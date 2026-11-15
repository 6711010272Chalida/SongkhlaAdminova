import React, { useState, useMemo } from 'react';
import { ComplaintRecord } from '../types';
import { CATEGORY_META, STATUS_META } from '../data/mockComplaints';
import { formatThaiDate, formatThaiMonthLabel, isComplaintOverdue } from '../services/storageService';
import {
  FileBarChart2,
  Printer,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  Clock,
  Inbox,
  FileText
} from 'lucide-react';
import { WaveMotif } from './WaveMotif';

interface ReportsViewProps {
  complaints: ComplaintRecord[];
  officerName: string;
}

type ReportPeriodMode = 'daily' | 'monthly' | 'yearly';

function summarizeSet(items: ComplaintRecord[]) {
  const total = items.length;
  const completed = items.filter((c) => c.status === 'completed' || c.status === 'closed').length;
  const inProgress = items.filter((c) =>
    ['investigating', 'coordinating', 'in_progress', 'waiting_info'].includes(c.status)
  ).length;
  const notStarted = items.filter((c) => c.status === 'new').length;
  const overdue = items.filter((c) => isComplaintOverdue(c)).length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { total, completed, inProgress, notStarted, overdue, completionRate };
}

function getPreviousPeriodKey(mode: ReportPeriodMode, key: string): string {
  if (mode === 'daily') {
    const d = new Date(key + 'T00:00:00');
    if (Number.isNaN(d.getTime())) return key;
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
  }
  if (mode === 'monthly') {
    const [yStr, mStr] = key.split('-');
    let y = parseInt(yStr, 10);
    let m = parseInt(mStr, 10) - 1;
    if (m <= 0) {
      m = 12;
      y -= 1;
    }
    return `${y}-${String(m).padStart(2, '0')}`;
  }
  const yr = parseInt(key, 10);
  return Number.isNaN(yr) ? key : String(yr - 1);
}

