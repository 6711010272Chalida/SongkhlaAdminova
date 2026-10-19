import React, { useState, useEffect } from 'react';
import { WorkRecord, WorkCategory, WorkStatus, PriorityLevel } from '../types';
import { CATEGORY_LABELS } from '../data/initialRecords';
import { X, Check, AlertCircle, FileText } from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: WorkRecord) => void;
  initialData?: WorkRecord | null;
  existingCount: number;
}

const OFFICER_OPTIONS = [
  'เจ้าหน้าที่ A (กลุ่มยุทธศาสตร์)',
  'เจ้าหน้าที่ B (ศูนย์ดำรงธรรมจำลอง)',
  'เจ้าหน้าที่ C (งานสารบรรณ)',
  'เจ้าหน้าที่ D (ฝ่ายการเงินและพัสดุ)',
  'เจ้าหน้าที่ E (ฝ่ายนิติการจำลอง)'
];

const DEPARTMENT_OPTIONS = [
  'กลุ่มงานยุทธศาสตร์และข้อมูลเพื่อการพัฒนาจังหวัด',
  'กลุ่มงานศูนย์ดำรงธรรม (ส่วนบริการประชาชน)',
  'กลุ่มงานอำนวยการ (งานสารบรรณกลาง)',
  'กลุ่มงานบริหารทรัพยากรบุคคลและการเงิน',
  'กลุ่มงานประสานราชการและกฎหมาย'
];

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  existingCount
}) => {
  const [refId, setRefId] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<WorkCategory>('official_letter');
  const [receivedDate, setReceivedDate] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [status, setStatus] = useState<WorkStatus>('pending');
  const [priority, setPriority] = useState<PriorityLevel>('normal');
  const [responsiblePerson, setResponsiblePerson] = useState(OFFICER_OPTIONS[0]);
  const [department, setDepartment] = useState(DEPARTMENT_OPTIONS[0]);
  const [originAgency, setOriginAgency] = useState('');
  const [details, setDetails] = useState('');
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setRefId(initialData.refId);
      setTitle(initialData.title);
      setCategory(initialData.category);
      setReceivedDate(initialData.receivedDate);
      setFollowUpDate(initialData.followUpDate);
      setStatus(initialData.status);
      setPriority(initialData.priority);
      setResponsiblePerson(initialData.responsiblePerson);
      setDepartment(initialData.department);
      setOriginAgency(initialData.originAgency);
      setDetails(initialData.details);
    } else {
      // Auto-generate realistic demo ref ID
      const nextNum = String(existingCount + 101).padStart(4, '0');
      const today = new Date().toISOString().split('T')[0];
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);
      const nextWeek = futureDate.toISOString().split('T')[0];

      setRefId(`SK-69-${nextNum}`);
      setTitle('');
      setCategory('official_letter');
      setReceivedDate(today);
      setFollowUpDate(nextWeek);
      setStatus('pending');
      setPriority('normal');
      setResponsiblePerson(OFFICER_OPTIONS[0]);
      setDepartment(DEPARTMENT_OPTIONS[0]);
      setOriginAgency('ที่ทำการปกครองอำเภอเมืองสงขลา (สมมติ)');
      setDetails('');
    }
    setErrors({});
  }, [initialData, isOpen, existingCount]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!refId.trim()) errs.refId = 'กรุณาระบุรหัสเอกสาร / เลขรับเรื่อง';
    if (!title.trim()) errs.title = 'กรุณาระบุเรื่อง / รายละเอียดโดยย่อ';
    if (!receivedDate) errs.receivedDate = 'กรุณาเลือกวันที่รับเรื่อง';
    if (!followUpDate) errs.followUpDate = 'กรุณาเลือกวันนัดติดตาม';
    if (!originAgency.trim()) errs.originAgency = 'กรุณาระบุหน่วยงานต้นเรื่องหรือผู้ส่ง';
    if (!details.trim()) errs.details = 'กรุณาระบุสาระสำคัญ / ข้อสั่งการ';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const recordToSave: WorkRecord = {
      id: initialData?.id || `rec-${Date.now()}`,
      refId: refId.trim(),
      title: title.trim(),
      category,
      receivedDate,
      followUpDate,
      status,
      priority,
      responsiblePerson,
      department,
      originAgency: originAgency.trim(),
      details: details.trim(),
      notes: initialData?.notes || [
        {
          id: `n-${Date.now()}`,
          date: receivedDate,
          author: responsiblePerson.split(' ')[0],
          text: 'ลงทะเบียนรับเรื่องเข้าสู่ระบบจำลอง'
        }
      ],
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(recordToSave);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 my-8 overflow-hidden transition-all"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                {initialData ? 'แก้ไขข้อมูลงาน' : 'บันทึกเรื่องงานใหม่ (ข้อมูลจำลอง)'}
              </h3>
              <p className="text-xs text-slate-500">
                กรอกข้อมูลสำหรับการทดสอบระบบติดตามงานภาครัฐจำลอง
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Reference ID & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                รหัสเอกสาร / เลขรับเรื่อง <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={refId}
                onChange={(e) => setRefId(e.target.value)}
                placeholder="เช่น SK-69-0111"
                className={`w-full px-3 py-2 text-sm rounded-lg border font-mono-numbers focus:outline-none focus:ring-2 focus:ring-amber-500/30 ${
                  errors.refId ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                }`}
              />
              {errors.refId && (
                <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.refId}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ระดับความสำคัญ
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 cursor-pointer"
              >
                <option value="normal">ปกติ (Normal)</option>
                <option value="urgent">ด่วน (Urgent)</option>
                <option value="very_urgent">ด่วนที่สุด (Very Urgent)</option>
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              เรื่อง / สรุปหัวข้อสั้น <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="เช่น ประสานงานจัดทำแผนฟื้นฟู..."
              className={`w-full px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-amber-500/30 ${
                errors.title ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
              }`}
            />
            {errors.title && (
              <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Category & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ประเภทงาน
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as WorkCategory)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 cursor-pointer"
              >
                {Object.entries(CATEGORY_LABELS).map(([key, item]) => (
                  <option key={key} value={key}>
                    {item.labelTh} ({item.labelEn})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                สถานะการดำเนินการ
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as WorkStatus)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 cursor-pointer"
              >
                <option value="pending">รอดำเนินการ (Pending)</option>
                <option value="in_progress">กำลังดำเนินการ (In Progress)</option>
                <option value="completed">ดำเนินการแล้วเสร็จ (Completed)</option>
                <option value="cancelled">ยกเลิก / ยุติเรื่อง (Cancelled)</option>
              </select>
            </div>
          </div>

          {/* Received Date & Follow-up Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                วันที่รับเรื่อง <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={receivedDate}
                onChange={(e) => setReceivedDate(e.target.value)}
                className={`w-full px-3 py-2 text-sm rounded-lg border font-mono-numbers focus:outline-none focus:ring-2 focus:ring-amber-500/30 ${
                  errors.receivedDate ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                }`}
              />
              {errors.receivedDate && (
                <p className="text-xs text-rose-500 mt-1">{errors.receivedDate}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                วันนัดติดตาม / กำหนดส่ง <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className={`w-full px-3 py-2 text-sm rounded-lg border font-mono-numbers focus:outline-none focus:ring-2 focus:ring-amber-500/30 ${
                  errors.followUpDate ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                }`}
              />
              {errors.followUpDate && (
                <p className="text-xs text-rose-500 mt-1">{errors.followUpDate}</p>
              )}
            </div>
          </div>

          {/* Responsible Officer & Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ผู้รับผิดชอบ (ชื่อจำลอง)
              </label>
              <select
                value={responsiblePerson}
                onChange={(e) => setResponsiblePerson(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 cursor-pointer"
              >
                {OFFICER_OPTIONS.map((officer) => (
                  <option key={officer} value={officer}>
                    {officer}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                กลุ่มงาน / ส่วนราชการ
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 cursor-pointer"
              >
                {DEPARTMENT_OPTIONS.map((dep) => (
                  <option key={dep} value={dep}>
                    {dep}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Origin Agency */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              หน่วยงานต้นเรื่อง / ผู้ส่ง <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={originAgency}
              onChange={(e) => setOriginAgency(e.target.value)}
              placeholder="เช่น อำเภอหาดใหญ่, เทศบาลเมืองสงขลา, ประชาชนหมู่ 3"
              className={`w-full px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-amber-500/30 ${
                errors.originAgency ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
              }`}
            />
            {errors.originAgency && (
              <p className="text-xs text-rose-500 mt-1">{errors.originAgency}</p>
            )}
          </div>

          {/* Details / Directive */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              สรุปสาระสำคัญ / ข้อสั่งการ / รายละเอียด <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="ระบุสาระสำคัญ คำสั่งการ หรือความคืบหน้าที่ต้องการติดตาม..."
              className={`w-full px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-amber-500/30 ${
                errors.details ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
              }`}
            />
            {errors.details && (
              <p className="text-xs text-rose-500 mt-1">{errors.details}</p>
            )}
          </div>

          {/* Notice */}
          <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-lg text-xs text-amber-900 leading-relaxed">
            <span className="font-semibold">หมายเหตุ:</span> ข้อมูลที่บันทึกจะถูกเก็บไว้เฉพาะในเบราว์เซอร์ของท่านผ่าน LocalStorage เพื่อจำลองการใช้งานสำหรับการนำเสนอผลงานเท่านั้น
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-medium text-white bg-[#0F2038] hover:bg-[#1E3A60] rounded-lg shadow-sm transition-all cursor-pointer"
            >
              <Check className="w-4 h-4 text-amber-300" />
              <span>บันทึกข้อมูล</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
