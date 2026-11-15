import React, { useState, useEffect } from 'react';
import {
  ComplaintAttachment,
  ComplaintCategory,
  ComplaintRecord,
  ComplaintUrgency,
  AgencyDirectoryItem
} from '../types';
import {
  CATEGORY_META,
  SONGKHLA_DISTRICTS,
  URGENCY_META
} from '../data/mockComplaints';
import { generateNextCaseNumber } from '../services/storageService';
import {
  FilePlus2,
  Check,
  RotateCcw,
  X,
  Upload,
  Trash2,
  FileText,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

interface IntakeFormViewProps {
  existingComplaints: ComplaintRecord[];
  agencies: AgencyDirectoryItem[];
  officerName: string;
  onSaveNewComplaint: (complaint: ComplaintRecord) => void;
  onCancel: () => void;
}

export const IntakeFormView: React.FC<IntakeFormViewProps> = ({
  existingComplaints,
  agencies,
  officerName,
  onSaveNewComplaint,
  onCancel
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  const [caseNumber, setCaseNumber] = useState(() => generateNextCaseNumber(existingComplaints));
  const [receivedDate, setReceivedDate] = useState(todayStr);
  const [complainantName, setComplainantName] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState(SONGKHLA_DISTRICTS[0]);
  const [locationArea, setLocationArea] = useState('');
  const [category, setCategory] = useState<ComplaintCategory>('infrastructure');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [responsibleAgency, setResponsibleAgency] = useState(agencies[0]?.name || '');
  const [customAgency, setCustomAgency] = useState('');
  const [urgency, setUrgency] = useState<ComplaintUrgency>('normal');
  const [attachments, setAttachments] = useState<ComplaintAttachment[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setCaseNumber(generateNextCaseNumber(existingComplaints));
  }, [existingComplaints]);

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const sizeText =
        file.size >= 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
          : `${Math.max(1, Math.round(file.size / 1024))} KB`;

      const isImage = file.type.startsWith('image/');
      const attId = `att-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

      if (isImage && file.size <= 350 * 1024) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          setAttachments((prev) => [
            ...prev,
            {
              id: attId,
              name: file.name,
              type: 'image',
              size: sizeText,
              previewDataUrl: ev.target?.result as string,
              uploadedAt: todayStr
            }
          ]);
        };
        reader.readAsDataURL(file);
      } else {
        setAttachments((prev) => [
          ...prev,
          {
            id: attId,
            name: file.name,
            type: isImage ? 'image' : file.name.toLowerCase().endsWith('.pdf') ? 'pdf' : 'doc',
            size: sizeText,
            uploadedAt: todayStr
          }
        ]);
      }
    });

    e.target.value = '';
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleResetForm = () => {
    setCaseNumber(generateNextCaseNumber(existingComplaints));
    setReceivedDate(todayStr);
    setComplainantName('');
    setPhone('');
    setDistrict(SONGKHLA_DISTRICTS[0]);
    setLocationArea('');
    setCategory('infrastructure');
    setSubject('');
    setDescription('');
    setResponsibleAgency(agencies[0]?.name || '');
    setCustomAgency('');
    setUrgency('normal');
    setAttachments([]);
    setErrors({});
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!caseNumber.trim()) errs.caseNumber = 'กรุณาระบุเลขที่รับเรื่อง';
    if (existingComplaints.some((c) => c.caseNumber === caseNumber.trim())) {
      errs.caseNumber = 'เลขที่รับเรื่องนี้มีอยู่ในระบบแล้ว กรุณาสร้างเลขที่ใหม่';
    }
    if (!receivedDate) errs.receivedDate = 'กรุณาเลือกวันที่รับเรื่อง';
    if (!complainantName.trim()) errs.complainantName = 'กรุณาระบุชื่อผู้ร้องเรียน';
    const cleanPhone = phone.replace(/[-\s]/g, '');
    if (!cleanPhone) {
      errs.phone = 'กรุณาระบุหมายเลขโทรศัพท์ติดต่อ';
    } else if (!/^[0-9]{9,10}$/.test(cleanPhone)) {
      errs.phone = 'กรุณาระบุหมายเลขโทรศัพท์ 9-10 หลักให้ถูกต้อง';
    }
    if (!locationArea.trim()) errs.locationArea = 'กรุณาระบุที่อยู่หรือพื้นที่ที่เกี่ยวข้อง';
    if (!subject.trim()) errs.subject = 'กรุณาระบุหัวข้อเรื่องร้องเรียน';
    if (!description.trim() || description.trim().length < 10) {
      errs.description = 'กรุณาระบุรายละเอียดปัญหาอย่างน้อย 10 ตัวอักษร';
    }
    const finalAgency = responsibleAgency === '__custom__' ? customAgency.trim() : responsibleAgency;
    if (!finalAgency) errs.responsibleAgency = 'กรุณาระบุหน่วยงานที่เกี่ยวข้อง';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const finalAgency = responsibleAgency === '__custom__' ? customAgency.trim() : responsibleAgency;
    const nowIso = new Date().toISOString();
    const nowTime = new Date().toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    const newComplaint: ComplaintRecord = {
      id: `cmp-${Date.now()}`,
      caseNumber: caseNumber.trim(),
      receivedDate,
      complainantName: complainantName.trim(),
      phone: phone.trim(),
      district,
      locationArea: locationArea.trim(),
      category,
      subject: subject.trim(),
      description: description.trim(),
      responsibleAgency: finalAgency,
      urgency,
      status: 'new',
      attachments,
      timeline: [
        {
          id: `tl-${Date.now()}`,
          timestamp: `${receivedDate} ${nowTime}`,
          status: 'new',
          officerName,
          department: 'ศูนย์ดำรงธรรมจังหวัดสงขลา',
          note: `รับเรื่องร้องเรียนร้องทุกข์ใหม่ (${caseNumber.trim()}) ประสานเบื้องต้นไปยัง ${finalAgency}`
        }
      ],
      createdAt: nowIso,
      updatedAt: nowIso
    };

    onSaveNewComplaint(newComplaint);
    handleResetForm();
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <div className="text-xs text-slate-500 mb-1">
          งานรับเรื่องราวร้องทุกข์ · ศูนย์ดำรงธรรมจังหวัดสงขลา
        </div>
        <h1 className="text-2xl font-bold text-[#102C4C] tracking-tight">
          รับเรื่องร้องเรียนร้องทุกข์
        </h1>
        <p className="text-sm text-slate-600 mt-0.5">
          บันทึกข้อมูลคำร้องเรียนใหม่เข้าสู่ระบบทะเบียนกลาง พร้อมสร้างเลขที่รับเรื่องและไฟล์ประกอบอัตโนมัติ
        </p>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[#E5EAF0] overflow-hidden">
        <div className="px-6 py-4 bg-[#F8FAFC] border-b border-[#E5EAF0] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FilePlus2 className="w-5 h-5 text-[#102C4C]" />
            <span className="text-sm font-bold text-[#102C4C]">แบบฟอร์มลงทะเบียนรับเรื่องร้องเรียน</span>
          </div>
          <span className="text-xs text-slate-500">เครื่องหมาย * จำเป็นต้องกรอก</span>
        </div>

        <div className="p-6 space-y-6">
          {/* Section 1: Case Identification */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#102C4C] mb-1.5">
                เลขที่รับเรื่อง (สร้างอัตโนมัติ) *
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={caseNumber}
                  onChange={(e) => setCaseNumber(e.target.value)}
                  className={`w-full px-3 py-2 text-xs sm:text-sm rounded-lg border font-mono-numbers font-semibold bg-[#F8FAFC] text-[#102C4C] focus:outline-none focus:bg-white focus:border-[#1D4ED8] ${
                    errors.caseNumber ? 'border-rose-500' : 'border-[#E5EAF0]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setCaseNumber(generateNextCaseNumber(existingComplaints))}
                  className="p-2 text-slate-600 hover:text-[#102C4C] border border-[#E5EAF0] rounded-lg hover:bg-slate-50 cursor-pointer shrink-0"
                  title="สร้างเลขที่รับเรื่องถัดไป"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
              {errors.caseNumber && (
                <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.caseNumber}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102C4C] mb-1.5">
                วันที่รับเรื่อง *
              </label>
              <input
                type="date"
                value={receivedDate}
                onChange={(e) => setReceivedDate(e.target.value)}
                className={`w-full px-3 py-2 text-xs sm:text-sm rounded-lg border font-mono-numbers focus:outline-none focus:border-[#1D4ED8] ${
                  errors.receivedDate ? 'border-rose-500' : 'border-[#E5EAF0]'
                }`}
              />
              {errors.receivedDate && <p className="text-xs text-rose-600 mt-1">{errors.receivedDate}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102C4C] mb-1.5">
                ระดับความเร่งด่วน *
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as ComplaintUrgency)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-[#E5EAF0] bg-white focus:outline-none focus:border-[#1D4ED8] cursor-pointer"
              >
                {Object.entries(URGENCY_META).map(([k, v]) => (
                  <option key={k} value={k}>{v.labelTh}</option>
                ))}
              </select>
            </div>
          </div>

          <hr className="border-[#E5EAF0]" />

          {/* Section 2: Complainant Info */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-[#102C4C]">ข้อมูลผู้ร้องเรียนและพื้นที่ที่เกี่ยวข้อง</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#102C4C] mb-1.5">
                  ชื่อผู้ร้องเรียน (ระบุข้อมูลสมมติสำหรับระบบต้นแบบ) *
                </label>
                <input
                  type="text"
                  value={complainantName}
                  onChange={(e) => setComplainantName(e.target.value)}
                  placeholder="เช่น นายสมชาย ทดสอบ (ข้อมูลสมมติ)"
                  className={`w-full px-3 py-2 text-xs sm:text-sm rounded-lg border focus:outline-none focus:border-[#1D4ED8] ${
                    errors.complainantName ? 'border-rose-500' : 'border-[#E5EAF0]'
                  }`}
                />
                {errors.complainantName && <p className="text-xs text-rose-600 mt-1">{errors.complainantName}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#102C4C] mb-1.5">
                  หมายเลขโทรศัพท์ *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="เช่น 080-000-0123"
                  className={`w-full px-3 py-2 text-xs sm:text-sm rounded-lg border font-mono-numbers focus:outline-none focus:border-[#1D4ED8] ${
                    errors.phone ? 'border-rose-500' : 'border-[#E5EAF0]'
                  }`}
                />
                {errors.phone && <p className="text-xs text-rose-600 mt-1">{errors.phone}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#102C4C] mb-1.5">
                  อำเภอ (จังหวัดสงขลา) *
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-[#E5EAF0] bg-white focus:outline-none focus:border-[#1D4ED8] cursor-pointer"
                >
                  {SONGKHLA_DISTRICTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#102C4C] mb-1.5">
                  ที่อยู่หรือพื้นที่ที่เกี่ยวข้อง *
                </label>
                <input
                  type="text"
                  value={locationArea}
                  onChange={(e) => setLocationArea(e.target.value)}
                  placeholder="เช่น ซอย/ถนน หมู่ที่ ตำบล หรือจุดสังเกตในพื้นที่"
                  className={`w-full px-3 py-2 text-xs sm:text-sm rounded-lg border focus:outline-none focus:border-[#1D4ED8] ${
                    errors.locationArea ? 'border-rose-500' : 'border-[#E5EAF0]'
                  }`}
                />
                {errors.locationArea && <p className="text-xs text-rose-600 mt-1">{errors.locationArea}</p>}
              </div>
            </div>
          </div>

          <hr className="border-[#E5EAF0]" />

          {/* Section 3: Complaint Details */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-[#102C4C]">รายละเอียดเรื่องร้องเรียนและหน่วยงานประสาน</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#102C4C] mb-1.5">
                  ประเภทเรื่องร้องเรียน *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-[#E5EAF0] bg-white focus:outline-none focus:border-[#1D4ED8] cursor-pointer"
                >
                  {Object.entries(CATEGORY_META).map(([k, v]) => (
                    <option key={k} value={k}>{v.labelTh}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#102C4C] mb-1.5">
                  หน่วยงานที่เกี่ยวข้อง *
                </label>
                <select
                  value={responsibleAgency}
                  onChange={(e) => setResponsibleAgency(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-[#E5EAF0] bg-white focus:outline-none focus:border-[#1D4ED8] cursor-pointer"
                >
                  {agencies.map((ag) => (
                    <option key={ag.id} value={ag.name}>{ag.name}</option>
                  ))}
                  <option value="__custom__">+ ระบุหน่วยงานอื่นเพิ่มเติม</option>
                </select>
                {responsibleAgency === '__custom__' && (
                  <input
                    type="text"
                    value={customAgency}
                    onChange={(e) => setCustomAgency(e.target.value)}
                    placeholder="ระบุชื่อหน่วยงานที่รับผิดชอบ..."
                    className="mt-2 w-full px-3 py-2 text-xs rounded-lg border border-[#E5EAF0] focus:outline-none focus:border-[#1D4ED8]"
                  />
                )}
                {errors.responsibleAgency && (
                  <p className="text-xs text-rose-600 mt-1">{errors.responsibleAgency}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102C4C] mb-1.5">
                หัวข้อเรื่องร้องเรียน *
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="สรุปประเด็นปัญหาหรือความเดือดร้อนอย่างกระชับ ชัดเจน"
                className={`w-full px-3 py-2 text-xs sm:text-sm rounded-lg border focus:outline-none focus:border-[#1D4ED8] ${
                  errors.subject ? 'border-rose-500' : 'border-[#E5EAF0]'
                }`}
              />
              {errors.subject && <p className="text-xs text-rose-600 mt-1">{errors.subject}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102C4C] mb-1.5">
                รายละเอียดปัญหา *
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="อธิบายข้อเท็จจริง วันเวลาที่เกิดเหตุ ผลกระทบที่ได้รับ และสิ่งที่ประสงค์ให้ศูนย์ดำรงธรรมดำเนินการช่วยเหลือ..."
                className={`w-full px-3 py-2 text-xs sm:text-sm rounded-lg border focus:outline-none focus:border-[#1D4ED8] ${
                  errors.description ? 'border-rose-500' : 'border-[#E5EAF0]'
                }`}
              />
              {errors.description && <p className="text-xs text-rose-600 mt-1">{errors.description}</p>}
            </div>
          </div>

          <hr className="border-[#E5EAF0]" />

          {/* Section 4: Attachments */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-[#102C4C]">
              แนบไฟล์เอกสารหรือรูปภาพประกอบ (ถ้ามี)
            </label>

            <label className="flex flex-col items-center justify-center p-5 border border-dashed border-slate-300 rounded-xl bg-[#F8FAFC] hover:bg-slate-100/70 transition-colors cursor-pointer text-center">
              <Upload className="w-5 h-5 text-[#1D4ED8] mb-1.5" />
              <span className="text-xs font-semibold text-[#102C4C]">
                คลิกเพื่อเลือกไฟล์เอกสาร หรือรูปภาพประกอบ
              </span>
              <span className="text-[11px] text-slate-500 mt-0.5">
                รองรับไฟล์ภาพ (.jpg, .png) และเอกสาร (.pdf, .doc, .docx)
              </span>
              <input
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx"
                onChange={handleFileAttach}
                className="hidden"
              />
            </label>

            {attachments.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {attachments.map((att) => (
                  <div
                    key={att.id}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-lg border border-[#E5EAF0] bg-white text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {att.previewDataUrl ? (
                        <img
                          src={att.previewDataUrl}
                          alt={att.name}
                          className="w-9 h-9 rounded object-cover border border-[#E5EAF0] shrink-0"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded bg-[#F3F6FA] text-[#102C4C] flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="font-medium text-[#102C4C] truncate">{att.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono-numbers">{att.size}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAttachment(att.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                      title="ลบไฟล์แนบ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Form Actions */}
        <div className="px-6 py-4 bg-[#F8FAFC] border-t border-[#E5EAF0] flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-[#E5EAF0] hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
            <span>ยกเลิก</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleResetForm}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-[#E5EAF0] hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>ล้างข้อมูล</span>
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-[#102C4C] hover:bg-[#1D4ED8] rounded-lg transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4 text-[#C5A45A]" />
              <span>บันทึกข้อมูลเรื่องร้องเรียน</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
