/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useTransition } from 'react';
import { 
  Employee, 
  TrainingCourse, 
  TrainingRecord, 
  DocumentItem, 
  AuditLog, 
  ActiveTab, 
  UserRole, 
  SystemMode, 
  AttendanceStatus 
} from './types';
import { 
  loadStoredData, 
  saveStoredData, 
  resetDemoData 
} from './data/initialRecords';

import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { EmployeesView } from './components/EmployeesView';
import { CoursesView } from './components/CoursesView';
import { AttendanceView } from './components/AttendanceView';
import { DevelopmentPassportView } from './components/DevelopmentPassportView';
import { DocumentsView } from './components/DocumentsView';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';

import { EmployeeModal } from './components/EmployeeModal';
import { EmployeeDetailModal } from './components/EmployeeDetailModal';
import { CourseModal } from './components/CourseModal';
import { CourseDetailModal } from './components/CourseDetailModal';
import { AttendanceModal } from './components/AttendanceModal';
import { DocumentUploadModal } from './components/DocumentUploadModal';
import { ConfirmModal } from './components/ConfirmModal';
import { Toast, ToastMessage } from './components/Toast';

export default function App() {
  const [systemMode, setSystemMode] = useState<SystemMode>('demo');
  const [userRole, setUserRole] = useState<UserRole>('admin');
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [isPending, startTransition] = useTransition();

  // Core Data Collections
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [courses, setCourses] = useState<TrainingCourse[]>([]);
  const [records, setRecords] = useState<TrainingRecord[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);

  // Selected for Passport view
  const [selectedPassportEmpId, setSelectedPassportEmpId] = useState<string>('');

  // Modals state
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const [isEmployeeDetailOpen, setIsEmployeeDetailOpen] = useState(false);
  const [detailEmployee, setDetailEmployee] = useState<Employee | null>(null);

  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<TrainingCourse | null>(null);

  const [isCourseDetailOpen, setIsCourseDetailOpen] = useState(false);
  const [detailCourse, setDetailCourse] = useState<TrainingCourse | null>(null);

  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<TrainingRecord | null>(null);
  const [defaultEnrollCourseId, setDefaultEnrollCourseId] = useState<string | undefined>();
  const [defaultEnrollEmployeeId, setDefaultEnrollEmployeeId] = useState<string | undefined>();

  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Generic Delete Confirmation Modal
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    type: 'employee' | 'course' | 'record' | 'document';
    targetId: string;
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: 'employee',
    targetId: '',
    title: '',
    message: ''
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Helper to add audit log
  const logAction = (
    action: AuditLog['action'],
    targetType: AuditLog['targetType'],
    targetId: string,
    details: string
  ) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userName: userRole === 'admin' ? 'นายสมเกียรติ พัฒนศิริ (ผู้ดูแลระบบ)' : 'นางสาวกานดา สงขลารักษ์ (เจ้าหน้าที่)',
      userRole,
      action,
      targetType,
      targetId,
      details
    };
    setLogs(prev => [newLog, ...prev.slice(0, 49)]);
  };

  // Initial load
  useEffect(() => {
    const loaded = loadStoredData();
    setSystemMode(loaded.mode);
    setUserRole(loaded.role);
    setEmployees(loaded.employees);
    setCourses(loaded.courses);
    setRecords(loaded.records);
    setDocuments(loaded.documents);
    setLogs(loaded.logs);
  }, []);

  // Save changes to storage whenever collections change
  useEffect(() => {
    if (employees.length > 0 || courses.length > 0 || systemMode === 'real') {
      saveStoredData({
        mode: systemMode,
        role: userRole,
        employees,
        courses,
        records,
        documents,
        logs
      });
    }
  }, [systemMode, userRole, employees, courses, records, documents, logs]);

  // Mode Switcher Handler
  const handleToggleMode = (newMode: SystemMode) => {
    if (newMode === systemMode) return;
    setSystemMode(newMode);
    if (newMode === 'real') {
      // Load real empty state or stored real
      const loaded = loadStoredData();
      setEmployees(loaded.employees);
      setCourses(loaded.courses);
      setRecords(loaded.records);
      setDocuments(loaded.documents);
      addToast('สลับเข้าสู่โหมดใช้งานจริง (Real Mode)', 'info');
    } else {
      const reset = resetDemoData();
      setEmployees(reset.employees);
      setCourses(reset.courses);
      setRecords(reset.records);
      setDocuments(reset.documents);
      setLogs(reset.logs);
      addToast('สลับเข้าสู่โหมดสาธิต (Demo Mode)', 'info');
    }
  };

  // Reset Demo Data
  const handleResetConfirmed = () => {
    const reset = resetDemoData();
    setSystemMode('demo');
    setEmployees(reset.employees);
    setCourses(reset.courses);
    setRecords(reset.records);
    setDocuments(reset.documents);
    setLogs(reset.logs);
    setIsResetConfirmOpen(false);
    addToast('คืนค่าชุดข้อมูลตัวอย่างเริ่มต้น 100% เรียบร้อยแล้ว', 'info');
  };

  // 1. Employee Handlers
  const handleSaveEmployee = (emp: Employee) => {
    setEmployees(prev => {
      const exists = prev.some(e => e.id === emp.id);
      if (exists) {
        logAction('update', 'employee', emp.id, `แก้ไขข้อมูลบุคลากร: ${emp.prefix}${emp.firstName} ${emp.lastName}`);
        return prev.map(e => e.id === emp.id ? emp : e);
      } else {
        logAction('create', 'employee', emp.id, `เพิ่มบุคลากรใหม่: ${emp.prefix}${emp.firstName} ${emp.lastName}`);
        return [emp, ...prev];
      }
    });
    setIsEmployeeModalOpen(false);
    setEditingEmployee(null);
    addToast(editingEmployee ? `อัปเดตข้อมูล ${emp.prefix}${emp.firstName} สำเร็จ` : `เพิ่มบุคลากร ${emp.empCode} สำเร็จ`);
  };

  const handleDeleteEmployee = (emp: Employee) => {
    setDeleteConfirm({
      isOpen: true,
      type: 'employee',
      targetId: emp.id,
      title: 'ยืนยันการลบข้อมูลบุคลากร?',
      message: `คุณต้องการลบข้อมูลของ ${emp.prefix}${emp.firstName} ${emp.lastName} (${emp.empCode}) ออกจากระบบใช่หรือไม่?`
    });
  };

  // 2. Course Handlers
  const handleSaveCourse = (course: TrainingCourse) => {
    setCourses(prev => {
      const exists = prev.some(c => c.id === course.id);
      if (exists) {
        logAction('update', 'course', course.id, `ปรับปรุงหลักสูตร: ${course.courseCode} ${course.title}`);
        return prev.map(c => c.id === course.id ? course : c);
      } else {
        logAction('create', 'course', course.id, `สร้างหลักสูตรใหม่: ${course.courseCode} ${course.title}`);
        return [course, ...prev];
      }
    });
    setIsCourseModalOpen(false);
    setEditingCourse(null);
    addToast(editingCourse ? `แก้ไขหลักสูตร ${course.courseCode} สำเร็จ` : `สร้างหลักสูตร ${course.courseCode} สำเร็จ`);
  };

  const handleDeleteCourse = (course: TrainingCourse) => {
    setDeleteConfirm({
      isOpen: true,
      type: 'course',
      targetId: course.id,
      title: 'ยืนยันการลบหลักสูตรฝึกอบรม?',
      message: `คุณต้องการลบหลักสูตร "${course.courseCode} ${course.title}" ออกจากระบบใช่หรือไม่?`
    });
  };

  // 3. Attendance Handlers
  const handleSaveAttendance = (record: TrainingRecord) => {
    setRecords(prev => {
      const exists = prev.some(r => r.id === record.id);
      if (exists) {
        logAction('update', 'attendance', record.id, `ปรับปรุงผลการอบรมของบุคลากร`);
        return prev.map(r => r.id === record.id ? record : r);
      } else {
        logAction('create', 'attendance', record.id, `บันทึกการเข้าร่วมอบรมใหม่`);
        return [record, ...prev];
      }
    });
    setIsAttendanceModalOpen(false);
    setEditingRecord(null);
    setDefaultEnrollCourseId(undefined);
    setDefaultEnrollEmployeeId(undefined);
    addToast('บันทึกผลการเข้าร่วมฝึกอบรมเรียบร้อยแล้ว');
  };

  const handleQuickAttendanceStatusChange = (recordId: string, status: AttendanceStatus) => {
    setRecords(prev =>
      prev.map(r => {
        if (r.id === recordId) {
          const matchedCourse = courses.find(c => c.id === r.courseId);
          const hours = status === 'passed' ? (matchedCourse ? matchedCourse.hours : 12) : 0;
          return {
            ...r,
            status,
            hoursCompleted: hours,
            updatedAt: new Date().toISOString()
          };
        }
        return r;
      })
    );
    logAction('status_change', 'attendance', recordId, `เปลี่ยนสถานะการเข้าร่วมเป็น: ${status}`);
    addToast('อัปเดตสถานะการเข้าร่วมเรียบร้อย');
  };

  const handleDeleteRecord = (record: TrainingRecord) => {
    setDeleteConfirm({
      isOpen: true,
      type: 'record',
      targetId: record.id,
      title: 'ยืนยันการลบบันทึกการเข้าร่วม?',
      message: `คุณต้องการลบรายการเข้าร่วมอบรมนี้ใช่หรือไม่?`
    });
  };

  // 4. Document Handlers
  const handleSaveDocument = (doc: DocumentItem) => {
    setDocuments(prev => [doc, ...prev]);
    logAction('create', 'document', doc.id, `อัปโหลดเอกสารใหม่: ${doc.title}`);
    addToast(`อัปโหลดเอกสาร ${doc.title} สำเร็จ`);
  };

  const handleDeleteDocument = (doc: DocumentItem) => {
    setDeleteConfirm({
      isOpen: true,
      type: 'document',
      targetId: doc.id,
      title: 'ยืนยันการลบเอกสารหลักฐาน?',
      message: `คุณต้องการลบเอกสาร "${doc.title}" ออกจากคลังใช่หรือไม่?`
    });
  };

  // Generic Confirm Action
  const executeDelete = () => {
    const { type, targetId } = deleteConfirm;
    if (type === 'employee') {
      setEmployees(prev => prev.filter(e => e.id !== targetId));
      setRecords(prev => prev.filter(r => r.employeeId !== targetId));
      logAction('delete', 'employee', targetId, 'ลบข้อมูลบุคลากรออกจากระบบ');
      addToast('ลบข้อมูลบุคลากรเรียบร้อยแล้ว', 'info');
    } else if (type === 'course') {
      setCourses(prev => prev.filter(c => c.id !== targetId));
      logAction('delete', 'course', targetId, 'ลบหลักสูตรฝึกอบรม');
      addToast('ลบหลักสูตรเรียบร้อยแล้ว', 'info');
    } else if (type === 'record') {
      setRecords(prev => prev.filter(r => r.id !== targetId));
      logAction('delete', 'attendance', targetId, 'ลบบันทึกการเข้าร่วม');
      addToast('ลบประวัติการอบรมเรียบร้อยแล้ว', 'info');
    } else if (type === 'document') {
      setDocuments(prev => prev.filter(d => d.id !== targetId));
      logAction('delete', 'document', targetId, 'ลบเอกสารออกจากคลัง');
      addToast('ลบเอกสารเรียบร้อยแล้ว', 'info');
    }
    setDeleteConfirm(prev => ({ ...prev, isOpen: false }));
  };

  // Import JSON Backup handler
  const handleImportData = (imported: any) => {
    if (imported.employees) setEmployees(imported.employees);
    if (imported.courses) setCourses(imported.courses);
    if (imported.records) setRecords(imported.records);
    if (imported.documents) setDocuments(imported.documents);
    addToast('นำเข้าและปรับปรุงฐานข้อมูลเรียบร้อยแล้ว', 'success');
  };

  // Counts for Badges
  const passedRecordsCount = records.filter(r => r.status === 'passed').length;
  const upcomingCoursesCount = courses.filter(c => c.status === 'upcoming').length;

  return (
    <div className="min-h-screen bg-[#F3F6FA] text-[#1B2B3A] flex flex-col font-sans">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => {
          startTransition(() => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          });
        }}
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        userRole={userRole}
        onRoleChange={setUserRole}
        systemMode={systemMode}
        onToggleMode={handleToggleMode}
        onOpenQuickAction={(action) => {
          if (action === 'employee') {
            setEditingEmployee(null);
            setIsEmployeeModalOpen(true);
          } else if (action === 'course') {
            setEditingCourse(null);
            setIsCourseModalOpen(true);
          } else if (action === 'attendance') {
            setEditingRecord(null);
            setDefaultEnrollCourseId(undefined);
            setDefaultEnrollEmployeeId(undefined);
            setIsAttendanceModalOpen(true);
          }
        }}
        onOpenResetConfirm={() => setIsResetConfirmOpen(true)}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        totalEmployees={employees.length}
        upcomingCoursesCount={upcomingCoursesCount}
        globalSearch={globalSearch}
        onGlobalSearchChange={setGlobalSearch}
      />

      {/* Main Workspace with Sidebar & Content Viewport */}
      <div className="flex-1 flex w-full">
        {/* Desktop Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={(tab) => {
            startTransition(() => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            });
          }}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          userRole={userRole}
          systemMode={systemMode}
          totalEmployees={employees.length}
          totalCourses={courses.length}
          totalRecords={records.length}
          passedRecords={passedRecordsCount}
          documentsCount={documents.length}
        />

        {/* Viewport Content Area */}
        <main className="flex-1 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 overflow-y-auto w-full min-w-0">
          {activeTab === 'dashboard' && (
            <DashboardView
              employees={employees}
              courses={courses}
              records={records}
              logs={logs}
              userRole={userRole}
              onNavigateTab={(tab) => {
                startTransition(() => {
                  setActiveTab(tab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                });
              }}
              onOpenQuickAction={(action) => {
                if (action === 'attendance') {
                  setEditingRecord(null);
                  setIsAttendanceModalOpen(true);
                } else if (action === 'employee') {
                  setEditingEmployee(null);
                  setIsEmployeeModalOpen(true);
                }
              }}
              onSelectEmployee={(emp) => {
                setSelectedPassportEmpId(emp.id);
                setActiveTab('development');
              }}
              onSelectCourse={(course) => {
                setDetailCourse(course);
                setIsCourseDetailOpen(true);
              }}
            />
          )}

          {activeTab === 'employees' && (
            <EmployeesView
              employees={employees}
              records={records}
              courses={courses}
              userRole={userRole}
              onOpenAddModal={() => {
                setEditingEmployee(null);
                setIsEmployeeModalOpen(true);
              }}
              onOpenEditModal={(emp) => {
                setEditingEmployee(emp);
                setIsEmployeeModalOpen(true);
              }}
              onDeleteEmployee={handleDeleteEmployee}
              onSelectEmployeeDetail={(emp) => {
                setDetailEmployee(emp);
                setIsEmployeeDetailOpen(true);
              }}
            />
          )}

          {activeTab === 'courses' && (
            <CoursesView
              courses={courses}
              records={records}
              employees={employees}
              userRole={userRole}
              onOpenAddCourse={() => {
                setEditingCourse(null);
                setIsCourseModalOpen(true);
              }}
              onOpenEditCourse={(course) => {
                setEditingCourse(course);
                setIsCourseModalOpen(true);
              }}
              onDeleteCourse={handleDeleteCourse}
              onSelectCourseDetail={(course) => {
                setDetailCourse(course);
                setIsCourseDetailOpen(true);
              }}
              onEnrollAttendance={(course) => {
                setDefaultEnrollCourseId(course.id);
                setEditingRecord(null);
                setIsAttendanceModalOpen(true);
              }}
            />
          )}

          {activeTab === 'attendance' && (
            <AttendanceView
              records={records}
              employees={employees}
              courses={courses}
              userRole={userRole}
              onOpenAddModal={() => {
                setEditingRecord(null);
                setIsAttendanceModalOpen(true);
              }}
              onOpenEditModal={(record) => {
                setEditingRecord(record);
                setIsAttendanceModalOpen(true);
              }}
              onDeleteRecord={handleDeleteRecord}
              onQuickStatusChange={handleQuickAttendanceStatusChange}
              onSelectEmployee={(emp) => {
                setSelectedPassportEmpId(emp.id);
                setActiveTab('development');
              }}
              onSelectCourse={(crs) => {
                setDetailCourse(crs);
                setIsCourseDetailOpen(true);
              }}
            />
          )}

          {activeTab === 'development' && (
            <DevelopmentPassportView
              employees={employees}
              records={records}
              courses={courses}
              selectedEmployeeId={selectedPassportEmpId}
              onSelectEmployeeId={setSelectedPassportEmpId}
            />
          )}

          {activeTab === 'documents' && (
            <DocumentsView
              documents={documents}
              courses={courses}
              employees={employees}
              userRole={userRole}
              onOpenUploadModal={() => setIsDocumentModalOpen(true)}
              onDeleteDocument={handleDeleteDocument}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView
              employees={employees}
              courses={courses}
              records={records}
              userRole={userRole}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              userRole={userRole}
              onRoleChange={setUserRole}
              systemMode={systemMode}
              onToggleMode={handleToggleMode}
              onResetDemo={() => setIsResetConfirmOpen(true)}
              logs={logs}
              allData={{
                employees,
                courses,
                records,
                documents
              }}
              onImportData={handleImportData}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <EmployeeModal
        isOpen={isEmployeeModalOpen}
        onClose={() => {
          setIsEmployeeModalOpen(false);
          setEditingEmployee(null);
        }}
        onSave={handleSaveEmployee}
        initialData={editingEmployee}
        existingCount={employees.length}
      />

      <EmployeeDetailModal
        isOpen={isEmployeeDetailOpen}
        onClose={() => {
          setIsEmployeeDetailOpen(false);
          setDetailEmployee(null);
        }}
        employee={detailEmployee}
        records={records}
        courses={courses}
        userRole={userRole}
        onEdit={(emp) => {
          setEditingEmployee(emp);
          setIsEmployeeModalOpen(true);
        }}
        onViewPassport={(emp) => {
          setSelectedPassportEmpId(emp.id);
          setActiveTab('development');
        }}
      />

      <CourseModal
        isOpen={isCourseModalOpen}
        onClose={() => {
          setIsCourseModalOpen(false);
          setEditingCourse(null);
        }}
        onSave={handleSaveCourse}
        initialData={editingCourse}
        existingCount={courses.length}
      />

      <CourseDetailModal
        isOpen={isCourseDetailOpen}
        onClose={() => {
          setIsCourseDetailOpen(false);
          setDetailCourse(null);
        }}
        course={detailCourse}
        records={records}
        employees={employees}
        userRole={userRole}
        onEdit={(crs) => {
          setEditingCourse(crs);
          setIsCourseModalOpen(true);
        }}
        onEnroll={(crs) => {
          setDefaultEnrollCourseId(crs.id);
          setEditingRecord(null);
          setIsAttendanceModalOpen(true);
        }}
        onSelectEmployee={(emp) => {
          setSelectedPassportEmpId(emp.id);
          setActiveTab('development');
        }}
      />

      <AttendanceModal
        isOpen={isAttendanceModalOpen}
        onClose={() => {
          setIsAttendanceModalOpen(false);
          setEditingRecord(null);
          setDefaultEnrollCourseId(undefined);
          setDefaultEnrollEmployeeId(undefined);
        }}
        onSave={handleSaveAttendance}
        initialData={editingRecord}
        employees={employees}
        courses={courses}
        defaultCourseId={defaultEnrollCourseId}
        defaultEmployeeId={defaultEnrollEmployeeId}
      />

      <DocumentUploadModal
        isOpen={isDocumentModalOpen}
        onClose={() => setIsDocumentModalOpen(false)}
        onSave={handleSaveDocument}
        courses={courses}
        employees={employees}
      />

      {/* Reset Demo Data Confirmation Modal */}
      <ConfirmModal
        isOpen={isResetConfirmOpen}
        title="ยืนยันการคืนค่าชุดข้อมูลตัวอย่างเริ่มต้น?"
        message="การดำเนินการนี้จะล้างข้อมูลที่คุณเพิ่มหรือแก้ไขในเบราว์เซอร์ และคืนค่าชุดข้อมูลจำลองข้าราชการและหลักสูตรฝึกอบรมเริ่มต้นของฝ่ายทรัพยากรบุคคล ศาลากลางจังหวัดสงขลา"
        confirmLabel="รีเซ็ตข้อมูลตัวอย่าง"
        cancelLabel="ยกเลิก"
        isDestructive={false}
        onConfirm={handleResetConfirmed}
        onCancel={() => setIsResetConfirmOpen(false)}
      />

      {/* Generic Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        title={deleteConfirm.title}
        message={deleteConfirm.message}
        confirmLabel="ยืนยันการลบ"
        cancelLabel="ยกเลิก"
        isDestructive={true}
        onConfirm={executeDelete}
        onCancel={() => setDeleteConfirm(prev => ({ ...prev, isOpen: false }))}
      />

      {/* Toast Stack */}
      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
