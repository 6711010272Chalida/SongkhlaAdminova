import React, { useState, useEffect } from 'react';
import { TrainingCourse, CourseCategory, CourseStatus } from '../types';
import { COURSE_CATEGORY_LABELS } from '../data/initialRecords';
import { X, Check, BookOpen, AlertCircle } from 'lucide-react';

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (course: TrainingCourse) => void;
  initialData?: TrainingCourse | null;
  existingCount: number;
}

export const CourseModal: React.FC<CourseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  existingCount
}) => {
  const [courseCode, setCourseCode] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CourseCategory>('knowledge_skill');
  const [organizer, setOrganizer] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [hours, setHours] = useState(12);
  const [maxAttendees, setMaxAttendees] = useState(40);
  const [objective, setObjective] = useState('');
  const [details, setDetails] = useState('');
  const [status, setStatus] = useState<CourseStatus>('upcoming');
  const [fiscalYear, setFiscalYear] = useState(2569);

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setCourseCode(initialData.courseCode);
      setTitle(initialData.title);
      setCategory(initialData.category);
      setOrganizer(initialData.organizer);
      setLocation(initialData.location);
      setStartDate(initialData.startDate);
      setEndDate(initialData.endDate);
      setHours(initialData.hours);
      setMaxAttendees(initialData.maxAttendees);
      setObjective(initialData.objective);
      setDetails(initialData.details);
      setStatus(initialData.status);
      setFiscalYear(initialData.fiscalYear);
    } else {
      const codeNum = String(existingCount + 1).padStart(2, '0');
      const today = new Date().toISOString().split('T')[0];
      setCourseCode(`TR-2569-${codeNum}`);
      setTitle('');
      setCategory('digital_tech');
      setOrganizer('ฝ่ายทรัพยากรบุคคล ศาลากลางจังหวัดสงขลา');
      setLocation('ห้องประชุมสารภี 1 ชั้น 5 ศาลากลางจังหวัดสงขลา');
      setStartDate(today);
      setEndDate(today);
      setHours(12);
      setMaxAttendees(40);
      setObjective('');
      setDetails('');
      setStatus('upcoming');
      setFiscalYear(2569);
    }
    setErrors({});
  }, [initialData, isOpen, existingCount]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!courseCode.trim()) errs.courseCode = 'กรุณาระบุรหัสหลักสูตร';
    if (!title.trim()) errs.title = 'กรุณาระบุชื่อหลักสูตร';
    if (!organizer.trim()) errs.organizer = 'กรุณาระบุหน่วยงานผู้จัด';
    if (!location.trim()) errs.location = 'กรุณาระบุสถานที่หรือช่องทางจัดอบรม';
    if (!startDate) errs.startDate = 'กรุณาเลือกวันเริ่ม';
    if (!endDate) errs.endDate = 'กรุณาเลือกวันสิ้นสุด';
    if (hours <= 0) errs.hours = 'จำนวนชั่วโมงต้องมากกว่า 0';
    if (!objective.trim()) errs.objective = 'กรุณาระบุวัตถุประสงค์หลักสูตร';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const savedCourse: TrainingCourse = {
      id: initialData?.id || `crs-${Date.now()}`,
      courseCode: courseCode.trim(),
      title: title.trim(),
      category,
      organizer: organizer.trim(),
      location: location.trim(),
      startDate,
      endDate,
      hours: Number(hours),
      maxAttendees: Number(maxAttendees),
      objective: objective.trim(),
      details: details.trim() || objective.trim(),
      status,
      fiscalYear: Number(fiscalYear),
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(savedCourse);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1F36]/60 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E5EAF0] my-8 overflow-hidden transition-all text-[#1B2B3A]"
        role="dialog"
        aria-modal="true"
      >
        <div className="px-6 py-4 bg-[#102C4C] text-white flex items-center justify-between border-b border-[#1B2B3A]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-[#C5A45A]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold leading-tight">
                {initialData ? 'แก้ไขหลักสูตรฝึกอบรม' : 'สร้างหลักสูตรและโครงการพัฒนาใหม่'}
              </h3>
              <p className="text-xs text-slate-300">
                ฝ่ายทรัพยากรบุคคล ศาลากลางจังหวัดสงขลา
              </p>
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
          {/* Code, Status & Fiscal Year */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#102C4C] mb-1">
                รหัสหลักสูตร <span className="text-[#D9534F]">*</span>
              </label>
              <input
                type="text"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                placeholder="เช่น TR-2569-07"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E5EAF0] font-mono-numbers focus:outline-none focus:ring-2 focus:ring-[#245B91]/30 focus:border-[#245B91]"
              />
              {errors.courseCode && <p className="text-xs text-[#D9534F] mt-1">{errors.courseCode}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102C4C] mb-1">
                สถานะการจัด
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as CourseStatus)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E5EAF0] bg-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#245B91]"
              >
                <option value="upcoming">เตรียมการ / เปิดรับสมัคร</option>
                <option value="ongoing">อยู่ระหว่างดำเนินการ</option>
                <option value="completed">เสร็จสิ้นแล้ว</option>
                <option value="cancelled">ยกเลิก / เลื่อนการจัด</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102C4C] mb-1">
                ปีงบประมาณ
              </label>
              <select
                value={fiscalYear}
                onChange={(e) => setFiscalYear(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E5EAF0] bg-white cursor-pointer font-mono-numbers focus:outline-none focus:ring-1 focus:ring-[#245B91]"
              >
                <option value={2569}>2569</option>
                <option value={2568}>2568</option>
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-[#102C4C] mb-1">
              ชื่อหลักสูตร / โครงการ <span className="text-[#D9534F]">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="เช่น การพัฒนาทักษะการบริหารงบประมาณยุคใหม่..."
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E5EAF0] focus:outline-none focus:ring-2 focus:ring-[#245B91]/30 focus:border-[#245B91]"
            />
            {errors.title && <p className="text-xs text-[#D9534F] mt-1">{errors.title}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-[#102C4C] mb-1">
              หมวดหมู่สมรรถนะ
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as CourseCategory)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E5EAF0] bg-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#245B91]"
            >
              {Object.entries(COURSE_CATEGORY_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v.labelTh} ({v.labelEn})</option>
              ))}
            </select>
          </div>

          {/* Organizer & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#102C4C] mb-1">
                หน่วยงานผู้จัด <span className="text-[#D9534F]">*</span>
              </label>
              <input
                type="text"
                value={organizer}
                onChange={(e) => setOrganizer(e.target.value)}
                placeholder="เช่น สถาบันดำรงราชานุภาพ, สำนักงาน ก.พ."
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E5EAF0] focus:outline-none focus:ring-2 focus:ring-[#245B91]/30 focus:border-[#245B91]"
              />
              {errors.organizer && <p className="text-xs text-[#D9534F] mt-1">{errors.organizer}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102C4C] mb-1">
                สถานที่จัดอบรม / ช่องทาง <span className="text-[#D9534F]">*</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="เช่น ห้องประชุม 1 ศาลากลางสงขลา หรือ Zoom"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E5EAF0] focus:outline-none focus:ring-2 focus:ring-[#245B91]/30 focus:border-[#245B91]"
              />
              {errors.location && <p className="text-xs text-[#D9534F] mt-1">{errors.location}</p>}
            </div>
          </div>

          {/* Dates & Hours */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#102C4C] mb-1">
                วันที่เริ่ม <span className="text-[#D9534F]">*</span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-[#E5EAF0] font-mono-numbers"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102C4C] mb-1">
                วันที่สิ้นสุด <span className="text-[#D9534F]">*</span>
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-[#E5EAF0] font-mono-numbers"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102C4C] mb-1">
                จำนวนชั่วโมง
              </label>
              <input
                type="number"
                min={1}
                max={200}
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-[#E5EAF0] font-mono-numbers"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102C4C] mb-1">
                จำนวนเป้าหมาย
              </label>
              <input
                type="number"
                min={1}
                max={500}
                value={maxAttendees}
                onChange={(e) => setMaxAttendees(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-[#E5EAF0] font-mono-numbers"
              />
            </div>
          </div>

          {/* Objective */}
          <div>
            <label className="block text-xs font-semibold text-[#102C4C] mb-1">
              วัตถุประสงค์หลักสูตร <span className="text-[#D9534F]">*</span>
            </label>
            <textarea
              rows={2}
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="ระบุวัตถุประสงค์และผลลัพธ์ที่คาดหวังจากการฝึกอบรม..."
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E5EAF0] focus:outline-none focus:ring-2 focus:ring-[#245B91]/30 focus:border-[#245B91]"
            />
            {errors.objective && <p className="text-xs text-[#D9534F] mt-1">{errors.objective}</p>}
          </div>

          {/* Details */}
          <div>
            <label className="block text-xs font-semibold text-[#102C4C] mb-1">
              รายละเอียดเนื้อหาหลักสูตร
            </label>
            <textarea
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="ระบุหัวข้อการบรรยาย วิทยากร หรือเกณฑ์การผ่านหลักสูตร..."
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E5EAF0] focus:outline-none focus:ring-2 focus:ring-[#245B91]/30 focus:border-[#245B91]"
            />
          </div>

          {/* Buttons */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#E5EAF0]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#102C4C] bg-white border border-[#E5EAF0] hover:bg-[#F3F6FA] rounded-xl transition-colors cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#102C4C] hover:bg-[#245B91] rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4 text-[#C5A45A]" />
              <span>{initialData ? 'บันทึกการแก้ไข' : 'สร้างหลักสูตร'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
