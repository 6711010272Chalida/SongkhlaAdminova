import React, { useState, useEffect, useMemo } from 'react';
import { ActiveTab, ComplaintRecord } from '../types';
import { CATEGORY_META, STATUS_META, URGENCY_META } from '../data/mockComplaints';
import { formatThaiDate, formatThaiMonthLabel, isComplaintOverdue } from '../services/storageService';
import {
  FileText,
  Inbox,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  FilePlus2,
  Calendar,
  Building2,
  Eye
} from 'lucide-react';

interface DashboardViewProps {
  complaints: ComplaintRecord[];
  officerName: string;
  onNavigateTab: (tab: ActiveTab) => void;
  onSelectComplaintDetail: (complaint: ComplaintRecord) => void;
  onFilterOverdueInRegistry: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  complaints,
  officerName,
  onNavigateTab,
  onSelectComplaintDetail,
  onFilterOverdueInRegistry
}) => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const thaiDateTimeStr = useMemo(() => {
    const datePart = now.toLocaleDateString('th-TH', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    const timePart = now.toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    return { datePart, timePart };
  }, [now]);

  // Real calculated KPI counts
  const kpis = useMemo(() => {
    const total = complaints.length;
    const newCount = complaints.filter((c) => c.status === 'new').length;
    const activeInProgress = complaints.filter((c) =>
      ['investigating', 'coordinating', 'in_progress', 'waiting_info'].includes(c.status)
    ).length;
    const completedCount = complaints.filter(
      (c) => c.status === 'completed' || c.status === 'closed'
    ).length;
    const overdueCount = complaints.filter((c) => isComplaintOverdue(c)).length;

    return {
      total,
      newCount,
      activeInProgress,
      completedCount,
      overdueCount
    };
  }, [complaints]);

  // Monthly statistics derived from receivedDate
  const monthlySeries = useMemo(() => {
    const monthBuckets: Record<string, { month: string; total: number; completed: number }> = {};
    complaints.forEach((c) => {
      const ym = c.receivedDate.slice(0, 7);
      if (!ym) return;
      if (!monthBuckets[ym]) {
        monthBuckets[ym] = { month: ym, total: 0, completed: 0 };
      }
      monthBuckets[ym].total += 1;
      if (c.status === 'completed' || c.status === 'closed') {
        monthBuckets[ym].completed += 1;
      }
    });
    const sorted = Object.values(monthBuckets).sort((a, b) => a.month.localeCompare(b.month));
    return sorted.slice(-6);
  }, [complaints]);

  const maxMonthlyVal = Math.max(...monthlySeries.map((m) => m.total), 1);

  // Category distribution derived from complaints
  const categoryBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    complaints.forEach((c) => {
      counts[c.category] = (counts[c.category] || 0) + 1;
    });
    return Object.entries(CATEGORY_META)
      .map(([key, meta]) => ({
        key,
        label: meta.shortTh,
        colorHex: meta.colorHex,
        count: counts[key] || 0,
        percent: complaints.length > 0 ? Math.round(((counts[key] || 0) / complaints.length) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count);
  }, [complaints]);

  // Latest 6 complaints
  const recentComplaints = useMemo(() => {
    return [...complaints]
      .sort((a, b) => b.receivedDate.localeCompare(a.receivedDate) || b.createdAt.localeCompare(a.createdAt))
      .slice(0, 6);
  }, [complaints]);

  return (
    <div className="space-y-6">
      {/* Welcome Banner (Single Focal Anchor) */}
      <div className="bg-[#0B1F36] text-white rounded-xl p-6 border border-[#183354] flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-1.5 max-w-2xl">
          <div className="text-xs font-medium text-[#C5A45A]">
            ศูนย์ดำรงธรรมจังหวัดสงขลา · ศาลากลางจังหวัดสงขลา
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            สวัสดีครับ, {officerName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            ระบบจัดการข้อมูลและติดตามเรื่องร้องเรียนร้องทุกข์ (SONGKHLA DAMRONGDHAM CONNECT)
            เพื่อติดตามความคืบหน้าและประสานงานช่วยเหลือประชาชนอย่างเป็นระบบ
          </p>
        </div>

        <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-3 shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0 border-white/10">
          <div className="text-left lg:text-right">
            <div className="text-xs text-slate-300 flex items-center lg:justify-end gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#C5A45A]" />
              <span>{thaiDateTimeStr.datePart}</span>
            </div>
            <div className="text-lg sm:text-xl font-mono-numbers font-bold text-white mt-0.5">
              เวลา {thaiDateTimeStr.timePart} น.
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('intake')}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#0B1F36] bg-[#C5A45A] hover:bg-[#d5b56b] rounded-lg transition-colors cursor-pointer whitespace-nowrap"
          >
            <FilePlus2 className="w-4 h-4" />
            <span>บันทึกเรื่องร้องเรียนใหม่</span>
          </button>
        </div>
      </div>

      {/* 5 Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <button
          onClick={() => onNavigateTab('registry')}
          className="bg-white rounded-xl border border-[#E5EAF0] p-4 text-left hover:border-[#1D4ED8]/50 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>เรื่องร้องเรียนทั้งหมด</span>
            <FileText className="w-4 h-4 text-[#102C4C]" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono-numbers text-[#102C4C]">{kpis.total}</span>
            <span className="text-xs text-slate-500">เรื่อง</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">ทะเบียนรับเรื่องในระบบ</div>
        </button>

        <button
          onClick={() => onNavigateTab('assignment')}
          className="bg-white rounded-xl border border-[#E5EAF0] p-4 text-left hover:border-blue-400 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>เรื่องที่รับใหม่</span>
            <Inbox className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono-numbers text-blue-700">{kpis.newCount}</span>
            <span className="text-xs text-slate-500">เรื่อง</span>
          </div>
          <div className="mt-1 text-[11px] text-blue-700 font-medium">รอมอบหมายเจ้าหน้าที่</div>
        </button>

        <button
          onClick={() => onNavigateTab('tracking')}
          className="bg-white rounded-xl border border-[#E5EAF0] p-4 text-left hover:border-amber-400 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>อยู่ระหว่างดำเนินการ</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono-numbers text-amber-700">{kpis.activeInProgress}</span>
            <span className="text-xs text-slate-500">เรื่อง</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">ตรวจสอบ/ประสาน/ดำเนินการ</div>
        </button>

        <button
          onClick={() => onNavigateTab('reports')}
          className="bg-white rounded-xl border border-[#E5EAF0] p-4 text-left hover:border-emerald-400 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>ดำเนินการเสร็จสิ้น</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono-numbers text-emerald-700">{kpis.completedCount}</span>
            <span className="text-xs text-slate-500">เรื่อง</span>
          </div>
          <div className="mt-1 text-[11px] text-emerald-700 font-medium">
            {kpis.total > 0 ? Math.round((kpis.completedCount / kpis.total) * 100) : 0}% ของเรื่องทั้งหมด
          </div>
        </button>

        <button
          onClick={onFilterOverdueInRegistry}
          className="bg-white rounded-xl border border-[#E5EAF0] p-4 text-left hover:border-rose-400 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>เกินกำหนดติดตาม</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono-numbers text-rose-700">{kpis.overdueCount}</span>
            <span className="text-xs text-slate-500">เรื่อง</span>
          </div>
          <div className="mt-1 text-[11px] text-rose-700 font-medium">เลยวันกำหนดติดตามผล</div>
        </button>
      </div>

      {/* Charts Row: Monthly Complaints & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Bar Chart */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-[#E5EAF0] p-6 flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
            <div>
              <h2 className="text-base font-bold text-[#102C4C]">จำนวนเรื่องร้องเรียนรายเดือน</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                เปรียบเทียบจำนวนเรื่องรับเข้าทั้งหมดกับเรื่องที่ดำเนินการเสร็จสิ้น
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-600">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#102C4C]" />
                <span>รับเรื่องทั้งหมด</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#C5A45A]" />
                <span>เสร็จสิ้น/ยุติเรื่อง</span>
              </span>
            </div>
          </div>

          {monthlySeries.length === 0 ? (
            <div className="h-52 flex items-center justify-center text-xs text-slate-400">
              ยังไม่มีข้อมูลรายเดือน
            </div>
          ) : (
            <div className="h-56 flex items-end justify-between gap-3 pt-4 border-b border-[#E5EAF0] pb-2">
              {monthlySeries.map((item) => {
                const totalHeightPct = Math.max(10, Math.round((item.total / maxMonthlyVal) * 100));
                const doneHeightPct = item.completed > 0 ? Math.max(10, Math.round((item.completed / maxMonthlyVal) * 100)) : 0;

                return (
                  <div key={item.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <div className="w-full flex items-end justify-center gap-1.5 h-40">
                      <div className="flex flex-col items-center justify-end h-full w-6 sm:w-8">
                        <span className="text-[11px] font-mono-numbers font-semibold text-[#102C4C] mb-1">
                          {item.total}
                        </span>
                        <div
                          className="w-full bg-[#102C4C] rounded-t transition-all duration-300"
                          style={{ height: `${totalHeightPct}%` }}
                          title={`ทั้งหมด ${item.total} เรื่อง`}
                        />
                      </div>
                      <div className="flex flex-col items-center justify-end h-full w-6 sm:w-8">
                        <span className="text-[11px] font-mono-numbers font-semibold text-[#A17E34] mb-1">
                          {item.completed}
                        </span>
                        <div
                          className="w-full bg-[#C5A45A] rounded-t transition-all duration-300"
                          style={{ height: `${doneHeightPct}%` }}
                          title={`เสร็จสิ้น ${item.completed} เรื่อง`}
                        />
                      </div>
                    </div>
                    <span className="text-[11px] font-medium text-slate-600 whitespace-nowrap">
                      {formatThaiMonthLabel(item.month)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          <div className="pt-3 flex items-center justify-between text-xs text-slate-500">
            <span>ข้อมูลคำนวณจากวันที่รับเรื่องจริงในทะเบียน</span>
            <button
              onClick={() => onNavigateTab('analytics')}
              className="text-[#1D4ED8] font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>ดูสถิติเชิงลึก</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Complaint Category Breakdown */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-[#E5EAF0] p-6 flex flex-col justify-between">
          <div className="mb-4">
            <h2 className="text-base font-bold text-[#102C4C]">สัดส่วนประเภทเรื่องร้องเรียน</h2>
            <p className="text-xs text-slate-500 mt-0.5">จำแนกตามหมวดหมู่ปัญหาที่ประชาชนแจ้งเข้ามา</p>
          </div>

          <div className="space-y-3 flex-1">
            {categoryBreakdown.slice(0, 6).map((cat) => (
              <div key={cat.key} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[#1B2B3A] truncate pr-2">{cat.label}</span>
                  <span className="font-mono-numbers text-slate-600 shrink-0">
                    <strong className="text-[#102C4C]">{cat.count}</strong> เรื่อง ({cat.percent}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${cat.percent}%`, backgroundColor: cat.colorHex }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 mt-3 border-t border-[#E5EAF0] flex items-center justify-between text-xs text-slate-500">
            <span>ครอบคลุม {Object.keys(CATEGORY_META).length} หมวดหมู่</span>
            <button
              onClick={() => onNavigateTab('reports')}
              className="text-[#1D4ED8] font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>รายงานสรุป</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Complaints Table */}
      <div className="bg-white rounded-xl border border-[#E5EAF0] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E5EAF0] flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-[#102C4C]">รายการเรื่องร้องเรียนล่าสุด</h2>
            <p className="text-xs text-slate-500">
              แสดงรายการรับเรื่องล่าสุดพร้อมสถานะการดำเนินงานและหน่วยงานรับผิดชอบ
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('registry')}
            className="text-xs font-semibold text-[#1D4ED8] hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <span>ดูทะเบียนเรื่องร้องเรียนทั้งหมด</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#F8FAFC] text-slate-600 border-b border-[#E5EAF0]">
              <tr>
                <th className="py-3 px-4 font-semibold whitespace-nowrap">เลขที่รับเรื่อง</th>
                <th className="py-3 px-4 font-semibold whitespace-nowrap">วันที่รับเรื่อง</th>
                <th className="py-3 px-4 font-semibold">หัวข้อเรื่อง / พื้นที่</th>
                <th className="py-3 px-4 font-semibold hidden md:table-cell">หน่วยงานที่เกี่ยวข้อง</th>
                <th className="py-3 px-4 font-semibold whitespace-nowrap">ความเร่งด่วน</th>
                <th className="py-3 px-4 font-semibold whitespace-nowrap">สถานะ</th>
                <th className="py-3 px-4 font-semibold text-right whitespace-nowrap">ดูข้อมูล</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5EAF0]">
              {recentComplaints.map((item) => {
                const statusMeta = STATUS_META[item.status];
                const urgencyMeta = URGENCY_META[item.urgency];
                const overdue = isComplaintOverdue(item);

                return (
                  <tr
                    key={item.id}
                    onClick={() => onSelectComplaintDetail(item)}
                    className="hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-4 font-mono-numbers font-semibold text-[#102C4C] whitespace-nowrap">
                      {item.caseNumber}
                    </td>
                    <td className="py-3 px-4 font-mono-numbers text-slate-600 whitespace-nowrap">
                      {formatThaiDate(item.receivedDate)}
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-semibold text-[#102C4C] truncate">{item.subject}</div>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5">
                        {item.complainantName} · {item.district}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 hidden md:table-cell max-w-[200px] truncate">
                      <span className="inline-flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{item.responsibleAgency}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`font-semibold ${urgencyMeta.textColor}`}>
                        {urgencyMeta.labelTh}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex flex-col gap-0.5">
                        <span className={`inline-flex items-center gap-1.5 font-semibold ${statusMeta.textColor}`}>
                          <span className={`w-2 h-2 rounded-full ${statusMeta.dotColor}`} />
                          <span>{statusMeta.labelTh}</span>
                        </span>
                        {overdue && (
                          <span className="text-[10px] text-rose-700 font-medium">เกินกำหนดติดตาม</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectComplaintDetail(item);
                        }}
                        className="p-1.5 text-slate-500 hover:text-[#102C4C] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        title="เปิดดูรายละเอียด"
                      >
                        <Eye className="w-4 h-4" />
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
