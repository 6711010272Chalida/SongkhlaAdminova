import React, { useMemo } from 'react';
import { WorkRecord } from '../types';
import { CATEGORY_LABELS, STATUS_LABELS } from '../data/initialRecords';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  ShieldAlert, 
  Download, 
  Printer, 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertTriangle 
} from 'lucide-react';

interface ReportsViewProps {
  records: WorkRecord[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ records }) => {
  const stats = useMemo(() => {
    const total = records.length;
    const pending = records.filter(r => r.status === 'pending').length;
    const inProgress = records.filter(r => r.status === 'in_progress').length;
    const completed = records.filter(r => r.status === 'completed').length;
    const cancelled = records.filter(r => r.status === 'cancelled').length;

    // Category distribution
    const categoryCounts: Record<string, number> = {};
    Object.keys(CATEGORY_LABELS).forEach(k => { categoryCounts[k] = 0; });
    records.forEach(r => {
      categoryCounts[r.category] = (categoryCounts[r.category] || 0) + 1;
    });

    // Officer workload
    const officerCounts: Record<string, { total: number; completed: number; pending: number }> = {};
    records.forEach(r => {
      const name = r.responsiblePerson;
      if (!officerCounts[name]) {
        officerCounts[name] = { total: 0, completed: 0, pending: 0 };
      }
      officerCounts[name].total += 1;
      if (r.status === 'completed') officerCounts[name].completed += 1;
      else officerCounts[name].pending += 1;
    });

    // Monthly breakdown
    const monthlyCounts: Record<string, number> = {};
    records.forEach(r => {
      const month = r.receivedDate.substring(0, 7); // YYYY-MM
      monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
    });

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      pending,
      inProgress,
      completed,
      cancelled,
      categoryCounts,
      officerCounts,
      monthlyCounts,
      completionRate
    };
  }, [records]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>รายงานและสถิติภาพรวม</span>
            <span aria-hidden="true">·</span>
            <span>รายงานเชิงวิเคราะห์จำลอง</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0F2038]">
            รายงานสถิติการจัดการข้อมูลและติดตามงาน
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            ประมวลผลสถิติจากระเบียนข้อมูลทั้งหมดในระบบจำลองเพื่อใช้ในการวิเคราะห์และนำเสนอ
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Printer className="w-4 h-4 text-slate-600" />
          <span>พิมพ์รายงานฉบับนี้</span>
        </button>
      </div>

      {/* Mandatory Demo Data Disclaimer Box */}
      <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-4 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed">
          <strong className="font-semibold block mb-0.5">
            ประกาศคำเตือนข้อมูลสมมติ (Demo Data Disclaimer)
          </strong>
          สถิติและตัวเลขทั้งหมดในรายงานนี้คำนวณจากชุดข้อมูลจำลองที่สร้างขึ้นเพื่อการสาธิตโครงงานนวัตกรรมเท่านั้น มิใช่สถิติผลการปฏิบัติงานจริงของส่วนราชการจังหวัดสงขลา หรือหน่วยงานใดๆ
        </div>
      </div>

      {/* Key Metric Highlights Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <span className="text-xs font-medium text-slate-500 block mb-1">ปริมาณงานสะสม</span>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono-numbers">
            {stats.total}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">เรื่องทั้งหมดในระบบ</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <span className="text-xs font-medium text-slate-500 block mb-1">อัตรางานแล้วเสร็จ</span>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-600 font-mono-numbers">
            {stats.completionRate}%
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block font-mono-numbers">
            {stats.completed} จาก {stats.total} เรื่อง
          </span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <span className="text-xs font-medium text-slate-500 block mb-1">งานที่กำลังดำเนินการ</span>
          <div className="text-2xl sm:text-3xl font-bold text-sky-600 font-mono-numbers">
            {stats.inProgress}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">อยู่ระหว่างประสานงาน</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <span className="text-xs font-medium text-slate-500 block mb-1">งานรอดำเนินการ</span>
          <div className="text-2xl sm:text-3xl font-bold text-amber-600 font-mono-numbers">
            {stats.pending}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">รอตรวจสอบ/สั่งการ</span>
        </div>
      </div>

      {/* Visual Section: Charts 2-column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Category Distribution */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">การกระจายตัวของประเภทงาน</h2>
              <p className="text-xs text-slate-500">สัดส่วนภารกิจงานที่รับเข้าสู่ระบบ</p>
            </div>
            <BarChart3 className="w-5 h-5 text-slate-400" />
          </div>

          <div className="space-y-4 pt-2">
            {Object.entries(CATEGORY_LABELS).map(([catKey, catInfo]) => {
              const count = stats.categoryCounts[catKey] || 0;
              const maxVal = Math.max(...Object.values(stats.categoryCounts), 1);
              const percentage = Math.round((count / (stats.total || 1)) * 100);
              const barWidth = Math.round((count / maxVal) * 100);

              return (
                <div key={catKey} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-800">{catInfo.labelTh}</span>
                    <span className="font-mono-numbers text-slate-600 font-semibold">
                      {count} เรื่อง ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-[#0F2038] h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.max(barWidth, count > 0 ? 5 : 0)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Officer Workload Analysis */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">การกระจายภาระงานตามผู้รับผิดชอบ</h2>
              <p className="text-xs text-slate-500">ภาระงานสะสมของเจ้าหน้าที่ (ชื่อจำลอง)</p>
            </div>
            <Users className="w-5 h-5 text-slate-400" />
          </div>

          <div className="space-y-3 pt-2">
            {Object.entries(stats.officerCounts).map(([officer, data]) => {
              const completedPct = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0;
              return (
                <div key={officer} className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800">{officer}</span>
                    <span className="font-mono-numbers text-slate-600 font-medium">
                      รวม {data.total} เรื่อง
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="text-emerald-700">เสร็จ {data.completed} เรื่อง</span>
                    <span className="text-amber-700">คงค้าง {data.pending} เรื่อง</span>
                    <span className="font-mono-numbers font-medium text-slate-700">สำเร็จ {completedPct}%</span>
                  </div>

                  {/* Progress track */}
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden flex">
                    <div 
                      className="bg-emerald-500 h-full transition-all"
                      style={{ width: `${completedPct}%` }}
                    />
                    <div 
                      className="bg-amber-400 h-full transition-all"
                      style={{ width: `${100 - completedPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Monthly Influx Comparison */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">สถิติปริมาณงานรับเข้าจำแนกตามเดือน</h2>
            <p className="text-xs text-slate-500">แนวโน้มการรับเรื่องเข้าสู่ระบบ (จำลองปี 2569)</p>
          </div>
          <TrendingUp className="w-5 h-5 text-slate-400" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(stats.monthlyCounts).map(([month, count]) => {
            const [y, m] = month.split('-');
            const monthNames: Record<string, string> = {
              '09': 'กันยายน 2569 (ก.ย.)',
              '10': 'ตุลาคม 2569 (ต.ค.)',
              '11': 'พฤศจิกายน 2569 (พ.ย.)'
            };
            const label = monthNames[m] || `${month}`;

            return (
              <div key={month} className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-xs font-semibold text-slate-600 block mb-1">{label}</span>
                <div className="text-xl sm:text-2xl font-bold text-[#0F2038] font-mono-numbers">
                  {count} <span className="text-xs font-normal text-slate-500">เรื่อง</span>
                </div>
                <div className="mt-2 text-[11px] text-slate-500">
                  สัดส่วน {Math.round((count / (stats.total || 1)) * 100)}% ของงานทั้งหมด
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