export const ReportsView: React.FC<ReportsViewProps> = ({ complaints, officerName }) => {
  // Default to latest receivedDate month/date present in complaints so demo immediately shows rich numbers
  const latestDate = useMemo(() => {
    if (complaints.length === 0) return new Date().toISOString().split('T')[0];
    return [...complaints].sort((a, b) => b.receivedDate.localeCompare(a.receivedDate))[0].receivedDate;
  }, [complaints]);

  const [periodMode, setPeriodMode] = useState<ReportPeriodMode>('monthly');
  const [selectedDay, setSelectedDay] = useState<string>(latestDate);
  const [selectedMonth, setSelectedMonth] = useState<string>(latestDate.slice(0, 7));
  const [selectedYear, setSelectedYear] = useState<string>(latestDate.slice(0, 4));

  const availableYears = useMemo(() => {
    const yrs = new Set<string>(['2026', '2025']);
    complaints.forEach((c) => {
      if (c.receivedDate) yrs.add(c.receivedDate.slice(0, 4));
    });
    return Array.from(yrs).sort((a, b) => b.localeCompare(a));
  }, [complaints]);

  const activePeriodKey =
    periodMode === 'daily' ? selectedDay : periodMode === 'monthly' ? selectedMonth : selectedYear;
  const previousPeriodKey = getPreviousPeriodKey(periodMode, activePeriodKey);

  const periodLabel = useMemo(() => {
    if (periodMode === 'daily') return `ประจำวันที่ ${formatThaiDate(selectedDay)}`;
    if (periodMode === 'monthly') {
      const [yStr, mStr] = selectedMonth.split('-');
      const thaiMonthsFull = [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
      ];
      const mIdx = parseInt(mStr, 10) - 1;
      const beYear = parseInt(yStr, 10) + 543;
      return `ประจำเดือน ${thaiMonthsFull[mIdx] || mStr} พ.ศ. ${beYear}`;
    }
    const beYear = parseInt(selectedYear, 10) + 543;
    return `ประจำปี พ.ศ. ${beYear} (ค.ศ. ${selectedYear})`;
  }, [periodMode, selectedDay, selectedMonth, selectedYear]);

  const currentRecords = useMemo(() => {
    return complaints.filter((c) => {
      if (periodMode === 'daily') return c.receivedDate === selectedDay;
      if (periodMode === 'monthly') return c.receivedDate.startsWith(selectedMonth);
      return c.receivedDate.startsWith(selectedYear);
    });
  }, [complaints, periodMode, selectedDay, selectedMonth, selectedYear]);

  const previousRecords = useMemo(() => {
    return complaints.filter((c) => {
      if (periodMode === 'daily') return c.receivedDate === previousPeriodKey;
      if (periodMode === 'monthly') return c.receivedDate.startsWith(previousPeriodKey);
      return c.receivedDate.startsWith(previousPeriodKey);
    });
  }, [complaints, periodMode, previousPeriodKey]);

  const currentSummary = useMemo(() => summarizeSet(currentRecords), [currentRecords]);
  const previousSummary = useMemo(() => summarizeSet(previousRecords), [previousRecords]);

  // Sub-period bar breakdown for the visual chart
  const chartSeries = useMemo(() => {
    if (periodMode === 'yearly') {
      const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
      return months
        .map((m) => {
          const ym = `${selectedYear}-${m}`;
          const subset = currentRecords.filter((c) => c.receivedDate.startsWith(ym));
          const sum = summarizeSet(subset);
          return {
            key: ym,
            label: formatThaiMonthLabel(ym),
            ...sum
          };
        })
        .filter((b) => b.total > 0);
    }
    // For daily/monthly, show breakdown by category present in period
    return Object.entries(CATEGORY_META)
      .map(([catKey, meta]) => {
        const subset = currentRecords.filter((c) => c.category === catKey);
        return {
          key: catKey,
          label: meta.shortTh,
          ...summarizeSet(subset)
        };
      })
      .filter((b) => b.total > 0);
  }, [periodMode, selectedYear, currentRecords]);

  const maxChartTotal = Math.max(...chartSeries.map((c) => c.total), 1);

  // Agency performance table for current period
  const agencyBreakdown = useMemo(() => {
    const map: Record<string, ComplaintRecord[]> = {};
    currentRecords.forEach((c) => {
      if (!map[c.responsibleAgency]) map[c.responsibleAgency] = [];
      map[c.responsibleAgency].push(c);
    });
    return Object.entries(map)
      .map(([agency, items]) => ({
        agency,
        ...summarizeSet(items)
      }))
      .sort((a, b) => b.total - a.total);
  }, [currentRecords]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = [
      'ช่วงรายงาน',
      'เลขที่รับเรื่อง',
      'วันที่รับเรื่อง',
      'ประเภทเรื่อง',
      'หัวข้อเรื่อง',
      'อำเภอ',
      'หน่วยงานรับผิดชอบ',
      'เจ้าหน้าที่ผู้รับผิดชอบ',
      'สถานะปัจจุบัน'
    ];
    const rows = currentRecords.map((c) => [
      `"${periodLabel}"`,
      `"${c.caseNumber}"`,
      `"${c.receivedDate}"`,
      `"${CATEGORY_META[c.category].labelTh}"`,
      `"${c.subject.replace(/"/g, '""')}"`,
      `"${c.district}"`,
      `"${c.responsibleAgency.replace(/"/g, '""')}"`,
      `"${c.assignedOfficer || '-'}"`,
      `"${STATUS_META[c.status].labelTh}"`
    ]);
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Damrongdham_Report_${periodMode}_${activePeriodKey}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const totalDelta = currentSummary.total - previousSummary.total;
  const rateDelta = currentSummary.completionRate - previousSummary.completionRate;

  return (
    <div className="space-y-6">
      {/* Official Print-Only Report Header */}
      <div className="print-only border-b-2 border-[#102C4C] pb-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <WaveMotif size="md" />
            <div>
              <div className="text-lg font-bold text-[#102C4C]">
                รายงานสรุปผลการดำเนินงานเรื่องร้องเรียนร้องทุกข์
              </div>
              <div className="text-sm text-slate-700">
                ศูนย์ดำรงธรรมจังหวัดสงขลา · ศาลากลางจังหวัดสงขลา (ระบบต้นแบบข้อมูลสมมติ)
              </div>
            </div>
          </div>
          <div className="text-right text-xs text-slate-600">
            <div>{periodLabel}</div>
            <div className="font-mono-numbers">
              พิมพ์เมื่อ: {new Date().toLocaleDateString('th-TH')}
            </div>
          </div>
        </div>
      </div>

      {/* Screen Header & Action Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 no-print">
        <div>
          <div className="text-xs text-slate-500 mb-1">
            ระบบรายงานผู้บริหารและสรุปผลการปฏิบัติงาน · {periodLabel}
          </div>
          <h1 className="text-2xl font-bold text-[#102C4C] tracking-tight">
            รายงานผลการดำเนินงาน
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            สรุปสถิติเรื่องร้องเรียนรายวัน รายเดือน และรายปี พร้อมการเปรียบเทียบผลการดำเนินงานและพิมพ์รายงาน PDF
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#102C4C] bg-white border border-[#E5EAF0] hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>ส่งออก CSV / Excel</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#102C4C] hover:bg-[#1D4ED8] rounded-lg transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#C5A45A]" />
            <span>พิมพ์รายงาน / บันทึก PDF</span>
          </button>
        </div>
      </div>

      {/* Period Mode & Date Picker Toolbar */}
      <div className="bg-white rounded-xl border border-[#E5EAF0] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-1.5 bg-[#F3F6FA] p-1 rounded-lg text-xs font-semibold self-start">
          {(
            [
              { id: 'daily', label: 'รายวัน' },
              { id: 'monthly', label: 'รายเดือน' },
              { id: 'yearly', label: 'รายปี' }
            ] as const
          ).map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => setPeriodMode(mode.id)}
              className={`px-4 py-1.5 rounded-md transition-colors cursor-pointer ${
                periodMode === mode.id
                  ? 'bg-[#102C4C] text-white'
                  : 'text-slate-600 hover:text-[#102C4C]'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="inline-flex items-center gap-1.5 text-slate-600 font-semibold">
            <Calendar className="w-4 h-4 text-[#102C4C]" />
            <span>เลือกช่วงเวลา:</span>
          </span>

          {periodMode === 'daily' && (
            <input
              type="date"
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-[#E5EAF0] font-mono-numbers text-xs bg-white"
            />
          )}

          {periodMode === 'monthly' && (
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-[#E5EAF0] font-mono-numbers text-xs bg-white"
            />
          )}

          {periodMode === 'yearly' && (
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-[#E5EAF0] font-mono-numbers text-xs bg-white cursor-pointer"
            >
              {availableYears.map((y) => (
                <option key={y} value={y}>
                  พ.ศ. {parseInt(y, 10) + 543} ({y})
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* 4 Required Period Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-[#E5EAF0] p-5">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>จำนวนเรื่องร้องเรียนทั้งหมด</span>
            <FileText className="w-4 h-4 text-[#102C4C]" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono-numbers text-[#102C4C]">
              {currentSummary.total}
            </span>
            <span className="text-xs text-slate-500">เรื่อง</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">{periodLabel}</div>
        </div>

        <div className="bg-white rounded-xl border border-[#E5EAF0] p-5">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>เรื่องที่ดำเนินการแล้ว</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono-numbers text-emerald-700">
              {currentSummary.completed}
            </span>
            <span className="text-xs text-slate-500">เรื่อง</span>
          </div>
          <div className="mt-1 text-[11px] text-emerald-700 font-semibold">
            ร้อยละ {currentSummary.completionRate}% (เสร็จสิ้น/ยุติเรื่อง)
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E5EAF0] p-5">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>อยู่ระหว่างดำเนินการ</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono-numbers text-amber-700">
              {currentSummary.inProgress}
            </span>
            <span className="text-xs text-slate-500">เรื่อง</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            ตรวจสอบ / ประสานงาน / รอข้อมูล
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E5EAF0] p-5">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>เรื่องที่ยังไม่ดำเนินการ</span>
            <Inbox className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono-numbers text-blue-700">
              {currentSummary.notStarted}
            </span>
            <span className="text-xs text-slate-500">เรื่อง</span>
          </div>
          <div className="mt-1 text-[11px] text-blue-700 font-medium">รับเรื่องใหม่รอมอบหมาย</div>
        </div>
      </div>

      {/* Period Comparison + Summary Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 print-break-inside-avoid">
        {/* Comparison Summary Card */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-[#E5EAF0] p-6 space-y-4">
          <div className="flex items-center gap-2">
            <FileBarChart2 className="w-4 h-4 text-[#C5A45A]" />
            <h2 className="text-base font-bold text-[#102C4C]">
              เปรียบเทียบผลการดำเนินงานกับช่วงก่อนหน้า
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-lg bg-[#F8FAFC] border border-[#E5EAF0]">
              <div className="text-slate-500 mb-1">ปริมาณเรื่องรับเข้า</div>
              <div className="text-lg font-bold font-mono-numbers text-[#102C4C]">
                {currentSummary.total} <span className="text-xs font-normal">เรื่อง</span>
              </div>
              <div className="mt-1.5 flex items-center gap-1 text-[11px]">
                {totalDelta > 0 ? (
                  <span className="text-amber-700 font-semibold inline-flex items-center gap-0.5">
                    <TrendingUp className="w-3.5 h-3.5" /> +{totalDelta} จากช่วงก่อน ({previousSummary.total})
                  </span>
                ) : totalDelta < 0 ? (
                  <span className="text-emerald-700 font-semibold inline-flex items-center gap-0.5">
                    <TrendingDown className="w-3.5 h-3.5" /> {totalDelta} จากช่วงก่อน ({previousSummary.total})
                  </span>
                ) : (
                  <span className="text-slate-500 inline-flex items-center gap-0.5">
                    <Minus className="w-3.5 h-3.5" /> เท่ากับช่วงก่อน ({previousSummary.total})
                  </span>
                )}
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-[#F8FAFC] border border-[#E5EAF0]">
              <div className="text-slate-500 mb-1">อัตราการแก้ไขเสร็จสิ้น</div>
              <div className="text-lg font-bold font-mono-numbers text-emerald-700">
                {currentSummary.completionRate}%
              </div>
              <div className="mt-1.5 flex items-center gap-1 text-[11px]">
                {rateDelta > 0 ? (
                  <span className="text-emerald-700 font-semibold inline-flex items-center gap-0.5">
                    <TrendingUp className="w-3.5 h-3.5" /> +{rateDelta}% จากช่วงก่อน ({previousSummary.completionRate}%)
                  </span>
                ) : rateDelta < 0 ? (
                  <span className="text-rose-700 font-semibold inline-flex items-center gap-0.5">
                    <TrendingDown className="w-3.5 h-3.5" /> {rateDelta}% จากช่วงก่อน ({previousSummary.completionRate}%)
                  </span>
                ) : (
                  <span className="text-slate-500 inline-flex items-center gap-0.5">
                    <Minus className="w-3.5 h-3.5" /> เท่ากับช่วงก่อน ({previousSummary.completionRate}%)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Stacked Progress Bar */}
          <div className="pt-2 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#102C4C]">สัดส่วนความคืบหน้าในช่วงเวลาที่เลือก</span>
              <span className="font-mono-numbers text-slate-600">{currentSummary.total} เรื่อง</span>
            </div>
            <div className="w-full h-3.5 rounded-full bg-slate-100 overflow-hidden flex">
              {currentSummary.total > 0 && (
                <>
                  <div
                    className="bg-emerald-600 h-full"
                    style={{ width: `${(currentSummary.completed / currentSummary.total) * 100}%` }}
                    title={`ดำเนินการแล้ว ${currentSummary.completed} เรื่อง`}
                  />
                  <div
                    className="bg-amber-500 h-full"
                    style={{ width: `${(currentSummary.inProgress / currentSummary.total) * 100}%` }}
                    title={`อยู่ระหว่างดำเนินการ ${currentSummary.inProgress} เรื่อง`}
                  />
                  <div
                    className="bg-blue-600 h-full"
                    style={{ width: `${(currentSummary.notStarted / currentSummary.total) * 100}%` }}
                    title={`ยังไม่ดำเนินการ ${currentSummary.notStarted} เรื่อง`}
                  />
                </>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-600">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-emerald-600" />
                ดำเนินการแล้ว ({currentSummary.completed})
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-amber-500" />
                อยู่ระหว่างดำเนินการ ({currentSummary.inProgress})
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-blue-600" />
                ยังไม่ดำเนินการ ({currentSummary.notStarted})
              </span>
            </div>
          </div>
        </div>

        {/* Visual Breakdown Chart */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-[#E5EAF0] p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-[#102C4C]">
                {periodMode === 'yearly'
                  ? 'กราฟสรุปเรื่องร้องเรียนรายเดือนตลอดปี'
                  : 'กราฟสรุปเรื่องร้องเรียนแยกตามประเภทปัญหา'}
              </h2>
              <p className="text-xs text-slate-500">{periodLabel}</p>
            </div>
          </div>

          {chartSeries.length === 0 ? (
            <div className="h-44 flex items-center justify-center text-xs text-slate-400">
              ไม่มีเรื่องร้องเรียนในช่วงเวลาที่เลือก
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              {chartSeries.map((row) => {
                const widthPct = Math.round((row.total / maxChartTotal) * 100);
                const donePct = row.total > 0 ? Math.round((row.completed / row.total) * 100) : 0;
                return (
                  <div key={row.key} className="space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-[#1B2B3A] truncate pr-2">{row.label}</span>
                      <span className="font-mono-numbers text-slate-600 shrink-0">
                        รวม <strong className="text-[#102C4C]">{row.total}</strong> · เสร็จสิ้น{' '}
                        <strong className="text-emerald-700">{row.completed}</strong> ({donePct}%)
                      </span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#102C4C] rounded-full flex overflow-hidden"
                        style={{ width: `${Math.max(widthPct, 6)}%` }}
                      >
                        <div
                          className="h-full bg-[#C5A45A]"
                          style={{ width: `${donePct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Agency Breakdown & Detailed Case List Table */}
      <div className="bg-white rounded-xl border border-[#E5EAF0] overflow-hidden print-break-inside-avoid">
        <div className="px-6 py-4 border-b border-[#E5EAF0] flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#102C4C]">
              สรุปผลการประสานงานแยกตามหน่วยงาน ({agencyBreakdown.length} หน่วยงาน)
            </h2>
            <p className="text-xs text-slate-500">{periodLabel}</p>
          </div>
        </div>

        {agencyBreakdown.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            ไม่มีข้อมูลการประสานหน่วยงานในช่วงเวลาที่เลือก
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#F8FAFC] text-slate-600 border-b border-[#E5EAF0]">
                <tr>
                  <th className="py-3 px-4 font-semibold">หน่วยงานที่รับผิดชอบ / ประสานงาน</th>
                  <th className="py-3 px-4 font-semibold text-right">ทั้งหมด</th>
                  <th className="py-3 px-4 font-semibold text-right">ดำเนินการแล้ว</th>
                  <th className="py-3 px-4 font-semibold text-right">อยู่ระหว่างดำเนินการ</th>
                  <th className="py-3 px-4 font-semibold text-right">รอมอบหมาย</th>
                  <th className="py-3 px-4 font-semibold text-right">ร้อยละสำเร็จ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5EAF0]">
                {agencyBreakdown.map((ag) => (
                  <tr key={ag.agency} className="hover:bg-[#F8FAFC]">
                    <td className="py-3 px-4 font-semibold text-[#102C4C]">{ag.agency}</td>
                    <td className="py-3 px-4 text-right font-mono-numbers font-bold">{ag.total}</td>
                    <td className="py-3 px-4 text-right font-mono-numbers text-emerald-700 font-semibold">
                      {ag.completed}
                    </td>
                    <td className="py-3 px-4 text-right font-mono-numbers text-amber-700">
                      {ag.inProgress}
                    </td>
                    <td className="py-3 px-4 text-right font-mono-numbers text-blue-700">
                      {ag.notStarted}
                    </td>
                    <td className="py-3 px-4 text-right font-mono-numbers font-semibold text-[#102C4C]">
                      {ag.completionRate}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Print-Only Signature Footer */}
      <div className="print-only pt-10 flex justify-end">
        <div className="text-center text-xs space-y-8 w-64">
          <div>ลงชื่อ ....................................................... ผู้จัดทำรายงาน</div>
          <div>
            ({officerName})
            <br />
            ศูนย์ดำรงธรรมจังหวัดสงขลา
          </div>
        </div>
      </div>
    </div>
  );
};
