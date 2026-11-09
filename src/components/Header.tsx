import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  Search, 
  Bell, 
  ShieldAlert, 
  RotateCcw, 
  PlusCircle, 
  ChevronDown, 
  ChevronRight, 
  Shield, 
  Lock, 
  Building2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles
} from 'lucide-react';
import { ActiveTab, UserRole, SystemMode } from '../types';
import { WaveMotif } from './WaveMotif';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  userRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  systemMode: SystemMode;
  onToggleMode: (mode: SystemMode) => void;
  onOpenQuickAction: (action: 'employee' | 'course' | 'attendance') => void;
  onOpenResetConfirm: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  totalEmployees: number;
  upcomingCoursesCount: number;
  globalSearch: string;
  onGlobalSearchChange: (q: string) => void;
}

const TAB_TITLES: Record<ActiveTab, { th: string; en: string }> = {
  dashboard: { th: 'ภาพรวมระบบ', en: 'Dashboard' },
  employees: { th: 'ข้อมูลบุคลากร', en: 'Personnel Directory' },
  courses: { th: 'หลักสูตรและโครงการพัฒนา', en: 'Training & Development' },
  attendance: { th: 'การเข้าร่วมฝึกอบรม', en: 'Attendance & Records' },
  development: { th: 'ประวัติการพัฒนา', en: 'Competency Passport' },
  documents: { th: 'เอกสารและหลักฐาน', en: 'Evidence Repository' },
  reports: { th: 'รายงานและสถิติ', en: 'Reports & Analytics' },
  settings: { th: 'ตั้งค่าระบบ', en: 'System Settings' }
};

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  sidebarCollapsed,
  onToggleSidebar,
  userRole,
  onRoleChange,
  systemMode,
  onToggleMode,
  onOpenQuickAction,
  onOpenResetConfirm,
  mobileMenuOpen,
  setMobileMenuOpen,
  totalEmployees,
  upcomingCoursesCount,
  globalSearch,
  onGlobalSearchChange
}) => {
  const [quickActionOpen, setQuickActionOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const currentTabInfo = TAB_TITLES[activeTab] || { th: 'ภาพรวมระบบ', en: 'Dashboard' };

  return (
    <header className="sticky top-0 z-20 w-full bg-white border-b border-[#E5EAF0] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      {/* Universal Demo Notice / Mode Top Banner */}
      <div className={`text-xs py-1.5 px-4 sm:px-6 transition-colors ${
        systemMode === 'demo' ? 'bg-[#0B1F36] text-slate-100' : 'bg-[#102C4C] text-emerald-100'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 font-semibold ${
              systemMode === 'demo' ? 'text-[#C5A45A]' : 'text-emerald-300'
            }`}>
              <ShieldAlert className="w-3.5 h-3.5" />
              {systemMode === 'demo' ? 'DEMO • ข้อมูลสมมติ' : 'REAL MODE • ข้อมูลจริง'}
            </span>
            <span className="hidden sm:inline text-slate-400">·</span>
            <span className="text-[11px] sm:text-xs opacity-90 truncate max-w-xl">
              {systemMode === 'demo'
                ? 'ระบบต้นแบบเพื่อการศึกษาและการสาธิตนวัตกรรม • ฝ่ายทรัพยากรบุคคล ศาลากลางจังหวัดสงขลา (ไม่ใช่ระบบราชการจริง)'
                : 'โหมดบันทึกข้อมูลจริง • เริ่มต้นด้วยฐานข้อมูลว่าง พร้อมเชื่อมต่อ Firebase Firestore'}
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            {/* Mode Switcher */}
            <div className="flex items-center gap-1 bg-white/10 rounded px-1.5 py-0.5">
              <span className="opacity-75">โหมด:</span>
              <button
                onClick={() => onToggleMode('demo')}
                className={`px-1.5 py-0.2 rounded transition-colors cursor-pointer ${
                  systemMode === 'demo' ? 'bg-[#C5A45A] text-[#0B1F36] font-bold' : 'hover:text-white'
                }`}
              >
                สาธิต
              </button>
              <button
                onClick={() => onToggleMode('real')}
                className={`px-1.5 py-0.2 rounded transition-colors cursor-pointer ${
                  systemMode === 'real' ? 'bg-emerald-400 text-slate-900 font-bold' : 'hover:text-white'
                }`}
              >
                จริง
              </button>
            </div>

            {systemMode === 'demo' && (
              <button
                onClick={onOpenResetConfirm}
                className="inline-flex items-center gap-1 text-[#C5A45A] hover:underline transition-colors cursor-pointer"
                title="คืนค่าข้อมูลตัวอย่างเริ่มต้น"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden md:inline">รีเซ็ตข้อมูลตัวอย่าง</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Topbar Row */}
      <div className="px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Sidebar Toggle + Breadcrumb */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="เปิดเมนูหลัก"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Desktop sidebar toggle icon */}
          <button
            onClick={onToggleSidebar}
            className="hidden lg:flex p-2 text-slate-500 hover:text-[#102C4C] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title={sidebarCollapsed ? 'ขยาย Sidebar' : 'ย่อ Sidebar'}
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb Trail */}
          <nav className="flex items-center gap-1.5 text-xs text-[#718096] truncate">
            <button
              onClick={() => onTabChange('dashboard')}
              className="hover:text-[#102C4C] transition-colors cursor-pointer truncate"
            >
              หน้าหลัก
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-semibold text-[#1B2B3A] truncate">
              {currentTabInfo.th}
            </span>
          </nav>
        </div>

        {/* Center: Global Search Input */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ค้นหาข้อมูลบุคลากร, หลักสูตร, วุฒิบัตร ในระบบ..."
              value={globalSearch}
              onChange={(e) => onGlobalSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#E5EAF0] bg-[#F3F6FA] text-[#1B2B3A] placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#245B91] focus:ring-2 focus:ring-[#245B91]/15 transition-all"
            />
          </div>
        </div>

        {/* Right: Quick Action, Notifications, User Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 text-slate-600 hover:text-[#102C4C] hover:bg-slate-100 rounded-xl relative transition-colors cursor-pointer"
              title="การแจ้งเตือนงาน HR"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#D69E36]" />
            </button>

            {/* Notification Popover */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-[#E5EAF0] p-3 z-40 text-xs animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="font-bold text-[#1B2B3A]">การแจ้งเตือนงาน HR</span>
                  <span className="text-[10px] text-[#245B91] font-semibold">2 รายการใหม่</span>
                </div>
                <div className="py-2 space-y-2">
                  <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900 space-y-1">
                    <div className="font-semibold flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-[#D69E36]" />
                      <span>เกณฑ์ชั่วโมงอบรม ก.พ. (30 ชม./ปี)</span>
                    </div>
                    <p className="text-[11px] text-amber-800 leading-tight">
                      มีบุคลากรที่ยังสะสมชั่วโมงไม่ครบตามเกณฑ์รอบประเมิน 6 เดือนแรก
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-900 space-y-1">
                    <div className="font-semibold flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#245B91]" />
                      <span>หลักสูตรเปิดรับสมัคร</span>
                    </div>
                    <p className="text-[11px] text-blue-800 leading-tight">
                      เปิดรับสมัครหลักสูตรการบริหารงบประมาณยุคใหม่ (TR-2569-05)
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setNotificationsOpen(false);
                    onTabChange('dashboard');
                  }}
                  className="w-full py-1.5 text-center text-[11px] font-semibold text-[#245B91] hover:underline"
                >
                  ดูภาพรวมทั้งหมดใน Dashboard
                </button>
              </div>
            )}
          </div>

          {/* Quick Action Button */}
          <div className="relative">
            <button
              onClick={() => setQuickActionOpen(!quickActionOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-[#102C4C] hover:bg-[#245B91] rounded-xl shadow-xs transition-all duration-150 cursor-pointer active:scale-95"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#C5A45A]" />
              <span className="hidden sm:inline">บันทึกข้อมูล</span>
              <span className="sm:hidden">เพิ่ม</span>
              <ChevronDown className="w-3 h-3 opacity-80" />
            </button>

            {quickActionOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-[#E5EAF0] p-1.5 z-40 text-xs">
                <button
                  onClick={() => {
                    setQuickActionOpen(false);
                    onOpenQuickAction('employee');
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors font-medium flex items-center gap-2 cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-[#245B91]" />
                  <span>เพิ่มบุคลากรใหม่</span>
                </button>
                <button
                  onClick={() => {
                    setQuickActionOpen(false);
                    onOpenQuickAction('course');
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors font-medium flex items-center gap-2 cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-[#23865B]" />
                  <span>สร้างหลักสูตรพัฒนาใหม่</span>
                </button>
                <button
                  onClick={() => {
                    setQuickActionOpen(false);
                    onOpenQuickAction('attendance');
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors font-medium flex items-center gap-2 cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-[#D69E36]" />
                  <span>บันทึกการเข้าร่วมอบรม</span>
                </button>
              </div>
            )}
          </div>

          {/* User Profile & Role Selector */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-2 px-2 py-1.5 rounded-xl border border-[#E5EAF0] hover:bg-slate-50 transition-colors text-xs text-slate-700 cursor-pointer"
              title="คลิกเพื่อสลับบทบาทสิทธิ์"
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                userRole === 'admin' ? 'bg-[#0B1F36] text-[#C5A45A]' : 'bg-[#245B91] text-white'
              }`}>
                {userRole === 'admin' ? 'AD' : 'OF'}
              </div>
              <div className="text-left hidden lg:block">
                <div className="font-semibold text-[#1B2B3A] leading-tight">
                  {userRole === 'admin' ? 'สมเกียรติ พัฒนศิริ' : 'กานดา สงขลารักษ์'}
                </div>
                <div className="text-[10px] text-[#718096] flex items-center gap-1">
                  <span>{userRole === 'admin' ? 'ผู้ดูแลระบบ (Admin)' : 'เจ้าหน้าที่ (Officer)'}</span>
                  <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
                </div>
              </div>
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#E5EAF0] p-2 z-40 text-xs">
                <div className="px-2.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  สิทธิ์ผู้ใช้งาน (RBAC Simulation)
                </div>
                <button
                  onClick={() => {
                    onRoleChange('admin');
                    setRoleMenuOpen(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl flex items-start gap-2.5 transition-colors cursor-pointer ${
                    userRole === 'admin' ? 'bg-[#F3F6FA] text-[#102C4C] font-semibold' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Shield className="w-4 h-4 text-[#C5A45A] mt-0.5 shrink-0" />
                  <div>
                    <div className="font-bold">ผู้ดูแลระบบ (Administrator)</div>
                    <div className="text-[10px] text-slate-500 font-normal">สิทธิ์เต็ม: เพิ่ม ลบ แก้ไข ข้อมูลและหลักสูตร</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    onRoleChange('officer');
                    setRoleMenuOpen(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl flex items-start gap-2.5 transition-colors cursor-pointer ${
                    userRole === 'officer' ? 'bg-[#F3F6FA] text-[#102C4C] font-semibold' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Lock className="w-4 h-4 text-[#245B91] mt-0.5 shrink-0" />
                  <div>
                    <div className="font-bold">เจ้าหน้าที่ (HR Officer)</div>
                    <div className="text-[10px] text-slate-500 font-normal">สิทธิ์ปฏิบัติการ: บันทึกการเข้าร่วม ดูข้อมูล</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer (When Open) */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E5EAF0] bg-white px-4 py-3 shadow-lg space-y-1">
          <div className="px-2 pb-1 text-[10px] font-bold tracking-wider uppercase text-slate-400">
            ระบบงานหลัก SONGKHLA HRD
          </div>
          {[
            { id: 'dashboard', label: 'ภาพรวมระบบ (Dashboard)' },
            { id: 'employees', label: `ข้อมูลบุคลากร (${totalEmployees} คน)` },
            { id: 'courses', label: `หลักสูตรและโครงการ (${upcomingCoursesCount} กำลังจัด)` },
            { id: 'attendance', label: 'การเข้าร่วมฝึกอบรม' },
            { id: 'development', label: 'ประวัติการพัฒนา (รายบุคคล)' },
            { id: 'documents', label: 'เอกสารและหลักฐาน' },
            { id: 'reports', label: 'รายงานและสถิติ' },
            { id: 'settings', label: 'ตั้งค่าระบบ' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id as ActiveTab);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                activeTab === item.id
                  ? 'bg-[#102C4C] text-white font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
