import React, { useState, useMemo } from 'react';
import { 
  Employee, 
  TrainingRecord, 
  TrainingCourse, 
  UserRole 
} from '../types';
import { 
  COURSE_CATEGORY_LABELS, 
  POSITION_LEVEL_LABELS, 
  ATTENDANCE_STATUS_LABELS 
} from '../data/initialRecords';
import { 
  GraduationCap, 
  Award, 
  Clock, 
  Calendar, 
  Printer, 
  CheckCircle2, 
  Search, 
  Building2, 
  User, 
  ArrowRight,
  ShieldCheck,
  FileText,
  Download,
  Sparkles,
  BookOpen,
  Check,
  ChevronRight
} from 'lucide-react';
import { WaveMotif } from './WaveMotif';

interface DevelopmentPassportViewProps {
  employees: Employee[];
  records: TrainingRecord[];
  courses: TrainingCourse[];
  selectedEmployeeId?: string;
  onSelectEmployeeId?: (id: string) => void;
}

export const DevelopmentPassportView: React.FC<DevelopmentPassportViewProps> = ({
  employees,
  records,
  courses,
  selectedEmployeeId,
  onSelectEmployeeId
}) => {
  const [activeEmployeeId, setActiveEmployeeId] = useState<string>(
    selectedEmployeeId || (employees[0]?.id || '')
  );

  // Sync if prop changes
  React.useEffect(() => {
    if (selectedEmployeeId) {
      setActiveEmployeeId(selectedEmployeeId);
    }
  }, [selectedEmployeeId]);

  const currentEmployee = useMemo(() => {
    return employees.find(e => e.id === activeEmployeeId) || employees[0];
  }, [employees, activeEmployeeId]);

  const courseMap = useMemo(() => {
    const map: Record<string, TrainingCourse> = {};
    courses.forEach(c => { map[c.id] = c; });
    return map;
  }, [courses]);

  // History records for this employee
  const employeeRecords = useMemo(() => {
    if (!currentEmployee) return [];
    return records
      .filter(r => r.employeeId === currentEmployee.id)
      .sort((a, b) => new Date(b.attendanceDate || b.registrationDate).getTime() - new Date(a.attendanceDate || a.registrationDate).getTime());
  }, [records, currentEmployee]);

  // Metrics for this employee
  const employeeStats = useMemo(() => {
    const passed = employeeRecords.filter(r => r.status === 'passed');
    const totalHours = passed.reduce((sum, r) => sum + (r.hoursCompleted || 0), 0);
    const targetHours = 30; // Government standard 30 hrs/year
    const progressPercent = Math.min(100, Math.round((totalHours / targetHours) * 100));

    // Category breakdown
    const categoryHours: Record<string, number> = {};
    Object.keys(COURSE_CATEGORY_LABELS).forEach(k => { categoryHours[k] = 0; });
    passed.forEach(r => {
      const crs = courseMap[r.courseId];
      if (crs) {
        categoryHours[crs.category] = (categoryHours[crs.category] || 0) + (r.hoursCompleted || 0);
      }
    });

    return {
      totalCoursesAttended: employeeRecords.length,
      passedCount: passed.length,
      totalHours,
      targetHours,
      progressPercent,
      categoryHours
    };
  }, [employeeRecords, courseMap]);

  const handlePrint = () => {
    window.print();
  };

  if (!currentEmployee) {
    return (
      <div className="bg-white rounded-2xl border border-[#E5EAF0] p-12 text-center">
        <p className="text-[#718096] text-sm">ไม่พบข้อมูลบุคลากรในระบบ</p>
      </div>
    );
  }

  const levelInfo = POSITION_LEVEL_LABELS[currentEmployee.positionLevel] || { labelTh: currentEmployee.positionLevel };

  return (
    <div className="space-y-6">
      {/* Top Header & Personnel Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#718096] mb-1">
            <span className="font-medium">สมุดทะเบียนประวัติรายบุคคล</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-numbers">เกณฑ์มาตรฐาน ก.พ. 30 ชั่วโมง/ปี</span>
          </div>
          <h1 className="text-2xl font-bold text-[#102C4C] tracking-tight">
            ประวัติการพัฒนาและสมรรถนะรายบุคคล (HRD Competency Passport)
          </h1>
          <p className="text-sm text-[#718096] mt-0.5">
            สมุดบันทึกประวัติการพัฒนาตนเองอย่างเป็นทางการ พร้อมติดตามตัวชี้วัดรายปี
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* Employee Selector Dropdown */}
          <select
            value={currentEmployee.id}
            onChange={(e) => {
              setActiveEmployeeId(e.target.value);
              if (onSelectEmployeeId) onSelectEmployeeId(e.target.value);
            }}
            className="px-3 py-2 rounded-xl border border-[#E5EAF0] bg-white text-xs font-semibold text-[#102C4C] shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#245B91]/30 focus:border-[#245B91]"
          >
            {employees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.empCode} - {e.prefix}{e.firstName} {e.lastName} ({e.position})
              </option>
            ))}
          </select>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#102C4C] bg-white border border-[#E5EAF0] hover:bg-[#F3F6FA] rounded-xl shadow-xs transition-colors cursor-pointer"
            title="พิมพ์สมุดประวัติฉบับนี้"
          >
            <Printer className="w-4 h-4 text-[#C5A45A]" />
            <span className="hidden sm:inline">พิมพ์สมุดประวัติ</span>
          </button>
        </div>
      </div>

      {/* Main Passport Card */}
      <div className="bg-white rounded-2xl border border-[#E5EAF0] p-6 sm:p-8 shadow-xs space-y-6 relative overflow-hidden">
        {/* Subtle Background Watermark Motif */}
        <div className="absolute right-0 top-0 opacity-5 pointer-events-none -mr-16 -mt-16">
          <WaveMotif size="lg" />
        </div>

        {/* Identity Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#E5EAF0] relative z-10">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#0B1F36] text-[#C5A45A] flex items-center justify-center font-bold text-2xl shrink-0 shadow-sm border border-white/10">
              {currentEmployee.firstName.charAt(0)}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono-numbers text-xs font-bold text-[#102C4C] bg-[#F3F6FA] border border-[#E5EAF0] px-2.5 py-0.5 rounded-lg">
                  {currentEmployee.empCode}
                </span>
                <span className="text-xs text-[#718096] font-medium">
                  {currentEmployee.department}
                </span>
                <span className="text-[10px] font-semibold text-[#23865B] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  ปฏิบัติราชการปกติ
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#102C4C]">
                {currentEmployee.prefix}{currentEmployee.firstName} {currentEmployee.lastName}
              </h2>
              <div className="text-xs text-[#718096] flex flex-wrap items-center gap-2">
                <span className="text-[#1B2B3A] font-medium">{currentEmployee.position}</span>
                <span>·</span>
                <span>ระดับ: {levelInfo.labelTh}</span>
                <span>·</span>
                <span>เริ่มปฏิบัติราชการ: <strong className="font-mono-numbers text-[#1B2B3A]">{currentEmployee.startDate}</strong></span>
              </div>
            </div>
          </div>

          {/* Contact Box */}
          <div className="bg-[#F3F6FA] p-3.5 rounded-xl border border-[#E5EAF0] text-xs text-[#718096] space-y-1 shrink-0">
            <div>อีเมล: <span className="font-mono-numbers font-medium text-[#102C4C]">{currentEmployee.email}</span></div>
            <div>โทรศัพท์: <span className="font-mono-numbers font-medium text-[#102C4C]">{currentEmployee.phone}</span></div>
            <div className="flex items-center gap-1 text-[11px] text-[#C5A45A] font-semibold pt-0.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ผ่านการยืนยันตัวตน ก.พ.</span>
            </div>
          </div>
        </div>

        {/* 30-Hour Government KPI Gauge */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* Gauge Card */}
          <div className="p-5 rounded-2xl bg-[#F3F6FA] border border-[#E5EAF0] space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-[#102C4C]">เกณฑ์มาตรฐาน ก.พ. ประจำปี</span>
                <span className="text-xs font-mono-numbers font-bold text-[#C5A45A]">30 ชม.</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold font-mono-numbers text-[#102C4C]">
                  {employeeStats.totalHours}
                </span>
                <span className="text-xs text-[#718096]">/ 30 ชั่วโมงสะสม</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden p-0.5">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    employeeStats.totalHours >= 30 ? 'bg-[#23865B]' : 'bg-[#D69E36]'
                  }`}
                  style={{ width: `${employeeStats.progressPercent}%` }}
                />
              </div>
              <div className="text-[11px] flex justify-between pt-0.5">
                <span className="text-[#718096]">ความคืบหน้า {employeeStats.progressPercent}%</span>
                <span className={`font-semibold ${employeeStats.totalHours >= 30 ? 'text-[#23865B]' : 'text-[#D69E36]'}`}>
                  {employeeStats.totalHours >= 30 ? '✓ ผ่านเกณฑ์ครบถ้วน' : `ขาดอีก ${30 - employeeStats.totalHours} ชม.`}
                </span>
              </div>
            </div>
          </div>

          {/* Passed Courses Count */}
          <div className="p-5 rounded-2xl bg-[#F3F6FA] border border-[#E5EAF0] space-y-2 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-[#102C4C] block mb-1">หลักสูตรที่ผ่านการอบรม</span>
              <div className="text-3xl font-bold text-[#23865B] font-mono-numbers">
                {employeeStats.passedCount} <span className="text-xs font-normal text-[#718096]">โครงการ</span>
              </div>
            </div>
            <p className="text-xs text-[#718096]">
              ได้รับวุฒิบัตรรับรองความรู้แล้วทั้งหมด <strong className="font-mono-numbers text-[#102C4C]">{employeeStats.passedCount}</strong> ฉบับ จากการลงทะเบียน {employeeStats.totalCoursesAttended} รายการ
            </p>
          </div>

          {/* IDP Status */}
          <div className="p-5 rounded-2xl bg-[#F3F6FA] border border-[#E5EAF0] space-y-2 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-[#102C4C] block mb-1">สถานะแผนพัฒนาบุคคล (IDP)</span>
              <div className="text-lg font-bold text-[#102C4C] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#C5A45A]" />
                <span>ระดับสมรรถนะมาตรฐาน</span>
              </div>
            </div>
            <p className="text-xs text-[#718096]">
              บันทึกชั่วโมงตรงตามแนวทางการประเมินผลการปฏิบัติราชการ สำนักงาน ก.พ. ประจำรอบการประเมิน 2569
            </p>
          </div>
        </div>

        {/* Competency Category Breakdown Bars */}
        <div className="pt-2 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#718096]">
            ชั่วโมงพัฒนาสะสมจำแนกตามกลุ่มสมรรถนะ (Competency Breakdown)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(COURSE_CATEGORY_LABELS).map(([catKey, catInfo]) => {
              const hours = employeeStats.categoryHours[catKey] || 0;
              const hasHours = hours > 0;

              return (
                <div 
                  key={catKey} 
                  className={`p-3.5 rounded-xl border transition-all text-xs space-y-1.5 ${
                    hasHours 
                      ? 'border-[#E5EAF0] bg-white shadow-xs' 
                      : 'border-[#E5EAF0]/60 bg-[#F3F6FA]/50 opacity-75'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#102C4C] truncate" title={catInfo.labelTh}>
                      {catInfo.labelTh}
                    </span>
                    <span className="font-mono-numbers font-bold text-[#102C4C] ml-2 shrink-0">
                      {hours} ชม.
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-[#245B91]"
                      style={{ width: `${Math.min(100, (hours / 12) * 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Chronological Training Transcript Table */}
      <div className="bg-white rounded-2xl border border-[#E5EAF0] overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-[#E5EAF0] flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#102C4C]">
              ประวัติการฝึกอบรมและสัมมนา (Official Training Transcript)
            </h3>
            <p className="text-xs text-[#718096]">
              บันทึกประวัติการพัฒนาตนเองอย่างเป็นทางการของ {currentEmployee.prefix}{currentEmployee.firstName} {currentEmployee.lastName}
            </p>
          </div>
          <span className="text-xs font-semibold font-mono-numbers px-2.5 py-1 rounded-full bg-[#F3F6FA] text-[#102C4C] border border-[#E5EAF0]">
            {employeeRecords.length} รายการ
          </span>
        </div>

        {employeeRecords.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <p className="text-xs text-[#718096] italic">ยังไม่มีประวัติการลงทะเบียนฝึกอบรมในระบบ</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#F3F6FA] text-[#718096] border-b border-[#E5EAF0] uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4 font-semibold">รหัส / หลักสูตร</th>
                  <th className="py-3 px-4 font-semibold">หน่วยงานผู้จัด</th>
                  <th className="py-3 px-4 font-semibold">วันที่อบรม</th>
                  <th className="py-3 px-4 font-semibold text-center">ชั่วโมง</th>
                  <th className="py-3 px-4 font-semibold">ผลการประเมิน</th>
                  <th className="py-3 px-4 font-semibold">เลขที่วุฒิบัตร</th>
                  <th className="py-3 px-4 font-semibold text-right">สถานะ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5EAF0]">
                {employeeRecords.map((r) => {
                  const crs = courseMap[r.courseId];
                  const statusInfo = ATTENDANCE_STATUS_LABELS[r.status] || ATTENDANCE_STATUS_LABELS.registered;

                  return (
                    <tr key={r.id} className="hover:bg-[#F3F6FA]/70 transition-colors">
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-mono-numbers text-[11px] font-bold text-[#C5A45A]">
                          {crs?.courseCode || '-'}
                        </div>
                        <div className="font-bold text-[#102C4C] truncate">
                          {crs?.title || 'หลักสูตรทั่วไป'}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-[#718096] max-w-[180px] truncate" title={crs?.organizer}>
                        {crs?.organizer || '-'}
                      </td>

                      <td className="py-3 px-4 font-mono-numbers text-[#1B2B3A] whitespace-nowrap">
                        {r.attendanceDate || r.registrationDate}
                      </td>

                      <td className="py-3 px-4 font-mono-numbers text-center whitespace-nowrap">
                        <span className="font-bold text-[#102C4C]">{r.hoursCompleted}</span> ชม.
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        {r.score ? (
                          <div className="font-mono-numbers font-semibold text-[#23865B]">
                            {r.score} / 100 ({r.evaluationGrade || 'ผ่าน'})
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">-</span>
                        )}
                      </td>

                      <td className="py-3 px-4 font-mono-numbers text-[#1B2B3A] whitespace-nowrap">
                        {r.certificateNumber || '-'}
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${statusInfo.bg} ${statusInfo.color}`}>
                          {statusInfo.labelTh}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
