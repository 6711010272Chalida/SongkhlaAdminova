import React, { useState, useEffect } from 'react';
import { Employee, PositionLevel, EmployeeStatus } from '../types';
import { POSITION_LEVEL_LABELS, EMPLOYEE_STATUS_LABELS } from '../data/initialRecords';
import { X, Check, AlertCircle, UserPlus, Users } from 'lucide-react';

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (employee: Employee) => void;
  initialData?: Employee | null;
  existingCount: number;
}

const DEPARTMENT_PRESETS = [
  'กลุ่มงานบริหารทรัพยากรบุคคล',
  'กลุ่มงานยุทธศาสตร์และข้อมูลเพื่อการพัฒนาจังหวัด',
  'กลุ่มงานศูนย์ดำรงธรรมจังหวัดสงขลา',
  'กลุ่มงานอำนวยการ',
  'กลุ่มงานประสานราชการและกฎหมาย',
  'กลุ่มงานเทคโนโลยีสารสนเทศและการสื่อสาร',
  'กลุ่มงานการเงินและบัญชี'
];

export const EmployeeModal: React.FC<EmployeeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  existingCount
}) => {
  const [empCode, setEmpCode] = useState('');
  const [prefix, setPrefix] = useState('นาย');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [position, setPosition] = useState('');
  const [department, setDepartment] = useState(DEPARTMENT_PRESETS[0]);
  const [positionLevel, setPositionLevel] = useState<PositionLevel>('operational');
  const [startDate, setStartDate] = useState('');
  const [status, setStatus] = useState<EmployeeStatus>('active');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setEmpCode(initialData.empCode);
      setPrefix(initialData.prefix);
      setFirstName(initialData.firstName);
      setLastName(initialData.lastName);
      setPosition(initialData.position);
      setDepartment(initialData.department);
      setPositionLevel(initialData.positionLevel);
      setStartDate(initialData.startDate);
      setStatus(initialData.status);
      setEmail(initialData.email);
      setPhone(initialData.phone);
      setNotes(initialData.notes || '');
    } else {
      const codeNum = String(existingCount + 1).padStart(3, '0');
      setEmpCode(`SK-HR-${codeNum}`);
      setPrefix('นาย');
      setFirstName('');
      setLastName('');
      setPosition('นักทรัพยากรบุคคลปฏิบัติการ');
      setDepartment(DEPARTMENT_PRESETS[0]);
      setPositionLevel('operational');
      setStartDate(new Date().toISOString().split('T')[0]);
      setStatus('active');
      setEmail('');
      setPhone('074-312-000');
      setNotes('');
    }
    setErrors({});
  }, [initialData, isOpen, existingCount]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!empCode.trim()) errs.empCode = 'กรุณาระบุรหัสบุคลากร';
    if (!firstName.trim()) errs.firstName = 'กรุณาระบุชื่อจริง';
    if (!lastName.trim()) errs.lastName = 'กรุณาระบุนามสกุล';
    if (!position.trim()) errs.position = 'กรุณาระบุตำแหน่งงาน';
    if (!department.trim()) errs.department = 'กรุณาระบุกลุ่มงาน/สังกัด';
    if (!startDate) errs.startDate = 'กรุณาเลือกวันที่เริ่มปฏิบัติงาน';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const savedEmp: Employee = {
      id: initialData?.id || `emp-${Date.now()}`,
      empCode: empCode.trim(),
      prefix,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      position: position.trim(),
      department: department.trim(),
      positionLevel,
      startDate,
      status,
      email: email.trim() || `${firstName.toLowerCase()}@songkhla.demo.th`,
      phone: phone.trim() || '074-312-000',
      notes: notes.trim(),
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(savedEmp);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1F36]/60 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E5EAF0] my-8 overflow-hidden transition-all text-[#1B2B3A]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-[#102C4C] text-white flex items-center justify-between border-b border-[#1B2B3A]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-[#C5A45A]">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold leading-tight">
                {initialData ? 'แก้ไขข้อมูลบุคลากร' : 'เพิ่มบุคลากรใหม่ (ศาลากลางสงขลา)'}
              </h3>
              <p className="text-xs text-slate-300">
                ทะเบียนประวัติข้าราชการและบุคลากรภาครัฐ
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Emp Code & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#102C4C] mb-1">
                รหัสบุคลากร <span className="text-[#D9534F]">*</span>
              </label>
              <input
                type="text"
                value={empCode}
                onChange={(e) => setEmpCode(e.target.value)}
                placeholder="เช่น SK-HR-009"
                className={`w-full px-3 py-2 text-xs sm:text-sm rounded-xl border font-mono-numbers focus:outline-none focus:ring-2 focus:ring-[#245B91]/30 focus:border-[#245B91] ${
                  errors.empCode ? 'border-[#D9534F] bg-rose-50/30' : 'border-[#E5EAF0]'
                }`}
              />
              {errors.empCode && <p className="text-xs text-[#D9534F] mt-1">{errors.empCode}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102C4C] mb-1">
                สถานะการปฏิบัติงาน
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as EmployeeStatus)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E5EAF0] bg-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#245B91]"
              >
                {Object.entries(EMPLOYEE_STATUS_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v.labelTh}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Name Row: Prefix, First, Last */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-1">
              <label className="block text-xs font-semibold text-[#102C4C] mb-1">
                คำนำหน้า
              </label>
              <select
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E5EAF0] bg-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#245B91]"
              >
                <option value="นาย">นาย</option>
                <option value="นาง">นาง</option>
                <option value="นางสาว">นางสาว</option>
                <option value="ว่าที่ ร.ต.">ว่าที่ ร.ต.</option>
                <option value="ดร.">ดร.</option>
              </select>
            </div>

            <div className="sm:col-span-1.5">
              <label className="block text-xs font-semibold text-[#102C4C] mb-1">
                ชื่อจริง <span className="text-[#D9534F]">*</span>
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="ชื่อจริง"
                className={`w-full px-3 py-2 text-xs sm:text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#245B91]/30 focus:border-[#245B91] ${
                  errors.firstName ? 'border-[#D9534F] bg-rose-50/30' : 'border-[#E5EAF0]'
                }`}
              />
              {errors.firstName && <p className="text-xs text-[#D9534F] mt-1">{errors.firstName}</p>}
            </div>

            <div className="sm:col-span-1.5">
              <label className="block text-xs font-semibold text-[#102C4C] mb-1">
                นามสกุล <span className="text-[#D9534F]">*</span>
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="นามสกุล"
                className={`w-full px-3 py-2 text-xs sm:text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#245B91]/30 focus:border-[#245B91] ${
                  errors.lastName ? 'border-[#D9534F] bg-rose-50/30' : 'border-[#E5EAF0]'
                }`}
              />
              {errors.lastName && <p className="text-xs text-[#D9534F] mt-1">{errors.lastName}</p>}
            </div>
          </div>

          {/* Position & Level */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#102C4C] mb-1">
                ตำแหน่งงาน <span className="text-[#D9534F]">*</span>
              </label>
              <input
                type="text"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="เช่น นักทรัพยากรบุคคลปฏิบัติการ"
                className={`w-full px-3 py-2 text-xs sm:text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#245B91]/30 focus:border-[#245B91] ${
                  errors.position ? 'border-[#D9534F] bg-rose-50/30' : 'border-[#E5EAF0]'
                }`}
              />
              {errors.position && <p className="text-xs text-[#D9534F] mt-1">{errors.position}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102C4C] mb-1">
                ระดับตำแหน่ง
              </label>
              <select
                value={positionLevel}
                onChange={(e) => setPositionLevel(e.target.value as PositionLevel)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E5EAF0] bg-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#245B91]"
              >
                {Object.entries(POSITION_LEVEL_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v.labelTh} ({v.labelEn})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Department & Start Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#102C4C] mb-1">
                กลุ่มงาน / สังกัด <span className="text-[#D9534F]">*</span>
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E5EAF0] bg-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#245B91]"
              >
                {DEPARTMENT_PRESETS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102C4C] mb-1">
                วันที่เริ่มปฏิบัติงาน <span className="text-[#D9534F]">*</span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={`w-full px-3 py-2 text-xs sm:text-sm rounded-xl border font-mono-numbers focus:outline-none focus:ring-2 focus:ring-[#245B91]/30 focus:border-[#245B91] ${
                  errors.startDate ? 'border-[#D9534F] bg-rose-50/30' : 'border-[#E5EAF0]'
                }`}
              />
              {errors.startDate && <p className="text-xs text-[#D9534F] mt-1">{errors.startDate}</p>}
            </div>
          </div>

          {/* Contact: Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#102C4C] mb-1">
                อีเมลติดต่อ
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="somchai@songkhla.demo.th"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E5EAF0] font-mono-numbers focus:outline-none focus:ring-2 focus:ring-[#245B91]/30 focus:border-[#245B91]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102C4C] mb-1">
                เบอร์โทรศัพท์ภายใน
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="074-312-xxx"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E5EAF0] font-mono-numbers focus:outline-none focus:ring-2 focus:ring-[#245B91]/30 focus:border-[#245B91]"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-[#102C4C] mb-1">
              หมายเหตุ / ภารกิจพิเศษ
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="ระบุความเชี่ยวชาญ คณะทำงาน หรือหมายเหตุ..."
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
              <span>{initialData ? 'บันทึกการแก้ไข' : 'บันทึกข้อมูลบุคลากร'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
