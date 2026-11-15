import React, { useState, useMemo } from 'react';
import { ComplaintRecord, AgencyDirectoryItem } from '../types';
import { CATEGORY_META, STATUS_META, URGENCY_META } from '../data/mockComplaints';
import { formatThaiDate, isComplaintOverdue } from '../services/storageService';
import {
  Search,
  Filter,
  RotateCcw,
  Download,
  Eye,
  Edit,
  Trash2,
  FilePlus2,
  ChevronLeft,
  ChevronRight,
  FolderKanban
} from 'lucide-react';

interface ComplaintRegistryViewProps {
  complaints: ComplaintRecord[];
  agencies: AgencyDirectoryItem[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  initialOverdueOnly?: boolean;
  onClearOverduePreset?: () => void;
  onOpenIntake: () => void;
  onViewDetail: (complaint: ComplaintRecord) => void;
  onEditComplaint: (complaint: ComplaintRecord) => void;
  onDeleteComplaint: (complaint: ComplaintRecord) => void;
}

export const ComplaintRegistryView: React.FC<ComplaintRegistryViewProps> = ({
  complaints,
  agencies,
  searchQuery,
  onSearchChange,
  initialOverdueOnly = false,
  onClearOverduePreset,
  onOpenIntake,
  onViewDetail,
  onEditComplaint,
  onDeleteComplaint
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedAgency, setSelectedAgency] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [overdueOnly, setOverdueOnly] = useState(initialOverdueOnly);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Keep overdueOnly synced if preset triggered from Dashboard
  React.useEffect(() => {
    setOverdueOnly(initialOverdueOnly);
    setCurrentPage(1);
  }, [initialOverdueOnly]);

  const agencyOptions = useMemo(() => {
    const names = new Set<string>(agencies.map((a) => a.name));
    complaints.forEach((c) => {
      if (c.responsibleAgency) names.add(c.responsibleAgency);
    });
    return Array.from(names);
  }, [agencies, complaints]);

  const filteredComplaints = useMemo(() => {
    return complaints
      .filter((c) => {
        if (selectedCategory !== 'all' && c.category !== selectedCategory) return false;
        if (selectedStatus !== 'all' && c.status !== selectedStatus) return false;
        if (selectedAgency !== 'all' && c.responsibleAgency !== selectedAgency) return false;
        if (dateFrom && c.receivedDate < dateFrom) return false;
        if (dateTo && c.receivedDate > dateTo) return false;
        if (overdueOnly && !isComplaintOverdue(c)) return false;

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchCase = c.caseNumber.toLowerCase().includes(q);
          const matchName = c.complainantName.toLowerCase().includes(q);
          const matchSubject = c.subject.toLowerCase().includes(q);
          const matchArea = c.locationArea.toLowerCase().includes(q) || c.district.toLowerCase().includes(q);
          if (!matchCase && !matchName && !matchSubject && !matchArea) return false;
        }
        return true;
      })
      .sort((a, b) => b.receivedDate.localeCompare(a.receivedDate) || b.createdAt.localeCompare(a.createdAt));
  }, [complaints, selectedCategory, selectedStatus, selectedAgency, dateFrom, dateTo, overdueOnly, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredComplaints.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedRows = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredComplaints.slice(start, start + pageSize);
  }, [filteredComplaints, safePage]);

