import React, { useState, useMemo } from 'react';
import { 
  Employee, 
  TrainingCourse, 
  TrainingRecord, 
  UserRole 
} from '../types';
import { 
  COURSE_CATEGORY_LABELS, 
  POSITION_LEVEL_LABELS 
} from '../data/initialRecords';
import { 
  BarChart3, 
  Download, 
  Printer, 
  Calendar, 
  Filter, 
  TrendingUp, 
  Building2, 
  Award, 
  Users, 
  CheckCircle2, 
  ShieldAlert,
  FileSpreadsheet,
  Clock,
  Sparkles
} from 'lucide-react';

interface ReportsViewProps {
  employees: Employee[];
  courses: TrainingCourse[];
  records: TrainingRecord[];
  userRole: UserRole;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  employees,
  courses,
  records,
  userRole
}) => {
  const [selectedFiscalYear, setSelectedFiscalYear] = useState('2569');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Course map for lookup
  const courseMap = useMemo(() => {
    const map: Record<string, TrainingCourse> = {};
    courses.forEach(c => { map[c.id] = c; });
    return map;
  }, [courses]);

  // Filtered records by fiscal year or dates
  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const crs = courseMap[r.courseId];
      if (selectedFiscalYear !== 'all') {
        if (!crs || String(crs.fiscalYear) !== selectedFiscalYear) return false;
      }
      if (startDate && r.attendanceDate && r.attendanceDate < startDate) return false;
      if (endDate && r.attendanceDate && r.attendanceDate > endDate) return false;
      return true;
    });
  }, [records, courseMap, selectedFiscalYear, startDate, endDate]);

  // Aggregate metrics
  const stats = useMemo(() => {
    const totalEmployees = employees.length;
    const passedRecords = filteredRecords.filter(r => r.status === 'passed');
    const totalTrainingHours = passedRecords.reduce((sum, r) => sum + (r.hoursCompleted || 0), 0);
    const averageHours = totalEmployees > 0 ? (totalTrainingHours / totalEmployees).toFixed(1) : '0';

    // Unique employees who completed training
    const trainedEmployeeIds = new Set(passedRecords.map(r => r.employeeId));
    const coverageRate = totalEmployees > 0 ? Math.round((trainedEmployeeIds.size / totalEmployees) * 100) : 0;

    // Employees with >= 30 hours
    const employeeHoursMap: Record<string, number> = {};
    employees.forEach(e => { employeeHoursMap[e.id] = 0; });
    passedRecords.forEach(r => {
      employeeHoursMap[r.employeeId] = (employeeHoursMap[r.employeeId] || 0) + (r.hoursCompleted || 0);
    });
    const completedKpiCount = Object.values(employeeHoursMap).filter(h => h >= 30).length;
    const kpiRate = totalEmployees > 0 ? Math.round((completedKpiCount / totalEmployees) * 100) : 0;

    // Breakdown by department
    const deptStats: Record<string, { totalEmp: number; totalHours: number; passedCount: number }> = {};
    employees.forEach(e => {
      if (!deptStats[e.department]) {
        deptStats[e.department] = { totalEmp: 0, totalHours: 0, passedCount: 0 };
      }
      deptStats[e.department].totalEmp += 1;
    });

    passedRecords.forEach(r => {
      const emp = employees.find(e => e.id === r.employeeId);
      if (emp && deptStats[emp.department]) {
        deptStats[emp.department].totalHours += (r.hoursCompleted || 0);
        deptStats[emp.department].passedCount += 1;
      }
    });

    return {
      totalEmployees,
      passedRecordsCount: passedRecords.length,
      totalTrainingHours,
      averageHours,
      coverageRate,
      completedKpiCount,
      kpiRate,
      deptStats
    };
  }, [employees, filteredRecords]);

  // CSV Export (Excel Compatible with UTF-8 BOM)
  const handleExportCSV = () => {
    const headers = ['รหัสบุคลากร', 'ชื่อ-สกุล', 'ตำแหน่ง', 'กลุ่มงาน', 'รหัสหลักสูตร', 'ชื่อหลักสูตร', 'วันที่อบรม', 'ชั่วโมงอบรม', 'สถานะ', 'คะแนน', 'เลขที่วุฒิบัตร'];
    const rows = filteredRecords.map(r => {
      const emp = employees.find(e => e.id === r.employeeId);
      const crs = courseMap[r.courseId];
      return [
        `"${emp?.empCode || ''}"`,
        `"${emp ? `${emp.prefix}${emp.firstName} ${emp.lastName}` : ''}"`,
        `"${emp?.position || ''}"`,
        `"${emp?.department || ''}"`,
        `"${crs?.courseCode || ''}"`,
        `"${(crs?.title || '').replace(/"/g, '""')}"`,
        `"${r.attendanceDate || r.registrationDate || ''}"`,
        `"${r.hoursCompleted}"`,
        `"${r.status === 'passed' ? 'ผ่านการอบรม' : r.status}"`,
        `"${r.score || ''}"`,
        `"${r.certificateNumber || ''}"`
      ];
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SONGKHLA_HRD_Report_FY${selectedFiscalYear}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#718096] mb-1">
            <span className="font-medium">การติดตามและรายงานผล</span>
            <span aria-hidden="true">·</span>
            <span>ข้อมูลสถิติประมวลผลตามปีงบประมาณ</span>
          </div>
          <h1 className="text-2xl font-bold text-[#102C4C] tracking-tight">
            รายงานสถิติการพัฒนาทรัพยากรบุคคล (HRD Analytics)
          </h1>
          <p className="text-sm text-[#718096] mt-0.5">
            สรุปข้อมูลสถิติการเข้าร่วมอบรม ชั่วโมงการพัฒนา และความก้าวหน้าตามเกณฑ์มาตรฐาน ก.พ. 30 ชม./ปี
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#102C4C] bg-white border border-[#E5EAF0] hover:bg-[#F3F6FA] rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#718096]" />
            <span>ส่งออก CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#102C4C] hover:bg-[#245B91] rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#C5A45A]" />
            <span>พิมพ์รายงานสรุป</span>
          </button>
        </div>
      </div>

      {/* Demo Disclaimer */}
      <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3">
        <ShieldAlert className="w-4 h-4 text-[#D69E36] shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed">
          <strong className="font-semibold block mb-0.5">
            ประกาศคำเตือนข้อมูล (Report Disclaimer):
          </strong>
          รายงานฉบับนี้ประมวลผลจากฐานข้อมูลจำลองของระบบ SONGKHLA HRD เพื่อใช้สำหรับการประเมินโครงงานและการสาธิตนวัตกรรม ไม่ใช่สถิติผลการปฏิบัติงานจริงของศาลากลางจังหวัดสงขลา
        </div>
      </div>

      {/* Filter Strip */}
      <div className="bg-white rounded-2xl border border-[#E5EAF0] p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-[#718096] font-semibold">
            <Filter className="w-3.5 h-3.5" />
            <span>ช่วงเวลาวิเคราะห์:</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[#718096]">ปีงบประมาณ:</span>
            <select
              value={selectedFiscalYear}
              onChange={(e) => setSelectedFiscalYear(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-[#E5EAF0] bg-white text-[#102C4C] font-semibold cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#245B91]"
            >
              <option value="2569">พ.ศ. 2569 (ปีปัจจุบัน)</option>
              <option value="2568">พ.ศ. 2568 (ปีย้อนหลัง)</option>
              <option value="all">ทุกปีงบประมาณ</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[#718096]">ตั้งแต่วันที่:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-[#E5EAF0] bg-white text-[#1B2B3A] font-mono-numbers text-xs"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[#718096]">ถึงวันที่:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-[#E5EAF0] bg-white text-[#1B2B3A] font-mono-numbers text-xs"
            />
          </div>
        </div>
      </div>

      {/* 4 Quantitative Highlights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-[#E5EAF0] p-5 shadow-xs">
          <span className="text-xs font-medium text-[#718096] block mb-1">ชั่วโมงอบรมรวมสะสม</span>
          <div className="text-2xl sm:text-3xl font-bold text-[#102C4C] font-mono-numbers">
            {stats.totalTrainingHours} <span className="text-xs font-normal text-[#718096]">ชม.</span>
          </div>
          <span className="text-[11px] text-[#718096] mt-1 block">
            เฉลี่ย <strong className="font-mono-numbers text-[#102C4C]">{stats.averageHours}</strong> ชม./คน
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5EAF0] p-5 shadow-xs">
          <span className="text-xs font-medium text-[#718096] block mb-1">อัตราการเข้าถึงการอบรม</span>
          <div className="text-2xl sm:text-3xl font-bold text-[#245B91] font-mono-numbers">
            {stats.coverageRate}%
          </div>
          <span className="text-[11px] text-[#718096] mt-1 block">
            ได้รับการพัฒนาแล้วอย่างน้อย 1 ครั้ง
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5EAF0] p-5 shadow-xs">
          <span className="text-xs font-medium text-[#718096] block mb-1">ผ่านเกณฑ์ ก.พ. (≥30 ชม.)</span>
          <div className="text-2xl sm:text-3xl font-bold text-[#23865B] font-mono-numbers">
            {stats.completedKpiCount} <span className="text-xs font-normal text-[#718096]">คน</span>
          </div>
          <span className="text-[11px] text-[#23865B] font-semibold mt-1 block font-mono-numbers">
            คิดเป็น {stats.kpiRate}% ของบุคลากรทั้งหมด
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5EAF0] p-5 shadow-xs">
          <span className="text-xs font-medium text-[#718096] block mb-1">วุฒิบัตรที่ผ่านการรับรอง</span>
          <div className="text-2xl sm:text-3xl font-bold text-[#C5A45A] font-mono-numbers">
            {stats.passedRecordsCount} <span className="text-xs font-normal text-[#718096]">ฉบับ</span>
          </div>
          <span className="text-[11px] text-[#718096] mt-1 block">
            ผ่านการตรวจรับรองผลสมบูรณ์
          </span>
        </div>
      </div>

      {/* Department Breakdown Table */}
      <div className="bg-white rounded-2xl border border-[#E5EAF0] overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-[#E5EAF0] flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#102C4C]">
              รายงานสถิติการพัฒนาจำแนกตามกลุ่มงาน / ส่วนราชการ
            </h2>
            <p className="text-xs text-[#718096]">
              เปรียบเทียบชั่วโมงการอบรมเฉลี่ยและจำนวนครั้งการผ่านหลักสูตรของแต่ละกลุ่มงาน
            </p>
          </div>
          <Building2 className="w-5 h-5 text-[#718096]" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#F3F6FA] text-[#718096] border-b border-[#E5EAF0] uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4 font-semibold">กลุ่มงาน / สังกัด</th>
                <th className="py-3 px-4 font-semibold text-center">จำนวนบุคลากร</th>
                <th className="py-3 px-4 font-semibold text-center">หลักสูตรที่ผ่าน</th>
                <th className="py-3 px-4 font-semibold text-center">ชั่วโมงรวม</th>
                <th className="py-3 px-4 font-semibold text-center">เฉลี่ย/คน</th>
                <th className="py-3 px-4 font-semibold text-right">เกณฑ์ 30 ชม.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5EAF0]">
              {Object.entries(stats.deptStats).map(([deptName, dData]) => {
                const avgHours = dData.totalEmp > 0 ? (dData.totalHours / dData.totalEmp).toFixed(1) : '0';
                const progressPct = Math.min(100, Math.round((Number(avgHours) / 30) * 100));

                return (
                  <tr key={deptName} className="hover:bg-[#F3F6FA]/70 transition-colors">
                    <td className="py-3 px-4 font-bold text-[#102C4C]">
                      {deptName}
                    </td>

                    <td className="py-3 px-4 font-mono-numbers text-center text-[#1B2B3A]">
                      {dData.totalEmp} คน
                    </td>

                    <td className="py-3 px-4 font-mono-numbers text-center text-[#23865B] font-semibold">
                      {dData.passedCount} รายการ
                    </td>

                    <td className="py-3 px-4 font-mono-numbers text-center font-bold text-[#102C4C]">
                      {dData.totalHours} ชม.
                    </td>

                    <td className="py-3 px-4 font-mono-numbers text-center text-[#C5A45A] font-bold">
                      {avgHours} ชม.
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <div className="w-20 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${Number(avgHours) >= 30 ? 'bg-[#23865B]' : 'bg-[#D69E36]'}`}
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                        <span className="font-mono-numbers text-[11px] text-[#718096] font-semibold">
                          {progressPct}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
