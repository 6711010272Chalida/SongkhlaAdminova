import React, { useState, useMemo } from 'react';
import { WorkRecord, WorkStatus, WorkCategory, PriorityLevel } from '../types';
import { CATEGORY_LABELS, STATUS_LABELS, PRIORITY_LABELS } from '../data/initialRecords';
import { 
  Search, 
  Filter, 
  PlusCircle, 
  Eye, 
  Edit, 
  Trash2, 
  Clock, 
  Calendar, 
  ArrowUpDown, 
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ChevronDown
} from 'lucide-react';

interface TrackerViewProps {
  records: WorkRecord[];
  onOpenNewTaskModal: () => void;
  onSelectRecord: (record: WorkRecord) => void;
  onEditRecord: (record: WorkRecord) => void;
  onDeleteRecord: (record: WorkRecord) => void;
  onQuickStatusChange: (recordId: string, newStatus: WorkStatus) => void;
}

type SortField = 'refId' | 'receivedDate' | 'followUpDate' | 'priority' | 'status';

export const TrackerView: React.FC<TrackerViewProps> = ({
  records,
  onOpenNewTaskModal,
  onSelectRecord,
  onEditRecord,
  onDeleteRecord,
  onQuickStatusChange
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedOfficer, setSelectedOfficer] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('followUpDate');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  // Extract unique officers for filter dropdown
  const officers = useMemo(() => {
    const set = new Set<string>();
    records.forEach(r => {
      if (r.responsiblePerson) set.add(r.responsiblePerson);
    });
    return Array.from(set).sort();
  }, [records]);

  // Filter and sort records
  const filteredRecords = useMemo(() => {
    return records
      .filter((rec) => {
        // Status filter
        if (selectedStatus !== 'all' && rec.status !== selectedStatus) return false;
        // Category filter
        if (selectedCategory !== 'all' && rec.category !== selectedCategory) return false;
        // Priority filter
        if (selectedPriority !== 'all' && rec.priority !== selectedPriority) return false;
        // Officer filter
        if (selectedOfficer !== 'all' && rec.responsiblePerson !== selectedOfficer) return false;
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchRef = rec.refId.toLowerCase().includes(q);
          const matchTitle = rec.title.toLowerCase().includes(q);
          const matchAgency = rec.originAgency.toLowerCase().includes(q);
          const matchDetails = rec.details.toLowerCase().includes(q);
          const matchOfficer = rec.responsiblePerson.toLowerCase().includes(q);
          if (!matchRef && !matchTitle && !matchAgency && !matchDetails && !matchOfficer) return false;
        }
        return true;
      })
      .sort((a, b) => {
        let cmp = 0;
        if (sortField === 'refId') {
          cmp = a.refId.localeCompare(b.refId);
        } else if (sortField === 'receivedDate') {
          cmp = new Date(a.receivedDate).getTime() - new Date(b.receivedDate).getTime();
        } else if (sortField === 'followUpDate') {
          cmp = new Date(a.followUpDate).getTime() - new Date(b.followUpDate).getTime();
        } else if (sortField === 'status') {
          cmp = a.status.localeCompare(b.status);
        } else if (sortField === 'priority') {
          const weights = { very_urgent: 3, urgent: 2, normal: 1 };
          cmp = (weights[b.priority] || 0) - (weights[a.priority] || 0);
        }
        return sortAsc ? cmp : -cmp;
      });
  }, [records, searchQuery, selectedStatus, selectedCategory, selectedPriority, selectedOfficer, sortField, sortAsc]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedStatus('all');
    setSelectedCategory('all');
    setSelectedPriority('all');
    setSelectedOfficer('all');
  };

  const hasActiveFilters = searchQuery !== '' || selectedStatus !== 'all' || selectedCategory !== 'all' || selectedPriority !== 'all' || selectedOfficer !== 'all';

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>การติดตามงาน</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-numbers">ผลลัพธ์ {filteredRecords.length} จาก {records.length} เรื่อง</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0F2038]">
            ระบบทะเบียนและติดตามความคืบหน้างาน
          </h1>
        </div>

        <button
          onClick={onOpenNewTaskModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-medium text-white bg-[#0F2038] hover:bg-[#1E3A60] rounded-lg shadow-sm transition-all cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 text-amber-300" />
          <span>บันทึกเรื่องใหม่</span>
        </button>
      </div>

      {/* Filter and Search Panel */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
        {/* Search Input Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ค้นหาด้วยรหัสเรื่อง (เช่น SK-69-0101), เรื่อง, ผู้รับผิดชอบ, หน่วยงาน..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ล้าง
              </button>
            )}
          </div>

          {/* Quick Segmented Status Control */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto text-xs shrink-0">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer ${
                selectedStatus === 'all'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ทั้งหมด ({records.length})
            </button>
            <button
              onClick={() => setSelectedStatus('pending')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer ${
                selectedStatus === 'pending'
                  ? 'bg-white text-amber-700 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              รอดำเนินการ ({records.filter(r => r.status === 'pending').length})
            </button>
            <button
              onClick={() => setSelectedStatus('in_progress')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer ${
                selectedStatus === 'in_progress'
                  ? 'bg-white text-sky-700 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              กำลังทำ ({records.filter(r => r.status === 'in_progress').length})
            </button>
            <button
              onClick={() => setSelectedStatus('completed')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer ${
                selectedStatus === 'completed'
                  ? 'bg-white text-emerald-700 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              เสร็จสิ้น ({records.filter(r => r.status === 'completed').length})
            </button>
          </div>
        </div>

        {/* Secondary Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 font-medium">
            <Filter className="w-3.5 h-3.5" />
            <span>กรองตาม:</span>
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1.5 rounded-md border border-slate-200 bg-white text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
          >
            <option value="all">ทุกประเภทงาน</option>
            {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v.labelTh}
              </option>
            ))}
          </select>

          {/* Priority Dropdown */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-2.5 py-1.5 rounded-md border border-slate-200 bg-white text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
          >
            <option value="all">ทุกระดับความสำคัญ</option>
            <option value="normal">ความสำคัญ: ปกติ</option>
            <option value="urgent">ความสำคัญ: ด่วน</option>
            <option value="very_urgent">ความสำคัญ: ด่วนที่สุด</option>
          </select>

          {/* Officer Dropdown */}
          <select
            value={selectedOfficer}
            onChange={(e) => setSelectedOfficer(e.target.value)}
            className="px-2.5 py-1.5 rounded-md border border-slate-200 bg-white text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
          >
            <option value="all">เจ้าหน้าที่ทั้งหมด</option>
            {officers.map((officer) => (
              <option key={officer} value={officer}>
                {officer}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-amber-700 hover:text-amber-800 hover:bg-amber-50 rounded-md transition-colors font-medium cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>ล้างตัวกรอง</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Records Table (Desktop / iPad) */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        {filteredRecords.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">ไม่พบข้อมูลที่ตรงกับเงื่อนไขการค้นหา</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              ลองปรับคำค้นหา หรือล้างตัวกรองสถานะ/ประเภทงานเพื่อดูข้อมูลทั้งหมด
            </p>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="mt-2 px-4 py-1.5 text-xs font-medium text-[#0F2038] bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                ล้างตัวกรองทั้งหมด
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th 
                    onClick={() => toggleSort('refId')}
                    className="py-3 px-4 font-semibold cursor-pointer hover:text-slate-900 select-none whitespace-nowrap"
                  >
                    <div className="flex items-center gap-1">
                      <span>รหัสเอกสาร</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-3 px-4 font-semibold">เรื่อง / รายละเอียด</th>
                  <th className="py-3 px-4 font-semibold hidden md:table-cell">ประเภทงาน</th>
                  <th 
                    onClick={() => toggleSort('receivedDate')}
                    className="py-3 px-4 font-semibold hidden lg:table-cell cursor-pointer hover:text-slate-900 select-none whitespace-nowrap"
                  >
                    <div className="flex items-center gap-1">
                      <span>วันที่รับ</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th 
                    onClick={() => toggleSort('followUpDate')}
                    className="py-3 px-4 font-semibold cursor-pointer hover:text-slate-900 select-none whitespace-nowrap"
                  >
                    <div className="flex items-center gap-1">
                      <span>นัดติดตาม</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-3 px-4 font-semibold hidden sm:table-cell">ผู้รับผิดชอบ</th>
                  <th 
                    onClick={() => toggleSort('status')}
                    className="py-3 px-4 font-semibold cursor-pointer hover:text-slate-900 select-none whitespace-nowrap"
                  >
                    <div className="flex items-center gap-1">
                      <span>สถานะ</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-3 px-4 font-semibold text-right">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map((record) => {
                  const cat = CATEGORY_LABELS[record.category];
                  const statusInfo = STATUS_LABELS[record.status];
                  const priorityInfo = PRIORITY_LABELS[record.priority];

                  return (
                    <tr 
                      key={record.id}
                      className="hover:bg-slate-50/90 transition-colors group"
                    >
                      {/* Ref ID */}
                      <td className="py-3 px-4 font-mono-numbers font-medium text-[#0F2038] whitespace-nowrap">
                        <button
                          onClick={() => onSelectRecord(record)}
                          className="hover:underline text-left cursor-pointer font-semibold"
                        >
                          {record.refId}
                        </button>
                      </td>

                      {/* Title & Agency */}
                      <td className="py-3 px-4 max-w-xs sm:max-w-sm">
                        <div className="flex items-center gap-1.5">
                          {record.priority !== 'normal' && (
                            <span 
                              className={`w-1.5 h-1.5 rounded-full shrink-0 ${priorityInfo.dotColor}`} 
                              title={`ความสำคัญ: ${priorityInfo.labelTh}`}
                            />
                          )}
                          <button
                            onClick={() => onSelectRecord(record)}
                            className="font-medium text-slate-900 hover:text-amber-800 text-left truncate transition-colors cursor-pointer"
                            title={record.title}
                          >
                            {record.title}
                          </button>
                        </div>
                        <div className="text-[11px] text-slate-500 truncate mt-0.5 flex items-center gap-1">
                          <span>{record.originAgency}</span>
                          <span aria-hidden="true">·</span>
                          <span className="hidden sm:inline">{record.department}</span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 text-slate-600 hidden md:table-cell whitespace-nowrap">
                        {cat?.labelTh}
                      </td>

                      {/* Received Date */}
                      <td className="py-3 px-4 font-mono-numbers text-slate-600 hidden lg:table-cell whitespace-nowrap">
                        {record.receivedDate}
                      </td>

                      {/* Follow-up Date */}
                      <td className="py-3 px-4 font-mono-numbers whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 ${record.status === 'completed' ? 'text-slate-400' : 'text-slate-700 font-medium'}`}>
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {record.followUpDate}
                        </span>
                      </td>

                      {/* Officer */}
                      <td className="py-3 px-4 text-slate-700 hidden sm:table-cell whitespace-nowrap">
                        <span className="truncate max-w-[130px] block" title={record.responsiblePerson}>
                          {record.responsiblePerson}
                        </span>
                      </td>

                      {/* Status Dropdown/Selector */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <select
                          value={record.status}
                          onChange={(e) => onQuickStatusChange(record.id, e.target.value as WorkStatus)}
                          className={`text-xs font-semibold py-1 px-2 rounded border focus:outline-none cursor-pointer ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border}`}
                        >
                          <option value="pending">รอดำเนินการ</option>
                          <option value="in_progress">กำลังดำเนินการ</option>
                          <option value="completed">เสร็จสิ้น</option>
                          <option value="cancelled">ยกเลิก</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onSelectRecord(record)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                            title="ดูรายละเอียด"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onEditRecord(record)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                            title="แก้ไขข้อมูล"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteRecord(record)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                            title="ลบระเบียนข้อมูลจำลองนี้"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer Info Strip */}
      <div className="p-3 bg-slate-100 rounded-lg text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>หมายเหตุ: การแก้ไขและลบข้อมูลจะมีผลเฉพาะในเบราว์เซอร์ของท่าน (LocalStorage)</span>
        <span className="font-mono-numbers">ระบบบันทึกเวลามาตรฐาน UTC+7</span>
      </div>
    </div>
  );
};
