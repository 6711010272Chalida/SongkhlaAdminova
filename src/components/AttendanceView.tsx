import React, { useState, useMemo } from 'react';
import { 
  TrainingRecord, 
  Employee, 
  TrainingCourse, 
  AttendanceStatus, 
  UserRole 
} from '../types';
import { 
  ATTENDANCE_STATUS_LABELS, 
  COURSE_CATEGORY_LABELS 
} from '../data/initialRecords';
import { 
  Search, 
  PlusCircle, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  ClipboardCheck, 
  Calendar, 
  Award, 
  CheckCircle2, 
  RotateCcw,
  BookOpen,
  User,
  Clock,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

interface AttendanceViewProps {
  records: TrainingRecord[];
  employees: Employee[];
  courses: TrainingCourse[];
  userRole: UserRole;
  onOpenAddModal: () => void;
  onOpenEditModal: (record: TrainingRecord) => void;
  onDeleteRecord: (record: TrainingRecord) => void;
  onQuickStatusChange: (recordId: string, status: AttendanceStatus) => void;
  onSelectEmployee: (emp: Employee) => void;
  onSelectCourse: (course: TrainingCourse) => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  records,
  employees,
  courses,
  userRole,
  onOpenAddModal,
  onOpenEditModal,
  onDeleteRecord,
  onQuickStatusChange,
  onSelectEmployee,
  onSelectCourse
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Employee & Course lookup maps
  const employeeMap = useMemo(() => {
    const map: Record<string, Employee> = {};
    employees.forEach(e => { map[e.id] = e; });
    return map;
  }, [employees]);

  const courseMap = useMemo(() => {
    const map: Record<string, TrainingCourse> = {};
    courses.forEach(c => { map[c.id] = c; });
    return map;
  }, [courses]);

  // Aggregate stats
  const totalPassed = records.filter(r => r.status === 'passed').length;
  const totalAttending = records.filter(r => r.status === 'attending' || r.status === 'registered').length;
  const totalHoursLogged = records.reduce((sum, r) => sum + (r.hoursCompleted || 0), 0);
  const passRate = records.length > 0 ? Math.round((totalPassed / records.length) * 100) : 0;

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      if (selectedCourseId !== 'all' && r.courseId !== selectedCourseId) return false;
      if (selectedStatus !== 'all' && r.status !== selectedStatus) return false;
      if (selectedEmployeeId !== 'all' && r.employeeId !== selectedEmployeeId) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const emp = employeeMap[r.employeeId];
        const crs = courseMap[r.courseId];
        const empName = emp ? `${emp.prefix}${emp.firstName} ${emp.lastName}`.toLowerCase() : '';
        const empCode = emp ? emp.empCode.toLowerCase() : '';
        const crsTitle = crs ? crs.title.toLowerCase() : '';
        const crsCode = crs ? crs.courseCode.toLowerCase() : '';
        const cert = (r.certificateNumber || '').toLowerCase();

        if (!empName.includes(q) && !empCode.includes(q) && !crsTitle.includes(q) && !crsCode.includes(q) && !cert.includes(q)) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime());
  }, [records, selectedCourseId, selectedStatus, selectedEmployeeId, searchQuery, employeeMap, courseMap]);

  // Pagination
  const totalPages = Math.ceil(filteredRecords.length / pageSize) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [filteredRecords, currentPage, pageSize]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCourseId('all');
    setSelectedStatus('all');
    setSelectedEmployeeId('all');
    setCurrentPage(1);
  };

  const hasActiveFilters = searchQuery !== '' || selectedCourseId !== 'all' || selectedStatus !== 'all' || selectedEmployeeId !== 'all';

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#718096] mb-1">
            <span className="font-medium">การติดตามผลการพัฒนา</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-numbers">ทั้งหมด {records.length} รายการ</span>
          </div>
          <h1 className="text-2xl font-bold text-[#102C4C] tracking-tight">
            การเข้าร่วมฝึกอบรมและการประเมินผล (Attendance & Evaluation)
          </h1>
          <p className="text-sm text-[#718096] mt-0.5">
            บันทึกประวัติการลงทะเบียน ชั่วโมงที่ได้รับ ผลการประเมิน และเลขที่วุฒิบัตรรับรองรายบุคคล
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#102C4C] hover:bg-[#245B91] rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 text-[#C5A45A]" />
          <span>บันทึกการเข้าร่วมใหม่</span>
        </button>
      </div>

      {/* 4 Quantitative Mini Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-[#E5EAF0] p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#718096]">บันทึกการเข้าร่วมทั้งหมด</span>
            <span className="p-2 rounded-xl bg-slate-50 text-[#102C4C]">
              <ClipboardCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono-numbers text-[#102C4C]">{records.length}</span>
            <span className="text-xs text-[#718096]">รายการ</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5EAF0] p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#718096]">ผ่านการอบรมแล้ว</span>
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono-numbers text-[#23865B]">{totalPassed}</span>
            <span className="text-xs text-[#718096]">รายการ</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5EAF0] p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#718096]">ชั่วโมงสะสมที่ผ่าน</span>
            <span className="p-2 rounded-xl bg-blue-50 text-[#245B91]">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono-numbers text-[#102C4C]">{totalHoursLogged}</span>
            <span className="text-xs text-[#718096]">ชม.</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5EAF0] p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#718096]">อัตราการผ่านเกณฑ์</span>
            <span className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <Award className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono-numbers text-[#D69E36]">{passRate}%</span>
            <span className="text-xs text-[#718096]">สำเร็จ</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-[#E5EAF0] p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#718096] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ค้นหาด้วยชื่อบุคลากร, รหัสข้าราชการ, ชื่อหลักสูตร, หรือเลขวุฒิบัตร..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-[#E5EAF0] bg-white text-[#1B2B3A] focus:outline-none focus:ring-2 focus:ring-[#245B91]/30 focus:border-[#245B91]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#718096] hover:text-[#1B2B3A]"
              >
                ล้าง
              </button>
            )}
          </div>
        </div>

        {/* Dropdown Filters Strip */}
        <div className="flex flex-wrap items-center gap-2.5 pt-3 border-t border-[#E5EAF0] text-xs">
          <div className="flex items-center gap-1.5 text-[#718096] font-medium">
            <Filter className="w-3.5 h-3.5" />
            <span>ตัวกรอง:</span>
          </div>

          <select
            value={selectedCourseId}
            onChange={(e) => { setSelectedCourseId(e.target.value); setCurrentPage(1); }}
            className="px-3 py-1.5 rounded-lg border border-[#E5EAF0] bg-white text-[#1B2B3A] font-medium focus:outline-none focus:ring-1 focus:ring-[#245B91] cursor-pointer max-w-xs truncate"
          >
            <option value="all">ทุกหลักสูตรฝึกอบรม</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>{c.courseCode}: {c.title}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
            className="px-3 py-1.5 rounded-lg border border-[#E5EAF0] bg-white text-[#1B2B3A] font-medium focus:outline-none focus:ring-1 focus:ring-[#245B91] cursor-pointer"
          >
            <option value="all">ทุกสถานะการเข้าร่วม</option>
            {Object.entries(ATTENDANCE_STATUS_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v.labelTh}</option>
            ))}
          </select>

          <select
            value={selectedEmployeeId}
            onChange={(e) => { setSelectedEmployeeId(e.target.value); setCurrentPage(1); }}
            className="px-3 py-1.5 rounded-lg border border-[#E5EAF0] bg-white text-[#1B2B3A] font-medium focus:outline-none focus:ring-1 focus:ring-[#245B91] cursor-pointer max-w-xs truncate"
          >
            <option value="all">บุคลากรทั้งหมด</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>
                {emp.empCode} {emp.prefix}{emp.firstName} {emp.lastName}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[#D69E36] hover:text-[#C5A45A] hover:bg-amber-50 rounded-lg transition-colors font-medium cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>ล้างตัวกรอง</span>
            </button>
          )}

          <div className="ml-auto text-xs text-[#718096]">
            แสดง <span className="font-mono-numbers font-semibold text-[#102C4C]">{filteredRecords.length}</span> จาก {records.length} รายการ
          </div>
        </div>
      </div>

      {/* Modern Government Table */}
      <div className="bg-white rounded-2xl border border-[#E5EAF0] overflow-hidden shadow-xs">
        {paginatedRecords.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#F3F6FA] text-[#718096] mx-auto flex items-center justify-center">
              <ClipboardCheck className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-[#102C4C]">ไม่พบบันทึกการเข้าร่วมที่ตรงกับเงื่อนไข</h3>
            <p className="text-xs text-[#718096] max-w-sm mx-auto">
              ลองปรับคำค้นหา หรือกดปุ่ม "บันทึกการเข้าร่วมใหม่" ด้านบนเพื่อลงทะเบียนผู้เข้าร่วม
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#F3F6FA] text-[#718096] border-b border-[#E5EAF0] uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4 font-semibold">บุคลากรผู้เข้าอบรม</th>
                  <th className="py-3 px-4 font-semibold">หลักสูตร / โครงการ</th>
                  <th className="py-3 px-4 font-semibold hidden md:table-cell">วันที่เข้าร่วม</th>
                  <th className="py-3 px-4 font-semibold text-center">ชั่วโมง</th>
                  <th className="py-3 px-4 font-semibold">ผลการประเมิน</th>
                  <th className="py-3 px-4 font-semibold">สถานะ</th>
                  <th className="py-3 px-4 font-semibold text-right">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5EAF0]">
                {paginatedRecords.map((record) => {
                  const emp = employeeMap[record.employeeId];
                  const crs = courseMap[record.courseId];
                  const statusInfo = ATTENDANCE_STATUS_LABELS[record.status] || ATTENDANCE_STATUS_LABELS.registered;

                  return (
                    <tr key={record.id} className="hover:bg-[#F3F6FA]/70 transition-colors group">
                      {/* Employee */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {emp ? (
                          <button
                            onClick={() => onSelectEmployee(emp)}
                            className="font-bold text-[#102C4C] hover:text-[#245B91] text-left transition-colors cursor-pointer block"
                          >
                            <div className="leading-tight">{emp.prefix}{emp.firstName} {emp.lastName}</div>
                            <div className="text-[11px] text-[#718096] font-normal font-mono-numbers mt-0.5">
                              {emp.empCode} · {emp.department}
                            </div>
                          </button>
                        ) : (
                          <span className="text-slate-400 italic">ไม่พบบุคลากร ({record.employeeId})</span>
                        )}
                      </td>

                      {/* Course */}
                      <td className="py-3 px-4 max-w-xs">
                        {crs ? (
                          <button
                            onClick={() => onSelectCourse(crs)}
                            className="font-medium text-[#1B2B3A] hover:text-[#245B91] text-left transition-colors cursor-pointer truncate block max-w-xs"
                            title={crs.title}
                          >
                            <div className="font-mono-numbers text-[11px] text-[#C5A45A] font-bold">
                              {crs.courseCode}
                            </div>
                            <div className="truncate text-[#102C4C] font-semibold">{crs.title}</div>
                          </button>
                        ) : (
                          <span className="text-slate-400 italic">ไม่พบหลักสูตร</span>
                        )}
                      </td>

                      {/* Attendance Date */}
                      <td className="py-3 px-4 font-mono-numbers text-[#718096] hidden md:table-cell whitespace-nowrap">
                        {record.attendanceDate || record.registrationDate}
                      </td>

                      {/* Hours */}
                      <td className="py-3 px-4 font-mono-numbers text-center whitespace-nowrap">
                        <span className="font-bold text-[#102C4C]">{record.hoursCompleted}</span>
                        <span className="text-[#718096] text-[11px] ml-1">ชม.</span>
                      </td>

                      {/* Evaluation / Score */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {record.status === 'passed' ? (
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1 text-[#23865B] font-semibold font-mono-numbers">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{record.score ? `${record.score}/100` : 'ผ่านเกณฑ์'}</span>
                            </div>
                            {record.certificateNumber && (
                              <div className="text-[10px] text-[#718096] font-mono-numbers truncate max-w-[130px]" title={record.certificateNumber}>
                                {record.certificateNumber}
                              </div>
                            )}
                          </div>
                        ) : record.status === 'failed' ? (
                          <span className="text-[#D9534F] font-semibold">ไม่ผ่านเกณฑ์</span>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">- รอประเมิน -</span>
                        )}
                      </td>

                      {/* Status Selector */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <select
                          value={record.status}
                          onChange={(e) => onQuickStatusChange(record.id, e.target.value as AttendanceStatus)}
                          className={`text-xs font-semibold py-1 px-2.5 rounded-full border focus:outline-none cursor-pointer transition-colors ${statusInfo.bg} ${statusInfo.color}`}
                        >
                          <option value="registered">ลงทะเบียนแล้ว</option>
                          <option value="attending">กำลังเข้าร่วม</option>
                          <option value="passed">ผ่านการอบรม</option>
                          <option value="failed">ไม่ผ่าน</option>
                          <option value="cancelled">ยกเลิก</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onOpenEditModal(record)}
                            className="p-1.5 text-[#718096] hover:text-[#102C4C] hover:bg-[#F3F6FA] rounded-lg transition-colors cursor-pointer"
                            title="แก้ไขผลการอบรม"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          {userRole === 'admin' && (
                            <button
                              onClick={() => onDeleteRecord(record)}
                              className="p-1.5 text-[#718096] hover:text-[#D9534F] hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="ลบรายการนี้"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-4 py-3 rounded-2xl border border-[#E5EAF0] shadow-xs text-xs text-[#718096]">
          <div>
            หน้า <span className="font-mono-numbers font-semibold text-[#102C4C]">{currentPage}</span> จาก <span className="font-mono-numbers font-semibold text-[#102C4C]">{totalPages}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-[#E5EAF0] hover:bg-[#F3F6FA] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`w-7 h-7 rounded-lg font-mono-numbers font-semibold transition-colors cursor-pointer ${
                  currentPage === p
                    ? 'bg-[#102C4C] text-white'
                    : 'hover:bg-[#F3F6FA] text-[#1B2B3A]'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-[#E5EAF0] hover:bg-[#F3F6FA] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
