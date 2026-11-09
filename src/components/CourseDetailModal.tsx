import React from 'react';
import { 
  TrainingCourse, 
  TrainingRecord, 
  Employee, 
  UserRole 
} from '../types';
import { 
  COURSE_CATEGORY_LABELS, 
  ATTENDANCE_STATUS_LABELS 
} from '../data/initialRecords';
import { 
  X, 
  BookOpen, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Building2, 
  Edit, 
  Award, 
  CheckCircle2,
  UserPlus
} from 'lucide-react';

interface CourseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: TrainingCourse | null;
  records: TrainingRecord[];
  employees: Employee[];
  userRole: UserRole;
  onEdit: (course: TrainingCourse) => void;
  onEnroll: (course: TrainingCourse) => void;
  onSelectEmployee: (emp: Employee) => void;
}

export const CourseDetailModal: React.FC<CourseDetailModalProps> = ({
  isOpen,
  onClose,
  course,
  records,
  employees,
  userRole,
  onEdit,
  onEnroll,
  onSelectEmployee
}) => {
  if (!isOpen || !course) return null;

  const cat = COURSE_CATEGORY_LABELS[course.category] || { labelTh: course.category, color: '' };
  
  const employeeMap = employees.reduce((acc, e) => {
    acc[e.id] = e;
    return acc;
  }, {} as Record<string, Employee>);

  // Attendees for this course
  const courseRecords = records.filter(r => r.courseId === course.id);
  const passedCount = courseRecords.filter(r => r.status === 'passed').length;

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
              {course.courseCode}
            </span>
            <div className="text-xs text-slate-300">
              {cat.labelTh} · ปีงบประมาณ {course.fiscalYear}
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
          {/* Main Title & Status */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                course.status === 'completed' ? 'bg-emerald-50 text-[#23865B] border-emerald-200' :
                course.status === 'upcoming' ? 'bg-amber-50 text-[#D69E36] border-amber-200' :
                'bg-sky-50 text-[#245B91] border-sky-200'
              }`}>
                {course.status === 'completed' ? 'เสร็จสิ้นแล้ว' : course.status === 'upcoming' ? 'เปิดรับสมัคร' : 'กำลังจัดอบรม'}
              </span>
              <span className="text-xs text-[#718096]">·</span>
              <span className="text-xs text-[#718096] font-mono-numbers">
                เป้าหมาย {course.maxAttendees} คน (ลงทะเบียนแล้ว {courseRecords.length} คน)
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[#102C4C] leading-snug">
              {course.title}
            </h2>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-[#F3F6FA] border border-[#E5EAF0] text-xs">
            <div>
              <span className="text-[#718096] block mb-1">ระยะเวลาฝึกอบรม</span>
              <div className="font-mono-numbers font-semibold text-[#102C4C] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#C5A45A]" />
                <span>{course.hours} ชั่วโมง</span>
              </div>
            </div>

            <div>
              <span className="text-[#718096] block mb-1">วันที่จัดโครงการ</span>
              <div className="font-mono-numbers font-semibold text-[#102C4C] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#245B91]" />
                <span>{course.startDate}</span>
              </div>
            </div>

            <div>
              <span className="text-[#718096] block mb-1">หน่วยงานผู้จัด</span>
              <div className="font-semibold text-[#102C4C] truncate" title={course.organizer}>
                {course.organizer}
              </div>
            </div>

            <div>
              <span className="text-[#718096] block mb-1">ผู้ผ่านเกณฑ์ประเมิน</span>
              <div className="font-mono-numbers font-bold text-[#23865B]">
                {passedCount} / {courseRecords.length} คน
              </div>
            </div>
          </div>

          {/* Location & Details */}
          <div className="space-y-3">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#718096] mb-1">
                สถานที่และช่องทางการอบรม
              </h4>
              <p className="text-xs text-[#1B2B3A] bg-white p-3.5 rounded-xl border border-[#E5EAF0] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C5A45A] shrink-0" />
                <span>{course.location}</span>
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#718096] mb-1">
                วัตถุประสงค์โครงการ
              </h4>
              <p className="text-xs text-[#1B2B3A] bg-white p-3.5 rounded-xl border border-[#E5EAF0] leading-relaxed">
                {course.objective}
              </p>
            </div>

            {course.details && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#718096] mb-1">
                  รายละเอียดและเกณฑ์การประเมิน
                </h4>
                <p className="text-xs text-[#718096] bg-white p-3.5 rounded-xl border border-[#E5EAF0] leading-relaxed whitespace-pre-line">
                  {course.details}
                </p>
              </div>
            )}
          </div>

          {/* Enrolled Attendees List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#718096]">
                รายชื่อบุคลากรผู้เข้าร่วมการอบรม ({courseRecords.length} คน)
              </h4>
              <button
                onClick={() => {
                  onClose();
                  onEnroll(course);
                }}
                className="text-xs font-semibold text-[#102C4C] hover:text-[#245B91] cursor-pointer flex items-center gap-1"
              >
                <UserPlus className="w-3.5 h-3.5 text-[#C5A45A]" />
                <span>+ เพิ่มผู้เข้าอบรมในโครงการนี้</span>
              </button>
            </div>

            {courseRecords.length === 0 ? (
              <p className="text-xs text-[#718096] italic py-2">ยังไม่มีบุคลากรลงทะเบียนในหลักสูตรนี้</p>
            ) : (
              <div className="space-y-2">
                {courseRecords.map((r) => {
                  const emp = employeeMap[r.employeeId];
                  const statusInfo = ATTENDANCE_STATUS_LABELS[r.status] || ATTENDANCE_STATUS_LABELS.registered;

                  return (
                    <div key={r.id} className="p-3.5 bg-[#F3F6FA] rounded-xl border border-[#E5EAF0] text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        {emp ? (
                          <button
                            onClick={() => {
                              onClose();
                              onSelectEmployee(emp);
                            }}
                            className="font-bold text-[#102C4C] hover:text-[#245B91] cursor-pointer text-left"
                          >
                            {emp.prefix}{emp.firstName} {emp.lastName} ({emp.empCode})
                          </button>
                        ) : (
                          <span className="text-[#718096]">{r.employeeId}</span>
                        )}
                        <div className="text-[11px] text-[#718096] mt-0.5">
                          {emp?.position} · {emp?.department}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-center">
                        {r.status === 'passed' && (
                          <span className="font-mono-numbers text-[#23865B] font-semibold">
                            คะแนน {r.score || '-'}/100
                          </span>
                        )}
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${statusInfo.bg} ${statusInfo.color}`}>
                          {statusInfo.labelTh}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#F3F6FA] border-t border-[#E5EAF0] flex items-center justify-between">
          {userRole === 'admin' ? (
            <button
              onClick={() => {
                onClose();
                onEdit(course);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-[#102C4C] hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>แก้ไขหลักสูตร</span>
            </button>
          ) : <div />}

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#102C4C] bg-white border border-[#E5EAF0] hover:bg-[#F3F6FA] rounded-xl transition-colors cursor-pointer"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
