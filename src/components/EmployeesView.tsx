import React, { useState, useMemo } from 'react';
import { 
  Employee, 
  PositionLevel, 
  EmployeeStatus, 
  UserRole, 
  TrainingRecord, 
  TrainingCourse 
} from '../types';
import { 
  POSITION_LEVEL_LABELS, 
  EMPLOYEE_STATUS_LABELS 
} from '../data/initialRecords';
import { 
  Search, 
  PlusCircle, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Users, 
  Building2, 
  RotateCcw,
  GraduationCap,
  Award,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface EmployeesViewProps {
  employees: Employee[];
  records: TrainingRecord[];
  courses: TrainingCourse[];
  userRole: UserRole;
  onOpenAddModal: () => void;
  onOpenEditModal: (emp: Employee) => void;
  onDeleteEmployee: (emp: Employee) => void;
  onSelectEmployeeDetail: (emp: Employee) => void;
}

export const EmployeesView: React.FC<EmployeesViewProps> = ({
  employees,
  records,
  courses,
  userRole,
  onOpenAddModal,
  onOpenEditModal,
  onDeleteEmployee,
  onSelectEmployeeDetail
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Extract unique departments for dropdown
  const departments = useMemo(() => {
    const set = new Set<string>();
    employees.forEach(e => {
      if (e.department) set.add(e.department);
    });
    return Array.from(set).sort();
  }, [employees]);

  // Compute completed training hours per employee
  const employeeTrainingSummary = useMemo(() => {
    const summary: Record<string, { totalHours: number; passedCoursesCount: number }> = {};
    employees.forEach(e => {
      summary[e.id] = { totalHours: 0, passedCoursesCount: 0 };
    });

    records.forEach(r => {
      if (r.status === 'passed' && summary[r.employeeId]) {
        summary[r.employeeId].totalHours += (r.hoursCompleted || 0);
        summary[r.employeeId].passedCoursesCount += 1;
      }
    });

    return summary;
  }, [employees, records]);

  // Filtered employees
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      if (selectedDept !== 'all' && emp.department !== selectedDept) return false;
      if (selectedLevel !== 'all' && emp.positionLevel !== selectedLevel) return false;
      if (selectedStatus !== 'all' && emp.status !== selectedStatus) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const fullName = `${emp.prefix}${emp.firstName} ${emp.lastName}`.toLowerCase();
        const matchCode = emp.empCode.toLowerCase().includes(q);
        const matchName = fullName.includes(q);
        const matchPos = emp.position.toLowerCase().includes(q);
        const matchDept = emp.department.toLowerCase().includes(q);
        if (!matchCode && !matchName && !matchPos && !matchDept) return false;
      }
      return true;
    });
  }, [employees, searchQuery, selectedDept, selectedLevel, selectedStatus]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / pageSize));
  const paginatedEmployees = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredEmployees.slice(start, start + pageSize);
  }, [filteredEmployees, currentPage, pageSize]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedDept('all');
    setSelectedLevel('all');
    setSelectedStatus('all');
    setCurrentPage(1);
  };

  const hasActiveFilters = searchQuery !== '' || selectedDept !== 'all' || selectedLevel !== 'all' || selectedStatus !== 'all';

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E5EAF0] shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#718096] mb-1">
            <span>การจัดการทรัพยากรบุคคล</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-numbers">ผลลัพธ์ {filteredEmployees.length} จาก {employees.length} คน</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#102C4C] tracking-tight">
            ทะเบียนข้อมูลบุคลากร ศาลากลางจังหวัดสงขลา
          </h1>
          <p className="text-xs sm:text-sm text-[#718096] mt-1">
            ฐานข้อมูลประวัติข้าราชการ พนักงานราชการ และบุคลากรทางการบริหาร พร้อมประวัติการพัฒนาศักยภาพ
          </p>
        </div>

        {userRole === 'admin' ? (
          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#102C4C] hover:bg-[#245B91] rounded-xl shadow-xs transition-all cursor-pointer self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4 text-[#C5A45A]" />
            <span>เพิ่มบุคลากรใหม่</span>
          </button>
        ) : (
          <div className="text-xs px-3 py-1.5 bg-[#F3F6FA] text-slate-600 rounded-xl border border-[#E5EAF0]">
            โหมดเจ้าหน้าที่: สิทธิ์เรียกดูประวัติ
          </div>
        )}
      </div>

      {/* Filter and Search Panel */}
      <div className="bg-white rounded-2xl border border-[#E5EAF0] p-4 space-y-3 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
        {/* Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ค้นหาด้วยรหัสบุคลากร (เช่น SK-HR-001), ชื่อ, นามสกุล, ตำแหน่ง, หรือกลุ่มงาน..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-[#E5EAF0] bg-[#F3F6FA] focus:bg-white focus:outline-none focus:border-[#245B91] focus:ring-2 focus:ring-[#245B91]/15 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ล้าง
              </button>
            )}
          </div>
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 font-medium">
            <Filter className="w-3.5 h-3.5" />
            <span>กรองข้อมูล:</span>
          </div>

          <select
            value={selectedDept}
            onChange={(e) => {
              setSelectedDept(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 rounded-xl border border-[#E5EAF0] bg-white text-slate-700 font-medium focus:outline-none focus:border-[#245B91] cursor-pointer"
          >
            <option value="all">ทุกกลุ่มงาน / ส่วนราชการ</option>
            {departments.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <select
            value={selectedLevel}
            onChange={(e) => {
              setSelectedLevel(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 rounded-xl border border-[#E5EAF0] bg-white text-slate-700 font-medium focus:outline-none focus:border-[#245B91] cursor-pointer"
          >
            <option value="all">ทุกระดับตำแหน่ง</option>
            {Object.entries(POSITION_LEVEL_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v.labelTh}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 rounded-xl border border-[#E5EAF0] bg-white text-slate-700 font-medium focus:outline-none focus:border-[#245B91] cursor-pointer"
          >
            <option value="all">ทุกสถานะปฏิบัติงาน</option>
            {Object.entries(EMPLOYEE_STATUS_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v.labelTh}</option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[#245B91] hover:underline font-semibold cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>ล้างตัวกรอง</span>
            </button>
          )}
        </div>
      </div>

      {/* Employees Directory Table */}
      <div className="bg-white rounded-2xl border border-[#E5EAF0] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
        {filteredEmployees.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#F3F6FA] text-slate-400 mx-auto flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-[#1B2B3A]">ไม่พบบุคลากรที่ตรงกับเงื่อนไขการค้นหา</h3>
            <p className="text-xs text-[#718096] max-w-sm mx-auto">
              ลองปรับคำค้นหา หรือล้างตัวกรองกลุ่มงานเพื่อดูรายชื่อบุคลากรทั้งหมด
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#F3F6FA] text-[#718096] border-b border-[#E5EAF0] uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4 font-semibold whitespace-nowrap">รหัสบุคลากร</th>
                  <th className="py-3 px-4 font-semibold">ชื่อ - นามสกุล</th>
                  <th className="py-3 px-4 font-semibold">ตำแหน่ง / ระดับ</th>
                  <th className="py-3 px-4 font-semibold hidden md:table-cell">กลุ่มงาน / สังกัด</th>
                  <th className="py-3 px-4 font-semibold hidden lg:table-cell">วันที่เริ่มงาน</th>
                  <th className="py-3 px-4 font-semibold">ชั่วโมงอบรม (เกณฑ์ 30 ชม.)</th>
                  <th className="py-3 px-4 font-semibold">สถานะ</th>
                  <th className="py-3 px-4 font-semibold text-right">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5EAF0]">
                {paginatedEmployees.map((emp) => {
                  const statusInfo = EMPLOYEE_STATUS_LABELS[emp.status] || EMPLOYEE_STATUS_LABELS.active;
                  const levelInfo = POSITION_LEVEL_LABELS[emp.positionLevel] || { labelTh: emp.positionLevel };
                  const training = employeeTrainingSummary[emp.id] || { totalHours: 0, passedCoursesCount: 0 };
                  const targetHours = 30;
                  const progressPct = Math.min(100, Math.round((training.totalHours / targetHours) * 100));

                  return (
                    <tr 
                      key={emp.id}
                      className="hover:bg-[#F3F6FA]/70 transition-colors group"
                    >
                      {/* Code */}
                      <td className="py-3 px-4 font-mono-numbers font-bold text-[#102C4C] whitespace-nowrap">
                        <button
                          onClick={() => onSelectEmployeeDetail(emp)}
                          className="hover:underline text-left cursor-pointer"
                        >
                          {emp.empCode}
                        </button>
                      </td>

                      {/* Name */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <button
                          onClick={() => onSelectEmployeeDetail(emp)}
                          className="font-bold text-[#1B2B3A] hover:text-[#245B91] text-left transition-colors cursor-pointer flex items-center gap-2.5"
                        >
                          <div className="w-8 h-8 rounded-full bg-[#102C4C]/10 border border-[#E5EAF0] flex items-center justify-center font-bold text-xs text-[#102C4C]">
                            {emp.firstName.charAt(0)}
                          </div>
                          <div>
                            <div>{emp.prefix}{emp.firstName} {emp.lastName}</div>
                            <div className="text-[11px] text-[#718096] font-normal">{emp.email}</div>
                          </div>
                        </button>
                      </td>

                      {/* Position & Level */}
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-semibold text-[#1B2B3A] truncate" title={emp.position}>
                          {emp.position}
                        </div>
                        <div className="text-[11px] text-[#718096]">
                          ระดับ: {levelInfo.labelTh}
                        </div>
                      </td>

                      {/* Department */}
                      <td className="py-3 px-4 text-[#718096] hidden md:table-cell max-w-[200px] truncate" title={emp.department}>
                        {emp.department}
                      </td>

                      {/* Start Date */}
                      <td className="py-3 px-4 font-mono-numbers text-[#718096] hidden lg:table-cell whitespace-nowrap">
                        {emp.startDate}
                      </td>

                      {/* Training Hours Progress */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 font-mono-numbers text-xs">
                            <span className={`font-bold ${training.totalHours >= 30 ? 'text-[#23865B]' : 'text-[#1B2B3A]'}`}>
                              {training.totalHours}
                            </span>
                            <span className="text-slate-400">/ 30 ชม.</span>
                          </div>
                          <div className="w-24 bg-[#E5EAF0] rounded-full h-1.5 overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all ${
                                training.totalHours >= 30 ? 'bg-[#23865B]' : 'bg-[#D69E36]'
                              }`}
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${statusInfo.bg} ${statusInfo.color}`}>
                          {statusInfo.labelTh}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onSelectEmployeeDetail(emp)}
                            className="p-1.5 text-slate-500 hover:text-[#102C4C] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="ดูประวัติการพัฒนาบุคคล"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {userRole === 'admin' && (
                            <>
                              <button
                                onClick={() => onOpenEditModal(emp)}
                                className="p-1.5 text-slate-500 hover:text-[#102C4C] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                title="แก้ไขข้อมูลบุคลากร"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => onDeleteEmployee(emp)}
                                className="p-1.5 text-slate-400 hover:text-[#D9534F] hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                title="ลบข้อมูลบุคลากรนี้"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
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

        {/* Pagination Strip */}
        {filteredEmployees.length > pageSize && (
          <div className="px-6 py-3 border-t border-[#E5EAF0] bg-white flex items-center justify-between text-xs text-[#718096]">
            <div>
              แสดง {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, filteredEmployees.length)} จากทั้งหมด {filteredEmployees.length} คน
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-[#E5EAF0] disabled:opacity-40 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 py-1 font-mono-numbers font-semibold text-[#1B2B3A]">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-[#E5EAF0] disabled:opacity-40 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
