import React from 'react';
import { 
  Employee, 
  TrainingRecord, 
  TrainingCourse, 
  UserRole 
} from '../types';
import { 
  POSITION_LEVEL_LABELS, 
  EMPLOYEE_STATUS_LABELS, 
  COURSE_CATEGORY_LABELS, 
  ATTENDANCE_STATUS_LABELS 
} from '../data/initialRecords';
import { 
  X, 
  Award, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Edit, 
  GraduationCap, 
  Mail, 
  Phone, 
  Building2, 
  FileText 
} from 'lucide-react';

interface EmployeeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  records: TrainingRecord[];
  courses: TrainingCourse[];
  userRole: UserRole;
  onEdit: (emp: Employee) => void;
  onViewPassport: (emp: Employee) => void;
}

export const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({
  isOpen,
  onClose,
  employee,
  records,
  courses,
  userRole,
  onEdit,
  onViewPassport
}) => {
  if (!isOpen || !employee) return null;

  const levelInfo = POSITION_LEVEL_LABELS[employee.positionLevel] || { labelTh: employee.positionLevel };
  const statusInfo = EMPLOYEE_STATUS_LABELS[employee.status] || EMPLOYEE_STATUS_LABELS.active;

  const courseMap = courses.reduce((acc, c) => {
    acc[c.id] = c;
    return acc;
  }, {} as Record<string, TrainingCourse>);

  // Filter records for this employee
  const employeeRecords = records.filter(r => r.employeeId === employee.id);
  const passedRecords = employeeRecords.filter(r => r.status === 'passed');
  const totalHours = passedRecords.reduce((sum, r) => sum + (r.hoursCompleted || 0), 0);
  const progressPct = Math.min(100, Math.round((totalHours / 30) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1F36]/60 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-[#E5EAF0] my-8 overflow-hidden transition-all text-[#1B2B3A]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-[#102C4C] text-white flex items-center justify-between border-b border-[#1B2B3A]">
          <div className="flex items-center gap-3">
            <span className="font-mono-numbers text-xs px-2.5 py-1 bg-white/10 text-[#C5A45A] font-bold rounded-lg border border-white/10">
              {employee.empCode}
            </span>
            <div className="text-xs text-slate-300">
              ประวัติบุคลากรภาครัฐ · {employee.department}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Identity Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5EAF0]">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#0B1F36] border border-white/10 flex items-center justify-center font-bold text-xl text-[#C5A45A] shrink-0">
                {employee.firstName.charAt(0)}
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-[#102C4C]">
                  {employee.prefix}{employee.firstName} {employee.lastName}
                </h2>
                <p className="text-xs text-[#718096]">
                  {employee.position} (ระดับ: {levelInfo.labelTh})
                </p>
              </div>
            </div>

            <span className={`inline-flex items-center self-start sm:self-auto px-3 py-1 rounded-full text-xs font-semibold border ${statusInfo.bg} ${statusInfo.color}`}>
              {statusInfo.labelTh}
            </span>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 bg-[#F3F6FA] rounded-xl border border-[#E5EAF0] text-xs">
              <span className="text-[#718096] block mb-0.5">ชั่วโมงการอบรมสะสม</span>
              <div className="text-xl font-bold text-[#102C4C] font-mono-numbers">
                {totalHours} <span className="text-xs font-normal text-[#718096]">/ 30 ชม.</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 mt-2 overflow-hidden">
                <div 
                  className={`h-full ${totalHours >= 30 ? 'bg-[#23865B]' : 'bg-[#D69E36]'}`}
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            <div className="p-4 bg-[#F3F6FA] rounded-xl border border-[#E5EAF0] text-xs">
              <span className="text-[#718096] block mb-0.5">หลักสูตรที่ผ่านการอบรม</span>
              <div className="text-xl font-bold text-[#23865B] font-mono-numbers">
                {passedRecords.length} <span className="text-xs font-normal text-[#718096]">โครงการ</span>
              </div>
              <span className="text-[11px] text-[#718096] mt-1 block">ได้รับวุฒิบัตรรับรอง</span>
            </div>

            <div className="p-4 bg-[#F3F6FA] rounded-xl border border-[#E5EAF0] text-xs">
              <span className="text-[#718096] block mb-0.5">วันที่เริ่มปฏิบัติราชการ</span>
              <div className="text-sm font-bold text-[#102C4C] font-mono-numbers mt-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#245B91]" />
                {employee.startDate}
              </div>
            </div>
          </div>

          {/* Contact & Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[#F3F6FA] border border-[#E5EAF0] text-xs">
            <div>
              <span className="text-[#718096] block mb-1">กลุ่มงาน / สังกัด</span>
              <span className="font-semibold text-[#102C4C]">{employee.department}</span>
            </div>
            <div>
              <span className="text-[#718096] block mb-1">อีเมลติดต่อ</span>
              <span className="font-mono-numbers text-[#102C4C]">{employee.email}</span>
            </div>
            <div>
              <span className="text-[#718096] block mb-1">เบอร์โทรศัพท์</span>
              <span className="font-mono-numbers text-[#102C4C]">{employee.phone}</span>
            </div>
            <div>
              <span className="text-[#718096] block mb-1">หมายเหตุ / ภารกิจพิเศษ</span>
              <span className="text-[#1B2B3A]">{employee.notes || '-'}</span>
            </div>
          </div>

          {/* Training Records History Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#718096]">
                ประวัติการเข้าร่วมหลักสูตร ({employeeRecords.length} รายการ)
              </h4>
            </div>

            {employeeRecords.length === 0 ? (
              <p className="text-xs text-[#718096] italic py-2">ยังไม่มีประวัติการเข้าร่วมฝึกอบรม</p>
            ) : (
              <div className="space-y-2">
                {employeeRecords.map(r => {
                  const crs = courseMap[r.courseId];
                  const statusInfo = ATTENDANCE_STATUS_LABELS[r.status] || ATTENDANCE_STATUS_LABELS.registered;

                  return (
                    <div key={r.id} className="p-3.5 bg-white rounded-xl border border-[#E5EAF0] text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs">
                      <div className="space-y-0.5">
                        <div className="font-bold text-[#102C4C]">
                          {crs ? `${crs.courseCode} ${crs.title}` : 'หลักสูตร'}
                        </div>
                        <div className="text-[11px] text-[#718096] flex items-center gap-2">
                          <span>วันที่: {r.attendanceDate || r.registrationDate}</span>
                          <span>·</span>
                          <span>ได้ {r.hoursCompleted} ชม.</span>
                          {r.score && <span>· คะแนน: {r.score}/100</span>}
                        </div>
                      </div>

                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border self-start sm:self-center ${statusInfo.bg} ${statusInfo.color}`}>
                        {statusInfo.labelTh}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-[#F3F6FA] border-t border-[#E5EAF0] flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onViewPassport(employee);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#102C4C] hover:text-[#245B91] cursor-pointer"
          >
            <GraduationCap className="w-4 h-4 text-[#C5A45A]" />
            <span>เปิดสมุดประวัติเต็ม (Competency Passport)</span>
          </button>

          <div className="flex items-center gap-2">
            {userRole === 'admin' && (
              <button
                onClick={() => {
                  onClose();
                  onEdit(employee);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-[#102C4C] hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>แก้ไขข้อมูล</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#102C4C] bg-white border border-[#E5EAF0] hover:bg-[#F3F6FA] rounded-xl transition-colors cursor-pointer"
            >
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
