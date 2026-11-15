import React, { useState, useMemo, useEffect } from 'react';
import { ComplaintRecord, ComplaintStatus, OfficerProfile } from '../types';
import { CATEGORY_META, STATUS_META, URGENCY_META } from '../data/mockComplaints';
import { formatThaiDate, isComplaintOverdue } from '../services/storageService';
import {
  Activity,
  Search,
  Clock,
  Check,
  AlertTriangle,
  Building2,
  User,
  Eye
} from 'lucide-react';

interface StatusTrackingViewProps {
  complaints: ComplaintRecord[];
  officers: OfficerProfile[];
  selectedComplaintId?: string;
  onSelectComplaintId: (id: string) => void;
  onAddTimelineUpdate: (
    complaintId: string,
    newStatus: ComplaintStatus,
    officerName: string,
    updateDate: string,
    note: string
  ) => void;
  onViewDetail: (complaint: ComplaintRecord) => void;
}

const ORDERED_STATUSES: ComplaintStatus[] = [
  'new',
  'investigating',
  'coordinating',
  'in_progress',
  'waiting_info',
  'completed',
  'closed'
];

export const StatusTrackingView: React.FC<StatusTrackingViewProps> = ({
  complaints,
  officers,
  selectedComplaintId,
  onSelectComplaintId,
  onAddTimelineUpdate,
  onViewDetail
}) => {
  const [listFilter, setListFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const activeComplaint = useMemo(() => {
    return complaints.find((c) => c.id === selectedComplaintId) || complaints[0] || null;
  }, [complaints, selectedComplaintId]);

  const [newStatus, setNewStatus] = useState<ComplaintStatus>(activeComplaint?.status || 'investigating');
  const [officerName, setOfficerName] = useState<string>(
    activeComplaint?.assignedOfficer || officers[0]?.name || ''
  );
  const [updateDate, setUpdateDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [progressNote, setProgressNote] = useState('');
  const [noteError, setNoteError] = useState('');

  useEffect(() => {
    if (activeComplaint) {
      setNewStatus(activeComplaint.status);
      setOfficerName(activeComplaint.assignedOfficer || officers[0]?.name || '');
      setNoteError('');
    }
  }, [activeComplaint, officers]);

  const filteredList = useMemo(() => {
    return complaints
      .filter((c) => {
        if (statusFilter !== 'all' && c.status !== statusFilter) return false;
        if (listFilter.trim()) {
          const q = listFilter.toLowerCase().trim();
          return (
            c.caseNumber.toLowerCase().includes(q) ||
            c.subject.toLowerCase().includes(q) ||
            c.complainantName.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [complaints, listFilter, statusFilter]);

  const handleSubmitUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeComplaint) return;
    if (!progressNote.trim()) {
      setNoteError('กรุณาระบุรายละเอียดความคืบหน้าในการดำเนินงาน');
      return;
    }
    onAddTimelineUpdate(
      activeComplaint.id,
      newStatus,
      officerName.trim() || officers[0]?.name || 'เจ้าหน้าที่ศูนย์ดำรงธรรม',
      updateDate,
      progressNote.trim()
    );
    setProgressNote('');
    setNoteError('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="text-xs text-slate-500 mb-1">
          การติดตามผลความคืบหน้า · 7 ขั้นตอนสถานะมาตรฐานศูนย์ดำรงธรรม
        </div>
        <h1 className="text-2xl font-bold text-[#102C4C] tracking-tight">
          ติดตามสถานะเรื่องร้องเรียน
        </h1>
        <p className="text-sm text-slate-600 mt-0.5">
          ปรับปรุงสถานะการดำเนินงานและบันทึก Timeline ประวัติย้อนหลังของเรื่องร้องเรียนแต่ละรายการ
        </p>
      </div>

      {/* Main Split Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Case Selector List */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-[#E5EAF0] overflow-hidden">
          <div className="p-3.5 border-b border-[#E5EAF0] space-y-2.5 bg-[#F8FAFC]">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={listFilter}
                onChange={(e) => setListFilter(e.target.value)}
                placeholder="ค้นหาเลขที่เรื่อง หรือหัวข้อ..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#E5EAF0] bg-white focus:outline-none focus:border-[#1D4ED8]"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#E5EAF0] bg-white cursor-pointer"
            >
              <option value="all">แสดงทุกสถานะ ({complaints.length})</option>
              {ORDERED_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_META[s].labelTh} ({complaints.filter((c) => c.status === s).length})
                </option>
              ))}
            </select>
          </div>

          <div className="divide-y divide-[#E5EAF0] max-h-[600px] overflow-y-auto">
            {filteredList.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">ไม่พบเรื่องร้องเรียน</div>
            ) : (
              filteredList.map((item) => {
                const isSelected = activeComplaint?.id === item.id;
                const statusInfo = STATUS_META[item.status];
                const overdue = isComplaintOverdue(item);

                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectComplaintId(item.id)}
                    className={`w-full text-left p-3.5 transition-colors cursor-pointer ${
                      isSelected ? 'bg-[#F3F6FA] border-l-4 border-[#102C4C]' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-mono-numbers font-bold text-[#102C4C]">{item.caseNumber}</span>
                      <span className={`font-semibold inline-flex items-center gap-1 ${statusInfo.textColor}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotColor}`} />
                        {statusInfo.labelTh}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-[#1B2B3A] line-clamp-2">{item.subject}</div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5">
                      <span className="truncate">{item.district}</span>
                      {overdue && <span className="text-rose-700 font-semibold shrink-0">เกินกำหนด</span>}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Active Case Status Stepper + Update Form + Timeline */}
        <div className="lg:col-span-8 space-y-6">
          {!activeComplaint ? (
            <div className="bg-white rounded-xl border border-[#E5EAF0] p-12 text-center text-xs text-slate-500">
              กรุณาเลือกเรื่องร้องเรียนจากรายการด้านซ้ายเพื่อติดตามสถานะ
            </div>
          ) : (
            <>
              {/* Case Summary & Status Pipeline */}
              <div className="bg-white rounded-xl border border-[#E5EAF0] p-6 space-y-5">
                <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-[#E5EAF0]">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="font-mono-numbers font-bold text-[#102C4C]">
                        {activeComplaint.caseNumber}
                      </span>
                      <span>·</span>
                      <span>{CATEGORY_META[activeComplaint.category].shortTh}</span>
                      <span>·</span>
                      <span className={URGENCY_META[activeComplaint.urgency].textColor + ' font-semibold'}>
                        {URGENCY_META[activeComplaint.urgency].labelTh}
                      </span>
                      {isComplaintOverdue(activeComplaint) && (
                        <>
                          <span>·</span>
                          <span className="inline-flex items-center gap-1 text-rose-700 font-semibold">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            เกินกำหนดติดตาม
                          </span>
                        </>
                      )}
                    </div>
                    <h2 className="text-lg font-bold text-[#102C4C]">{activeComplaint.subject}</h2>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                      <span className="inline-flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {activeComplaint.complainantName}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {activeComplaint.responsibleAgency}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onViewDetail(activeComplaint)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#102C4C] border border-[#E5EAF0] hover:bg-slate-50 rounded-lg cursor-pointer shrink-0"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>ดูรายละเอียดเต็ม</span>
                  </button>
                </div>

                {/* 7-Status Selector Strip */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-500">สถานะปัจจุบันของเรื่องร้องเรียน (7 สถานะ)</div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                    {ORDERED_STATUSES.map((st) => {
                      const meta = STATUS_META[st];
                      const isCurrent = activeComplaint.status === st;
                      return (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setNewStatus(st)}
                          className={`p-2 rounded-lg border text-center text-[11px] transition-colors cursor-pointer ${
                            isCurrent
                              ? `${meta.surfaceBg} ${meta.borderColor} ${meta.textColor} font-bold`
                              : newStatus === st
                              ? 'border-[#1D4ED8] bg-blue-50/40 text-[#102C4C] font-semibold'
                              : 'border-[#E5EAF0] bg-white text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <span className={`inline-block w-2 h-2 rounded-full mb-1 ${meta.dotColor}`} />
                          <div className="leading-tight">{meta.labelTh}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Update Progress Form */}
              <form onSubmit={handleSubmitUpdate} className="bg-white rounded-xl border border-[#E5EAF0] p-6 space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-[#102C4C]">
                  <Activity className="w-4 h-4 text-[#1D4ED8]" />
                  <span>บันทึกความคืบหน้าและปรับปรุงสถานะลงใน Timeline</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#102C4C] mb-1">สถานะที่ปรับปรุง *</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as ComplaintStatus)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5EAF0] bg-white focus:outline-none focus:border-[#1D4ED8] cursor-pointer"
                    >
                      {ORDERED_STATUSES.map((st) => (
                        <option key={st} value={st}>{STATUS_META[st].labelTh}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#102C4C] mb-1">เจ้าหน้าที่ผู้บันทึก *</label>
                    <select
                      value={officerName}
                      onChange={(e) => setOfficerName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5EAF0] bg-white focus:outline-none focus:border-[#1D4ED8] cursor-pointer"
                    >
                      {officers.map((off) => (
                        <option key={off.id} value={off.name}>{off.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#102C4C] mb-1">วันที่ดำเนินการ *</label>
                    <input
                      type="date"
                      value={updateDate}
                      onChange={(e) => setUpdateDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5EAF0] font-mono-numbers focus:outline-none focus:border-[#1D4ED8]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#102C4C] mb-1">
                    รายละเอียดความคืบหน้า / ผลการติดตาม *
                  </label>
                  <textarea
                    rows={3}
                    value={progressNote}
                    onChange={(e) => setProgressNote(e.target.value)}
                    placeholder="ระบุการดำเนินการ เช่น ส่งหนังสือประสานงานหน่วยงาน ลงพื้นที่ตรวจสอบข้อเท็จจริง หรือแจ้งผลให้ผู้ร้องเรียนทราบ..."
                    className={`w-full px-3 py-2 text-xs sm:text-sm rounded-lg border focus:outline-none focus:border-[#1D4ED8] ${
                      noteError ? 'border-rose-500' : 'border-[#E5EAF0]'
                    }`}
                  />
                  {noteError && <p className="text-xs text-rose-600 mt-1">{noteError}</p>}
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#102C4C] hover:bg-[#1D4ED8] rounded-lg transition-colors cursor-pointer"
                  >
                    <Check className="w-4 h-4 text-[#C5A45A]" />
                    <span>บันทึกความคืบหน้าลง Timeline</span>
                  </button>
                </div>
              </form>

              {/* Chronological Timeline Display */}
              <div className="bg-white rounded-xl border border-[#E5EAF0] p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#102C4C] flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#C5A45A]" />
                    <span>Timeline ประวัติการดำเนินงาน ({activeComplaint.timeline.length} รายการ)</span>
                  </h3>
                  <span className="text-xs text-slate-500 font-mono-numbers">
                    อัปเดตล่าสุด: {formatThaiDate(activeComplaint.updatedAt.split('T')[0])}
                  </span>
                </div>

                <div className="space-y-4 pl-3 border-l border-[#E5EAF0]">
                  {[...activeComplaint.timeline].reverse().map((entry) => {
                    const meta = STATUS_META[entry.status];
                    return (
                      <div key={entry.id} className="relative pl-5">
                        <span
                          className={`absolute -left-[22px] top-1.5 w-3 h-3 rounded-full border-2 border-white ${meta.dotColor}`}
                        />
                        <div className="p-3.5 rounded-lg bg-[#F8FAFC] border border-[#E5EAF0] space-y-1.5">
                          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                            <span className={`font-bold ${meta.textColor}`}>{meta.labelTh}</span>
                            <span className="font-mono-numbers text-slate-500">{entry.timestamp}</span>
                          </div>
                          <p className="text-xs sm:text-sm text-[#1B2B3A] leading-relaxed">{entry.note}</p>
                          <div className="text-[11px] text-slate-500">
                            ผู้บันทึก: <span className="font-medium text-[#102C4C]">{entry.officerName}</span>
                            {entry.department ? ` · ${entry.department}` : ''}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
