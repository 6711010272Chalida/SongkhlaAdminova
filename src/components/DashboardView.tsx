import React, { useState, useMemo } from 'react';
import { 
  Employee, 
  TrainingCourse, 
  TrainingRecord, 
  ActiveTab, 
  UserRole,
  AuditLog
} from '../types';
import { 
  COURSE_CATEGORY_LABELS, 
  ATTENDANCE_STATUS_LABELS, 
  EMPLOYEE_STATUS_LABELS 
} from '../data/initialRecords';
import { 
  Users, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Award, 
  AlertTriangle, 
  TrendingUp, 
  ArrowRight, 
  PlusCircle, 
  Building2, 
  FileCheck,
  ChevronRight,
  ShieldCheck,
  Download,
  Printer,
  Sparkles,
  BarChart3,
  CalendarDays
} from 'lucide-react';

interface DashboardViewProps {
  employees: Employee[];
  courses: TrainingCourse[];
  records: TrainingRecord[];
  logs: AuditLog[];
  userRole: UserRole;
  onNavigateTab: (tab: ActiveTab) => void;
  onOpenQuickAction: (action: 'employee' | 'course' | 'attendance') => void;
  onSelectEmployee: (emp: Employee) => void;
  onSelectCourse: (course: TrainingCourse) => void;
  globalSearchQuery?: string;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  employees,
  courses,
  records,
  logs,
  userRole,
  onNavigateTab,
  onOpenQuickAction,
  onSelectEmployee,
  onSelectCourse,
  globalSearchQuery = ''
}) => {
  const [selectedFiscalYear, setSelectedFiscalYear] = useState('2569');

  // Filter courses by fiscal year if selected
  const activeCourses = useMemo(() => {
    if (selectedFiscalYear === 'all') return courses;
    return courses.filter(c => String(c.fiscalYear) === selectedFiscalYear);
  }, [courses, selectedFiscalYear]);

  // Dynamically calculate metrics
  const metrics = useMemo(() => {
    const totalEmployees = employees.length;
    const totalCourses = activeCourses.length;

    // Distinct passed employees
    const passedEmployeeIds = new Set(
      records.filter(r => r.status === 'passed').map(r => r.employeeId)
    );
    const passedEmployeesCount = passedEmployeeIds.size;

    // In training/development
    const inDevelopmentCount = records.filter(
      r => r.status === 'registered' || r.status === 'attending'
    ).length;

    // Total training hours
    const totalHoursDelivered = records
      .filter(r => r.status === 'passed')
      .reduce((sum, r) => sum + (r.hoursCompleted || 0), 0);

    const averageHoursPerEmployee = totalEmployees > 0 
      ? (totalHoursDelivered / totalEmployees).toFixed(1) 
      : '0.0';

    // Upcoming courses
    const upcomingCourses = activeCourses
      .filter(c => c.status === 'upcoming')
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    // Category distribution
    const categoryCounts: Record<string, number> = {};
    Object.keys(COURSE_CATEGORY_LABELS).forEach(k => { categoryCounts[k] = 0; });
    activeCourses.forEach(c => {
      categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
    });

    // Monthly attendance aggregation
    const monthlyStats: Record<string, { monthName: string; count: number; hours: number }> = {
      '01': { monthName: 'ม.ค.', count: 0, hours: 0 },
      '02': { monthName: 'ก.พ.', count: 0, hours: 0 },
      '03': { monthName: 'มี.ค.', count: 0, hours: 0 },
      '04': { monthName: 'เม.ย.', count: 0, hours: 0 },
      '05': { monthName: 'พ.ค.', count: 0, hours: 0 },
      '06': { monthName: 'มิ.ย.', count: 0, hours: 0 },
      '07': { monthName: 'ก.ค.', count: 0, hours: 0 },
      '08': { monthName: 'ส.ค.', count: 0, hours: 0 },
      '09': { monthName: 'ก.ย.', count: 0, hours: 0 },
      '10': { monthName: 'ต.ค.', count: 0, hours: 0 },
      '11': { monthName: 'พ.ย.', count: 0, hours: 0 },
      '12': { monthName: 'ธ.ค.', count: 0, hours: 0 },
    };

    records.forEach(r => {
      const date = r.attendanceDate || r.registrationDate;
      if (date && date.includes('-')) {
        const month = date.split('-')[1];
        if (monthlyStats[month]) {
          monthlyStats[month].count += 1;
          if (r.status === 'passed') {
            monthlyStats[month].hours += (r.hoursCompleted || 0);
          }
        }
      }
    });

    // Department progress breakdown
    const deptStats: Record<string, { totalEmp: number; totalHours: number }> = {};
    employees.forEach(e => {
      if (!deptStats[e.department]) {
        deptStats[e.department] = { totalEmp: 0, totalHours: 0 };
      }
      deptStats[e.department].totalEmp += 1;
    });
    records.filter(r => r.status === 'passed').forEach(r => {
      const emp = employees.find(e => e.id === r.employeeId);
      if (emp && deptStats[emp.department]) {
        deptStats[emp.department].totalHours += (r.hoursCompleted || 0);
      }
    });

    // Actionable alerts: Employees with < 15 hours of training
    const employeeHoursMap: Record<string, number> = {};
    employees.forEach(e => { employeeHoursMap[e.id] = 0; });
    records.filter(r => r.status === 'passed').forEach(r => {
      employeeHoursMap[r.employeeId] = (employeeHoursMap[r.employeeId] || 0) + (r.hoursCompleted || 0);
    });
    const needTrainingEmployees = employees.filter(e => (employeeHoursMap[e.id] || 0) < 15);

    // Recent training records (last 5)
    const recentRecords = [...records]
      .sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime())
      .slice(0, 5);

    return {
      totalEmployees,
      totalCourses,
      passedEmployeesCount,
      inDevelopmentCount,
      totalHoursDelivered,
      averageHoursPerEmployee,
      upcomingCourses,
      categoryCounts,
      monthlyStats,
      deptStats,
      needTrainingEmployees,
      recentRecords,
      passRate: records.length > 0 ? Math.round((records.filter(r => r.status === 'passed').length / records.length) * 100) : 0
    };
  }, [employees, activeCourses, records]);

  // Max value for monthly chart scaling
  const maxMonthlyCount = useMemo(() => {
    const counts = Object.values(metrics.monthlyStats).map(m => m.count);
    return Math.max(...counts, 4);
  }, [metrics.monthlyStats]);

  // Format today's Thai date
  const todayThaiFormatted = useMemo(() => {
    const now = new Date();
    const monthsThai = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    return `${now.getDate()} ${monthsThai[now.getMonth()]} ${now.getFullYear() + 543}`;
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header (Modern Government Style) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E5EAF0] shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#718096] mb-1">
            <span className="font-semibold text-[#245B91]">ศาลากลางจังหวัดสงขลา</span>
            <span aria-hidden="true">·</span>
            <span>ฝ่ายทรัพยากรบุคคล</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 font-mono-numbers text-slate-600">
              <CalendarDays className="w-3.5 h-3.5 text-[#C5A45A]" />
              {todayThaiFormatted}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#102C4C] tracking-tight">
            ภาพรวมระบบทะเบียนและติดตามการพัฒนาบุคลากร (HRD Overview)
          </h1>
          <p className="text-xs sm:text-sm text-[#718096] mt-1 leading-relaxed max-w-2xl">
            สรุปข้อมูลสถิติการพัฒนาสมรรถนะบุคลากร ติดตามเป้าหมาย 30 ชั่วโมงต่อปี และการจัดหลักสูตรฝึกอบรม
          </p>
        </div>

        {/* Controls: Fiscal Year Selector + Export Button */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <div className="flex items-center gap-1.5 bg-[#F3F6FA] px-3 py-1.5 rounded-xl border border-[#E5EAF0] text-xs">
            <span className="text-slate-500 font-medium">ปีงบประมาณ:</span>
            <select
              value={selectedFiscalYear}
              onChange={(e) => setSelectedFiscalYear(e.target.value)}
              className="bg-transparent font-bold text-[#102C4C] cursor-pointer focus:outline-none font-mono-numbers"
            >
              <option value="2569">2569 (ปีปัจจุบัน)</option>
              <option value="2568">2568 (ย้อนหลัง)</option>
              <option value="all">ทั้งหมด</option>
            </select>
          </div>

          <button
            onClick={() => onNavigateTab('reports')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-[#E5EAF0] hover:bg-slate-50 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#245B91]" />
            <span>ส่งออกรายงาน</span>
          </button>

          <button
            onClick={() => onOpenQuickAction('attendance')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#102C4C] hover:bg-[#245B91] rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#C5A45A]" />
            <span>บันทึกการอบรม</span>
          </button>
        </div>
      </div>

      {/* 4 Primary Statistics Cards (Per Section 5 of Master Prompt) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Employees */}
        <div 
          onClick={() => onNavigateTab('employees')}
          className="bg-white rounded-2xl border border-[#E5EAF0] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-[#245B91]/40 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#718096]">บุคลากรทั้งหมด</span>
            <div className="w-9 h-9 rounded-xl bg-[#245B91]/10 text-[#245B91] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#1B2B3A] font-mono-numbers">
            {metrics.totalEmployees} <span className="text-xs font-normal text-slate-500">คน</span>
          </div>
          <div className="mt-2 text-[11px] text-[#718096] flex items-center justify-between border-t border-slate-100 pt-2">
            <span>ฐานข้อมูลศาลากลาง</span>
            <span className="text-[#245B91] font-semibold font-mono-numbers">100% Active</span>
          </div>
        </div>

        {/* Card 2: Training Courses */}
        <div 
          onClick={() => onNavigateTab('courses')}
          className="bg-white rounded-2xl border border-[#E5EAF0] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-[#245B91]/40 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#718096]">หลักสูตรฝึกอบรม</span>
            <div className="w-9 h-9 rounded-xl bg-[#102C4C]/10 text-[#102C4C] flex items-center justify-center group-hover:scale-105 transition-transform">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#1B2B3A] font-mono-numbers">
            {metrics.totalCourses} <span className="text-xs font-normal text-slate-500">โครงการ</span>
          </div>
          <div className="mt-2 text-[11px] text-[#718096] flex items-center justify-between border-t border-slate-100 pt-2">
            <span>ปีงบประมาณ {selectedFiscalYear}</span>
            <span className="text-[#102C4C] font-semibold font-mono-numbers">
              {metrics.upcomingCourses.length} กำลังจัด
            </span>
          </div>
        </div>

        {/* Card 3: Passed Employees */}
        <div 
          onClick={() => onNavigateTab('attendance')}
          className="bg-white rounded-2xl border border-[#E5EAF0] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-[#23865B]/40 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#23865B]">ผู้ผ่านการอบรม</span>
            <div className="w-9 h-9 rounded-xl bg-[#23865B]/10 text-[#23865B] flex items-center justify-center group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#23865B] font-mono-numbers">
            {metrics.passedEmployeesCount} <span className="text-xs font-normal text-slate-500">คน</span>
          </div>
          <div className="mt-2 text-[11px] text-[#718096] flex items-center justify-between border-t border-slate-100 pt-2">
            <span>ได้รับวุฒิบัตรรับรอง</span>
            <span className="text-[#23865B] font-semibold font-mono-numbers">
              {metrics.totalEmployees > 0 ? Math.round((metrics.passedEmployeesCount / metrics.totalEmployees) * 100) : 0}% อัตราผ่าน
            </span>
          </div>
        </div>

        {/* Card 4: Hours of Development */}
        <div 
          onClick={() => onNavigateTab('development')}
          className="bg-white rounded-2xl border border-[#E5EAF0] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-[#C5A45A]/60 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#C5A45A]">ชั่วโมงการพัฒนาบุคลากร</span>
            <div className="w-9 h-9 rounded-xl bg-[#C5A45A]/15 text-[#C5A45A] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#102C4C] font-mono-numbers">
            {metrics.totalHoursDelivered} <span className="text-xs font-normal text-slate-500">ชม.</span>
          </div>
          <div className="mt-2 text-[11px] text-[#718096] flex items-center justify-between border-t border-slate-100 pt-2">
            <span>เฉลี่ยต่อคน</span>
            <span className="font-mono-numbers font-bold text-[#102C4C]">
              {metrics.averageHoursPerEmployee} ชม. / 30 ชม.
            </span>
          </div>
        </div>
      </div>

      {/* Analytics Charts Section (Grid: Monthly Attendance + Category Competency) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Attendance Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E5EAF0] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.03)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-[#102C4C]">
                สถิติการเข้าร่วมอบรมรายเดือน (Monthly Training Participation)
              </h2>
              <p className="text-xs text-[#718096]">
                จำนวนบุคลากรที่เข้าร่วมกิจกรรมฝึกอบรมในแต่ละเดือนตลอดปีงบประมาณ {selectedFiscalYear}
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#102C4C]" />
                ผู้เข้าร่วม (คน)
              </span>
            </div>
          </div>

          {/* Bar Chart Container */}
          <div className="pt-6 pb-2">
            <div className="h-44 flex items-end justify-between gap-2 border-b border-[#E5EAF0] px-1">
              {Object.entries(metrics.monthlyStats).map(([monthKey, mData]) => {
                const heightPercent = maxMonthlyCount > 0 ? (mData.count / maxMonthlyCount) * 100 : 0;
                const isHighlight = mData.count > 0;

                return (
                  <div key={monthKey} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                    {/* Tooltip */}
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-[#0B1F36] text-white text-[10px] py-1 px-2.5 rounded-lg whitespace-nowrap pointer-events-none z-20 shadow-md">
                      <div>เดือน {mData.monthName}: {mData.count} คน</div>
                      <div>ผ่าน {mData.hours} ชั่วโมง</div>
                    </div>

                    {/* Bar */}
                    <div 
                      className={`w-full max-w-[28px] rounded-t-md transition-all duration-300 ${
                        isHighlight ? 'bg-[#102C4C] hover:bg-[#245B91]' : 'bg-[#E5EAF0]'
                      }`}
                      style={{ height: `${Math.max(heightPercent, 6)}%` }}
                    />
                    
                    {/* X-axis Label */}
                    <span className="text-[11px] font-medium text-[#718096] mt-2">
                      {mData.monthName}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between text-xs text-[#718096] pt-1">
            <span>คำนวณจากบันทึกการเข้าร่วมและประเมินผลจริง</span>
            <button 
              onClick={() => onNavigateTab('reports')}
              className="text-[#245B91] hover:underline font-semibold inline-flex items-center gap-1 cursor-pointer"
            >
              เปิดรายงานสถิติละเอียด
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Competency & Category Distribution */}
        <div className="bg-white rounded-2xl border border-[#E5EAF0] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.03)] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#102C4C]">สัดส่วนตามหมวดหมู่</h2>
              <p className="text-xs text-[#718096]">การกระจายตัวของหลักสูตรพัฒนา</p>
            </div>
            <Award className="w-5 h-5 text-[#C5A45A]" />
          </div>

          <div className="space-y-3 pt-2">
            {Object.entries(COURSE_CATEGORY_LABELS).map(([catKey, catInfo]) => {
              const count = metrics.categoryCounts[catKey] || 0;
              const maxCount = Math.max(...Object.values(metrics.categoryCounts), 1);
              const percentage = Math.round((count / (metrics.totalCourses || 1)) * 100);
              const barWidth = Math.round((count / maxCount) * 100);

              return (
                <div key={catKey} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-700 font-medium truncate max-w-[170px]" title={catInfo.labelTh}>
                      {catInfo.labelTh}
                    </span>
                    <span className="text-[#102C4C] font-mono-numbers font-semibold">
                      {count} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#F3F6FA] rounded-full h-2 overflow-hidden border border-[#E5EAF0]">
                    <div 
                      className="bg-[#245B91] h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.max(barWidth, count > 0 ? 8 : 0)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 text-xs text-[#718096] flex items-center justify-between">
            <span>อัตราผ่านการอบรมโดยรวม:</span>
            <span className="font-bold text-[#23865B] font-mono-numbers">{metrics.passRate}%</span>
          </div>
        </div>
      </div>

      {/* Row 3: Upcoming Courses & Actionable Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Actionable Alerts Box */}
        <div className="bg-white rounded-2xl border border-[#E5EAF0] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.03)] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-[#D69E36] flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#102C4C]">การแจ้งเตือนงาน HR</h2>
                <p className="text-xs text-[#718096]">รายการที่ต้องติดตามและกำกับ</p>
              </div>
            </div>
          </div>

          <div className="space-y-2.5">
            {metrics.needTrainingEmployees.length > 0 ? (
              <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl text-xs space-y-1.5">
                <div className="font-semibold text-amber-900 flex items-center justify-between">
                  <span>เป้าหมายเกณฑ์ ก.พ. (30 ชม./ปี)</span>
                  <span className="font-mono-numbers font-bold text-amber-800">
                    {metrics.needTrainingEmployees.length} คนยังไม่ครบ
                  </span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  มีบุคลากร {metrics.needTrainingEmployees.length} คนที่มีชั่วโมงสะสมน้อยกว่า 15 ชั่วโมง ควรกำกับให้ลงทะเบียนในหลักสูตรไตรมาสถัดไป
                </p>
                <div className="pt-1 flex flex-wrap gap-1">
                  {metrics.needTrainingEmployees.slice(0, 3).map(e => (
                    <button
                      key={e.id}
                      onClick={() => onSelectEmployee(e)}
                      className="text-[10px] px-2 py-0.5 bg-white text-slate-800 rounded-md border border-amber-200 hover:bg-amber-100 cursor-pointer"
                    >
                      {e.prefix}{e.firstName} ({e.positionLevel})
                    </button>
                  ))}
                  {metrics.needTrainingEmployees.length > 3 && (
                    <span className="text-[10px] text-amber-700 self-center">
                      +{metrics.needTrainingEmployees.length - 3} คน
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-[#23865B] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#23865B] shrink-0" />
                <span>บุคลากรทุกคนมีชั่วโมงการอบรมสะสมตามเกณฑ์มาตรฐานขั้นต่ำ</span>
              </div>
            )}

            {/* Upcoming registration alert */}
            <div className="p-3.5 bg-[#F3F6FA] border border-[#E5EAF0] rounded-xl text-xs space-y-1">
              <div className="font-semibold text-[#102C4C] flex items-center justify-between">
                <span>หลักสูตรเปิดรับสมัครรอบใหม่</span>
                <span className="font-mono-numbers text-[#245B91] font-bold">
                  {metrics.upcomingCourses.length} หลักสูตร
                </span>
              </div>
              <p className="text-[11px] text-[#718096]">
                เปิดให้หน่วยงานภายในส่งรายชื่อผู้เข้าร่วมอบรมผ่านระบบแล้ว
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('attendance')}
            className="w-full py-2.5 text-xs font-semibold text-[#102C4C] bg-[#F3F6FA] hover:bg-slate-200/80 rounded-xl border border-[#E5EAF0] transition-colors text-center cursor-pointer"
          >
            ไปที่ระบบบันทึกการเข้าร่วมอบรม
          </button>
        </div>

        {/* Upcoming Courses Cards */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E5EAF0] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.03)] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#102C4C]">
                หลักสูตรและโครงการที่กำลังจะจัดขึ้น (Upcoming Programs)
              </h2>
              <p className="text-xs text-[#718096]">
                กำหนดการจัดฝึกอบรมประจำเดือนพฤศจิกายน - ธันวาคม 2569
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('courses')}
              className="text-xs text-[#245B91] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              ดูทั้งหมด ({activeCourses.length})
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            {metrics.upcomingCourses.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-6 col-span-2 text-center">
                ไม่มีหลักสูตรใหม่ที่กำลังจะจัดขึ้นในขณะนี้
              </p>
            ) : (
              metrics.upcomingCourses.slice(0, 4).map((course) => {
                const cat = COURSE_CATEGORY_LABELS[course.category];
                return (
                  <div
                    key={course.id}
                    onClick={() => onSelectCourse(course)}
                    className="p-4 rounded-xl border border-[#E5EAF0] hover:border-[#245B91] hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between space-y-2.5 bg-[#F3F6FA]/50 group"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-mono-numbers font-bold text-[#102C4C] bg-white px-2 py-0.5 rounded-md border border-[#E5EAF0]">
                          {course.courseCode}
                        </span>
                        <span className="font-mono-numbers text-[#C5A45A] font-semibold flex items-center gap-1 text-[11px]">
                          <Clock className="w-3 h-3" />
                          {course.hours} ชั่วโมง
                        </span>
                      </div>
                      <h3 className="font-bold text-[#1B2B3A] text-xs sm:text-sm line-clamp-2 leading-snug group-hover:text-[#245B91] transition-colors">
                        {course.title}
                      </h3>
                    </div>

                    <div className="pt-2 border-t border-slate-200/80 text-[11px] text-[#718096] space-y-1">
                      <div className="flex items-center gap-1.5 font-mono-numbers">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{course.startDate} ถึง {course.endDate}</span>
                      </div>
                      <div className="truncate">
                        ผู้จัด: {course.organizer}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Row 4: Recent Training Records & Audit Logs */}
      <div className="bg-white rounded-2xl border border-[#E5EAF0] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.03)] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#102C4C]">
              บันทึกกิจกรรมและความเคลื่อนไหวล่าสุด (Recent HR Activities)
            </h2>
            <p className="text-xs text-[#718096]">
              ประวัติการเพิ่ม แก้ไข หรือประเมินผลการอบรมในระบบ
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('settings')}
            className="text-xs text-[#245B91] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
          >
            ดู Audit Logs ทั้งหมด
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2">
          {logs.slice(0, 4).map((log) => (
            <div 
              key={log.id} 
              className="p-3 rounded-xl bg-[#F3F6FA] border border-[#E5EAF0] text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#102C4C] text-[#C5A45A] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5 sm:mt-0">
                  HR
                </div>
                <div>
                  <p className="font-semibold text-[#1B2B3A] leading-relaxed">
                    {log.details}
                  </p>
                  <div className="text-[11px] text-[#718096] mt-0.5 flex items-center gap-2">
                    <span>โดย: <strong className="text-slate-800">{log.userName}</strong></span>
                    <span>·</span>
                    <span className="font-mono-numbers">{new Date(log.timestamp).toLocaleString('th-TH')}</span>
                  </div>
                </div>
              </div>

              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white text-slate-700 border border-[#E5EAF0] self-start sm:self-center font-mono uppercase">
                {log.action}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
