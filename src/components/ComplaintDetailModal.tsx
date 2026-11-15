import React from 'react';
import { ComplaintRecord } from '../types';
import { CATEGORY_META, STATUS_META, URGENCY_META } from '../data/mockComplaints';
import { formatThaiDate, isComplaintOverdue } from '../services/storageService';
import {
  X,
  Calendar,
  MapPin,
  Phone,
  User,
  Building2,
  Paperclip,
  Clock,
  AlertTriangle,
  Edit,
  Activity,
  UserCheck,
  FileText
} from 'lucide-react';

interface ComplaintDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  complaint: ComplaintRecord | null;
  onEdit: (complaint: ComplaintRecord) => void;
  onOpenTracking: (complaint: ComplaintRecord) => void;
  onOpenAssignment: (complaint: ComplaintRecord) => void;
}

export const ComplaintDetailModal: React.FC<ComplaintDetailModalProps> = ({
  isOpen,
  onClose,
  complaint,
  onEdit,
  onOpenTracking,
  onOpenAssignment
}) => {
  if (!isOpen || !complaint) return null;

  const statusInfo = STATUS_META[complaint.status];
  const urgencyInfo = URGENCY_META[complaint.urgency];
  const categoryInfo = CATEGORY_META[complaint.category];
  const overdue = isComplaintOverdue(complaint);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1F36]/60 backdrop-blur-xs overflow-y-auto">
      <div
        className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl border border-[#E5EAF0] my-6 overflow-hidden text-[#1B2B3A]"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Modal Header */}
        <div className="px-6 py-4 bg-[#0B1F36] text-white flex items-center justify-between border-b border-[#183354]">
          <div className="flex items-center gap-3 min-w-0">
            <span className="font-mono-numbers text-xs font-semibold px-2.5 py-1 rounded bg-white/10 text-[#C5A45A] border border-[#C5A45A]/30 shrink-0">
              {complaint.caseNumber}
            </span>
            <div className="text-xs text-slate-300 truncate">
              รายละเอียดเรื่องร้องเรียนร้องทุกข์ · {categoryInfo.shortTh}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            aria-label="ปิดหน้าต่าง"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Subject & Status */}
          <div className="space-y-2 pb-4 border-b border-[#E5EAF0]">
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className={`inline-flex items-center gap-1.5 font-semibold ${statusInfo.textColor}`}>
                <span className={`w-2 h-2 rounded-full ${statusInfo.dotColor}`} />
                {statusInfo.labelTh}
              </span>
              <span className="text-slate-300">·</span>
              <span className={`font-semibold ${urgencyInfo.textColor}`}>
                ระดับความเร่งด่วน: {urgencyInfo.labelTh}
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-slate-500 font-mono-numbers">
                รับเรื่องวันที่ {formatThaiDate(complaint.receivedDate)}
              </span>
              {overdue && (
                <>
                  <span className="text-slate-300">·</span>
                  <span className="inline-flex items-center gap-1 text-rose-700 font-semibold">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    เกินกำหนดติดตาม ({formatThaiDate(complaint.followUpDate || '')})
                  </span>
                </>
              )}
            </div>

            <h2 className="text-lg font-bold text-[#102C4C] leading-snug">
              {complaint.subject}
            </h2>
          </div>

          {/* Core Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-[#F8FAFC] p-4 rounded-xl border border-[#E5EAF0]">
            <div className="space-y-1">
              <div className="text-slate-500 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>ผู้ร้องเรียน</span>
              </div>
              <div className="font-semibold text-[#102C4C]">{complaint.complainantName}</div>
            </div>

            <div className="space-y-1">
              <div className="text-slate-500 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>หมายเลขโทรศัพท์</span>
              </div>
              <div className="font-mono-numbers font-semibold text-[#102C4C]">{complaint.phone}</div>
            </div>

            <div className="space-y-1">
              <div className="text-slate-500 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>พื้นที่ที่เกี่ยวข้อง</span>
              </div>
              <div className="font-medium text-[#1B2B3A]">
                {complaint.district} — {complaint.locationArea}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-slate-500 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>หน่วยงานที่รับผิดชอบ</span>
              </div>
              <div className="font-semibold text-[#102C4C]">{complaint.responsibleAgency}</div>
            </div>
          </div>

          {/* Problem Description */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-semibold text-slate-500">รายละเอียดปัญหา / คำร้อง</h3>
            <p className="text-sm text-[#1B2B3A] leading-relaxed bg-white p-4 rounded-xl border border-[#E5EAF0]">
              {complaint.description}
            </p>
          </div>

          {/* Assignment & Coordination Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs p-4 rounded-xl border border-[#E5EAF0] bg-[#F8FAFC]">
            <div>
              <div className="text-slate-500 mb-0.5">เจ้าหน้าที่ผู้รับผิดชอบ</div>
              <div className="font-semibold text-[#102C4C]">
                {complaint.assignedOfficer || 'ยังไม่ได้มอบหมาย'}
              </div>
            </div>
            <div>
              <div className="text-slate-500 mb-0.5">วันที่มอบหมาย</div>
              <div className="font-mono-numbers text-[#1B2B3A]">
                {complaint.assignedDate ? formatThaiDate(complaint.assignedDate) : '-'}
              </div>
            </div>
            <div>
              <div className="text-slate-500 mb-0.5">วันกำหนดติดตามผล</div>
              <div className={`font-mono-numbers font-semibold ${overdue ? 'text-rose-700' : 'text-[#102C4C]'}`}>
                {complaint.followUpDate ? formatThaiDate(complaint.followUpDate) : '-'}
              </div>
            </div>
            {complaint.coordinationResult && (
              <div className="sm:col-span-3 pt-2 border-t border-[#E5EAF0]">
                <div className="text-slate-500 mb-0.5">ผลการประสานงานล่าสุด</div>
                <div className="text-[#1B2B3A]">{complaint.coordinationResult}</div>
              </div>
            )}
            {complaint.coordinationNotes && (
              <div className="sm:col-span-3">
                <div className="text-slate-500 mb-0.5">หมายเหตุเพิ่มเติม</div>
                <div className="text-slate-600">{complaint.coordinationNotes}</div>
              </div>
            )}
          </div>

          {/* Attachments */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
              <Paperclip className="w-3.5 h-3.5" />
              <span>เอกสารและรูปภาพประกอบ ({complaint.attachments.length} ไฟล์)</span>
            </h3>
            {complaint.attachments.length === 0 ? (
              <div className="text-xs text-slate-400">ไม่มีไฟล์แนบประกอบเรื่อง</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {complaint.attachments.map((att) => (
                  <div
                    key={att.id}
                    className="flex items-center gap-3 p-2.5 rounded-lg border border-[#E5EAF0] bg-white text-xs"
                  >
                    {att.previewDataUrl ? (
                      <img
                        src={att.previewDataUrl}
                        alt={att.name}
                        className="w-10 h-10 rounded object-cover border border-[#E5EAF0] shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded bg-[#F3F6FA] text-[#102C4C] flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-[#102C4C] truncate">{att.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono-numbers">
                        {att.size} · {att.uploadedAt}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Timeline History */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>ประวัติการดำเนินงาน (Timeline)</span>
            </h3>
            <div className="space-y-3 pl-3 border-l border-[#E5EAF0]">
              {[...complaint.timeline].reverse().map((entry) => {
                const tlStatus = STATUS_META[entry.status];
                return (
                  <div key={entry.id} className="relative pl-4">
                    <span
                      className={`absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white ${tlStatus.dotColor}`}
                    />
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className={`font-semibold ${tlStatus.textColor}`}>{tlStatus.labelTh}</span>
                      <span className="text-slate-300">·</span>
                      <span className="font-mono-numbers text-slate-500">{entry.timestamp}</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-slate-600 font-medium">{entry.officerName}</span>
                    </div>
                    <p className="text-xs text-[#1B2B3A] mt-1 leading-relaxed">{entry.note}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 bg-[#F8FAFC] border-t border-[#E5EAF0] flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenTracking(complaint);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#102C4C] bg-white border border-[#E5EAF0] hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
            >
              <Activity className="w-3.5 h-3.5 text-[#1D4ED8]" />
              <span>ติดตามและอัปเดตสถานะ</span>
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenAssignment(complaint);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#102C4C] bg-white border border-[#E5EAF0] hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#C5A45A]" />
              <span>มอบหมายและประสานงาน</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(complaint);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-[#102C4C] hover:bg-[#1D4ED8] rounded-lg transition-colors cursor-pointer"
            >
              <Edit className="w-3.5 h-3.5 text-[#C5A45A]" />
              <span>แก้ไขข้อมูล</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-[#E5EAF0] hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
            >
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
