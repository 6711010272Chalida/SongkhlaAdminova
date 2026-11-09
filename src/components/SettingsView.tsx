import React, { useState } from 'react';
import { 
  UserRole, 
  SystemMode, 
  AuditLog, 
  Employee, 
  TrainingCourse, 
  TrainingRecord, 
  DocumentItem 
} from '../types';
import { 
  Settings, 
  Building2, 
  ShieldCheck, 
  Database, 
  RotateCcw, 
  Download, 
  Upload, 
  Lock, 
  FileCheck, 
  Cloud, 
  CheckCircle2, 
  AlertTriangle,
  History,
  Info,
  Server,
  KeyRound
} from 'lucide-react';

interface SettingsViewProps {
  userRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  systemMode: SystemMode;
  onToggleMode: (mode: SystemMode) => void;
  onResetDemo: () => void;
  logs: AuditLog[];
  allData: {
    employees: Employee[];
    courses: TrainingCourse[];
    records: TrainingRecord[];
    documents: DocumentItem[];
  };
  onImportData: (imported: any) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  userRole,
  onRoleChange,
  systemMode,
  onToggleMode,
  onResetDemo,
  logs,
  allData,
  onImportData
}) => {
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Backup data export
  const handleExportJSON = () => {
    const backupObj = {
      exportDate: new Date().toISOString(),
      system: 'SONGKHLA HRD',
      agency: 'ศาลากลางจังหวัดสงขลา ฝ่ายทรัพยากรบุคคล',
      mode: systemMode,
      ...allData
    };
    const jsonStr = JSON.stringify(backupObj, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SONGKHLA_HRD_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Restore data import
  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.employees && parsed.courses && parsed.records) {
          onImportData(parsed);
          setImportStatus('นำเข้าชุดข้อมูลสำเร็จเรียบร้อย');
        } else {
          setImportStatus('รูปแบบไฟล์สำรองไม่ถูกต้อง (ขาดโครงสร้างหลัก)');
        }
      } catch (err) {
        setImportStatus('เกิดข้อผิดพลาดในการอ่านไฟล์ JSON');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-[#718096] mb-1">
          <span className="font-medium">การบริหารจัดการระบบ</span>
          <span aria-hidden="true">·</span>
          <span>การกำหนดค่าสิทธิ์และการควบคุมข้อมูล</span>
        </div>
        <h1 className="text-2xl font-bold text-[#102C4C] tracking-tight">
          ตั้งค่าระบบและการจัดการสิทธิ์ (System Administration)
        </h1>
        <p className="text-sm text-[#718096] mt-0.5">
          กำหนดบทบาทผู้ใช้งาน สลับโหมดการทำงาน สำรองข้อมูล และตรวจสอบความพร้อมโครงสร้างสถาปัตยกรรม
        </p>
      </div>

      {/* Grid Section 1: Agency Info & System Mode */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Agency Profile */}
        <div className="bg-white rounded-2xl border border-[#E5EAF0] p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F3F6FA] text-[#102C4C] flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5 text-[#C5A45A]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#102C4C]">ข้อมูลหน่วยงานเป้าหมาย</h2>
              <p className="text-xs text-[#718096]">Target Agency Profile</p>
            </div>
          </div>

          <div className="space-y-2.5 text-xs text-[#1B2B3A] pt-1">
            <div className="p-3.5 bg-[#F3F6FA] rounded-xl border border-[#E5EAF0] space-y-1">
              <div className="font-bold text-[#102C4C]">ศาลากลางจังหวัดสงขลา</div>
              <div className="text-[#718096]">สำนักงานจังหวัดสงขลา ฝ่ายทรัพยากรบุคคล</div>
              <div className="text-[#718096] text-[11px]">ถนนราชดำเนิน ตำบลบ่อยาง อำเภอเมืองสงขลา จังหวัดสงขลา 90000</div>
            </div>

            <div className="flex justify-between py-1.5 border-b border-[#E5EAF0]">
              <span className="text-[#718096]">ชื่อระบบสารสนเทศ:</span>
              <span className="font-bold text-[#102C4C]">SONGKHLA HRD (Modern Gov v2.0)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#E5EAF0]">
              <span className="text-[#718096]">ปีงบประมาณปฏิบัติงาน:</span>
              <span className="font-mono-numbers font-semibold text-[#102C4C]">พ.ศ. 2569</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-[#718096]">มาตรฐานสมรรถนะ:</span>
              <span className="font-semibold text-[#23865B]">เกณฑ์มาตรฐาน ก.พ. (30 ชม./ปี)</span>
            </div>
          </div>
        </div>

        {/* System Mode Switcher */}
        <div className="bg-white rounded-2xl border border-[#E5EAF0] p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F3F6FA] text-[#102C4C] flex items-center justify-center font-bold">
              <Database className="w-5 h-5 text-[#C5A45A]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#102C4C]">โหมดการทำงานของระบบ</h2>
              <p className="text-xs text-[#718096]">Demo Mode vs Production Real Mode</p>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onToggleMode('demo')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  systemMode === 'demo'
                    ? 'border-[#C5A45A] bg-amber-50/70 shadow-xs'
                    : 'border-[#E5EAF0] hover:bg-[#F3F6FA]'
                }`}
              >
                <div className="font-bold text-xs text-[#102C4C] mb-1">1. โหมดสาธิต (Demo)</div>
                <p className="text-[11px] text-[#718096] leading-tight">
                  ใช้สำหรับนำเสนอ มีชุดข้อมูลจำลองข้าราชการและหลักสูตร
                </p>
              </button>

              <button
                onClick={() => onToggleMode('real')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  systemMode === 'real'
                    ? 'border-[#23865B] bg-emerald-50/70 shadow-xs'
                    : 'border-[#E5EAF0] hover:bg-[#F3F6FA]'
                }`}
              >
                <div className="font-bold text-xs text-[#102C4C] mb-1">2. โหมดใช้งานจริง (Real)</div>
                <p className="text-[11px] text-[#718096] leading-tight">
                  เริ่มต้นด้วยข้อมูลว่าง แยกพื้นที่จัดเก็บอย่างสมบูรณ์
                </p>
              </button>
            </div>

            {systemMode === 'demo' && (
              <div className="pt-2">
                <button
                  onClick={onResetDemo}
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-[#D69E36] bg-amber-50 hover:bg-amber-100/80 border border-amber-200/80 rounded-xl transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>คืนค่าชุดข้อมูลตัวอย่างเริ่มต้น (Reset Demo Data)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid Section 2: Role-Based Access Control (RBAC) */}
      <div className="bg-white rounded-2xl border border-[#E5EAF0] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F3F6FA] text-[#102C4C] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5 text-[#C5A45A]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#102C4C]">
                การจัดการสิทธิ์การใช้งาน (Role-Based Access Control)
              </h2>
              <p className="text-xs text-[#718096]">
                จำลองการสลับบทบาทสิทธิ์ระหว่าง Administrator และ Officer เพื่อทดสอบความปลอดภัย
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#718096]">บทบาทปัจจุบัน:</span>
            <span className={`px-3 py-1 rounded-full font-bold text-xs ${
              userRole === 'admin' ? 'bg-[#102C4C] text-[#C5A45A]' : 'bg-sky-100 text-[#245B91]'
            }`}>
              {userRole === 'admin' ? 'ผู้ดูแลระบบ (Admin)' : 'เจ้าหน้าที่ (Officer)'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* Admin Role Card */}
          <div 
            onClick={() => onRoleChange('admin')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              userRole === 'admin' ? 'border-[#102C4C] bg-[#F3F6FA] ring-2 ring-[#102C4C]/20 shadow-xs' : 'border-[#E5EAF0] hover:bg-[#F3F6FA]/50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="font-bold text-sm text-[#102C4C] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C5A45A]" />
                <span>ผู้ดูแลระบบ (Administrator)</span>
              </div>
              {userRole === 'admin' && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#102C4C] text-white">
                  เปิดใช้งานอยู่
                </span>
              )}
            </div>
            <ul className="text-xs text-[#718096] space-y-1.5 list-disc list-inside">
              <li>เพิ่ม แก้ไข และลบข้อมูลบุคลากรในระบบ</li>
              <li>สร้าง แก้ไข และกำหนดรายละเอียดหลักสูตร</li>
              <li>อนุมัติผลการประเมินและออกเลขที่วุฒิบัตร</li>
              <li>เข้าถึงและส่งออกรายงานสถิติทุกประเภท</li>
              <li>จัดการและล้างข้อมูลจำลอง</li>
            </ul>
          </div>

          {/* Officer Role Card */}
          <div 
            onClick={() => onRoleChange('officer')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              userRole === 'officer' ? 'border-[#245B91] bg-sky-50/50 ring-2 ring-[#245B91]/20 shadow-xs' : 'border-[#E5EAF0] hover:bg-[#F3F6FA]/50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="font-bold text-sm text-[#102C4C] flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#245B91]" />
                <span>เจ้าหน้าที่ปฏิบัติการ (Officer)</span>
              </div>
              {userRole === 'officer' && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#245B91] text-white">
                  เปิดใช้งานอยู่
                </span>
              )}
            </div>
            <ul className="text-xs text-[#718096] space-y-1.5 list-disc list-inside">
              <li>สืบค้นและเรียกดูข้อมูลบุคลากรและหลักสูตร</li>
              <li>บันทึกการลงทะเบียนเข้าร่วมอบรม</li>
              <li>เรียกดูสมุดประวัติและพิมพ์รายงาน</li>
              <li>จำกัดสิทธิ์การลบข้อมูลสำคัญเพื่อความปลอดภัย</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Grid Section 3: Database & Cloud Integration Status */}
      <div className="bg-white rounded-2xl border border-[#E5EAF0] p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F3F6FA] text-[#102C4C] flex items-center justify-center font-bold">
            <Server className="w-5 h-5 text-[#C5A45A]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#102C4C]">
              สถานะสถาปัตยกรรมคลาวด์และฐานข้อมูล (Cloud Readiness)
            </h2>
            <p className="text-xs text-[#718096]">
              ความพร้อมของสถาปัตยกรรมข้อมูลเพื่อการใช้งานจริงในอนาคต
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#F3F6FA] border border-[#E5EAF0] space-y-3 text-xs leading-relaxed">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#102C4C]">สถานะการกำหนดค่าปัจจุบัน:</span>
            <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-semibold text-[11px]">
              จำลองข้อมูลบนเบราว์เซอร์ (Browser State & LocalStorage)
            </span>
          </div>

          <p className="text-[#718096]">
            ระบบได้รับการออกแบบให้รองรับโครงสร้าง Entity สำหรับ <strong>Firebase Firestore / Cloud SQL</strong> (Collections: <code className="bg-white px-1.5 py-0.5 rounded border border-[#E5EAF0] text-[#102C4C]">employees</code>, <code className="bg-white px-1.5 py-0.5 rounded border border-[#E5EAF0] text-[#102C4C]">courses</code>, <code className="bg-white px-1.5 py-0.5 rounded border border-[#E5EAF0] text-[#102C4C]">records</code>, <code className="bg-white px-1.5 py-0.5 rounded border border-[#E5EAF0] text-[#102C4C]">documents</code>) และ Google Workspace OAuth เพื่อให้สามารถยกระดับเป็นระบบจริงได้ทันที
          </p>

          <div className="pt-2 border-t border-[#E5EAF0] flex flex-wrap items-center justify-between gap-3 text-[#718096] text-[11px]">
            <span className="flex items-center gap-1 text-[#23865B] font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> รองรับโครงสร้าง Relational NoSQL
            </span>
            <span className="flex items-center gap-1 text-[#23865B] font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> ไม่มีการเปิดเผย Secrets หรือ Personal Data
            </span>
          </div>
        </div>
      </div>

      {/* Grid Section 4: Backup & Restore */}
      <div className="bg-white rounded-2xl border border-[#E5EAF0] p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F3F6FA] text-[#102C4C] flex items-center justify-center font-bold">
            <FileCheck className="w-5 h-5 text-[#C5A45A]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#102C4C]">การสำรองและกู้คืนข้อมูล (Backup & Restore)</h2>
            <p className="text-xs text-[#718096]">ส่งออกและนำเข้าข้อมูลระบบในรูปแบบไฟล์ JSON มาตรฐาน</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            onClick={handleExportJSON}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-[#102C4C] bg-white border border-[#E5EAF0] hover:bg-[#F3F6FA] rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#718096]" />
            <span>สำรองข้อมูลระบบ (Export JSON)</span>
          </button>

          <label className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-[#102C4C] bg-white border border-[#E5EAF0] hover:bg-[#F3F6FA] rounded-xl shadow-xs transition-colors cursor-pointer">
            <Upload className="w-4 h-4 text-[#718096]" />
            <span>นำเข้าข้อมูลจากไฟล์ (Import JSON)</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileImport}
              className="hidden"
            />
          </label>

          {importStatus && (
            <span className="text-xs font-semibold text-[#23865B]">
              {importStatus}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
