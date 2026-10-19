/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useTransition } from 'react';
import { WorkRecord, WorkStatus, ActiveTab } from './types';
import { 
  loadRecordsFromStorage, 
  saveRecordsToStorage, 
  resetRecordsStorage 
} from './data/initialRecords';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { TrackerView } from './components/TrackerView';
import { SmartSearchView } from './components/SmartSearchView';
import { ReportsView } from './components/ReportsView';
import { AboutView } from './components/AboutView';
import { TaskModal } from './components/TaskModal';
import { TaskDetailModal } from './components/TaskDetailModal';
import { ConfirmModal } from './components/ConfirmModal';
import { Toast, ToastMessage } from './components/Toast';

export default function App() {
  const [records, setRecords] = useState<WorkRecord[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<WorkRecord | null>(null);
  const [detailRecord, setDetailRecord] = useState<WorkRecord | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<WorkRecord | null>(null);

  // Toast notifications
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

  // Initial load from LocalStorage
  useEffect(() => {
    const loaded = loadRecordsFromStorage();
    setRecords(loaded);
  }, []);

  // Save changes to LocalStorage whenever records update
  const updateRecords = (updater: (prev: WorkRecord[]) => WorkRecord[]) => {
    setRecords(prev => {
      const next = updater(prev);
      saveRecordsToStorage(next);
      return next;
    });
  };

  // Handlers
  const handleSaveRecord = (record: WorkRecord) => {
    updateRecords(prev => {
      const exists = prev.some(r => r.id === record.id);
      if (exists) {
        return prev.map(r => r.id === record.id ? record : r);
      } else {
        return [record, ...prev];
      }
    });

    if (detailRecord && detailRecord.id === record.id) {
      setDetailRecord(record);
    }

    setIsTaskModalOpen(false);
    setEditingRecord(null);
    addToast(editingRecord ? `อัปเดตข้อมูล ${record.refId} เรียบร้อยแล้ว` : `บันทึกเรื่องใหม่ ${record.refId} เรียบร้อยแล้ว`);
  };

  const handleQuickStatusChange = (recordId: string, newStatus: WorkStatus) => {
    updateRecords(prev => 
      prev.map(r => {
        if (r.id === recordId) {
          const updated: WorkRecord = {
            ...r,
            status: newStatus,
            updatedAt: new Date().toISOString(),
            notes: [
              ...r.notes,
              {
                id: `n-${Date.now()}`,
                date: new Date().toISOString().split('T')[0],
                author: 'ระบบจำลอง',
                text: `ปรับปรุงสถานะเป็น: ${
                  newStatus === 'completed' ? 'ดำเนินการแล้วเสร็จ' :
                  newStatus === 'in_progress' ? 'กำลังดำเนินการ' :
                  newStatus === 'pending' ? 'รอดำเนินการ' : 'ยกเลิก'
                }`
              }
            ]
          };
          if (detailRecord && detailRecord.id === recordId) {
            setDetailRecord(updated);
          }
          return updated;
        }
        return r;
      })
    );
    addToast('อัปเดตสถานะงานเรียบร้อย');
  };

  const handleAddNote = (recordId: string, noteText: string, author: string) => {
    updateRecords(prev =>
      prev.map(r => {
        if (r.id === recordId) {
          const updatedNote = {
            id: `n-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            author,
            text: noteText
          };
          const updated: WorkRecord = {
            ...r,
            notes: [...r.notes, updatedNote],
            updatedAt: new Date().toISOString()
          };
          if (detailRecord && detailRecord.id === recordId) {
            setDetailRecord(updated);
          }
          return updated;
        }
        return r;
      })
    );
    addToast('เพิ่มบันทึกความคืบหน้าสำเร็จ');
  };

  const handleDeleteRecord = (record: WorkRecord) => {
    setRecordToDelete(record);
  };

  const confirmDeleteRecord = () => {
    if (!recordToDelete) return;
    updateRecords(prev => prev.filter(r => r.id !== recordToDelete.id));
    if (detailRecord && detailRecord.id === recordToDelete.id) {
      setDetailRecord(null);
    }
    addToast(`ลบข้อมูล ${recordToDelete.refId} ออกจากระบบจำลองแล้ว`, 'info');
    setRecordToDelete(null);
  };

  const handleResetConfirmed = () => {
    const fresh = resetRecordsStorage();
    setRecords(fresh);
    setIsResetConfirmOpen(false);
    if (detailRecord) setDetailRecord(null);
    addToast('รีเซ็ตข้อมูลตัวอย่างกลับสู่ค่าเริ่มต้นเรียบร้อยแล้ว', 'info');
  };

  // Calculations for badges
  const pendingCount = records.filter(r => r.status === 'pending').length;
  const inProgressCount = records.filter(r => r.status === 'in_progress').length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Standard Navigation Header */}
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => {
          startTransition(() => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          });
        }}
        onOpenNewTaskModal={() => {
          setEditingRecord(null);
          setIsTaskModalOpen(true);
        }}
        onOpenResetConfirm={() => setIsResetConfirmOpen(true)}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        totalPendingCount={pendingCount}
      />

      {/* Main Workspace with Sidebar and Content Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop / iPad Landscape Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={(tab) => {
            startTransition(() => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            });
          }}
          totalRecordsCount={records.length}
          pendingCount={pendingCount}
          inProgressCount={inProgressCount}
          onResetDemo={() => setIsResetConfirmOpen(true)}
        />

        {/* Viewport Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              records={records}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenNewTaskModal={() => {
                setEditingRecord(null);
                setIsTaskModalOpen(true);
              }}
              onSelectRecord={(rec) => setDetailRecord(rec)}
              onQuickStatusChange={handleQuickStatusChange}
            />
          )}

          {activeTab === 'tracker' && (
            <TrackerView
              records={records}
              onOpenNewTaskModal={() => {
                setEditingRecord(null);
                setIsTaskModalOpen(true);
              }}
              onSelectRecord={(rec) => setDetailRecord(rec)}
              onEditRecord={(rec) => {
                setEditingRecord(rec);
                setIsTaskModalOpen(true);
              }}
              onDeleteRecord={handleDeleteRecord}
              onQuickStatusChange={handleQuickStatusChange}
            />
          )}

          {activeTab === 'search' && (
            <SmartSearchView
              records={records}
              onSelectRecord={(rec) => setDetailRecord(rec)}
              onOpenNewTaskModal={() => {
                setEditingRecord(null);
                setIsTaskModalOpen(true);
              }}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView records={records} />
          )}

          {activeTab === 'about' && (
            <AboutView />
          )}
        </main>
      </div>

      {/* Add / Edit Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingRecord(null);
        }}
        onSave={handleSaveRecord}
        initialData={editingRecord}
        existingCount={records.length}
      />

      {/* View Task Details Modal */}
      <TaskDetailModal
        isOpen={!!detailRecord}
        record={detailRecord}
        onClose={() => setDetailRecord(null)}
        onEdit={(rec) => {
          setDetailRecord(null);
          setEditingRecord(rec);
          setIsTaskModalOpen(true);
        }}
        onStatusChange={handleQuickStatusChange}
        onAddNote={handleAddNote}
      />

      {/* Reset Demo Data Confirmation Dialog */}
      <ConfirmModal
        isOpen={isResetConfirmOpen}
        title="ยืนยันการคืนค่าข้อมูลตัวอย่างเริ่มต้น?"
        message="การดำเนินการนี้จะล้างข้อมูลที่คุณเพิ่มหรือแก้ไขในเบราว์เซอร์ และคืนค่าชุดข้อมูลจำลองเริ่มต้น 10 เรื่องสำหรับศาลากลางจังหวัดสงขลาจำลอง"
        confirmLabel="รีเซ็ตข้อมูลตัวอย่าง"
        cancelLabel="ยกเลิก"
        isDestructive={false}
        onConfirm={handleResetConfirmed}
        onCancel={() => setIsResetConfirmOpen(false)}
      />

      {/* Delete Record Confirmation Dialog */}
      <ConfirmModal
        isOpen={!!recordToDelete}
        title="ยืนยันการลบระเบียนข้อมูลจำลองนี้?"
        message={recordToDelete ? `คุณต้องการลบระเบียน ${recordToDelete.refId}: "${recordToDelete.title}" ออกจากฐานข้อมูล LocalStorage ใช่หรือไม่?` : ''}
        confirmLabel="ลบข้อมูล"
        cancelLabel="ยกเลิก"
        isDestructive={true}
        onConfirm={confirmDeleteRecord}
        onCancel={() => setRecordToDelete(null)}
      />

      {/* Toast Notification Stack */}
      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
