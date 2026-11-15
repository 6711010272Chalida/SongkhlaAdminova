import React, { useMemo, useState } from 'react';
import { ComplaintRecord } from '../types';
import { CATEGORY_META, SONGKHLA_DISTRICTS } from '../data/mockComplaints';
import { formatThaiMonthLabel } from '../services/storageService';
import {
  BarChart3,
  MapPin,
  Building2,
  TrendingUp,
  CheckCircle2,
  Layers
} from 'lucide-react';

interface AnalyticsViewProps {
  complaints: ComplaintRecord[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ complaints }) => {
  const [selectedYear, setSelectedYear] = useState<string>('all');

  const availableYears = useMemo(() => {
    const yrs = new Set<string>();
    complaints.forEach((c) => {
      if (c.receivedDate) yrs.add(c.receivedDate.slice(0, 4));
    });
    return Array.from(yrs).sort((a, b) => b.localeCompare(a));
  }, [complaints]);

  const scopedComplaints = useMemo(() => {
    if (selectedYear === 'all') return complaints;
    return complaints.filter((c) => c.receivedDate.startsWith(selectedYear));
  }, [complaints, selectedYear]);

  // 1. Top Complaint Categories
  const categoryStats = useMemo(() => {
    const counts: Record<string, number> = {};
    scopedComplaints.forEach((c) => {
      counts[c.category] = (counts[c.category] || 0) + 1;
    });
    return Object.entries(CATEGORY_META)
      .map(([key, meta]) => ({
        key,
        label: meta.labelTh,
        short: meta.shortTh,
        colorHex: meta.colorHex,
        count: counts[key] || 0,
        percent: scopedComplaints.length > 0 ? Math.round(((counts[key] || 0) / scopedComplaints.length) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count);
  }, [scopedComplaints]);

  const maxCategoryCount = Math.max(...categoryStats.map((c) => c.count), 1);

  // 2 & 6. Monthly Volume & Trend Series
  const monthlyStats = useMemo(() => {
    const map: Record<string, { month: string; total: number; completed: number }> = {};
    scopedComplaints.forEach((c) => {
      const ym = c.receivedDate.slice(0, 7);
      if (!ym) return;
      if (!map[ym]) map[ym] = { month: ym, total: 0, completed: 0 };
      map[ym].total += 1;
      if (c.status === 'completed' || c.status === 'closed') {
        map[ym].completed += 1;
      }
    });
    return Object.values(map).sort((a, b) => a.month.localeCompare(b.month));
  }, [scopedComplaints]);

  const maxMonthlyCount = Math.max(...monthlyStats.map((m) => m.total), 1);

  // 3. District Distribution (พื้นที่ที่มีการร้องเรียน)
  const districtStats = useMemo(() => {
    const counts: Record<string, number> = {};
    scopedComplaints.forEach((c) => {
      const d = c.district || 'ไม่ระบุอำเภอ';
      counts[d] = (counts[d] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([district, count]) => ({
        district,
        count,
        percent: scopedComplaints.length > 0 ? Math.round((count / scopedComplaints.length) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count);
  }, [scopedComplaints]);

  const maxDistrictCount = Math.max(...districtStats.map((d) => d.count), 1);

  // 4. Agency Workload & Completion Rate
  const agencyStats = useMemo(() => {
    const map: Record<string, { total: number; completed: number; active: number }> = {};
    scopedComplaints.forEach((c) => {
      const ag = c.responsibleAgency || 'ไม่ระบุหน่วยงาน';
      if (!map[ag]) map[ag] = { total: 0, completed: 0, active: 0 };
      map[ag].total += 1;
      if (c.status === 'completed' || c.status === 'closed') {
        map[ag].completed += 1;
      } else {
        map[ag].active += 1;
      }
    });
    return Object.entries(map)
      .map(([agency, vals]) => ({
        agency,
        ...vals,
        rate: vals.total > 0 ? Math.round((vals.completed / vals.total) * 100) : 0
      }))
      .sort((a, b) => b.total - a.total);
  }, [scopedComplaints]);

  // 5. Overall Completion Rate Ring Calculations
  const completionSummary = useMemo(() => {
    const total = scopedComplaints.length;
    const completed = scopedComplaints.filter(
      (c) => c.status === 'completed' || c.status === 'closed'
    ).length;
    const active = scopedComplaints.filter((c) =>
      ['investigating', 'coordinating', 'in_progress', 'waiting_info'].includes(c.status)
    ).length;
    const newCount = scopedComplaints.filter((c) => c.status === 'new').length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, active, newCount, rate };
  }, [scopedComplaints]);

  // SVG Donut Geometry
  const ringRadius = 54;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset =
    ringCircumference - (completionSummary.rate / 100) * ringCircumference;

  // SVG Line Trend Geometry
  const trendChart = useMemo(() => {
    const width = 560;
    const height = 180;
    const padX = 36;
    const padY = 24;
    const plotW = width - padX * 2;
    const plotH = height - padY * 2;

    if (monthlyStats.length === 0) {
      return { width, height, points: [], polylineTotal: '', polylineCompleted: '', areaTotal: '' };
    }

    const pts = monthlyStats.map((m, idx) => {
      const x =
        monthlyStats.length === 1
          ? padX + plotW / 2
          : padX + (idx / (monthlyStats.length - 1)) * plotW;
      const yTotal = padY + plotH - (m.total / maxMonthlyCount) * plotH;
      const yDone = padY + plotH - (m.completed / maxMonthlyCount) * plotH;
      return {
        x,
        yTotal,
        yDone,
        label: formatThaiMonthLabel(m.month),
        total: m.total,
        completed: m.completed
      };
    });

    const polylineTotal = pts.map((p) => `${p.x},${p.yTotal}`).join(' ');
    const polylineCompleted = pts.map((p) => `${p.x},${p.yDone}`).join(' ');
    const areaTotal =
      pts.length > 0
        ? `${pts[0].x},${padY + plotH} ${polylineTotal} ${pts[pts.length - 1].x},${padY + plotH}`
        : '';

    return { width, height, padY, plotH, points: pts, polylineTotal, polylineCompleted, areaTotal };
  }, [monthlyStats, maxMonthlyCount]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-slate-500 mb-1">
            ระบบวิเคราะห์ข้อมูลเชิงลึก · ครอบคลุม {SONGKHLA_DISTRICTS.length} อำเภอในจังหวัดสงขลา
          </div>
          <h1 className="text-2xl font-bold text-[#102C4C] tracking-tight">
            สถิติและวิเคราะห์ข้อมูล
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            วิเคราะห์แนวโน้มเรื่องร้องเรียน ประเภทปัญหาที่พบบ่อย พื้นที่จังหวัดสงขลา และภาระงานของหน่วยงาน
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs self-start sm:self-auto">
          <span className="text-slate-500 font-medium">ปีข้อมูล:</span>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3 py-2 rounded-lg border border-[#E5EAF0] bg-white font-semibold text-[#102C4C] cursor-pointer"
          >
            <option value="all">ทุกปีในระบบ ({complaints.length} เรื่อง)</option>
            {availableYears.map((y) => (
              <option key={y} value={y}>
                ปี พ.ศ. {parseInt(y, 10) + 543} ({y})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 1: Top Categories & Completion Rate Ring */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 1. Most Frequent Complaint Categories */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-[#E5EAF0] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#102C4C] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#1D4ED8]" />
                <span>ประเภทเรื่องร้องเรียนที่พบมากที่สุด</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                จัดอันดับตามจำนวนเรื่องร้องเรียนในแต่ละหมวดหมู่
              </p>
            </div>
            <span className="text-xs font-mono-numbers text-slate-500">
              รวม {scopedComplaints.length} เรื่อง
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {categoryStats.map((cat, index) => (
              <div key={cat.key} className="space-y-1 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-[#1B2B3A] truncate">
                    <span className="font-mono-numbers text-slate-400 mr-1.5">{index + 1}.</span>
                    {cat.label}
                  </span>
                  <span className="font-mono-numbers text-slate-600 shrink-0">
                    <strong className="text-[#102C4C]">{cat.count}</strong> เรื่อง ({cat.percent}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${cat.count > 0 ? Math.max((cat.count / maxCategoryCount) * 100, 5) : 0}%`,
                      backgroundColor: cat.colorHex
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Completion Rate Donut Ring */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-[#E5EAF0] p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-[#102C4C] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>อัตราการดำเนินการเสร็จสิ้น</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              สัดส่วนเรื่องที่แก้ไขแล้วเสร็จ/ยุติเรื่อง เทียบกับเรื่องทั้งหมด
            </p>
          </div>

          <div className="my-5 flex items-center justify-center">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-36 h-36 -rotate-90" viewBox="0 0 132 132">
                <circle
                  cx="66"
                  cy="66"
                  r={ringRadius}
                  fill="none"
                  stroke="#F1F5F9"
                  strokeWidth="12"
                />
                <circle
                  cx="66"
                  cy="66"
                  r={ringRadius}
                  fill="none"
                  stroke="#059669"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={ringCircumference}
                  strokeDashoffset={ringOffset}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold font-mono-numbers text-[#102C4C]">
                  {completionSummary.rate}%
                </span>
                <span className="text-[11px] text-slate-500">เสร็จสิ้นแล้ว</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center pt-3 border-t border-[#E5EAF0] text-xs">
            <div className="p-2 rounded-lg bg-emerald-50/60">
              <div className="font-mono-numbers font-bold text-emerald-700 text-base">
                {completionSummary.completed}
              </div>
              <div className="text-[11px] text-slate-600">เสร็จสิ้น/ยุติ</div>
            </div>
            <div className="p-2 rounded-lg bg-amber-50/60">
              <div className="font-mono-numbers font-bold text-amber-700 text-base">
                {completionSummary.active}
              </div>
              <div className="text-[11px] text-slate-600">กำลังดำเนินการ</div>
            </div>
            <div className="p-2 rounded-lg bg-blue-50/60">
              <div className="font-mono-numbers font-bold text-blue-700 text-base">
                {completionSummary.newCount}
              </div>
              <div className="text-[11px] text-slate-600">รับใหม่</div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Monthly Volume Bar Chart & Complaint Trend Line Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 2. Monthly Volume Bar Chart */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-[#E5EAF0] p-6 space-y-4">
          <div>
            <h2 className="text-base font-bold text-[#102C4C] flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#102C4C]" />
              <span>จำนวนเรื่องร้องเรียนในแต่ละเดือน</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              แสดงปริมาณคำร้องที่รับเข้าในระบบแยกตามรายเดือน
            </p>
          </div>

          {monthlyStats.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-xs text-slate-400">
              ไม่มีข้อมูลรายเดือน
            </div>
          ) : (
            <div className="h-52 flex items-end justify-between gap-2.5 pt-4 border-b border-[#E5EAF0] pb-2">
              {monthlyStats.map((m) => {
                const hPct = Math.max(12, Math.round((m.total / maxMonthlyCount) * 100));
                return (
                  <div key={m.month} className="flex-1 flex flex-col items-center justify-end h-full gap-1.5">
                    <span className="text-xs font-mono-numbers font-bold text-[#102C4C]">
                      {m.total}
                    </span>
                    <div className="w-full max-w-[38px] h-36 flex items-end">
                      <div
                        className="w-full bg-[#102C4C] hover:bg-[#1D4ED8] transition-colors rounded-t"
                        style={{ height: `${hPct}%` }}
                        title={`${formatThaiMonthLabel(m.month)}: ${m.total} เรื่อง`}
                      />
                    </div>
                    <span className="text-[11px] text-slate-600 whitespace-nowrap">
                      {formatThaiMonthLabel(m.month)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 6. Complaint Trend Line Chart */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-[#E5EAF0] p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-[#102C4C] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#C5A45A]" />
                <span>แนวโน้มจำนวนเรื่องร้องเรียน</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                เส้นแนวโน้มการรับเรื่องเทียบกับเรื่องที่ดำเนินการเสร็จสิ้นรายเดือน
              </p>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-600">
              <span className="inline-flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1D4ED8]" /> เรื่องรับเข้า
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#059669]" /> เสร็จสิ้น
              </span>
            </div>
          </div>

          {trendChart.points.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-xs text-slate-400">
              ไม่มีข้อมูลแนวโน้มรายเดือน
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <svg
                viewBox={`0 0 ${trendChart.width} ${trendChart.height}`}
                className="w-full h-48 min-w-[360px]"
              >
                {/* Horizontal gridlines */}
                {[0.25, 0.5, 0.75, 1].map((ratio) => {
                  const y = (trendChart.padY || 24) + (trendChart.plotH || 132) * (1 - ratio);
                  return (
                    <line
                      key={ratio}
                      x1="28"
                      y1={y}
                      x2={trendChart.width - 28}
                      y2={y}
                      stroke="#E5EAF0"
                      strokeDasharray="3 3"
                    />
                  );
                })}

                {trendChart.areaTotal && (
                  <polygon points={trendChart.areaTotal} fill="rgba(29, 78, 216, 0.08)" />
                )}

                {trendChart.points.length > 1 && (
                  <>
                    <polyline
                      fill="none"
                      stroke="#1D4ED8"
                      strokeWidth="2.5"
                      points={trendChart.polylineTotal}
                    />
                    <polyline
                      fill="none"
                      stroke="#059669"
                      strokeWidth="2"
                      strokeDasharray="4 3"
                      points={trendChart.polylineCompleted}
                    />
                  </>
                )}

                {trendChart.points.map((pt) => (
                  <g key={pt.label}>
                    <circle cx={pt.x} cy={pt.yTotal} r="4.5" fill="#1D4ED8" stroke="#fff" strokeWidth="1.5" />
                    <circle cx={pt.x} cy={pt.yDone} r="3.5" fill="#059669" stroke="#fff" strokeWidth="1.5" />
                    <text
                      x={pt.x}
                      y={pt.yTotal - 9}
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="600"
                      fill="#102C4C"
                    >
                      {pt.total}
                    </text>
                    <text
                      x={pt.x}
                      y={trendChart.height - 4}
                      textAnchor="middle"
                      fontSize="10"
                      fill="#64748B"
                    >
                      {pt.label}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Row 3: Songkhla Areas & Assigned Agencies */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 3. Areas with Complaints (Songkhla Districts) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-[#E5EAF0] p-6 space-y-4">
          <div>
            <h2 className="text-base font-bold text-[#102C4C] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#C5A45A]" />
              <span>พื้นที่ที่มีการร้องเรียน (รายอำเภอ)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              การกระจายตัวของเรื่องร้องเรียนในเขตอำเภอจังหวัดสงขลา
            </p>
          </div>

          {districtStats.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">ยังไม่มีข้อมูลพื้นที่</div>
          ) : (
            <div className="space-y-3">
              {districtStats.map((d) => (
                <div key={d.district} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[#102C4C]">{d.district}</span>
                    <span className="font-mono-numbers text-slate-600">
                      <strong className="text-[#102C4C]">{d.count}</strong> เรื่อง ({d.percent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#C5A45A] rounded-full"
                      style={{ width: `${Math.max((d.count / maxDistrictCount) * 100, 6)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 4. Assigned Agencies Workload */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-[#E5EAF0] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E5EAF0]">
            <h2 className="text-base font-bold text-[#102C4C] flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#102C4C]" />
              <span>หน่วยงานที่ได้รับมอบหมายและอัตราความสำเร็จ</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              เปรียบเทียบปริมาณเรื่องที่ประสานงานกับหน่วยงานภาครัฐในจังหวัดสงขลา
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#F8FAFC] text-slate-600 border-b border-[#E5EAF0]">
                <tr>
                  <th className="py-3 px-4 font-semibold">หน่วยงานที่ได้รับมอบหมาย</th>
                  <th className="py-3 px-4 font-semibold text-right">รับผิดชอบ</th>
                  <th className="py-3 px-4 font-semibold text-right">เสร็จสิ้น</th>
                  <th className="py-3 px-4 font-semibold text-right">ค้างติดตาม</th>
                  <th className="py-3 px-4 font-semibold text-right">อัตราสำเร็จ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5EAF0]">
                {agencyStats.map((ag) => (
                  <tr key={ag.agency} className="hover:bg-[#F8FAFC]">
                    <td className="py-3 px-4 font-medium text-[#102C4C]">{ag.agency}</td>
                    <td className="py-3 px-4 text-right font-mono-numbers font-bold">{ag.total}</td>
                    <td className="py-3 px-4 text-right font-mono-numbers text-emerald-700 font-semibold">
                      {ag.completed}
                    </td>
                    <td className="py-3 px-4 text-right font-mono-numbers text-amber-700">
                      {ag.active}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <div className="w-14 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                          <div
                            className="h-full bg-emerald-600 rounded-full"
                            style={{ width: `${ag.rate}%` }}
                          />
                        </div>
                        <span className="font-mono-numbers font-semibold text-[#102C4C]">
                          {ag.rate}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
