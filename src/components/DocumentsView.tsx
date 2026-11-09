import React, { useState, useMemo } from 'react';
import { 
  DocumentItem, 
  DocumentCategory, 
  UserRole, 
  TrainingCourse, 
  Employee 
} from '../types';
import { DOCUMENT_CATEGORY_LABELS } from '../data/initialRecords';
import { 
  FolderArchive, 
  Search, 
  PlusCircle, 
  Filter, 
  FileText, 
  File, 
  Image, 
  Download, 
  Trash2, 
  Eye, 
  RotateCcw,
  Cloud,
  CheckCircle2,
  Calendar,
  User,
  BookOpen,
  FolderOpen,
  Sparkles
} from 'lucide-react';

interface DocumentsViewProps {
  documents: DocumentItem[];
  courses: TrainingCourse[];
  employees: Employee[];
  userRole: UserRole;
  onOpenUploadModal: () => void;
  onDeleteDocument: (doc: DocumentItem) => void;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  documents,
  courses,
  employees,
  userRole,
  onOpenUploadModal,
  onDeleteDocument
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFileType, setSelectedFileType] = useState<string>('all');

  const courseMap = useMemo(() => {
    const map: Record<string, TrainingCourse> = {};
    courses.forEach(c => { map[c.id] = c; });
    return map;
  }, [courses]);

  const employeeMap = useMemo(() => {
    const map: Record<string, Employee> = {};
    employees.forEach(e => { map[e.id] = e; });
    return map;
  }, [employees]);

  const filteredDocs = useMemo(() => {
    return documents.filter(doc => {
      if (selectedCategory !== 'all' && doc.category !== selectedCategory) return false;
      if (selectedFileType !== 'all' && doc.fileType !== selectedFileType) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = doc.title.toLowerCase().includes(q);
        const matchUploader = doc.uploadedBy.toLowerCase().includes(q);
        const matchNotes = (doc.notes || '').toLowerCase().includes(q);
        if (!matchTitle && !matchUploader && !matchNotes) return false;
      }
      return true;
    });
  }, [documents, selectedCategory, selectedFileType, searchQuery]);

  const handleSimulatedDownload = (doc: DocumentItem) => {
    const content = `เอกสารจำลองระบบ SONGKHLA HRD\nชื่อเอกสาร: ${doc.title}\nหมวดหมู่: ${DOCUMENT_CATEGORY_LABELS[doc.category]?.labelTh || doc.category}\nวันที่อัปโหลด: ${doc.uploadDate}\nผู้บันทึก: ${doc.uploadedBy}\nหมายเหตุ: เพื่อการศึกษาและสาธิตนวัตกรรม ศาลากลางจังหวัดสงขลา`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${doc.title}.${doc.fileType}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedFileType('all');
  };

  const hasActiveFilters = searchQuery !== '' || selectedCategory !== 'all' || selectedFileType !== 'all';

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#718096] mb-1">
            <span className="font-medium">คลังข้อมูลและเอกสารหลักฐาน</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-numbers">ทั้งหมด {documents.length} รายการ</span>
          </div>
          <h1 className="text-2xl font-bold text-[#102C4C] tracking-tight">
            คลังเอกสารและหลักฐานการพัฒนา (Evidence Repository)
          </h1>
          <p className="text-sm text-[#718096] mt-0.5">
            จัดเก็บวุฒิบัตร เอกสารบรรยาย โครงการอนุมัติ และบันทึกประเมินผลสำหรับรอบการตรวจราชการ
          </p>
        </div>

        <button
          onClick={onOpenUploadModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#102C4C] hover:bg-[#245B91] rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 text-[#C5A45A]" />
          <span>อัปโหลดเอกสารใหม่</span>
        </button>
      </div>

      {/* Cloud Storage Readiness Banner */}
      <div className="p-4 bg-white border border-[#E5EAF0] rounded-2xl text-xs text-[#1B2B3A] shadow-xs flex items-start gap-3.5">
        <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#245B91] flex items-center justify-center shrink-0 mt-0.5">
          <Cloud className="w-4 h-4" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#102C4C]">สถาปัตยกรรมจัดเก็บเอกสาร (Cloud Storage Architecture Ready):</span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-[#23865B] border border-emerald-200">
              พร้อมใช้งานจริง
            </span>
          </div>
          <p className="text-[#718096] leading-relaxed text-[11px]">
            ระบบนี้จำลองการจัดเก็บเอกสารระดับเบราว์เซอร์ พร้อมแยก Data Adapter สำหรับเชื่อมต่อ Google Cloud Storage หรือ Firebase Storage ในระดับการใช้งานจริงของฝ่ายทรัพยากรบุคคล ศาลากลางจังหวัดสงขลา
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-[#E5EAF0] p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#718096] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ค้นหาชื่อเอกสาร, ผู้บันทึก, หรือหมายเหตุประกอบ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-[#E5EAF0] bg-white text-[#1B2B3A] font-medium focus:outline-none focus:ring-1 focus:ring-[#245B91] cursor-pointer"
          >
            <option value="all">ทุกหมวดหมู่เอกสาร</option>
            {Object.entries(DOCUMENT_CATEGORY_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v.labelTh}</option>
            ))}
          </select>

          <select
            value={selectedFileType}
            onChange={(e) => setSelectedFileType(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-[#E5EAF0] bg-white text-[#1B2B3A] font-medium focus:outline-none focus:ring-1 focus:ring-[#245B91] cursor-pointer"
          >
            <option value="all">ทุกนามสกุลไฟล์</option>
            <option value="pdf">PDF Document (.pdf)</option>
            <option value="docx">Word Document (.docx)</option>
            <option value="jpg">Image JPEG (.jpg / .jpeg)</option>
            <option value="png">Image PNG (.png)</option>
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
            แสดง <span className="font-mono-numbers font-semibold text-[#102C4C]">{filteredDocs.length}</span> จาก {documents.length} รายการ
          </div>
        </div>
      </div>

      {/* Documents Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E5EAF0] p-12 text-center col-span-full space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#F3F6FA] text-[#718096] mx-auto flex items-center justify-center">
              <FolderOpen className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-[#102C4C]">ไม่พบเอกสารที่ตรงกับเงื่อนไข</h3>
            <p className="text-xs text-[#718096] max-w-sm mx-auto">
              ลองปรับคำค้นหา หรือกดปุ่ม "อัปโหลดเอกสารใหม่" เพื่อจัดเก็บไฟล์
            </p>
          </div>
        ) : (
          filteredDocs.map((doc) => {
            const cat = DOCUMENT_CATEGORY_LABELS[doc.category] || { labelTh: doc.category, labelEn: '' };
            const crs = doc.courseId ? courseMap[doc.courseId] : null;
            const emp = doc.employeeId ? employeeMap[doc.employeeId] : null;

            return (
              <div 
                key={doc.id}
                className="bg-white rounded-2xl border border-[#E5EAF0] p-5 hover:border-[#245B91]/40 hover:shadow-xs transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-[#F3F6FA] text-[#102C4C] border border-[#E5EAF0] font-mono-numbers">
                      {doc.fileType.toUpperCase()} · {doc.fileSize}
                    </span>
                    <span className="text-[11px] text-[#718096] font-mono-numbers">
                      {doc.uploadDate}
                    </span>
                  </div>

                  <h3 className="font-bold text-[#102C4C] text-sm group-hover:text-[#245B91] transition-colors line-clamp-2 leading-snug">
                    {doc.title}
                  </h3>

                  <div className="text-[11px] text-[#718096] space-y-1.5 p-3 bg-[#F3F6FA] rounded-xl border border-[#E5EAF0]">
                    <div className="flex items-center justify-between">
                      <span>หมวดหมู่:</span>
                      <span className="font-semibold text-[#102C4C]">{cat.labelTh}</span>
                    </div>
                    {crs && (
                      <div className="truncate text-[#C5A45A] font-medium" title={`${crs.courseCode} ${crs.title}`}>
                        หลักสูตร: {crs.courseCode} {crs.title}
                      </div>
                    )}
                    {emp && (
                      <div className="truncate text-[#1B2B3A]">
                        บุคลากร: {emp.prefix}{emp.firstName} {emp.lastName}
                      </div>
                    )}
                    {doc.notes && (
                      <p className="text-[#718096] italic line-clamp-1 border-t border-[#E5EAF0] pt-1 mt-1">
                        {doc.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E5EAF0] flex items-center justify-between text-xs">
                  <span className="text-[11px] text-[#718096] truncate max-w-[130px]">
                    โดย: {doc.uploadedBy.split(' ')[0]}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleSimulatedDownload(doc)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#102C4C] text-white hover:bg-[#245B91] transition-colors cursor-pointer text-xs font-semibold shadow-xs"
                      title="ดาวน์โหลดไฟล์ตัวอย่าง"
                    >
                      <Download className="w-3.5 h-3.5 text-[#C5A45A]" />
                      <span>ดาวน์โหลด</span>
                    </button>
                    {userRole === 'admin' && (
                      <button
                        onClick={() => onDeleteDocument(doc)}
                        className="p-1.5 text-[#718096] hover:text-[#D9534F] hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="ลบเอกสาร"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
