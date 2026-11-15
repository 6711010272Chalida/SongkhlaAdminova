import React, { useState, useEffect } from 'react';
import {
  ComplaintRecord,
  ComplaintCategory,
  ComplaintUrgency,
  AgencyDirectoryItem
} from '../types';
import {
  CATEGORY_META,
  URGENCY_META,
  SONGKHLA_DISTRICTS
} from '../data/mockComplaints';
import { X, Check, Edit } from 'lucide-react';

interface ComplaintEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  complaint: ComplaintRecord | null;
  agencies: AgencyDirectoryItem[];
  onSave: (updated: ComplaintRecord) => void;
}

export const ComplaintEditModal: React.FC<ComplaintEditModalProps> = ({
  isOpen,
  onClose,
  complaint,
  agencies,
  onSave
}) => {
  const [receivedDate, setReceivedDate] = useState('');
  const [complainantName, setComplainantName] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState(SONGKHLA_DISTRICTS[0]);
  const [locationArea, setLocationArea] = useState('');
  const [category, setCategory] = useState<ComplaintCategory>('infrastructure');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [responsibleAgency, setResponsibleAgency] = useState('');
  const [urgency, setUrgency] = useState<ComplaintUrgency>('normal');
  const [followUpDate, setFollowUpDate] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (complaint) {
      setReceivedDate(complaint.receivedDate);
      setComplainantName(complaint.complainantName);
      setPhone(complaint.phone);
      setDistrict(complaint.district);
      setLocationArea(complaint.locationArea);
      setCategory(complaint.category);
      setSubject(complaint.subject);
      setDescription(complaint.description);
      setResponsibleAgency(complaint.responsibleAgency);
      setUrgency(complaint.urgency);
      setFollowUpDate(complaint.followUpDate || '');
      setErrors({});
    }
  }, [complaint, isOpen]);

  if (!isOpen || !complaint) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!receivedDate) errs.receivedDate = 'กรุณาระบุวันที่รับเรื่อง';
    if (!complainantName.trim()) errs.complainantName = 'กรุณาระบุชื่อผู้ร้องเรียน';
    if (!phone.trim()) errs.phone = 'กรุณาระบุหมายเลขโทรศัพท์';
    if (!locationArea.trim()) errs.locationArea = 'กรุณาระบุรายละเอียดพื้นที่';
    if (!subject.trim()) errs.subject = 'กรุณาระบุหัวข้อเรื่องร้องเรียน';
    if (!description.trim()) errs.description = 'กรุณาระบุรายละเอียดปัญหา';
    if (!responsibleAgency.trim()) errs.responsibleAgency = 'กรุณาระบุหน่วยงานที่เกี่ยวข้อง';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      ...complaint,
      receivedDate,
      complainantName: complainantName.trim(),
      phone: phone.trim(),
      district,
      locationArea: locationArea.trim(),
      category,
      subject: subject.trim(),
      description: description.trim(),
      responsibleAgency: responsibleAgency.trim(),
      urgency,
      followUpDate: followUpDate || undefined,
      updatedAt: new Date().toISOString()
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1F36]/60 backdrop-blur-xs overflow-y-auto">
      <div
        className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-[#E5EAF0] my-8 overflow-hidden text-[#1B2B3A]"
        role="dialog"
        aria-modal="true"
      >
        <div className="px-6 py-4 bg-[#0B1F36] text-white flex items-center justify-between border-b border-[#183354]">
          <div className="flex items-center gap-3">
            <Edit className="w-5 h-5 text-[#C5A45A]" />
            <div>
              <h3 className="text-base font-bold">แก้ไขข้อมูลเรื่องร้องเรียน ({complaint.caseNumber})</h3>
              <p className="text-xs text-slate-300">ปรับปรุงข้อมูลทะเบียนเรื่องร้องเรียนร้องทุกข์</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#102C4C] mb-1">วันที่รับเรื่อง *</label>
              <input
                type="date"
                value={receivedDate}
                onChange={(e) => setReceivedDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5EAF0] font-mono-numbers focus:outline-none focus:border-[#1D4ED8]"
              />
              {errors.receivedDate && <p className="text-xs text-rose-600 mt-1">{errors.receivedDate}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102C4C] mb-1">ระดับความเร่งด่วน</label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as ComplaintUrgency)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5EAF0] bg-white focus:outline-none focus:border-[#1D4ED8] cursor-pointer"
              >
                {Object.entries(URGENCY_META).map(([k, v]) => (
                  <option key={k} value={k}>{v.labelTh}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102C4C] mb-1">กำหนดวันติดตามผล</label>
              <input
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5EAF0] font-mono-numbers focus:outline-none focus:border-[#1D4ED8]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#102C4C] mb-1">ชื่อผู้ร้องเรียน *</label>
              <input
                type="text"
                value={complainantName}
                onChange={(e) => setComplainantName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5EAF0] focus:outline-none focus:border-[#1D4ED8]"
              />
              {errors.complainantName && <p className="text-xs text-rose-600 mt-1">{errors.complainantName}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102C4C] mb-1">หมายเลขโทรศัพท์ *</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5EAF0] font-mono-numbers focus:outline-none focus:border-[#1D4ED8]"
              />
              {errors.phone && <p className="text-xs text-rose-600 mt-1">{errors.phone}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#102C4C] mb-1">อำเภอในจังหวัดสงขลา</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5EAF0] bg-white focus:outline-none focus:border-[#1D4ED8] cursor-pointer"
              >
                {SONGKHLA_DISTRICTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102C4C] mb-1">ที่อยู่หรือพื้นที่ที่เกี่ยวข้อง *</label>
              <input
                type="text"
                value={locationArea}
                onChange={(e) => setLocationArea(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5EAF0] focus:outline-none focus:border-[#1D4ED8]"
              />
              {errors.locationArea && <p className="text-xs text-rose-600 mt-1">{errors.locationArea}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#102C4C] mb-1">ประเภทเรื่องร้องเรียน</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5EAF0] bg-white focus:outline-none focus:border-[#1D4ED8] cursor-pointer"
              >
                {Object.entries(CATEGORY_META).map(([k, v]) => (
                  <option key={k} value={k}>{v.labelTh}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102C4C] mb-1">หน่วยงานที่เกี่ยวข้อง *</label>
              <select
                value={responsibleAgency}
                onChange={(e) => setResponsibleAgency(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5EAF0] bg-white focus:outline-none focus:border-[#1D4ED8] cursor-pointer"
              >
                {agencies.map((ag) => (
                  <option key={ag.id} value={ag.name}>{ag.name}</option>
                ))}
                {!agencies.some((a) => a.name === responsibleAgency) && responsibleAgency && (
                  <option value={responsibleAgency}>{responsibleAgency}</option>
                )}
              </select>
              {errors.responsibleAgency && <p className="text-xs text-rose-600 mt-1">{errors.responsibleAgency}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#102C4C] mb-1">หัวข้อเรื่องร้องเรียน *</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5EAF0] focus:outline-none focus:border-[#1D4ED8]"
            />
            {errors.subject && <p className="text-xs text-rose-600 mt-1">{errors.subject}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#102C4C] mb-1">รายละเอียดปัญหา *</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5EAF0] focus:outline-none focus:border-[#1D4ED8]"
            />
            {errors.description && <p className="text-xs text-rose-600 mt-1">{errors.description}</p>}
          </div>

          <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-[#E5EAF0]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-[#E5EAF0] hover:bg-slate-50 rounded-lg cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#102C4C] hover:bg-[#1D4ED8] rounded-lg cursor-pointer"
            >
              <Check className="w-4 h-4 text-[#C5A45A]" />
              <span>บันทึกการแก้ไข</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
