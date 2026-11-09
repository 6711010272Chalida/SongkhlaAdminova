import React, { useState } from 'react';
import { 
  DocumentItem, 
  DocumentCategory, 
  TrainingCourse, 
  Employee 
} from '../types';
import { DOCUMENT_CATEGORY_LABELS } from '../data/initialRecords';
import { X, Check, Upload, FolderArchive } from 'lucide-react';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (doc: DocumentItem) => void;
  courses: TrainingCourse[];
  employees: Employee[];
}

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  onSave,
  courses,
  employees
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DocumentCategory>('certificate');
  const [fileType, setFileType] = useState<'pdf' | 'docx' | 'jpg' | 'jpeg' | 'png'>('pdf');
  const [fileSize, setFileSize] = useState('2.4 MB');
  const [courseId, setCourseId] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('กรุณาระบุชื่อเอกสาร');
      return;
    }

    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      title: title.trim(),
      category,
      fileType,
      fileSize,
      courseId: courseId || undefined,
      employeeId: employeeId || undefined,
      uploadDate: new Date().toISOString().split('T')[0],
      uploadedBy: 'ฝ่ายทรัพยากรบุคคล',
      notes: notes.trim()
    };

    onSave(newDoc);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1F36]/60 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-[#E5EAF0] my-8 overflow-hidden transition-all text-[#1B2B3A]"
        role="dialog"
        aria-modal="true"
      >
        <div className="px-6 py-4 bg-[#102C4C] text-white flex items-center justify-between border-b border-[#1B2B3A]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-[#C5A45A]">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold leading-tight">อัปโหลดเอกสารและหลักฐาน</h3>
              <p className="text-xs text-slate-300">จัดเก็บวุฒิบัตร เอกสารโครงการ หรือสื่อการอบรม</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#102C4C] mb-1">
              ชื่อเอกสาร / โครงการ <span className="text-[#D9534F]">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="เช่น วุฒิบัตรผ่านการอบรมทักษะดิจิทัล..."
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E5EAF0] focus:outline-none focus:ring-2 focus:ring-[#245B91]/30 focus:border-[#245B91]"
            />
            {error && <p className="text-xs text-[#D9534F] mt-1">{error}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#102C4C] mb-1">
                หมวดหมู่เอกสาร
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as DocumentCategory)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E5EAF0] bg-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#245B91]"
              >
                {Object.entries(DOCUMENT_CATEGORY_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v.labelTh}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102C4C] mb-1">
                นามสกุลไฟล์
              </label>
              <select
                value={fileType}
                onChange={(e) => setFileType(e.target.value as any)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E5EAF0] bg-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#245B91]"
              >
                <option value="pdf">PDF Document (.pdf)</option>
                <option value="docx">Word Document (.docx)</option>
                <option value="jpg">Image JPEG (.jpg)</option>
                <option value="png">Image PNG (.png)</option>
              </select>
            </div>
          </div>

          {/* Linked Course */}
          <div>
            <label className="block text-xs font-semibold text-[#102C4C] mb-1">
              เชื่อมโยงกับหลักสูตร (ถ้ามี)
            </label>
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E5EAF0] bg-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#245B91]"
            >
              <option value="">-- ไม่เชื่อมโยงหลักสูตร --</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.courseCode} - {c.title}</option>
              ))}
            </select>
          </div>

          {/* Linked Employee */}
          <div>
            <label className="block text-xs font-semibold text-[#102C4C] mb-1">
              เชื่อมโยงกับบุคลากร (ถ้ามี)
            </label>
            <select
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E5EAF0] bg-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#245B91]"
            >
              <option value="">-- ไม่เชื่อมโยงบุคลากร --</option>
              {employees.map(e => (
                <option key={e.id} value={e.id}>
                  {e.empCode} {e.prefix}{e.firstName} {e.lastName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#102C4C] mb-1">
              คำอธิบาย / หมายเหตุ
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="ระบุรายละเอียดเพิ่มเติม..."
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E5EAF0] focus:outline-none focus:ring-2 focus:ring-[#245B91]/30 focus:border-[#245B91]"
            />
          </div>

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
              <span>บันทึกเอกสาร</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
