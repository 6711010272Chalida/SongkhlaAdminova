import React, { useState, useMemo, useEffect } from 'react';
import {
  AgencyDirectoryItem,
  ComplaintRecord,
  ComplaintStatus,
  OfficerProfile
} from '../types';
import { CATEGORY_META, STATUS_META, URGENCY_META } from '../data/mockComplaints';
import { formatThaiDate, isComplaintOverdue } from '../services/storageService';
import {
  UserCheck,
  Search,
  AlertTriangle,
  Clock,
  Check,
  Building2,
  Calendar,
  Eye,
  Inbox
} from 'lucide-react';

interface AssignmentViewProps {
  complaints: ComplaintRecord[];
  officers: OfficerProfile[];
  agencies: AgencyDirectoryItem[];
  selectedComplaintId?: string;
  onSelectComplaintId: (id: string) => void;
  onSaveAssignment: (
    complaintId: string,
    payload: {
      assignedOfficer: string;
      responsibleAgency: string;
      assignedDate: string;
      followUpDate?: string;
      coordinationResult?: string;
      coordinationNotes?: string;
      nextStatus?: ComplaintStatus;
    }
  ) => void;
  onViewDetail: (complaint: ComplaintRecord) => void;
}

export const AssignmentView: React.FC<AssignmentViewProps> = ({
  complaints,
  officers,
  agencies,
  selectedComplaintId,
  onSelectComplaintId,
  onSaveAssignment,
  onViewDetail
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const [queueFilter, setQueueFilter] = useState<'pending' | 'all'>('pending');
  const [searchTerm, setSearchTerm] = useState('');

  const pendingQueue = useMemo(() => {
    return complaints.filter(
      (c) => c.status === 'new' || !c.assignedOfficer || isComplaintOverdue(c)
    );
  }, [complaints]);

  const displayedList = useMemo(() => {
    const base = queueFilter === 'pending' ? pendingQueue : complaints;
    return base
      .filter((c) => {
        if (!searchTerm.trim()) return true;
        const q = searchTerm.toLowerCase().trim();
        return (
          c.caseNumber.toLowerCase().includes(q) ||
          c.subject.toLowerCase().includes(q) ||
          c.responsibleAgency.toLowerCase().includes(q) ||
          c.district.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        const aScore = a.status === 'new' ? 0 : isComplaintOverdue(a) ? 1 : 2;
        const bScore = b.status === 'new' ? 0 : isComplaintOverdue(b) ? 1 : 2;
        if (aScore !== bScore) return aScore - bScore;
        return b.receivedDate.localeCompare(a.receivedDate);
      });
  }, [queueFilter, pendingQueue, complaints, searchTerm]);

  const activeComplaint = useMemo(() => {
    return (
      complaints.find((c) => c.id === selectedComplaintId) ||
      displayedList[0] ||
      complaints[0] ||
      null
    );
  }, [complaints, selectedComplaintId, displayedList]);

  const [assignedOfficer, setAssignedOfficer] = useState('');
  const [customOfficer, setCustomOfficer] = useState('');
  const [responsibleAgency, setResponsibleAgency] = useState('');
  const [customAgency, setCustomAgency] = useState('');
  const [assignedDate, setAssignedDate] = useState(todayStr);
  const [followUpDate, setFollowUpDate] = useState('');
  const [coordinationResult, setCoordinationResult] = useState('');
  const [coordinationNotes, setCoordinationNotes] = useState('');
  const [autoTransitionStatus, setAutoTransitionStatus] = useState(true);
  const [targetStatus, setTargetStatus] = useState<ComplaintStatus>('coordinating');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (!activeComplaint) return;

    const matchedOfficer = officers.some((o) => o.name === activeComplaint.assignedOfficer);
    if (activeComplaint.assignedOfficer) {
      if (matchedOfficer) {
        setAssignedOfficer(activeComplaint.assignedOfficer);
        setCustomOfficer('');
      } else {
        setAssignedOfficer('__custom__');
        setCustomOfficer(activeComplaint.assignedOfficer);
      }
    } else {
      setAssignedOfficer(officers[0]?.name || '__custom__');
      setCustomOfficer('');
    }

    const matchedAgency = agencies.some((a) => a.name === activeComplaint.responsibleAgency);
    if (matchedAgency) {
      setResponsibleAgency(activeComplaint.responsibleAgency);
      setCustomAgency('');
    } else if (activeComplaint.responsibleAgency) {
      setResponsibleAgency('__custom__');
      setCustomAgency(activeComplaint.responsibleAgency);
    } else {
      setResponsibleAgency(agencies[0]?.name || '__custom__');
      setCustomAgency('');
    }

    setAssignedDate(activeComplaint.assignedDate || todayStr);

    if (activeComplaint.followUpDate) {
      setFollowUpDate(activeComplaint.followUpDate);
    } else {
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 14);
      setFollowUpDate(nextWeek.toISOString().split('T')[0]);
    }

    setCoordinationResult(activeComplaint.coordinationResult || '');
    setCoordinationNotes(activeComplaint.coordinationNotes || '');

    if (activeComplaint.status === 'new') {
      setAutoTransitionStatus(true);
      setTargetStatus('coordinating');
    } else {
      setAutoTransitionStatus(false);
      setTargetStatus(activeComplaint.status);
    }
    setFormError('');
  }, [activeComplaint, officers, agencies, todayStr]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeComplaint) return;

    const finalOfficer =
      assignedOfficer === '__custom__' ? customOfficer.trim() : assignedOfficer;
    const finalAgency =
      responsibleAgency === '__custom__' ? customAgency.trim() : responsibleAgency;

    if (!finalOfficer) {
      setFormError('กรุณาระบุชื่อเจ้าหน้าที่ผู้รับผิดชอบ');
      return;
    }
    if (!finalAgency) {
      setFormError('กรุณาระบุหน่วยงานที่เกี่ยวข้องในการประสานงาน');
      return;
    }
    if (!assignedDate) {
      setFormError('กรุณาระบุวันที่มอบหมายงาน');
      return;
    }

    setFormError('');
    onSaveAssignment(activeComplaint.id, {
      assignedOfficer: finalOfficer,
      responsibleAgency: finalAgency,
      assignedDate,
      followUpDate: followUpDate || undefined,
      coordinationResult: coordinationResult.trim() || undefined,
      coordinationNotes: coordinationNotes.trim() || undefined,
      nextStatus: autoTransitionStatus ? targetStatus : undefined
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-slate-500 mb-1">
            ระบบบริหารจัดการงานและการประสานหน่วยงาน · ศูนย์ดำรงธรรมจังหวัดสงขลา
          </div>
          <h1 className="text-2xl font-bold text-[#102C4C] tracking-tight">
            มอบหมายและประสานงาน
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            มอบหมายเจ้าหน้าที่ผู้รับผิดชอบ ประสานงานหน่วยงานที่เกี่ยวข้อง กำหนดวันติดตามผล และบันทึกผลการประสานงาน
          </p>
        </div>

        {/* Pending Count Summary Strip */}
        <div className="flex items-center gap-3 bg-white border border-[#E5EAF0] rounded-xl px-4 py-2.5 shrink-0">
          <div className="text-right">
            <div className="text-[11px] text-slate-500">งานรอมอบหมาย / เกินกำหนด</div>
            <div className="text-base font-bold font-mono-numbers text-[#102C4C]">
              {pendingQueue.length} <span className="text-xs font-normal text-slate-500">เรื่อง</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-[#F3F6FA] text-[#102C4C] flex items-center justify-center">
            <Inbox className="w-4 h-4 text-[#C5A45A]" />
          </div>
        </div>
      </div>

      {/* Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Queue & Case List */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-[#E5EAF0] overflow-hidden">
          <div className="p-3.5 border-b border-[#E5EAF0] bg-[#F8FAFC] space-y-2.5">
            <div className="grid grid-cols-2 gap-1.5 bg-slate-200/60 p-1 rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => setQueueFilter('pending')}
                className={`py-1.5 px-2.5 rounded-md transition-colors cursor-pointer ${
                  queueFilter === 'pending'
                    ? 'bg-white text-[#102C4C] shadow-xs'
                    : 'text-slate-600 hover:text-[#102C4C]'
                }`}
              >
                รอมอบหมาย/เร่งติดตาม ({pendingQueue.length})
              </button>
              <button
                type="button"
                onClick={() => setQueueFilter('all')}
                className={`py-1.5 px-2.5 rounded-md transition-colors cursor-pointer ${
                  queueFilter === 'all'
                    ? 'bg-white text-[#102C4C] shadow-xs'
                    : 'text-slate-600 hover:text-[#102C4C]'
                }`}
              >
                ทั้งหมด ({complaints.length})
              </button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ค้นหาเลขที่เรื่อง หัวข้อ หรือหน่วยงาน..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#E5EAF0] bg-white focus:outline-none focus:border-[#1D4ED8]"
              />
            </div>
          </div>

          <div className="divide-y divide-[#E5EAF0] max-h-[580px] overflow-y-auto">
            {displayedList.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <div className="text-xs font-semibold text-[#102C4C]">
                  {queueFilter === 'pending'
                    ? 'ไม่มีรายการค้างมอบหมายหรือเกินกำหนด'
                    : 'ไม่พบรายการเรื่องร้องเรียน'}
                </div>
                {queueFilter === 'pending' && (
                  <button
                    type="button"
                    onClick={() => setQueueFilter('all')}
                    className="text-xs text-[#1D4ED8] font-semibold hover:underline cursor-pointer"
                  >
                    แสดงเรื่องร้องเรียนทั้งหมด
                  </button>
                )}
              </div>
            ) : (
              displayedList.map((item) => {
                const isSelected = activeComplaint?.id === item.id;
                const statusInfo = STATUS_META[item.status];
                const overdue = isComplaintOverdue(item);
                const unassigned = !item.assignedOfficer || item.status === 'new';

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelectComplaintId(item.id)}
                    className={`w-full text-left p-3.5 transition-colors cursor-pointer ${
                      isSelected ? 'bg-[#F3F6FA] border-l-4 border-[#102C4C]' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-xs mb-1">
                      <span className="font-mono-numbers font-bold text-[#102C4C]">
                        {item.caseNumber}
                      </span>
                      <span className={`font-semibold inline-flex items-center gap-1 ${statusInfo.textColor}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotColor}`} />
                        {statusInfo.labelTh}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-[#1B2B3A] line-clamp-2">
                      {item.subject}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] text-slate-500 mt-1.5">
                      <span className="truncate max-w-[180px]">{item.responsibleAgency}</span>
                      {overdue ? (
                        <span className="text-rose-700 font-semibold inline-flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> เกินกำหนด
                        </span>
                      ) : unassigned ? (
                        <span className="text-blue-700 font-semibold">รอมอบหมาย</span>
                      ) : (
                        <span className="text-slate-500 truncate">{item.assignedOfficer}</span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Assignment & Coordination Form */}
        <div className="lg:col-span-7">
          {!activeComplaint ? (
            <div className="bg-white rounded-xl border border-[#E5EAF0] p-12 text-center text-xs text-slate-500">
              เลือกเรื่องร้องเรียนจากรายการด้านซ้ายเพื่อมอบหมายและประสานงาน
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-xl border border-[#E5EAF0] overflow-hidden"
            >
              {/* Selected Case Context Header */}
              <div className="p-6 bg-[#F8FAFC] border-b border-[#E5EAF0] space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-mono-numbers font-bold px-2.5 py-0.5 rounded bg-[#102C4C] text-[#C5A45A]">
                      {activeComplaint.caseNumber}
                    </span>
                    <span className="text-slate-500 font-mono-numbers">
                      รับเรื่อง {formatThaiDate(activeComplaint.receivedDate)}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className={`font-semibold ${URGENCY_META[activeComplaint.urgency].textColor}`}>
                      {URGENCY_META[activeComplaint.urgency].labelTh}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onViewDetail(activeComplaint)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#102C4C] bg-white border border-[#E5EAF0] hover:bg-slate-50 rounded-lg cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>ดูรายละเอียดเต็ม</span>
                  </button>
                </div>

                <h2 className="text-base sm:text-lg font-bold text-[#102C4C]">
                  {activeComplaint.subject}
                </h2>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                  <span>{CATEGORY_META[activeComplaint.category].shortTh}</span>
                  <span>·</span>
                  <span>{activeComplaint.district}</span>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    {activeComplaint.responsibleAgency}
                  </span>
                </div>
              </div>

              {/* Assignment Fields */}
              <div className="p-6 space-y-5">
                {formError && (
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
                    {formError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#102C4C] mb-1.5">
                      ระบุเจ้าหน้าที่ผู้รับผิดชอบ *
                    </label>
                    <select
                      value={assignedOfficer}
                      onChange={(e) => setAssignedOfficer(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-[#E5EAF0] bg-white focus:outline-none focus:border-[#1D4ED8] cursor-pointer"
                    >
                      {officers.map((off) => (
                        <option key={off.id} value={off.name}>
                          {off.name} ({off.position})
                        </option>
                      ))}
                      <option value="__custom__">+ ระบุเจ้าหน้าที่ท่านอื่น</option>
                    </select>
                    {assignedOfficer === '__custom__' && (
                      <input
                        type="text"
                        value={customOfficer}
                        onChange={(e) => setCustomOfficer(e.target.value)}
                        placeholder="ระบุชื่อ-สกุล เจ้าหน้าที่ผู้รับผิดชอบ"
                        className="mt-2 w-full px-3 py-2 text-xs rounded-lg border border-[#E5EAF0] focus:outline-none focus:border-[#1D4ED8]"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#102C4C] mb-1.5">
                      ระบุหน่วยงานที่เกี่ยวข้อง *
                    </label>
                    <select
                      value={responsibleAgency}
                      onChange={(e) => setResponsibleAgency(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-[#E5EAF0] bg-white focus:outline-none focus:border-[#1D4ED8] cursor-pointer"
                    >
                      {agencies.map((ag) => (
                        <option key={ag.id} value={ag.name}>
                          {ag.name}
                        </option>
                      ))}
                      <option value="__custom__">+ ระบุหน่วยงานอื่นเพิ่มเติม</option>
                    </select>
                    {responsibleAgency === '__custom__' && (
                      <input
                        type="text"
                        value={customAgency}
                        onChange={(e) => setCustomAgency(e.target.value)}
                        placeholder="ระบุชื่อหน่วยงานที่ประสานงาน"
                        className="mt-2 w-full px-3 py-2 text-xs rounded-lg border border-[#E5EAF0] focus:outline-none focus:border-[#1D4ED8]"
                      />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#102C4C] mb-1.5">
                      กำหนดวันที่มอบหมาย *
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="date"
                        value={assignedDate}
                        onChange={(e) => setAssignedDate(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-[#E5EAF0] font-mono-numbers focus:outline-none focus:border-[#1D4ED8]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#102C4C] mb-1.5">
                      กำหนดวันติดตามผล
                    </label>
                    <div className="relative">
                      <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="date"
                        value={followUpDate}
                        onChange={(e) => setFollowUpDate(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-[#E5EAF0] font-mono-numbers focus:outline-none focus:border-[#1D4ED8]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#102C4C] mb-1.5">
                    บันทึกผลการประสานงาน
                  </label>
                  <textarea
                    rows={3}
                    value={coordinationResult}
                    onChange={(e) => setCoordinationResult(e.target.value)}
                    placeholder="บันทึกผลการส่งหนังสือประสานงาน การติดต่อหน่วยงาน หรือคำตอบรับเบื้องต้นจากหน่วยงานที่รับผิดชอบ..."
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-[#E5EAF0] focus:outline-none focus:border-[#1D4ED8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#102C4C] mb-1.5">
                    บันทึกหมายเหตุเพิ่มเติม
                  </label>
                  <textarea
                    rows={2}
                    value={coordinationNotes}
                    onChange={(e) => setCoordinationNotes(e.target.value)}
                    placeholder="ข้อกำชับในการติดตามผล หรือข้อมูลประกอบสำหรับเจ้าหน้าที่เวร..."
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-[#E5EAF0] focus:outline-none focus:border-[#1D4ED8]"
                  />
                </div>

                {/* Status Transition Control */}
                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E5EAF0] space-y-2.5">
                  <label className="flex items-center gap-2 text-xs font-semibold text-[#102C4C] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoTransitionStatus}
                      onChange={(e) => setAutoTransitionStatus(e.target.checked)}
                      className="rounded border-slate-300 text-[#102C4C] focus:ring-[#1D4ED8]"
                    />
                    <span>ปรับสถานะเรื่องร้องเรียนพร้อมกับการบันทึกมอบหมาย</span>
                  </label>

                  {autoTransitionStatus && (
                    <div className="pl-6">
                      <select
                        value={targetStatus}
                        onChange={(e) => setTargetStatus(e.target.value as ComplaintStatus)}
                        className="w-full sm:w-72 px-3 py-1.5 text-xs rounded-lg border border-[#E5EAF0] bg-white cursor-pointer"
                      >
                        <option value="investigating">อยู่ระหว่างตรวจสอบ</option>
                        <option value="coordinating">อยู่ระหว่างประสานงาน</option>
                        <option value="in_progress">อยู่ระหว่างดำเนินการ</option>
                        <option value="waiting_info">รอข้อมูลเพิ่มเติม</option>
                        <option value="completed">ดำเนินการเสร็จสิ้น</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-[#F8FAFC] border-t border-[#E5EAF0] flex items-center justify-between gap-3">
                <div className="text-[11px] text-slate-500">
                  บันทึกการมอบหมายจะถูกเพิ่มลงใน Timeline โดยอัตโนมัติ
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-[#102C4C] hover:bg-[#1D4ED8] rounded-lg transition-colors cursor-pointer shrink-0"
                >
                  <UserCheck className="w-4 h-4 text-[#C5A45A]" />
                  <span>บันทึกการมอบหมายและประสานงาน</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