  const handleClearFilters = () => {
    onSearchChange('');
    setSelectedCategory('all');
    setSelectedStatus('all');
    setSelectedAgency('all');
    setDateFrom('');
    setDateTo('');
    setOverdueOnly(false);
    if (onClearOverduePreset) onClearOverduePreset();
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedCategory !== 'all' ||
    selectedStatus !== 'all' ||
    selectedAgency !== 'all' ||
    dateFrom !== '' ||
    dateTo !== '' ||
    overdueOnly;

  // Export CSV / Excel compatible with Thai UTF-8 BOM
  const handleExportCSV = () => {
    const headers = [
      'เลขที่รับเรื่อง',
      'วันที่รับเรื่อง',
      'ชื่อผู้ร้องเรียน',
      'เบอร์โทรศัพท์',
      'อำเภอ',
      'พื้นที่ที่เกี่ยวข้อง',
      'ประเภทเรื่องร้องเรียน',
      'หัวข้อเรื่องร้องเรียน',
      'หน่วยงานที่เกี่ยวข้อง',
      'เจ้าหน้าที่ผู้รับผิดชอบ',
      'ระดับความเร่งด่วน',
      'สถานะการดำเนินงาน',
      'วันกำหนดติดตามผล'
    ];

    const rows = filteredComplaints.map((c) => [
      `"${c.caseNumber}"`,
      `"${c.receivedDate}"`,
      `"${c.complainantName.replace(/"/g, '""')}"`,
      `"${c.phone}"`,
      `"${c.district}"`,
      `"${c.locationArea.replace(/"/g, '""')}"`,
      `"${CATEGORY_META[c.category]?.labelTh || c.category}"`,
      `"${c.subject.replace(/"/g, '""')}"`,
      `"${c.responsibleAgency.replace(/"/g, '""')}"`,
      `"${c.assignedOfficer || '-'}"`,
      `"${URGENCY_META[c.urgency]?.labelTh || c.urgency}"`,
      `"${STATUS_META[c.status]?.labelTh || c.status}"`,
      `"${c.followUpDate || '-'}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Songkhla_Damrongdham_Registry_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-slate-500 mb-1">
            ทะเบียนกลางเรื่องร้องเรียน · ผลลัพธ์ {filteredComplaints.length} จาก {complaints.length} เรื่อง
          </div>
          <h1 className="text-2xl font-bold text-[#102C4C] tracking-tight">
            ทะเบียนข้อมูลเรื่องร้องเรียนร้องทุกข์
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            ค้นหา กรองข้อมูล เปิดดูรายละเอียด แก้ไข ลบ และส่งออกทะเบียนข้อมูลเป็นไฟล์ Excel / CSV
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#102C4C] bg-white border border-[#E5EAF0] hover:bg-slate-50 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>ส่งออก CSV / Excel</span>
          </button>

          <button
            onClick={onOpenIntake}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#102C4C] hover:bg-[#1D4ED8] rounded-lg transition-colors cursor-pointer whitespace-nowrap"
          >
            <FilePlus2 className="w-4 h-4 text-[#C5A45A]" />
            <span>รับเรื่องใหม่</span>
          </button>
        </div>
      </div>

      {/* Search & Multi-Filters */}
      <div className="bg-white rounded-xl border border-[#E5EAF0] p-4 sm:p-5 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="ค้นหาด้วยเลขที่รับเรื่อง (เช่น SD-2569-001), ชื่อผู้ร้องเรียน, หัวข้อ หรือพื้นที่..."
              className="w-full pl-9 pr-12 py-2 text-xs sm:text-sm rounded-lg border border-[#E5EAF0] focus:outline-none focus:border-[#1D4ED8]"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  onSearchChange('');
                  setCurrentPage(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-[#102C4C] cursor-pointer"
              >
                ล้าง
              </button>
            )}
          </div>

          <button
            onClick={() => {
              setOverdueOnly(!overdueOnly);
              setCurrentPage(1);
            }}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer whitespace-nowrap ${
              overdueOnly
                ? 'bg-rose-50 text-rose-700 border-rose-300'
                : 'bg-white text-slate-600 border-[#E5EAF0] hover:bg-slate-50'
            }`}
          >
            เฉพาะเรื่องเกินกำหนดติดตาม
          </button>
        </div>

        {/* Secondary Filter Strip */}
        <div className="flex flex-wrap items-center gap-2.5 pt-3 border-t border-[#E5EAF0] text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 font-medium">
            <Filter className="w-3.5 h-3.5" />
            <span>กรองข้อมูล:</span>
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 rounded-lg border border-[#E5EAF0] bg-white text-[#1B2B3A] cursor-pointer"
          >
            <option value="all">ทุกประเภทเรื่อง</option>
            {Object.entries(CATEGORY_META).map(([k, v]) => (
              <option key={k} value={k}>{v.shortTh}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 rounded-lg border border-[#E5EAF0] bg-white text-[#1B2B3A] cursor-pointer"
          >
            <option value="all">ทุกสถานะ</option>
            {Object.entries(STATUS_META).map(([k, v]) => (
              <option key={k} value={k}>{v.labelTh}</option>
            ))}
          </select>

          <select
            value={selectedAgency}
            onChange={(e) => {
              setSelectedAgency(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 rounded-lg border border-[#E5EAF0] bg-white text-[#1B2B3A] cursor-pointer max-w-[220px] truncate"
          >
            <option value="all">ทุกหน่วยงานรับผิดชอบ</option>
            {agencyOptions.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">ตั้งแต่:</span>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2 py-1 rounded-lg border border-[#E5EAF0] font-mono-numbers text-xs"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">ถึง:</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2 py-1 rounded-lg border border-[#E5EAF0] font-mono-numbers text-xs"
            />
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[#1D4ED8] hover:bg-blue-50 rounded-lg font-semibold cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>ล้างตัวกรอง</span>
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#E5EAF0] overflow-hidden">
        {paginatedRows.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <FolderKanban className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-[#102C4C]">ไม่พบข้อมูลเรื่องร้องเรียนที่ตรงกับเงื่อนไข</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              ลองปรับเปลี่ยนคำค้นหาหรือช่วงวันที่ หรือล้างตัวกรองเพื่อดูข้อมูลทั้งหมด
            </p>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#102C4C] hover:bg-[#1D4ED8] rounded-lg cursor-pointer"
              >
                ล้างตัวกรองทั้งหมด
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#F8FAFC] text-slate-600 border-b border-[#E5EAF0]">
                <tr>
                  <th className="py-3 px-4 font-semibold whitespace-nowrap">เลขที่รับเรื่อง</th>
                  <th className="py-3 px-4 font-semibold whitespace-nowrap">วันที่รับเรื่อง</th>
                  <th className="py-3 px-4 font-semibold">ผู้ร้องเรียน / หัวข้อเรื่อง</th>
                  <th className="py-3 px-4 font-semibold hidden lg:table-cell">ประเภท</th>
                  <th className="py-3 px-4 font-semibold hidden md:table-cell">หน่วยงานรับผิดชอบ</th>
                  <th className="py-3 px-4 font-semibold whitespace-nowrap">สถานะ</th>
                  <th className="py-3 px-4 font-semibold text-right whitespace-nowrap">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5EAF0]">
                {paginatedRows.map((item) => {
                  const statusInfo = STATUS_META[item.status];
                  const catInfo = CATEGORY_META[item.category];
                  const overdue = isComplaintOverdue(item);

                  return (
                    <tr key={item.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="py-3 px-4 font-mono-numbers font-bold text-[#102C4C] whitespace-nowrap">
                        {item.caseNumber}
                      </td>
                      <td className="py-3 px-4 font-mono-numbers text-slate-600 whitespace-nowrap">
                        {formatThaiDate(item.receivedDate)}
                      </td>
                      <td className="py-3 px-4 max-w-xs">
                        <button
                          onClick={() => onViewDetail(item)}
                          className="font-semibold text-[#102C4C] hover:text-[#1D4ED8] text-left truncate block w-full cursor-pointer"
                          title={item.subject}
                        >
                          {item.subject}
                        </button>
                        <div className="text-[11px] text-slate-500 truncate mt-0.5">
                          {item.complainantName} · {item.district}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 hidden lg:table-cell whitespace-nowrap">
                        {catInfo.shortTh}
                      </td>
                      <td className="py-3 px-4 text-slate-600 hidden md:table-cell max-w-[180px] truncate">
                        {item.responsibleAgency}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 font-semibold ${statusInfo.textColor}`}>
                          <span className={`w-2 h-2 rounded-full ${statusInfo.dotColor}`} />
                          <span>{statusInfo.labelTh}</span>
                        </span>
                        {overdue && (
                          <div className="text-[10px] text-rose-700 font-medium mt-0.5">
                            เกินกำหนดติดตาม
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center justify-end gap-1">
                          <button
                            onClick={() => onViewDetail(item)}
                            className="p-1.5 text-slate-500 hover:text-[#102C4C] hover:bg-slate-100 rounded-lg cursor-pointer"
                            title="ดูรายละเอียด"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onEditComplaint(item)}
                            className="p-1.5 text-slate-500 hover:text-[#1D4ED8] hover:bg-blue-50 rounded-lg cursor-pointer"
                            title="แก้ไขข้อมูล"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteComplaint(item)}
                            className="p-1.5 text-slate-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer"
                            title="ลบข้อมูล"
                          >
                            <Trash2 className="w-4 h-4" />
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-[#E5EAF0] text-xs text-slate-600">
          <div>
            หน้า <span className="font-mono-numbers font-semibold text-[#102C4C]">{safePage}</span> จาก{' '}
            <span className="font-mono-numbers font-semibold text-[#102C4C]">{totalPages}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="p-1.5 rounded-lg border border-[#E5EAF0] hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`w-7 h-7 rounded-lg font-mono-numbers font-semibold cursor-pointer ${
                  safePage === p ? 'bg-[#102C4C] text-white' : 'hover:bg-slate-100 text-[#1B2B3A]'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="p-1.5 rounded-lg border border-[#E5EAF0] hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
