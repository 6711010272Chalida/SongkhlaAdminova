import React, { useState, useEffect } from 'react';
import { 
  TrainingRecord, 
  Employee, 
  TrainingCourse, 
  AttendanceStatus 
} from '../types';
import { ATTENDANCE_STATUS_LABELS } from '../data/initialRecords';
import { X, Check, ClipboardCheck, AlertCircle } from 'lucide-react';

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: TrainingRecord) => void;
  initialData?: TrainingRecord | null;
  employees: Employee[];
  courses: TrainingCourse[];
  defaultCourseId?: string;
  defaultEmployeeId?: string;
}

export const AttendanceModal: React.FC<AttendanceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  employees,
  courses,
  defaultCourseId,
  defaultEmployeeId
}) => {
  const [employeeId, setEmployeeId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [registrationDate, setRegistrationDate] = useState('');
  const [attendanceDate, setAttendanceDate] = useState('');
  const [status, setStatus] = useState<AttendanceStatus>('registered');
  const [score, setScore] = useState<number | ''>('');
  const [evaluationGrade, setEvaluationGrade] = useState<'excellent' | 'good' | 'fair' | 'need_improvement'>('good');
  const [evaluationNote, setEvaluationNote] = useState('');
  const [certificateNumber, setCertificateNumber] = useState('');
  const [hoursCompleted, setHoursCompleted] = useState<number>(0);

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setEmployeeId(initialData.employeeId);
      setCourseId(initialData.courseId);
      setRegistrationDate(initialData.registrationDate);
      setAttendanceDate(initialData.attendanceDate || initialData.registrationDate);
      setStatus(initialData.status);
      setScore(initialData.score !== undefined ? initialData.score : '');
      setEvaluationGrade(initialData.evaluationGrade || 'good');
      setEvaluationNote(initialData.evaluationNote || '');
      setCertificateNumber(initialData.certificateNumber || '');
      setHoursCompleted(initialData.hoursCompleted);
    } else {
      const today = new Date().toISOString().split('T')[0];
      const initialEmpId = defaultEmployeeId || (employees[0]?.id || '');
      const initialCrsId = defaultCourseId || (courses[0]?.id || '');
      const matchedCourse = courses.find(c => c.id === initialCrsId);

      setEmployeeId(initialEmpId);
      setCourseId(initialCrsId);
      setRegistrationDate(today);
      setAttendanceDate(today);
      setStatus('passed');
      setScore(85);
      setEvaluationGrade('good');
      setEvaluationNote('ผ่านเกณฑ์การประเมินมาตรฐานสมรรถนะ');
      setCertificateNumber(`SK-HRD-2569-${String(Date.now()).slice(-3)}`);
      setHoursCompleted(matchedCourse ? matchedCourse.hours : 12);
    }
    setErrors({});
  }, [initialData, isOpen, defaultCourseId, defaultEmployeeId, employees, courses]);

  // When course changes and new record, update default hours
  const handleCourseChange = (newCourseId: string) => {
    setCourseId(newCourseId);
    const crs = courses.find(c => c.id === newCourseId);
    if (crs && !initialData) {
      setHoursCompleted(crs.hours);
    }
  };

  // When status changes to passed, ensure hoursCompleted is set
  const handleStatusChange = (newStatus: AttendanceStatus) => {
    setStatus(newStatus);
    const crs = courses.find(c => c.id === courseId);
    if (newStatus === 'passed' && crs && hoursCompleted === 0) {
      setHoursCompleted(crs.hours);
    } else if (newStatus !== 'passed') {
      setHoursCompleted(0);
    }
  };

  if (!isOpen) return null;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!employeeId) errs.employeeId = 'กรุณาเลือกบุคลากร';
    if (!courseId) errs.courseId = 'กรุณาเลือกหลักสูตรฝึกอบรม';
    if (!registrationDate) errs.registrationDate = 'กรุณาระบุวันที่ลงทะเบียน';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const savedRecord: TrainingRecord = {
      id: initialData?.id || `tr-${Date.now()}`,
      employeeId,
      courseId,
      registrationDate,
      attendanceDate: attendanceDate || registrationDate,
      status,
      score: score === '' ? undefined : Number(score),
      evaluationGrade: status === 'passed' ? evaluationGrade : undefined,
      evaluationNote: evaluationNote.trim(),
      certificateNumber: status === 'passed' ? certificateNumber.trim() : undefined,
      hoursCompleted: status === 'passed' ? Number(hoursCompleted) : 0,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(savedRecord);
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
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold leading-tight">
                {initialData ? 'แก้ไขผลการเข้าร่วมฝึกอบรม' : 'บันทึกการเข้าร่วมและประเมินผลการอบรม'}
              </h3>
              <p className="text-xs text-slate-300">
                เชื่อมโยงระหว่างทะเบียนบุคลากรและโครงการพัฒนา
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
          {/* Employee Selector */}
          <div>
            <label className="block text-xs font-semibold text-[#102C4C] mb-1">
              บุคลากรผู้เข้าร่วมอบรม <span className="text-[#D9534F]">*</span>
            </label>
            <select
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E5EAF0] bg-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#245B91]"
            >
              <option value="">-- กรุณาเลือกบุคลากร --</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.empCode} - {emp.prefix}{emp.firstName} {emp.lastName} ({emp.position} · {emp.department})
                </option>
              ))}
            </select>
            {errors.employeeId && <p className="text-xs text-[#D9534F] mt-1">{errors.employeeId}</p>}
          </div>

          {/* Course Selector */}
          <div>
            <label className="block text-xs font-semibold text-[#102C4C] mb-1">
              หลักสูตร / โครงการพัฒนา <span className="text-[#D9534F]">*</span>
            </label>
            <select
              value={courseId}
              onChange={(e) => handleCourseChange(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E5EAF0] bg-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#245B91]"
            >
              <option value="">-- กรุณาเลือกหลักสูตร --</option>
              {courses.map(crs => (
                <option key={crs.id} value={crs.id}>
                  {crs.courseCode} - {crs.title} ({crs.hours} ชม.)
                </option>
              ))}
            </select>
            {errors.courseId && <p className="text-xs text-[#D9534F] mt-1">{errors.courseId}</p>}
          </div>

          {/* Dates & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#102C4C] mb-1">
                วันที่ลงทะเบียน <span className="text-[#D9534F]">*</span>
              </label>
              <input
                type="date"
                value={registrationDate}
                onChange={(e) => setRegistrationDate(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-[#E5EAF0] font-mono-numbers"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102C4C] mb-1">
                วันที่เข้าร่วม
              </label>
              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-[#E5EAF0] font-mono-numbers"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102C4C] mb-1">
                สถานะผลการเข้าร่วม
              </label>
              <select
                value={status}
                onChange={(e) => handleStatusChange(e.target.value as AttendanceStatus)}
                className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-[#E5EAF0] bg-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#245B91]"
              >
                {Object.entries(ATTENDANCE_STATUS_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v.labelTh}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Conditional: Evaluation details when Passed */}
          {status === 'passed' && (
            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-3">
              <div className="font-bold text-xs text-emerald-900">
                ผลการประเมินและการออกวุฒิบัตร (Evaluation & Certificate)
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#102C4C] mb-1">
                    คะแนนประเมิน (0-100)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={score}
                    onChange={(e) => setScore(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="เช่น 90"
                    className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-[#E5EAF0] font-mono-numbers bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#102C4C] mb-1">
                    ระดับผลการประเมิน
                  </label>
                  <select
                    value={evaluationGrade}
                    onChange={(e) => setEvaluationGrade(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-[#E5EAF0] bg-white cursor-pointer"
                  >
                    <option value="excellent">ดีมาก (Excellent)</option>
                    <option value="good">ดี (Good)</option>
                    <option value="fair">พอใช้ (Fair)</option>
                    <option value="need_improvement">ต้องปรับปรุง (Need Improvement)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#102C4C] mb-1">
                    ชั่วโมงที่ได้รับจริง
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={hoursCompleted}
                    onChange={(e) => setHoursCompleted(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-[#E5EAF0] font-mono-numbers bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#102C4C] mb-1">
                  เลขที่ใบประกาศนียบัตร / วุฒิบัตร
                </label>
                <input
                  type="text"
                  value={certificateNumber}
                  onChange={(e) => setCertificateNumber(e.target.value)}
                  placeholder="เช่น SK-HRD-2569-011"
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#E5EAF0] font-mono-numbers bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#102C4C] mb-1">
                  ความคิดเห็น / ผลสัมฤทธิ์
                </label>
                <input
                  type="text"
                  value={evaluationNote}
                  onChange={(e) => setEvaluationNote(e.target.value)}
                  placeholder="ความเห็นการประเมินผลการฝึกอบรม..."
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#E5EAF0] bg-white"
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
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
              <span>{initialData ? 'บันทึกการแก้ไข' : 'บันทึกผลการอบรม'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
