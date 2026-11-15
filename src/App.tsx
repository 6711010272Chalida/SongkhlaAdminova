import React, { useState, useEffect, useMemo } from 'react';
import {
  ActiveTab,
  AgencyDirectoryItem,
  AuditLog,
  ComplaintRecord,
  ComplaintStatus,
  OfficerProfile,
  StoredSystemState,
  SystemConfig
} from './types';
import {
  complaintStorage,
  isComplaintOverdue
} from './services/storageService';
import { STATUS_META } from './data/mockComplaints';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { IntakeFormView } from './components/IntakeFormView';
import { ComplaintRegistryView } from './components/ComplaintRegistryView';
import { StatusTrackingView } from './components/StatusTrackingView';
import { AssignmentView } from './components/AssignmentView';
import { ReportsView } from './components/ReportsView';
import { AnalyticsView } from './components/AnalyticsView';
import { SettingsView } from './components/SettingsView';
import { ComplaintDetailModal } from './components/ComplaintDetailModal';
import { ComplaintEditModal } from './components/ComplaintEditModal';
import { ConfirmModal } from './components/ConfirmModal';
import { Toast, ToastMessage } from './components/Toast';

export function App() {
  const [systemState, setSystemState] = useState<StoredSystemState>(() =>
    complaintStorage.loadState()
  );

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Cross-view filter & selection states
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [registryOverduePreset, setRegistryOverduePreset] = useState(false);
  const [selectedTrackingId, setSelectedTrackingId] = useState<string | undefined>(undefined);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | undefined>(undefined);

  // Modals
  const [detailComplaintId, setDetailComplaintId] = useState<string | null>(null);
  const [editComplaintId, setEditComplaintId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ComplaintRecord | null>(null);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Persist every change automatically
  useEffect(() => {
    complaintStorage.saveState(systemState);
  }, [systemState]);

  const addToast = (type: ToastMessage['type'], text: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, type, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const appendAuditLog = (
    prevLogs: AuditLog[],
    action: AuditLog['action'],
    details: string,
    caseNumber?: string
  ): AuditLog[] => {
    const newEntry: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: systemState.config.officerDisplayName,
      action,
      caseNumber,
      details
    };
    return [newEntry, ...prevLogs];
  };

  const sidebarCounts = useMemo(() => {
    const total = systemState.complaints.length;
    const newCases = systemState.complaints.filter((c) => c.status === 'new').length;
    const overdue = systemState.complaints.filter((c) => isComplaintOverdue(c)).length;
    const unassignedOrPending = systemState.complaints.filter(
      (c) => c.status === 'new' || !c.assignedOfficer || isComplaintOverdue(c)
    ).length;

    return { total, newCases, unassignedOrPending, overdue };
  }, [systemState.complaints]);

  const detailComplaint = useMemo(
    () => systemState.complaints.find((c) => c.id === detailComplaintId) || null,
    [systemState.complaints, detailComplaintId]
  );

  const editComplaint = useMemo(
    () => systemState.complaints.find((c) => c.id === editComplaintId) || null,
    [systemState.complaints, editComplaintId]
  );

  // Handlers
  const handleSaveNewComplaint = (newComplaint: ComplaintRecord) => {
    setSystemState((prev) => ({
      ...prev,
      complaints: [newComplaint, ...prev.complaints],
      logs: appendAuditLog(
        prev.logs,
        'create',
        `รับเรื่องร้องเรียนใหม่: ${newComplaint.subject}`,
        newComplaint.caseNumber
      )
    }));
    addToast('success', `บันทึกเรื่องร้องเรียน ${newComplaint.caseNumber} สำเร็จแล้ว`);
    setActiveTab('registry');
  };

  const handleSaveEditedComplaint = (updated: ComplaintRecord) => {
    setSystemState((prev) => ({
      ...prev,
      complaints: prev.complaints.map((c) => (c.id === updated.id ? updated : c)),
      logs: appendAuditLog(
        prev.logs,
        'update',
        `แก้ไขข้อมูลเรื่องร้องเรียน: ${updated.subject}`,
        updated.caseNumber
      )
    }));
    setEditComplaintId(null);
    addToast('success', `อัปเดตข้อมูลเรื่อง ${updated.caseNumber} เรียบร้อยแล้ว`);
  };

  const handleConfirmDeleteComplaint = () => {
    if (!deleteTarget) return;
    const targetCase = deleteTarget.caseNumber;
    const targetId = deleteTarget.id;

    setSystemState((prev) => ({
      ...prev,
      complaints: prev.complaints.filter((c) => c.id !== targetId),
      logs: appendAuditLog(prev.logs, 'delete', `ลบรายการเรื่องร้องเรียน ${targetCase}`, targetCase)
    }));
    setDeleteTarget(null);
    if (detailComplaintId === targetId) setDetailComplaintId(null);
    addToast('info', `ลบข้อมูลเรื่อง ${targetCase} ออกจากทะเบียนแล้ว`);
  };

  const handleAddTimelineUpdate = (
    complaintId: string,
    newStatus: ComplaintStatus,
    officerName: string,
    updateDate: string,
    note: string
  ) => {
    const nowTime = new Date().toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    const nowIso = new Date().toISOString();

    let updatedCaseNum = '';
    setSystemState((prev) => {
      const nextComplaints = prev.complaints.map((c) => {
        if (c.id !== complaintId) return c;
        updatedCaseNum = c.caseNumber;
        return {
          ...c,
          status: newStatus,
          updatedAt: nowIso,
          timeline: [
            ...c.timeline,
            {
              id: `tl-${Date.now()}`,
              timestamp: `${updateDate} ${nowTime}`,
              status: newStatus,
              officerName,
              department: c.responsibleAgency,
              note
            }
          ]
        };
      });

      return {
        ...prev,
        complaints: nextComplaints,
        logs: appendAuditLog(
          prev.logs,
          'status_change',
          `ปรับสถานะเป็น "${STATUS_META[newStatus].labelTh}": ${note}`,
          updatedCaseNum
        )
      };
    });

    addToast('success', `บันทึกความคืบหน้า ${updatedCaseNum} ลง Timeline เรียบร้อยแล้ว`);
  };

  const handleSaveAssignment = (
    complaintId: string,
    payload: {
      assignedOfficer: string;
      responsibleAgency: string;
      assignedDate: string;
      followUpDate?: string;
      coordinationResult?: string;
      coordinationNotes?: string;
      nextStatus?: ComplaintStatus;
    }
  ) => {
    const nowTime = new Date().toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    const nowIso = new Date().toISOString();
    let caseNum = '';

    setSystemState((prev) => {
      const nextComplaints = prev.complaints.map((c) => {
        if (c.id !== complaintId) return c;
        caseNum = c.caseNumber;
        const resolvedStatus = payload.nextStatus || c.status;
        const timelineNote = [
          `มอบหมายให้ ${payload.assignedOfficer} ประสาน ${payload.responsibleAgency}`,
          payload.followUpDate ? `กำหนดติดตามผล ${payload.followUpDate}` : '',
          payload.coordinationResult ? `ผลการประสาน: ${payload.coordinationResult}` : ''
        ]
          .filter(Boolean)
          .join(' · ');

        return {
          ...c,
          assignedOfficer: payload.assignedOfficer,
          responsibleAgency: payload.responsibleAgency,
          assignedDate: payload.assignedDate,
          followUpDate: payload.followUpDate,
          coordinationResult: payload.coordinationResult,
          coordinationNotes: payload.coordinationNotes,
          status: resolvedStatus,
          updatedAt: nowIso,
          timeline: [
            ...c.timeline,
            {
              id: `tl-${Date.now()}`,
              timestamp: `${payload.assignedDate} ${nowTime}`,
              status: resolvedStatus,
              officerName: payload.assignedOfficer,
              department: payload.responsibleAgency,
              note: timelineNote
            }
          ]
        };
      });

      return {
        ...prev,
        complaints: nextComplaints,
        logs: appendAuditLog(
          prev.logs,
          'assign',
          `มอบหมาย ${payload.assignedOfficer} ประสาน ${payload.responsibleAgency}`,
          caseNum
        )
      };
    });

    addToast('success', `บันทึกการมอบหมายและประสานงาน ${caseNum} เรียบร้อยแล้ว`);
  };

  // Settings Handlers
  const handleUpdateConfig = (nextConfig: SystemConfig) => {
    setSystemState((prev) => ({
      ...prev,
      config: nextConfig,
      logs: appendAuditLog(prev.logs, 'update', `อัปเดตข้อมูลผู้ใช้งานระบบ: ${nextConfig.officerDisplayName}`)
    }));
    addToast('success', 'บันทึกการตั้งค่าระบบเรียบร้อยแล้ว');
  };

  const handleAddOfficer = (officer: OfficerProfile) => {
    setSystemState((prev) => ({
      ...prev,
      officers: [...prev.officers, officer],
      logs: appendAuditLog(prev.logs, 'create', `เพิ่มรายชื่อเจ้าหน้าที่: ${officer.name}`)
    }));
    addToast('success', `เพิ่มเจ้าหน้าที่ ${officer.name} เรียบร้อยแล้ว`);
  };

  const handleRemoveOfficer = (id: string) => {
    setSystemState((prev) => ({
      ...prev,
      officers: prev.officers.filter((o) => o.id !== id)
    }));
    addToast('info', 'ลบรายชื่อเจ้าหน้าที่เรียบร้อยแล้ว');
  };

  const handleAddAgency = (agency: AgencyDirectoryItem) => {
    setSystemState((prev) => ({
      ...prev,
      agencies: [...prev.agencies, agency],
      logs: appendAuditLog(prev.logs, 'create', `เพิ่มหน่วยงานประสานงาน: ${agency.name}`)
    }));
    addToast('success', `เพิ่มหน่วยงาน ${agency.name} เรียบร้อยแล้ว`);
  };

  const handleRemoveAgency = (id: string) => {
    setSystemState((prev) => ({
      ...prev,
      agencies: prev.agencies.filter((a) => a.id !== id)
    }));
    addToast('info', 'ลบหน่วยงานออกจากทำเนียบแล้ว');
  };

  const handleImportState = (imported: StoredSystemState) => {
    setSystemState({
      ...imported,
      logs: appendAuditLog(imported.logs, 'import', `นำเข้าข้อมูลสำรอง (${imported.complaints.length} เรื่อง)`)
    });
    addToast('success', `นำเข้าข้อมูลสำรอง ${imported.complaints.length} เรื่องสำเร็จแล้ว`);
  };

  const handleConfirmResetDemo = () => {
    const fresh = complaintStorage.resetDemoState();
    setSystemState({
      ...fresh,
      logs: appendAuditLog(fresh.logs, 'reset', 'รีเซ็ตข้อมูลกลับเป็นชุดสาธิตเริ่มต้น 12 เรื่อง')
    });
    setResetConfirmOpen(false);
    addToast('info', 'รีเซ็ตข้อมูลกลับเป็นชุดสาธิตเริ่มต้นเรียบร้อยแล้ว');
  };

  return (
    <div className="min-h-screen flex bg-[#F3F6FA] text-[#1B2B3A]">
      {/* Desktop Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (tab !== 'registry') setRegistryOverduePreset(false);
          setActiveTab(tab);
        }}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        officerName={systemState.config.officerDisplayName}
        officerPosition={systemState.config.officerPosition}
        counts={sidebarCounts}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          activeTab={activeTab}
          onTabChange={(tab) => {
            if (tab !== 'registry') setRegistryOverduePreset(false);
            setActiveTab(tab);
          }}
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          searchQuery={globalSearchQuery}
          onSearchChange={setGlobalSearchQuery}
          onSubmitGlobalSearch={() => {
            setRegistryOverduePreset(false);
            setActiveTab('registry');
          }}
          complaints={systemState.complaints}
          onSelectComplaintForTracking={(id) => {
            setSelectedTrackingId(id);
            setActiveTab('tracking');
          }}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1440px] w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              complaints={systemState.complaints}
              officerName={systemState.config.officerDisplayName}
              onNavigateTab={(tab) => {
                setRegistryOverduePreset(false);
                setActiveTab(tab);
              }}
              onSelectComplaintDetail={(c) => setDetailComplaintId(c.id)}
              onFilterOverdueInRegistry={() => {
                setRegistryOverduePreset(true);
                setActiveTab('registry');
              }}
            />
          )}

          {activeTab === 'intake' && (
            <IntakeFormView
              existingComplaints={systemState.complaints}
              agencies={systemState.agencies}
              officerName={systemState.config.officerDisplayName}
              onSaveNewComplaint={handleSaveNewComplaint}
              onCancel={() => setActiveTab('dashboard')}
            />
          )}

          {activeTab === 'registry' && (
            <ComplaintRegistryView
              complaints={systemState.complaints}
              agencies={systemState.agencies}
              searchQuery={globalSearchQuery}
              onSearchChange={setGlobalSearchQuery}
              initialOverdueOnly={registryOverduePreset}
              onClearOverduePreset={() => setRegistryOverduePreset(false)}
              onOpenIntake={() => setActiveTab('intake')}
              onViewDetail={(c) => setDetailComplaintId(c.id)}
              onEditComplaint={(c) => setEditComplaintId(c.id)}
              onDeleteComplaint={(c) => setDeleteTarget(c)}
            />
          )}

          {activeTab === 'tracking' && (
            <StatusTrackingView
              complaints={systemState.complaints}
              officers={systemState.officers}
              selectedComplaintId={selectedTrackingId}
              onSelectComplaintId={setSelectedTrackingId}
              onAddTimelineUpdate={handleAddTimelineUpdate}
              onViewDetail={(c) => setDetailComplaintId(c.id)}
            />
          )}

          {activeTab === 'assignment' && (
            <AssignmentView
              complaints={systemState.complaints}
              officers={systemState.officers}
              agencies={systemState.agencies}
              selectedComplaintId={selectedAssignmentId}
              onSelectComplaintId={setSelectedAssignmentId}
              onSaveAssignment={handleSaveAssignment}
              onViewDetail={(c) => setDetailComplaintId(c.id)}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView
              complaints={systemState.complaints}
              officerName={systemState.config.officerDisplayName}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView complaints={systemState.complaints} />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              state={systemState}
              onUpdateConfig={handleUpdateConfig}
              onAddOfficer={handleAddOfficer}
              onRemoveOfficer={handleRemoveOfficer}
              onAddAgency={handleAddAgency}
              onRemoveAgency={handleRemoveAgency}
              onImportState={handleImportState}
              onRequestResetDemo={() => setResetConfirmOpen(true)}
              onNotifyError={(msg) => addToast('error', msg)}
            />
          )}

          {/* Prototype Footer */}
          <footer className="mt-10 pt-5 border-t border-[#E5EAF0] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500 no-print">
            <div>
              <strong>SONGKHLA DAMRONGDHAM CONNECT</strong> · ระบบจัดการข้อมูลและติดตามเรื่องร้องเรียนร้องทุกข์ ศูนย์ดำรงธรรมจังหวัดสงขลา
            </div>
            <div>
              ระบบต้นแบบนวัตกรรมดิจิทัล · ข้อมูลสมมติสำหรับการสาธิต
            </div>
          </footer>
        </main>
      </div>

      {/* Modals */}
      <ComplaintDetailModal
        isOpen={Boolean(detailComplaint)}
        onClose={() => setDetailComplaintId(null)}
        complaint={detailComplaint}
        onEdit={(c) => setEditComplaintId(c.id)}
        onOpenTracking={(c) => {
          setSelectedTrackingId(c.id);
          setActiveTab('tracking');
        }}
        onOpenAssignment={(c) => {
          setSelectedAssignmentId(c.id);
          setActiveTab('assignment');
        }}
      />

      <ComplaintEditModal
        isOpen={Boolean(editComplaint)}
        onClose={() => setEditComplaintId(null)}
        complaint={editComplaint}
        agencies={systemState.agencies}
        onSave={handleSaveEditedComplaint}
      />

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="ยืนยันการลบเรื่องร้องเรียน"
        message={
          deleteTarget
            ? `ต้องการลบเรื่องร้องเรียน ${deleteTarget.caseNumber} (${deleteTarget.subject}) ออกจากระบบใช่หรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้`
            : ''
        }
        confirmLabel="ลบข้อมูล"
        cancelLabel="ยกเลิก"
        isDestructive
        onConfirm={handleConfirmDeleteComplaint}
        onCancel={() => setDeleteTarget(null)}
      />

      <ConfirmModal
        isOpen={resetConfirmOpen}
        title="ยืนยันการรีเซ็ตข้อมูลสาธิต"
        message="ข้อมูลที่แก้ไขหรือเพิ่มใหม่ทั้งหมดใน LocalStorage จะถูกแทนที่ด้วยข้อมูลสมมติตั้งต้น 12 เรื่อง ต้องการดำเนินการต่อหรือไม่?"
        confirmLabel="รีเซ็ตข้อมูล"
        cancelLabel="ยกเลิก"
        isDestructive
        onConfirm={handleConfirmResetDemo}
        onCancel={() => setResetConfirmOpen(false)}
      />

      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default App;
