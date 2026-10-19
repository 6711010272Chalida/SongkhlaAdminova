import React, { useState, useMemo } from 'react';
import { WorkRecord, WorkStatus } from '../types';
import { CATEGORY_LABELS, STATUS_LABELS, PRIORITY_LABELS } from '../data/initialRecords';
import { 
  Search, 
  Calendar, 
  Filter, 
  RotateCcw, 
  Download, 
  Printer, 
  FileSearch, 
  Eye, 
  ArrowRight,
  Clock,
  Sparkles
} from 'lucide-react';

interface SmartSearchViewProps {
  records: WorkRecord[];
  onSelectRecord: (record: WorkRecord) => void;
  onOpenNewTaskModal: () => void;
}

const POPULAR_KEYWORDS = [
  'ทะเลสาบสงขลา',
  'คลองสำโรง',
  'ศูนย์ดำรงธรรม',
  'แหลมสมิหลา',
  'ลดใช้กระดาษ',
  'งบประมาณ',
  'เมืองเก่าสงขลา',
  'อุทกภัย'
];

export const SmartSearchView: React.FC<SmartSearchViewProps> = ({
  records,
  onSelectRecord,
  onOpenNewTaskModal
}) => {
  const [keyword, setKeyword] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Results matching
  const results = useMemo(() => {
    return records.filter((rec) => {
      // Keyword matching across multiple fields
      if (keyword.trim()) {
        const q = keyword.toLowerCase().trim();
        const matchRef = rec.refId.toLowerCase().includes(q);
        const matchTitle = rec.title.toLowerCase().includes(q);
        const matchAgency = rec.originAgency.toLowerCase().includes(q);
        const matchDept = rec.department.toLowerCase().includes(q);
        const matchDetails = rec.details.toLowerCase().includes(q);
        const matchOfficer = rec.responsiblePerson.toLowerCase().includes(q);
        const matchNotes = rec.notes.some(n => n.text.toLowerCase().includes(q) || n.author.toLowerCase().includes(q));

        if (!matchRef && !matchTitle && !matchAgency && !matchDept && !matchDetails && !matchOfficer && !matchNotes) {
          return false;
        }
      }

      // Category
      if (categoryFilter !== 'all' && rec.category !== categoryFilter) return false;

      // Status
      if (statusFilter !== 'all' && rec.status !== statusFilter) return false;

      // Date range (by receivedDate)
      if (startDate && rec.receivedDate < startDate) return false;
      if (endDate && rec.receivedDate > endDate) return false;

      return true;
    });
  }, [records, keyword, categoryFilter, statusFilter, startDate, endDate]);

  const handleResetFilters = () => {
    setKeyword('');
    setCategoryFilter('all');
    setStatusFilter('all');
    setStartDate('');
    setEndDate('');
  };

  const handleExportCSV = () => {
    if (results.length === 0) return;
    const headers = ['รหัสเอกสาร', 'เรื่อง', 'ประเภทงาน', 'วันที่รับเรื่อง', 'วันนัดติดตาม', 'ผู้รับผิดชอบ', 'สถานะ', 'หน่วยงานต้นเรื่อง'];
    const rows = results.map(r => [
      `"${r.refId}"`,
      `"${r.title.replace(/"/g, '""')}"`,
      `"${CATEGORY_LABELS[r.category]?.labelTh || r.category}"`,
      `"${r.receivedDate}"`,
      `"${r.followUpDate}"`,
      `"${r.responsiblePerson}"`,
      `"${STATUS_LABELS[r.status]?.labelTh || r.status}"`,
      `"${r.originAgency.replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `SONGKHLA_AdminFlow_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const hasFilterActive = keyword !== '' || categoryFilter !== 'all' || statusFilter !== 'all' || startDate !== '' || endDate !== '';

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
          <span>ระบบสืบค้นอัจฉริยะ</span>
          <span aria-hidden="true">·</span>
          <span>สืบค้นแบบเต็มข้อความ (Full-text Search)</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#0F2038]">
          ค้นหาข้อมูลและสารบบงานราชการจำลอง
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          ค้นหาจากเลขรับเรื่อง ชื่อเรื่อง ข้อสั่งการ หน่วยงานต้นเรื่อง และประวัติบันทึกความคืบหน้า
        </p>
      </div>

      {/* Main Search & Advanced Filter Box */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        {/* Big Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="พิมพ์คำค้น เช่น 'คลองสำโรง', 'SK-69', 'ศูนย์ดำรงธรรม', 'ไฟส่องสว่าง'..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full pl-12 pr-24 py-3 text-sm sm:text-base rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/40 bg-slate-50/50"
          />
          {keyword && (
            <button
              onClick={() => setKeyword('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 px-2 py-1 bg-slate-200/60 rounded"
            >
              ล้างคำค้น
            </button>
          )}
        </div>

        {/* Quick Keyword Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-500 text-[11px] font-semibold">คำค้นยอดนิยม:</span>
          {POPULAR_KEYWORDS.map((kw) => (
            <button
              key={kw}
              onClick={() => setKeyword(kw)}
              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-colors cursor-pointer text-[11px]"
            >
              {kw}
            </button>
          ))}
        </div>

        {/* Multi-criteria Filter Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
          {/* Category */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              ประเภทงาน
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-2.5 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="all">ทุกประเภทงาน</option>
              {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.labelTh}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              สถานะดำเนินงาน
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-2.5 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="all">ทุกสถานะ</option>
              <option value="pending">รอดำเนินการ</option>
              <option value="in_progress">กำลังดำเนินการ</option>
              <option value="completed">ดำเนินการแล้วเสร็จ</option>
              <option value="cancelled">ยกเลิก/ยุติเรื่อง</option>
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              รับเรื่องตั้งแต่วันที่
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-mono-numbers focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              ถึงวันที่
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-mono-numbers focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Action Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
          <div className="text-slate-600 font-medium">
            พบผลลัพธ์ทั้งหมด <span className="font-bold text-[#0F2038] font-mono-numbers">{results.length}</span> เรื่อง
          </div>

          <div className="flex items-center gap-2">
            {hasFilterActive && (
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-amber-700 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>รีเซ็ตเงื่อนไข</span>
              </button>
            )}

            <button
              onClick={handleExportCSV}
              disabled={results.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ส่งออก CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-3">
        {results.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <FileSearch className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">ไม่พบข้อมูลที่ตรงกับเงื่อนไขการสืบค้น</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              ไม่มีระเบียนข้อมูลใดตรงกับคำค้นหาหรือตัวกรองที่ระบุ ลองใช้คำค้นที่มีความกว้างขึ้น เช่น "สงขลา", "คำร้อง", หรือล้างตัวกรองวันที่
            </p>
            {hasFilterActive && (
              <button
                onClick={handleResetFilters}
                className="mt-3 px-4 py-2 text-xs font-medium text-white bg-[#0F2038] hover:bg-[#1E3A60] rounded-lg transition-colors cursor-pointer"
              >
                ล้างเงื่อนไขการค้นหาทั้งหมด
              </button>
            )}
          </div>
        ) : (
          results.map((item) => {
            const cat = CATEGORY_LABELS[item.category];
            const statusInfo = STATUS_LABELS[item.status];
            const priorityInfo = PRIORITY_LABELS[item.priority];

            return (
              <div
                key={item.id}
                onClick={() => onSelectRecord(item)}
                className="bg-white rounded-xl border border-slate-200 hover:border-amber-400 hover:shadow-sm p-5 transition-all cursor-pointer space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono-numbers text-xs font-bold text-[#0F2038] bg-slate-100 px-2.5 py-0.5 rounded">
                      {item.refId}
                    </span>
                    <span className="text-xs text-slate-500">
                      {cat?.labelTh}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs text-slate-500">
                      {item.department}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span className={`font-semibold ${statusInfo.color}`}>
                      {statusInfo.labelTh}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="font-mono-numbers text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      นัดติดตาม: {item.followUpDate}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {item.details}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
                  <div className="flex items-center gap-3">
                    <span>ต้นเรื่อง: <strong className="text-slate-700 font-medium">{item.originAgency}</strong></span>
                    <span>·</span>
                    <span>ผู้รับผิดชอบ: <strong className="text-slate-700 font-medium">{item.responsiblePerson}</strong></span>
                  </div>

                  <div className="inline-flex items-center gap-1 text-amber-700 font-medium text-xs">
                    <span>ดูรายละเอียดระเบียน</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
