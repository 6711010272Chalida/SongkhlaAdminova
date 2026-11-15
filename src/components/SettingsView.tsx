import React, { useState } from 'react';
import {
  AgencyDirectoryItem,
  AuditLog,
  OfficerProfile,
  StoredSystemState,
  SystemConfig
} from '../types';
import {
  Building2,
  UserPlus,
  Trash2,
  Download,
  Upload,
  RotateCcw,
  Check,
  Database,
  History,
  ShieldCheck,
  Plus
} from 'lucide-react';

interface SettingsViewProps {
  state: StoredSystemState;
  onUpdateConfig: (nextConfig: SystemConfig) => void;
  onAddOfficer: (officer: OfficerProfile) => void;
  onRemoveOfficer: (id: string) => void;
  onAddAgency: (agency: AgencyDirectoryItem) => void;
  onRemoveAgency: (id: string) => void;
  onImportState: (imported: StoredSystemState) => void;
  onRequestResetDemo: () => void;
  onNotifyError: (msg: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  state,
  onUpdateConfig,
  onAddOfficer,
  onRemoveOfficer,
  onAddAgency,
  onRemoveAgency,
  onImportState,
  onRequestResetDemo,
  onNotifyError
}) => {
  const [officerDisplayName, setOfficerDisplayName] = useState(state.config.officerDisplayName);
  const [officerPosition, setOfficerPosition] = useState(state.config.officerPosition);
  const [fiscalYear, setFiscalYear] = useState(String(state.config.fiscalYear));

  // New Officer Form
  const [newOffName, setNewOffName] = useState('');
  const [newOffPos, setNewOffPos] = useState('');
  const [newOffPhone, setNewOffPhone] = useState('');

  // New Agency Form
  const [newAgencyName, setNewAgencyName] = useState('');
  const [newAgencyCat, setNewAgencyCat] = useState('องค์กรปกครองส่วนท้องถิ่น');
  const [newAgencyPhone, setNewAgencyPhone] = useState('');

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!officerDisplayName.trim()) {
      onNotifyError('กรุณาระบุชื่อเจ้าหน้าที่ผู้ใช้งานระบบ');
      return;
    }
    onUpdateConfig({
      ...state.config,
      officerDisplayName: officerDisplayName.trim(),
      officerPosition: officerPosition.trim() || 'เจ้าหน้าที่ศูนย์ดำรงธรรมจังหวัดสงขลา',
      fiscalYear: parseInt(fiscalYear, 10) || 2569
    });
  };

  const handleQuickSelectOfficer = (off: OfficerProfile) => {
    setOfficerDisplayName(off.name);
    setOfficerPosition(off.position);
    onUpdateConfig({
      ...state.config,
      officerDisplayName: off.name,
      officerPosition: off.position
    });
  };

  const handleCreateOfficer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOffName.trim()) return;
    onAddOfficer({
      id: `off-${Date.now()}`,
      name: newOffName.trim(),
      position: newOffPos.trim() || 'เจ้าหน้าที่ศูนย์ดำรงธรรม',
      division: 'กลุ่มงานศูนย์ดำรงธรรมจังหวัดสงขลา',
      phone: newOffPhone.trim() || '074-311-000 (สมมติ)'
    });
    setNewOffName('');
    setNewOffPos('');
    setNewOffPhone('');
  };

  const handleCreateAgency = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgencyName.trim()) return;
    onAddAgency({
      id: `ag-${Date.now()}`,
      name: newAgencyName.trim(),
      category: newAgencyCat,
      contactPhone: newAgencyPhone.trim() || '074-000-000 (สมมติ)'
    });
    setNewAgencyName('');
    setNewAgencyPhone('');
  };

  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(state, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Songkhla_Damrongdham_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(String(ev.target?.result || '{}')) as Partial<StoredSystemState>;
        if (!Array.isArray(parsed.complaints)) {
          onNotifyError('ไฟล์ JSON ไม่ถูกต้อง: ไม่พบรายการเรื่องร้องเรียน (complaints)');
          return;
        }
        onImportState({
          complaints: parsed.complaints,
          officers:
            Array.isArray(parsed.officers) && parsed.officers.length > 0
              ? parsed.officers
              : state.officers,
          agencies:
            Array.isArray(parsed.agencies) && parsed.agencies.length > 0
              ? parsed.agencies
              : state.agencies,
          logs: Array.isArray(parsed.logs) ? parsed.logs : state.logs,
          config: parsed.config ? { ...state.config, ...parsed.config } : state.config
        });
      } catch {
        onNotifyError('ไม่สามารถอ่านไฟล์ JSON ได้ กรุณาตรวจสอบรูปแบบไฟล์');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="text-xs text-slate-500 mb-1">
          การบริหารจัดการระบบและข้อมูลหลัก · SONGKHLA DAMRONGDHAM CONNECT
        </div>
        <h1 className="text-2xl font-bold text-[#102C4C] tracking-tight">
          จัดการข้อมูลและตั้งค่าระบบ
        </h1>
        <p className="text-sm text-slate-600 mt-0.5">
          ตั้งค่าข้อมูลผู้ปฏิบัติงาน จัดการทำเนียบเจ้าหน้าที่และหน่วยงานประสานงาน สำรอง/นำเข้าข้อมูล และตรวจสอบบันทึกการใช้งาน
        </p>
      </div>

      {/* Top Row: Agency Profile & Officer Profile Config */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Agency & Prototype Architecture Info */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-[#E5EAF0] p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#0B1F36] text-[#C5A45A] flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#102C4C]">
                ศูนย์ดำรงธรรมจังหวัดสงขลา
              </h2>
              <p className="text-xs text-slate-600">
                ศาลากลางจังหวัดสงขลา · ต้นแบบระบบจัดการข้อมูลและติดตามเรื่องร้องเรียนร้องทุกข์
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#F8FAFC] border border-[#E5EAF0] text-xs space-y-1.5">
            <div className="font-semibold text-[#102C4C] flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-[#1D4ED8]" />
              <span>สถานะการจัดเก็บข้อมูล (Data Persistence)</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              ระบบจัดเก็บข้อมูลเรื่องร้องเรียน ทำเนียบเจ้าหน้าที่ และประวัติ Timeline ลงใน{' '}
              <span className="font-mono-numbers font-semibold text-[#102C4C]">LocalStorage</span>{' '}
              แบบถาวรบนเบราว์เซอร์ ผ่าน Interface{' '}
              <span className="font-mono-numbers text-[#102C4C]">ComplaintDataAdapter</span>{' '}
              ซึ่งออกแบบรองรับการเชื่อมต่อฐานข้อมูลกลางในอนาคต (เช่น Firebase Firestore Collections:{' '}
              <span className="font-mono-numbers">complaints, officers, agencies, auditLogs</span>)
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-amber-50/60 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <span>
              ข้อมูลทั้งหมดในระบบนี้เป็น <strong>ข้อมูลสมมติเพื่อสาธิตการใช้งานระบบต้นแบบ</strong>{' '}
              ไม่ใช้ข้อมูลส่วนบุคคลหรือข้อมูลทางราชการจริง
            </span>
          </div>
        </div>

        {/* Officer Active Profile Form */}
        <form
          onSubmit={handleSaveConfig}
          className="lg:col-span-7 bg-white rounded-xl border border-[#E5EAF0] p-6 space-y-4"
        >
          <div className="flex items-center justify-between border-b border-[#E5EAF0] pb-3">
            <div>
              <h2 className="text-base font-bold text-[#102C4C]">ข้อมูลเจ้าหน้าที่ผู้ใช้งานระบบ</h2>
              <p className="text-xs text-slate-500">
                ใช้แสดงชื่อผู้ปฏิบัติงานบนหน้าภาพรวมและเป็นผู้บันทึกรายการรับเรื่องอัตโนมัติ
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#102C4C] mb-1">
                ชื่อ-สกุล เจ้าหน้าที่ผู้ปฏิบัติงาน *
              </label>
              <input
                type="text"
                value={officerDisplayName}
                onChange={(e) => setOfficerDisplayName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#E5EAF0] focus:outline-none focus:border-[#1D4ED8]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#102C4C] mb-1">ตำแหน่ง</label>
              <input
                type="text"
                value={officerPosition}
                onChange={(e) => setOfficerPosition(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#E5EAF0] focus:outline-none focus:border-[#1D4ED8]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#102C4C] mb-1">
                ปีงบประมาณสำหรับออกเลขที่รับเรื่อง (พ.ศ.)
              </label>
              <input
                type="number"
                value={fiscalYear}
                onChange={(e) => setFiscalYear(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#E5EAF0] font-mono-numbers focus:outline-none focus:border-[#1D4ED8]"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#102C4C] hover:bg-[#1D4ED8] rounded-lg transition-colors cursor-pointer"
              >
                <Check className="w-4 h-4 text-[#C5A45A]" />
                <span>บันทึกการตั้งค่าผู้ใช้งาน</span>
              </button>
            </div>
          </div>

          {/* Quick Switcher */}
          <div className="pt-2 border-t border-[#E5EAF0]">
            <div className="text-[11px] text-slate-500 mb-2">สลับบัญชีเจ้าหน้าที่สาธิตอย่างรวดเร็ว:</div>
            <div className="flex flex-wrap gap-2">
              {state.officers.map((off) => (
                <button
                  key={off.id}
                  type="button"
                  onClick={() => handleQuickSelectOfficer(off)}
                  className={`px-3 py-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                    state.config.officerDisplayName === off.name
                      ? 'bg-[#102C4C] text-white border-[#102C4C] font-semibold'
                      : 'bg-white text-slate-700 border-[#E5EAF0] hover:bg-slate-50'
                  }`}
                >
                  {off.name}
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>

      {/* Master Directories: Officers & Agencies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Officers Directory */}
        <div className="bg-white rounded-xl border border-[#E5EAF0] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#102C4C] flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-[#1D4ED8]" />
              <span>รายชื่อเจ้าหน้าที่ศูนย์ดำรงธรรม ({state.officers.length} คน)</span>
            </h2>
          </div>

          <form onSubmit={handleCreateOfficer} className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <input
              type="text"
              value={newOffName}
              onChange={(e) => setNewOffName(e.target.value)}
              placeholder="ชื่อ-สกุล เจ้าหน้าที่..."
              className="px-2.5 py-2 rounded-lg border border-[#E5EAF0] focus:outline-none focus:border-[#1D4ED8]"
            />
            <input
              type="text"
              value={newOffPos}
              onChange={(e) => setNewOffPos(e.target.value)}
              placeholder="ตำแหน่ง..."
              className="px-2.5 py-2 rounded-lg border border-[#E5EAF0] focus:outline-none focus:border-[#1D4ED8]"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-1 px-3 py-2 bg-[#102C4C] hover:bg-[#1D4ED8] text-white font-semibold rounded-lg cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#C5A45A]" />
              <span>เพิ่มเจ้าหน้าที่</span>
            </button>
          </form>

          <div className="divide-y divide-[#E5EAF0] max-h-60 overflow-y-auto border border-[#E5EAF0] rounded-lg">
            {state.officers.map((off) => (
              <div key={off.id} className="p-3 flex items-center justify-between gap-2 text-xs">
                <div className="min-w-0">
                  <div className="font-semibold text-[#102C4C] truncate">{off.name}</div>
                  <div className="text-[11px] text-slate-500 truncate">{off.position}</div>
                </div>
                {state.officers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onRemoveOfficer(off.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded cursor-pointer shrink-0"
                    title="ลบรายชื่อเจ้าหน้าที่"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Agencies Directory */}
        <div className="bg-white rounded-xl border border-[#E5EAF0] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#102C4C] flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#C5A45A]" />
              <span>ทำเนียบหน่วยงานประสานงาน ({state.agencies.length} หน่วยงาน)</span>
            </h2>
          </div>

          <form onSubmit={handleCreateAgency} className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <input
              type="text"
              value={newAgencyName}
              onChange={(e) => setNewAgencyName(e.target.value)}
              placeholder="ชื่อหน่วยงานที่ประสาน..."
              className="px-2.5 py-2 rounded-lg border border-[#E5EAF0] focus:outline-none focus:border-[#1D4ED8]"
            />
            <select
              value={newAgencyCat}
              onChange={(e) => setNewAgencyCat(e.target.value)}
              className="px-2.5 py-2 rounded-lg border border-[#E5EAF0] bg-white cursor-pointer"
            >
              <option value="องค์กรปกครองส่วนท้องถิ่น">องค์กรปกครองส่วนท้องถิ่น</option>
              <option value="โครงสร้างพื้นฐาน">โครงสร้างพื้นฐาน</option>
              <option value="สาธารณูปโภค">สาธารณูปโภค</option>
              <option value="สิ่งแวดล้อม">สิ่งแวดล้อม</option>
              <option value="ฝ่ายปกครอง">ฝ่ายปกครอง</option>
              <option value="ความมั่นคงและกฎหมาย">ความมั่นคงและกฎหมาย</option>
              <option value="สวัสดิการสังคม">สวัสดิการสังคม</option>
            </select>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-1 px-3 py-2 bg-[#102C4C] hover:bg-[#1D4ED8] text-white font-semibold rounded-lg cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#C5A45A]" />
              <span>เพิ่มหน่วยงาน</span>
            </button>
          </form>

          <div className="divide-y divide-[#E5EAF0] max-h-60 overflow-y-auto border border-[#E5EAF0] rounded-lg">
            {state.agencies.map((ag) => (
              <div key={ag.id} className="p-3 flex items-center justify-between gap-2 text-xs">
                <div className="min-w-0">
                  <div className="font-semibold text-[#102C4C] truncate">{ag.name}</div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {ag.category} · {ag.contactPhone}
                  </div>
                </div>
                {state.agencies.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onRemoveAgency(ag.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded cursor-pointer shrink-0"
                    title="ลบหน่วยงาน"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Backup / Restore / Reset & Audit Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Backup & Reset Controls */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-[#E5EAF0] p-6 space-y-4">
          <div>
            <h2 className="text-base font-bold text-[#102C4C]">สำรองข้อมูลและกู้คืนข้อมูลสมมติ</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              ส่งออกข้อมูลทั้งหมดเป็นไฟล์ JSON นำเข้าจากไฟล์สำรอง หรือรีเซ็ตกลับเป็นข้อมูลตั้งต้น 12 เรื่อง
            </p>
          </div>

          <div className="space-y-2.5 text-xs">
            <button
              type="button"
              onClick={handleExportJSON}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg border border-[#E5EAF0] hover:bg-slate-50 font-semibold text-[#102C4C] cursor-pointer"
            >
              <span className="inline-flex items-center gap-2">
                <Download className="w-4 h-4 text-[#1D4ED8]" />
                <span>ส่งออกข้อมูลสำรองทั้งระบบ (.JSON)</span>
              </span>
              <span className="font-mono-numbers text-slate-400">
                {state.complaints.length} เรื่อง
              </span>
            </button>

            <label className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg border border-[#E5EAF0] hover:bg-slate-50 font-semibold text-[#102C4C] cursor-pointer">
              <span className="inline-flex items-center gap-2">
                <Upload className="w-4 h-4 text-emerald-600" />
                <span>นำเข้าข้อมูลจากไฟล์สำรอง (.JSON)</span>
              </span>
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleImportJSON}
                className="hidden"
              />
            </label>

            <button
              type="button"
              onClick={onRequestResetDemo}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg border border-rose-200 bg-rose-50/50 hover:bg-rose-50 font-semibold text-rose-700 cursor-pointer"
            >
              <span className="inline-flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                <span>รีเซ็ตข้อมูลกลับเป็นชุดสาธิตเริ่มต้น</span>
              </span>
            </button>
          </div>
        </div>

        {/* Audit Log Viewer */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-[#E5EAF0] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E5EAF0] flex items-center justify-between">
            <h2 className="text-base font-bold text-[#102C4C] flex items-center gap-2">
              <History className="w-4 h-4 text-[#C5A45A]" />
              <span>บันทึกประวัติการใช้งานระบบ (Audit Log)</span>
            </h2>
            <span className="text-xs font-mono-numbers text-slate-500">
              {state.logs.length} รายการ
            </span>
          </div>

          <div className="divide-y divide-[#E5EAF0] max-h-64 overflow-y-auto">
            {state.logs.slice(0, 25).map((log: AuditLog) => (
              <div key={log.id} className="px-6 py-3 flex items-start justify-between gap-3 text-xs">
                <div className="min-w-0 space-y-0.5">
                  <div className="font-medium text-[#102C4C]">
                    {log.caseNumber && (
                      <span className="font-mono-numbers font-bold text-[#1D4ED8] mr-1.5">
                        [{log.caseNumber}]
                      </span>
                    )}
                    {log.details}
                  </div>
                  <div className="text-[11px] text-slate-500">ผู้ดำเนินการ: {log.actor}</div>
                </div>
                <span className="font-mono-numbers text-[11px] text-slate-400 shrink-0">
                  {new Date(log.timestamp).toLocaleString('th-TH')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
