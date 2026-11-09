import React, { useState, useMemo } from 'react';
import { 
  TrainingCourse, 
  CourseCategory, 
  CourseStatus, 
  UserRole, 
  TrainingRecord, 
  Employee 
} from '../types';
import { COURSE_CATEGORY_LABELS } from '../data/initialRecords';
import { 
  Search, 
  PlusCircle, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  BookOpen, 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Sparkles,
  Building2,
  UserPlus
} from 'lucide-react';

interface CoursesViewProps {
  courses: TrainingCourse[];
  records: TrainingRecord[];
  employees: Employee[];
  userRole: UserRole;
  onOpenAddCourse: () => void;
  onOpenEditCourse: (course: TrainingCourse) => void;
  onDeleteCourse: (course: TrainingCourse) => void;
  onSelectCourseDetail: (course: TrainingCourse) => void;
  onEnrollAttendance: (course: TrainingCourse) => void;
}

export const CoursesView: React.FC<CoursesViewProps> = ({
  courses,
  records,
  employees,
  userRole,
  onOpenAddCourse,
  onOpenEditCourse,
  onDeleteCourse,
  onSelectCourseDetail,
  onEnrollAttendance
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = viewMode === 'grid' ? 6 : 10;

  // Compute registered and passed counts per course
  const courseStats = useMemo(() => {
    const stats: Record<string, { enrolled: number; passed: number }> = {};
    courses.forEach(c => {
      stats[c.id] = { enrolled: 0, passed: 0 };
    });

    records.forEach(r => {
      if (stats[r.courseId]) {
        stats[r.courseId].enrolled += 1;
        if (r.status === 'passed') {
          stats[r.courseId].passed += 1;
        }
      }
    });

    return stats;
  }, [courses, records]);

  // Aggregate stats for top banner
  const totalUpcoming = courses.filter(c => c.status === 'upcoming').length;
  const totalOngoing = courses.filter(c => c.status === 'ongoing').length;
  const totalCompleted = courses.filter(c => c.status === 'completed').length;
  const totalHoursOffered = courses.reduce((sum, c) => sum + (c.hours || 0), 0);

  // Filtered courses
  const filteredCourses = useMemo(() => {
    return courses.filter(c => {
      if (selectedCategory !== 'all' && c.category !== selectedCategory) return false;
      if (selectedStatus !== 'all' && c.status !== selectedStatus) return false;
      if (selectedYear !== 'all' && String(c.fiscalYear) !== selectedYear) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchCode = c.courseCode.toLowerCase().includes(q);
        const matchTitle = c.title.toLowerCase().includes(q);
        const matchOrg = c.organizer.toLowerCase().includes(q);
        const matchLoc = c.location.toLowerCase().includes(q);
        if (!matchCode && !matchTitle && !matchOrg && !matchLoc) return false;
      }
      return true;
    });
  }, [courses, searchQuery, selectedCategory, selectedStatus, selectedYear]);

  // Pagination
  const totalPages = Math.ceil(filteredCourses.length / pageSize) || 1;
  const paginatedCourses = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCourses.slice(start, start + pageSize);
  }, [filteredCourses, currentPage, pageSize]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedStatus('all');
    setSelectedYear('all');
    setCurrentPage(1);
  };

  const hasActiveFilters = searchQuery !== '' || selectedCategory !== 'all' || selectedStatus !== 'all' || selectedYear !== 'all';

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#718096] mb-1">
            <span className="font-medium">การพัฒนาและฝึกอบรม</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-numbers">ทั้งหมด {courses.length} หลักสูตร</span>
          </div>
          <h1 className="text-2xl font-bold text-[#102C4C] tracking-tight">
            หลักสูตรและโครงการพัฒนาบุคลากร (Training Programs)
          </h1>
          <p className="text-sm text-[#718096] mt-0.5">
            ทะเบียนโครงการฝึกอบรม สัมมนา และการยกระดับสมรรถนะ ศาลากลางจังหวัดสงขลา ประจำปี 2569
          </p>
        </div>

        {userRole === 'admin' && (
          <button
            onClick={onOpenAddCourse}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#102C4C] hover:bg-[#245B91] rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4 text-[#C5A45A]" />
            <span>สร้างหลักสูตรใหม่</span>
          </button>
        )}
      </div>

      {/* 4 Summary Stat Mini Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-[#E5EAF0] p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#718096]">หลักสูตรทั้งหมด</span>
            <span className="p-2 rounded-xl bg-slate-50 text-[#102C4C]">
              <BookOpen className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono-numbers text-[#102C4C]">{courses.length}</span>
            <span className="text-xs text-[#718096]">โครงการ</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5EAF0] p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#718096]">เปิดรับสมัคร / กำลังเปิด</span>
            <span className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <Sparkles className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono-numbers text-[#D69E36]">{totalUpcoming}</span>
            <span className="text-xs text-[#718096]">โครงการ</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5EAF0] p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#718096]">เสร็จสิ้นแล้ว</span>
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono-numbers text-[#23865B]">{totalCompleted}</span>
            <span className="text-xs text-[#718096]">โครงการ</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5EAF0] p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#718096]">ชั่วโมงอบรมรวมที่จัด</span>
            <span className="p-2 rounded-xl bg-blue-50 text-[#245B91]">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono-numbers text-[#102C4C]">{totalHoursOffered}</span>
            <span className="text-xs text-[#718096]">ชั่วโมง</span>
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
              placeholder="ค้นหาด้วยรหัสหลักสูตร (เช่น TR-2569-01), ชื่อโครงการ, หน่วยงานผู้จัด, หรือสถานที่..."
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

          {/* View Mode Toggle: Grid vs Table */}
          <div className="flex items-center bg-[#F3F6FA] p-1 rounded-xl border border-[#E5EAF0] shrink-0 self-end md:self-auto">
            <button
              onClick={() => { setViewMode('grid'); setCurrentPage(1); }}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-[#102C4C] shadow-xs'
                  : 'text-[#718096] hover:text-[#1B2B3A]'
              }`}
              title="มุมมองการ์ด"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">การ์ด</span>
            </button>
            <button
              onClick={() => { setViewMode('table'); setCurrentPage(1); }}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-[#102C4C] shadow-xs'
                  : 'text-[#718096] hover:text-[#1B2B3A]'
              }`}
              title="มุมมองตาราง"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">ตาราง</span>
            </button>
          </div>
        </div>

        {/* Dropdown Filters Strip */}
        <div className="flex flex-wrap items-center gap-2.5 pt-3 border-t border-[#E5EAF0] text-xs">
          <div className="flex items-center gap-1.5 text-[#718096] font-medium">
            <Filter className="w-3.5 h-3.5" />
            <span>ตัวกรอง:</span>
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
            className="px-3 py-1.5 rounded-lg border border-[#E5EAF0] bg-white text-[#1B2B3A] font-medium focus:outline-none focus:ring-1 focus:ring-[#245B91] cursor-pointer"
          >
            <option value="all">ทุกหมวดหมู่สมรรถนะ</option>
            {Object.entries(COURSE_CATEGORY_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v.labelTh}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
            className="px-3 py-1.5 rounded-lg border border-[#E5EAF0] bg-white text-[#1B2B3A] font-medium focus:outline-none focus:ring-1 focus:ring-[#245B91] cursor-pointer"
          >
            <option value="all">ทุกสถานะการจัด</option>
            <option value="upcoming">เตรียมการ / เปิดรับสมัคร</option>
            <option value="ongoing">อยู่ระหว่างจัดอบรม</option>
            <option value="completed">เสร็จสิ้นแล้ว</option>
            <option value="cancelled">ยกเลิก / เลื่อนการจัด</option>
          </select>

          <select
            value={selectedYear}
            onChange={(e) => { setSelectedYear(e.target.value); setCurrentPage(1); }}
            className="px-3 py-1.5 rounded-lg border border-[#E5EAF0] bg-white text-[#1B2B3A] font-medium focus:outline-none focus:ring-1 focus:ring-[#245B91] cursor-pointer"
          >
            <option value="all">ทุกปีงบประมาณ</option>
            <option value="2569">ปีงบประมาณ 2569</option>
            <option value="2568">ปีงบประมาณ 2568</option>
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
            แสดง <span className="font-mono-numbers font-semibold text-[#102C4C]">{filteredCourses.length}</span> จาก {courses.length} หลักสูตร
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedCourses.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E5EAF0] p-12 text-center col-span-full space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#F3F6FA] text-[#718096] mx-auto flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-[#102C4C]">ไม่พบหลักสูตรที่ตรงกับเงื่อนไข</h3>
              <p className="text-xs text-[#718096] max-w-sm mx-auto">
                ลองปรับคำค้นหา หรือล้างตัวกรองเพื่อดูโครงการพัฒนาทั้งหมด
              </p>
            </div>
          ) : (
            paginatedCourses.map((course) => {
              const cat = COURSE_CATEGORY_LABELS[course.category] || { labelTh: course.category, color: '' };
              const stats = courseStats[course.id] || { enrolled: 0, passed: 0 };
              
              const isCompleted = course.status === 'completed';
              const isUpcoming = course.status === 'upcoming';
              const isOngoing = course.status === 'ongoing';

              return (
                <div
                  key={course.id}
                  className="bg-white rounded-2xl border border-[#E5EAF0] hover:border-[#245B91]/40 hover:shadow-xs p-5 transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    {/* Top Bar: Code, Category & Status */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono-numbers font-bold text-xs bg-[#F3F6FA] px-2.5 py-1 rounded-lg text-[#102C4C] border border-[#E5EAF0]">
                          {course.courseCode}
                        </span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${cat.color}`}>
                          {cat.labelTh}
                        </span>
                      </div>

                      <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                        isCompleted ? 'bg-emerald-50 text-[#23865B] border-emerald-200' :
                        isOngoing ? 'bg-sky-50 text-[#245B91] border-sky-200' :
                        isUpcoming ? 'bg-amber-50 text-[#D69E36] border-amber-200' :
                        'bg-slate-50 text-slate-600 border-slate-200'
                      }`}>
                        {isCompleted ? 'เสร็จสิ้นแล้ว' : isOngoing ? 'กำลังดำเนินการ' : isUpcoming ? 'เปิดรับสมัคร' : 'ยกเลิก'}
                      </span>
                    </div>

                    {/* Title & Objective */}
                    <div>
                      <h3 
                        onClick={() => onSelectCourseDetail(course)}
                        className="font-bold text-[#102C4C] text-sm sm:text-base group-hover:text-[#245B91] transition-colors cursor-pointer leading-snug line-clamp-2"
                      >
                        {course.title}
                      </h3>
                      <p className="text-xs text-[#718096] mt-1.5 line-clamp-2 leading-relaxed">
                        {course.objective}
                      </p>
                    </div>

                    {/* Metadata Box */}
                    <div className="grid grid-cols-2 gap-2 p-3 bg-[#F3F6FA] rounded-xl text-xs text-[#718096] border border-[#E5EAF0]">
                      <div className="flex items-center gap-1.5 font-mono-numbers">
                        <Calendar className="w-3.5 h-3.5 text-[#245B91]" />
                        <span className="text-[#1B2B3A] truncate">{course.startDate}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono-numbers">
                        <Clock className="w-3.5 h-3.5 text-[#C5A45A]" />
                        <span className="text-[#1B2B3A] font-semibold">{course.hours} ชม.</span>
                      </div>
                      <div className="flex items-center gap-1.5 col-span-2 truncate" title={course.location}>
                        <MapPin className="w-3.5 h-3.5 text-[#718096] shrink-0" />
                        <span className="truncate text-[#1B2B3A]">{course.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Strip & Actions */}
                  <div className="pt-3 border-t border-[#E5EAF0] flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 text-[#718096]">
                      <Users className="w-3.5 h-3.5 text-[#718096]" />
                      <span className="font-mono-numbers font-bold text-[#102C4C]">{stats.enrolled}</span>
                      <span>/ {course.maxAttendees} คน</span>
                      {isCompleted && (
                        <span className="text-[#23865B] font-medium text-[11px]">
                          (ผ่าน {stats.passed})
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEnrollAttendance(course)}
                        className="px-2.5 py-1 text-xs font-semibold text-[#102C4C] bg-amber-50 hover:bg-amber-100/80 rounded-lg border border-amber-200/80 transition-colors cursor-pointer flex items-center gap-1"
                        title="ลงทะเบียนบุคลากรเข้าหลักสูตร"
                      >
                        <UserPlus className="w-3 h-3 text-[#C5A45A]" />
                        <span>ลงทะเบียน</span>
                      </button>

                      <button
                        onClick={() => onSelectCourseDetail(course)}
                        className="p-1.5 text-[#718096] hover:text-[#102C4C] hover:bg-[#F3F6FA] rounded-lg transition-colors cursor-pointer"
                        title="ดูรายละเอียดหลักสูตร"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {userRole === 'admin' && (
                        <>
                          <button
                            onClick={() => onOpenEditCourse(course)}
                            className="p-1.5 text-[#718096] hover:text-[#102C4C] hover:bg-[#F3F6FA] rounded-lg transition-colors cursor-pointer"
                            title="แก้ไขหลักสูตร"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteCourse(course)}
                            className="p-1.5 text-[#718096] hover:text-[#D9534F] hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="ลบหลักสูตร"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl border border-[#E5EAF0] overflow-hidden shadow-xs">
          {paginatedCourses.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#F3F6FA] text-[#718096] mx-auto flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-[#102C4C]">ไม่พบหลักสูตรที่ตรงกับเงื่อนไข</h3>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#F3F6FA] text-[#718096] border-b border-[#E5EAF0] uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4 font-semibold">รหัสหลักสูตร</th>
                    <th className="py-3 px-4 font-semibold">ชื่อหลักสูตร / โครงการ</th>
                    <th className="py-3 px-4 font-semibold">หมวดหมู่สมรรถนะ</th>
                    <th className="py-3 px-4 font-semibold">วันที่จัดอบรม</th>
                    <th className="py-3 px-4 font-semibold text-center">ชั่วโมง</th>
                    <th className="py-3 px-4 font-semibold text-center">ผู้เข้าร่วม</th>
                    <th className="py-3 px-4 font-semibold">สถานะ</th>
                    <th className="py-3 px-4 font-semibold text-right">การจัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5EAF0]">
                  {paginatedCourses.map((course) => {
                    const cat = COURSE_CATEGORY_LABELS[course.category] || { labelTh: course.category, color: '' };
                    const stats = courseStats[course.id] || { enrolled: 0, passed: 0 };
                    const isCompleted = course.status === 'completed';

                    return (
                      <tr key={course.id} className="hover:bg-[#F3F6FA]/70 transition-colors group">
                        <td className="py-3 px-4 whitespace-nowrap font-mono-numbers font-bold text-[#102C4C]">
                          {course.courseCode}
                        </td>
                        <td className="py-3 px-4 max-w-sm">
                          <button
                            onClick={() => onSelectCourseDetail(course)}
                            className="font-bold text-[#102C4C] hover:text-[#245B91] text-left transition-colors cursor-pointer block truncate"
                            title={course.title}
                          >
                            {course.title}
                          </button>
                          <div className="text-[11px] text-[#718096] truncate mt-0.5">
                            {course.organizer}
                          </div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${cat.color}`}>
                            {cat.labelTh}
                          </span>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap font-mono-numbers text-[#1B2B3A]">
                          {course.startDate}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap font-mono-numbers text-center font-bold text-[#102C4C]">
                          {course.hours} ชม.
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-center font-mono-numbers">
                          <span className="font-semibold text-[#102C4C]">{stats.enrolled}</span>
                          <span className="text-[#718096]"> / {course.maxAttendees}</span>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                            isCompleted ? 'bg-emerald-50 text-[#23865B] border-emerald-200' :
                            course.status === 'ongoing' ? 'bg-sky-50 text-[#245B91] border-sky-200' :
                            course.status === 'upcoming' ? 'bg-amber-50 text-[#D69E36] border-amber-200' :
                            'bg-slate-50 text-slate-600 border-slate-200'
                          }`}>
                            {isCompleted ? 'เสร็จสิ้นแล้ว' : course.status === 'ongoing' ? 'กำลังดำเนินการ' : course.status === 'upcoming' ? 'เปิดรับสมัคร' : 'ยกเลิก'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => onEnrollAttendance(course)}
                              className="px-2 py-1 text-xs font-semibold text-[#102C4C] bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200/80 transition-colors cursor-pointer"
                              title="ลงทะเบียนบุคลากร"
                            >
                              + ลงทะเบียน
                            </button>
                            <button
                              onClick={() => onSelectCourseDetail(course)}
                              className="p-1.5 text-[#718096] hover:text-[#102C4C] hover:bg-[#F3F6FA] rounded-lg transition-colors cursor-pointer"
                              title="ดูรายละเอียด"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            {userRole === 'admin' && (
                              <>
                                <button
                                  onClick={() => onOpenEditCourse(course)}
                                  className="p-1.5 text-[#718096] hover:text-[#102C4C] hover:bg-[#F3F6FA] rounded-lg transition-colors cursor-pointer"
                                  title="แก้ไข"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => onDeleteCourse(course)}
                                  className="p-1.5 text-[#718096] hover:text-[#D9534F] hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                  title="ลบ"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
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
        </div>
      )}

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
