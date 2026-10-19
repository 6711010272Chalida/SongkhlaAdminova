import React, { useState } from 'react';
import { WorkRecord, WorkStatus } from '../types';
import { CATEGORY_LABELS, STATUS_LABELS, PRIORITY_LABELS } from '../data/initialRecords';
import { X, Calendar, User, Building, Send, Edit, Clock, CheckCircle2, AlertTriangle, Printer } from 'lucide-react';

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: WorkRecord | null;
  onEdit: (record: WorkRecord) => void;
  onStatusChange: (recordId: string, newStatus: WorkStatus) => void;
  onAddNote: (recordId: string, noteText: string, author: string) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  isOpen,
  onClose,
  record,
  onEdit,
  onStatusChange,
  onAddNote
}) => {
  const [newNote, setNewNote] = useState('');
  const [noteAuthor, setNoteAuthor] = useState('เจ้าหน้าที่ผู้รับผิดชอบ');

  if (!isOpen || !record) return null;

  const category = CATEGORY_LABELS[record.category] || { labelTh: record.category, labelEn: '', icon: '' };
  const statusInfo = STATUS_LABELS[record.status] || { labelTh: record.status, labelEn: '', color: '', bg: '', border: '' };
  const priorityInfo = PRIORITY_LABELS[record.priority] || { labelTh: record.priority, labelEn: '', color: '', dotColor: '' };

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    onAddNote(record.id, newNote.trim(), noteAuthor);
    setNewNote('');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl border border-slate-200 my-8 overflow-hidden transition-all text-slate-800"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header */}
        <div className="px-6 py-4 bg-[#0F2038] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono-numbers text-xs px-2.5 py-1 bg-amber-400/20 text-amber-300 font-semibold rounded border border-amber-300/30">
              {record.refId}
            </span>
            <div className="text-xs text-slate-300">
              {category.labelTh} · {record.department}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded transition-colors cursor-pointer"
              title="พิมพ์เอกสารสรุป"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Main Title & Status Bar */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
              <span className={`text-xs font-semibold ${priorityInfo.color} flex items-center gap-1.5`}>
                <span className={`w-2 h-2 rounded-full ${priorityInfo.dotColor}`} />
                ความสำคัญ: {priorityInfo.labelTh}
              </span>
              
              {/* Quick Status Selector */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 font-medium">เปลี่ยนสถานะ:</span>
                <select
                  value={record.status}
                  onChange={(e) => onStatusChange(record.id, e.target.value as WorkStatus)}
                  className="px-2.5 py-1 rounded border border-slate-300 bg-white font-medium text-slate-700 cursor-pointer focus:ring-1 focus:ring-amber-500"
                >
                  <option value="pending">รอดำเนินการ</option>
                  <option value="in_progress">กำลังดำเนินการ</option>
                  <option value="completed">ดำเนินการแล้วเสร็จ</option>
                  <option value="cancelled">ยกเลิก / ยุติเรื่อง</option>
                </select>
              </div>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
              {record.title}
            </h2>
          </div>

          {/* Key Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block mb-1">วันที่รับเรื่อง</span>
              <div className="flex items-center gap-1.5 font-mono-numbers font-medium text-slate-900">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {record.receivedDate}
              </div>
            </div>

            <div>
              <span className="text-slate-500 block mb-1">วันนัดติดตาม / กำหนดส่ง</span>
              <div className="flex items-center gap-1.5 font-mono-numbers font-medium text-slate-900">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                {record.followUpDate}
              </div>
            </div>

            <div>
              <span className="text-slate-500 block mb-1">ผู้รับผิดชอบ</span>
              <div className="flex items-center gap-1.5 font-medium text-slate-900">
                <User className="w-3.5 h-3.5 text-slate-400" />
                {record.responsiblePerson}
              </div>
            </div>

            <div>
              <span className="text-slate-500 block mb-1">หน่วยงานต้นเรื่อง</span>
              <div className="flex items-center gap-1.5 font-medium text-slate-900">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate" title={record.originAgency}>{record.originAgency}</span>
              </div>
            </div>
          </div>

          {/* Full Details Section */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              สาระสำคัญและข้อสั่งการ
            </h4>
            <div className="p-4 bg-white rounded-lg border border-slate-200 text-sm leading-relaxed text-slate-800 whitespace-pre-line">
              {record.details}
            </div>
          </div>

          {/* Progress Notes Timeline */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                บันทึกความคืบหน้าและการติดตาม ({record.notes.length})
              </h4>
            </div>

            <div className="space-y-2">
              {record.notes.length === 0 ? (
                <p className="text-xs text-slate-400 italic">ยังไม่มีการบันทึกความคืบหน้า</p>
              ) : (
                record.notes.map((note) => (
                  <div key={note.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-slate-800 leading-normal">{note.text}</p>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2">
                        <span>โดย: {note.author}</span>
                        <span>·</span>
                        <span className="font-mono-numbers">{note.date}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add Note Form */}
            <form onSubmit={handleAddNoteSubmit} className="pt-2">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="เขียนบันทึกความคืบหน้าใหม่ เช่น โทรประสานงานแล้ว..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                />
                <button
                  type="submit"
                  disabled={!newNote.trim()}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-[#0F2038] hover:bg-[#1E3A60] disabled:bg-slate-300 rounded-lg transition-colors cursor-pointer shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>เพิ่มบันทึก</span>
                </button>
              </div>
            </form>
          </div>

          {/* Demo disclaimer footer */}
          <div className="p-3 rounded-lg bg-slate-100 text-[11px] text-slate-600 flex items-center gap-2">
            <span className="font-semibold text-slate-700">จำลองระบบ:</span>
            <span>บันทึกและสถานะนี้เป็นส่วนหนึ่งของโครงงานต้นแบบนวัตกรรม (Prototype)</span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onEdit(record);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-200/60 rounded-md transition-colors cursor-pointer"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>แก้ไขข้อมูลเรื่องนี้</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
