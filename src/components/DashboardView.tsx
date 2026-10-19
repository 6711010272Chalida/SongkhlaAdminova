import React, { useMemo } from 'react';
import { WorkRecord, WorkStatus, ActiveTab } from '../types';
import { CATEGORY_LABELS, STATUS_LABELS } from '../data/initialRecords';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  ArrowRight, 
  TrendingUp, 
  User, 
  Building,
  PlusCircle,
  Eye
} from 'lucide-react';

interface DashboardViewProps {
  records: WorkRecord[];
  onNavigateTab: (tab: ActiveTab) => void;
  onOpenNewTaskModal: () => void;
  onSelectRecord: (record: WorkRecord) => void;
  onQuickStatusChange: (recordId: string, newStatus: WorkStatus) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  records,
  onNavigateTab,
  onOpenNewTaskModal,
  onSelectRecord,
  onQuickStatusChange
}) => {
  // Dynamically calculate all KPI counts from real records state
  const stats = useMemo(() => {
    const total = records.length;
    const pending = records.filter(r => r.status === 'pending').length;
    const inProgress = records.filter(r => r.status === 'in_progress').length;
    const completed = records.filter(r => r.status === 'completed').length;
    const cancelled = records.filter(r => r.status === 'cancelled').length;

    // Upcoming follow-up dates (tasks not yet completed, sorted by followUpDate)
    const upcomingTasks = [...records]
      .filter(r => r.status !== 'completed' && r.status !== 'cancelled')
      .sort((a, b) => new Date(a.followUpDate).getTime() - new Date(b.followUpDate).getTime());

    // Category counts
    const categoryCounts: Record<string, number> = {};
    Object.keys(CATEGORY_LABELS).forEach(k => { categoryCounts[k] = 0; });
    records.forEach(r => {
      categoryCounts[r.category] = (categoryCounts[r.category] || 0) + 1;
    });

    // Recent 5 tasks sorted by updatedAt or createdAt
    const recentTasks = [...records]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5);

    return {
      total,
      pending,
      inProgress,
      completed,
      cancelled,
      upcomingTasks,
      categoryCounts,
      recentTasks,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  }, [records]);

  // SVG Donut calculation
  const donutSegments = useMemo(() => {
    const total = stats.total || 1;
    const pPct = stats.pending / total;
    const ipPct = stats.inProgress / total;
    const cPct = stats.completed / total;
    const canPct = stats.cancelled / total;

    // Radius 40, circumference ~251.2
    const circumference = 2 * Math.PI * 40;
    const pDash = pPct * circumference;
    const ipDash = ipPct * circumference;
    const cDash = cPct * circumference;
    const canDash = canPct * circumference;

    const pOffset = 0;
    const ipOffset = -(pDash);
    const cOffset = -(pDash + ipDash);
    const canOffset = -(pDash + ipDash + cDash);

    return {
      circumference,
      pDash,
      ipDash,
      cDash,
      canDash,
      pOffset,
      ipOffset,
      cOffset,
      canOffset
    };
  }, [stats]);

  return (
    <div className="space-y-6">
      {/* Welcome Banner / Overview Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>ภาพรวมการดำเนินงาน</span>
            <span aria-hidden="true">·</span>
            <span>ปีงบประมาณ 2569 (ข้อมูลสมมติ)</span>
            <span aria-hidden="true">·</span>
            <span>จังหวัดสงขลา</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0F2038] tracking-tight">
            ระบบสนับสนุนการจัดการข้อมูลและติดตามงาน
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            ศูนย์กลางติดตามหนังสือราชการ คำร้องเรียน และงานประสานงานระหว่างกลุ่มงานในสังกัดศาลากลางจังหวัด
          </p>
        </div>
        
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => onNavigateTab('tracker')}
            className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            เปิดตารางงานทั้งหมด
          </button>
          <button
            onClick={onOpenNewTaskModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-[#0F2038] hover:bg-[#1E3A60] rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5 text-amber-300" />
            <span>บันทึกเรื่องใหม่</span>
          </button>
        </div>
      </div>

      {/* 4 Primary Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">งานทั้งหมดในระบบ</span>
            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono-numbers">
            {stats.total}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>คำนวณจากระเบียนจำลอง</span>
            <span className="text-slate-400 font-mono-numbers">100%</span>
          </div>
        </div>

        {/* Card 2: Pending */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-amber-700">รอดำเนินการ</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-amber-600 font-mono-numbers">
            {stats.pending}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>รอการสั่งการ/ตรวจสอบ</span>
            <span className="font-mono-numbers text-amber-700">
              {stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0}%
            </span>
          </div>
        </div>

        {/* Card 3: In Progress */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-sky-700">กำลังดำเนินการ</span>
            <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-sky-600 font-mono-numbers">
            {stats.inProgress}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>อยู่ระหว่างการประสานงาน</span>
            <span className="font-mono-numbers text-sky-700">
              {stats.total > 0 ? Math.round((stats.inProgress / stats.total) * 100) : 0}%
            </span>
          </div>
        </div>

        {/* Card 4: Completed */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-emerald-700">ดำเนินการแล้วเสร็จ</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-600 font-mono-numbers">
            {stats.completed}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>ยุติเรื่อง/จัดส่งเรียบร้อย</span>
            <span className="font-mono-numbers text-emerald-700 font-semibold">
              {stats.completionRate}%
            </span>
          </div>
        </div>
      </div>

      {/* Visual Analytics Row: Status Donut Chart & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Distribution Donut */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">สัดส่วนสถานะงาน</h2>
              <p className="text-xs text-slate-500">จำแนกตามขั้นตอนการดำเนินงาน</p>
            </div>
            <button
              onClick={() => onNavigateTab('reports')}
              className="text-xs text-amber-700 hover:text-amber-800 font-medium inline-flex items-center gap-1 cursor-pointer"
            >
              ดูสถิติละเอียด
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
            {/* SVG Donut */}
            <div className="relative w-36 h-36 shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 transform">
                {/* Background ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#F1F5F9"
                  strokeWidth="14"
                />
                {/* Pending: Amber */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#F59E0B"
                  strokeWidth="14"
                  strokeDasharray={`${donutSegments.pDash} ${donutSegments.circumference}`}
                  strokeDashoffset={donutSegments.pOffset}
                  className="transition-all duration-500"
                />
                {/* In Progress: Sky */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#0284C7"
                  strokeWidth="14"
                  strokeDasharray={`${donutSegments.ipDash} ${donutSegments.circumference}`}
                  strokeDashoffset={donutSegments.ipOffset}
                  className="transition-all duration-500"
                />
                {/* Completed: Emerald */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#10B981"
                  strokeWidth="14"
                  strokeDasharray={`${donutSegments.cDash} ${donutSegments.circumference}`}
                  strokeDashoffset={donutSegments.cOffset}
                  className="transition-all duration-500"
                />
                {/* Cancelled: Slate */}
                {donutSegments.canDash > 0 && (
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#94A3B8"
                    strokeWidth="14"
                    strokeDasharray={`${donutSegments.canDash} ${donutSegments.circumference}`}
                    strokeDashoffset={donutSegments.canOffset}
                    className="transition-all duration-500"
                  />
                )}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-slate-900 font-mono-numbers">
                  {stats.completionRate}%
                </span>
                <span className="text-[10px] text-slate-500">แล้วเสร็จ</span>
              </div>
            </div>

            {/* Legend / Breakdown List */}
            <div className="space-y-2 text-xs w-full">
              <div className="flex items-center justify-between text-slate-700">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 shrink-0" />
                  <span>รอดำเนินการ</span>
                </div>
                <span className="font-mono-numbers font-semibold">{stats.pending} เรื่อง</span>
              </div>

              <div className="flex items-center justify-between text-slate-700">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm bg-sky-600 shrink-0" />
                  <span>กำลังดำเนินการ</span>
                </div>
                <span className="font-mono-numbers font-semibold">{stats.inProgress} เรื่อง</span>
              </div>

              <div className="flex items-center justify-between text-slate-700">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 shrink-0" />
                  <span>ดำเนินการแล้วเสร็จ</span>
                </div>
                <span className="font-mono-numbers font-semibold">{stats.completed} เรื่อง</span>
              </div>

              {stats.cancelled > 0 && (
                <div className="flex items-center justify-between text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm bg-slate-400 shrink-0" />
                    <span>ยกเลิก/ยุติ</span>
                  </div>
                  <span className="font-mono-numbers font-semibold">{stats.cancelled} เรื่อง</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Work Category Breakdown Bar Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">การกระจายตามประเภทงาน</h2>
              <p className="text-xs text-slate-500">ความถี่ของภารกิจงานที่บันทึก</p>
            </div>
            <span className="text-xs text-slate-500 font-mono-numbers">
              {Object.keys(CATEGORY_LABELS).length} หมวด
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {Object.entries(CATEGORY_LABELS).map(([catKey, catInfo]) => {
              const count = stats.categoryCounts[catKey] || 0;
              const maxCount = Math.max(...Object.values(stats.categoryCounts), 1);
              const percentage = Math.round((count / (stats.total || 1)) * 100);
              const barWidth = Math.round((count / maxCount) * 100);

              return (
                <div key={catKey} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-700 font-medium truncate max-w-[190px]">
                      {catInfo.labelTh}
                    </span>
                    <span className="text-slate-500 font-mono-numbers">
                      {count} เรื่อง ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-[#0F2038] h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.max(barWidth, count > 0 ? 8 : 0)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Follow-up Schedule Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900">กำหนดนัดติดตามเร็วๆ นี้</h2>
                <p className="text-xs text-slate-500">งานที่อยู่ระหว่างดำเนินการและมีนัดหมาย</p>
              </div>
              <Calendar className="w-4 h-4 text-amber-600" />
            </div>

            <div className="space-y-2.5">
              {stats.upcomingTasks.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-4 text-center">ไม่มีงานค้างที่มีกำหนดนัดหมาย</p>
              ) : (
                stats.upcomingTasks.slice(0, 4).map((task) => (
                  <div
                    key={task.id}
                    onClick={() => onSelectRecord(task)}
                    className="p-2.5 rounded-lg border border-slate-100 hover:border-amber-300 hover:bg-amber-50/20 transition-all cursor-pointer text-xs"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-mono-numbers text-slate-500 font-medium">
                        {task.refId}
                      </span>
                      <span className="font-mono-numbers text-amber-700 font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {task.followUpDate}
                      </span>
                    </div>
                    <p className="font-medium text-slate-800 line-clamp-1">
                      {task.title}
                    </p>
                    <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                      <span>{task.responsiblePerson.split(' ')[0]}</span>
                      <span className="text-slate-400">{task.status === 'pending' ? 'รอดำเนินการ' : 'กำลังดำเนินการ'}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('tracker')}
            className="mt-3 w-full py-2 text-xs font-medium text-[#0F2038] bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors text-center cursor-pointer"
          >
            เปิดตารางติดตามงานทั้งหมด ({stats.upcomingTasks.length})
          </button>
        </div>
      </div>

      {/* Recent Tasks Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">รายการงานที่อัปเดตล่าสุด</h2>
            <p className="text-xs text-slate-500">แสดง 5 รายการที่มีความเคลื่อนไหวล่าสุดในระบบ</p>
          </div>
          <button
            onClick={() => onNavigateTab('tracker')}
            className="text-xs font-semibold text-[#0F2038] hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>ดูตารางงานทั้งหมด</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4 font-semibold">รหัสเอกสาร</th>
                <th className="py-3 px-4 font-semibold">เรื่อง / รายละเอียด</th>
                <th className="py-3 px-4 font-semibold hidden md:table-cell">ประเภทงาน</th>
                <th className="py-3 px-4 font-semibold">ผู้รับผิดชอบ</th>
                <th className="py-3 px-4 font-semibold hidden sm:table-cell">นัดติดตาม</th>
                <th className="py-3 px-4 font-semibold">สถานะ</th>
                <th className="py-3 px-4 font-semibold text-right">การกระทำ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats.recentTasks.map((task) => {
                const cat = CATEGORY_LABELS[task.category];
                const statusInfo = STATUS_LABELS[task.status];

                return (
                  <tr key={task.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono-numbers font-medium text-slate-900 whitespace-nowrap">
                      {task.refId}
                    </td>
                    <td className="py-3 px-4 max-w-xs sm:max-w-md">
                      <div className="font-medium text-slate-900 truncate" title={task.title}>
                        {task.title}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5">
                        {task.originAgency}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 hidden md:table-cell whitespace-nowrap">
                      {cat?.labelTh}
                    </td>
                    <td className="py-3 px-4 text-slate-700 whitespace-nowrap">
                      {task.responsiblePerson}
                    </td>
                    <td className="py-3 px-4 font-mono-numbers text-slate-600 hidden sm:table-cell whitespace-nowrap">
                      {task.followUpDate}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center text-xs font-semibold ${statusInfo.color}`}>
                        {statusInfo.labelTh}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => onSelectRecord(task)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>เปิดดู</span>
                      </button>
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
