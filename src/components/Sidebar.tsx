import React from 'react';
import { ActiveTab, UserRole, SystemMode } from '../types';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  ClipboardList, 
  GraduationCap, 
  FolderOpen, 
  ChartNoAxesCombined, 
  Settings, 
  ShieldAlert, 
  Building2,
  ChevronLeft,
  ChevronRight,
  Shield,
  Lock,
  UserCheck
} from 'lucide-react';
import { WaveMotif } from './WaveMotif';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  userRole: UserRole;
  systemMode: SystemMode;
  totalEmployees: number;
  totalCourses: number;
  totalRecords: number;
  passedRecords: number;
  documentsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  collapsed,
  onToggleCollapse,
  userRole,
  systemMode,
  totalEmployees,
  totalCourses,
  totalRecords,
  passedRecords,
  documentsCount
}) => {
  const menuItems: Array<{
    id: ActiveTab;
    labelTh: string;
    labelEn: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number | string;
  }> = [
    {
      id: 'dashboard',
      labelTh: 'ภาพรวมระบบ',
      labelEn: 'Dashboard',
      icon: LayoutDashboard
    },
    {
      id: 'employees',
      labelTh: 'ข้อมูลบุคลากร',
      labelEn: 'Personnel Directory',
      icon: Users,
      badge: totalEmployees
    },
    {
      id: 'courses',
      labelTh: 'หลักสูตรและโครงการ',
      labelEn: 'Training & Programs',
      icon: BookOpen,
      badge: totalCourses
    },
    {
      id: 'attendance',
      labelTh: 'การเข้าร่วมฝึกอบรม',
      labelEn: 'Attendance & Records',
      icon: ClipboardList,
      badge: totalRecords
    },
    {
      id: 'development',
      labelTh: 'ประวัติการพัฒนา',
      labelEn: 'Competency Passport',
      icon: GraduationCap
    },
    {
      id: 'documents',
      labelTh: 'เอกสารและหลักฐาน',
      labelEn: 'Document Repository',
      icon: FolderOpen,
      badge: documentsCount
    },
    {
      id: 'reports',
      labelTh: 'รายงานและสถิติ',
      labelEn: 'Reports & Analytics',
      icon: ChartNoAxesCombined
    },
    {
      id: 'settings',
      labelTh: 'ตั้งค่าระบบ',
      labelEn: 'System Settings',
      icon: Settings
    }
  ];

  return (
    <aside 
      className={`shrink-0 hidden lg:flex flex-col justify-between bg-[#0B1F36] text-white border-r border-[#1B2B3A] select-none transition-layout ${
        collapsed ? 'w-20' : 'w-72'
      } min-h-screen sticky top-0 h-screen z-30`}
    >
      {/* Top Brand Section */}
      <div className="flex flex-col">
        {/* Logo Lockup */}
        <div className={`h-20 flex items-center border-b border-white/10 px-4 ${collapsed ? 'justify-center' : 'justify-between'}`}>
          <div className="flex items-center gap-3 overflow-hidden">
            <WaveMotif size="md" className="shrink-0" />
            {!collapsed && (
              <div className="flex flex-col overflow-hidden">
                <div className="flex items-center gap-1.5">
                  <span className="font-brand font-bold text-base tracking-tight text-white leading-tight">
                    SONGKHLA HRD
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A45A]" />
                </div>
                <span className="text-[10px] text-slate-300 font-medium truncate leading-tight">
                  ระบบพัฒนาทรัพยากรบุคคล
                </span>
                <span className="text-[9px] text-[#C5A45A] font-light truncate">
                  ศาลากลางจังหวัดสงขลา
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Agency Tag Banner (when expanded) */}
        {!collapsed && (
          <div className="px-4 py-3 mx-3 my-3 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 text-white/90 text-xs font-medium">
              <Building2 className="w-3.5 h-3.5 text-[#C5A45A] shrink-0" />
              <span className="truncate">ฝ่ายทรัพยากรบุคคล</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 truncate">
              สำนักงานจังหวัดสงขลา (ศาลากลาง)
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="px-3 py-2 space-y-1 overflow-y-auto max-h-[calc(100vh-280px)]">
          {!collapsed && (
            <div className="px-3 pb-1.5 text-[10px] font-bold tracking-wider uppercase text-slate-400">
              เมนูหลัก (Core Modules)
            </div>
          )}

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer group relative ${
                  collapsed ? 'justify-center py-3 px-2' : 'justify-between py-2.5 px-3'
                } ${
                  isActive
                    ? 'bg-[#102C4C] text-white shadow-sm font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
                title={collapsed ? `${item.labelTh} (${item.labelEn})` : undefined}
              >
                {/* Active Indicator Line on the left */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#C5A45A] rounded-r-md" />
                )}

                <div className="flex items-center gap-3 min-w-0">
                  <Icon 
                    className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? 'text-[#C5A45A]' : 'text-slate-400 group-hover:text-slate-200'
                    }`} 
                  />
                  {!collapsed && (
                    <div className="text-left truncate">
                      <span className="block leading-tight truncate">{item.labelTh}</span>
                      <span className={`text-[10px] block leading-tight truncate ${isActive ? 'text-slate-300' : 'text-slate-400'}`}>
                        {item.labelEn}
                      </span>
                    </div>
                  )}
                </div>

                {!collapsed && item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-mono-numbers px-2 py-0.5 rounded-full font-semibold shrink-0 ${
                      isActive 
                        ? 'bg-[#C5A45A] text-[#0B1F36]' 
                        : 'bg-white/10 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom User & Collapse Section */}
      <div className="border-t border-white/10 p-3 flex flex-col gap-2">
        {/* User Card */}
        <div className={`p-2 rounded-xl bg-white/5 border border-white/10 flex items-center ${collapsed ? 'justify-center' : 'justify-between gap-3'}`}>
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
              userRole === 'admin' ? 'bg-[#C5A45A] text-[#0B1F36]' : 'bg-[#245B91] text-white'
            }`}>
              {userRole === 'admin' ? 'AD' : 'OF'}
            </div>
            {!collapsed && (
              <div className="min-w-0 text-left">
                <div className="text-xs font-semibold text-white truncate leading-tight">
                  {userRole === 'admin' ? 'นายสมเกียรติ พัฒนศิริ' : 'นางสาวกานดา สงขลารักษ์'}
                </div>
                <div className="text-[10px] text-slate-400 truncate flex items-center gap-1">
                  {userRole === 'admin' ? (
                    <span className="text-[#C5A45A] font-medium flex items-center gap-1">
                      <Shield className="w-2.5 h-2.5" /> ผู้ดูแลระบบ (Admin)
                    </span>
                  ) : (
                    <span className="text-sky-300 font-medium flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" /> เจ้าหน้าที่ (Officer)
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Toggle Collapse Button */}
        <button
          onClick={onToggleCollapse}
          className={`w-full py-2 px-3 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/5 flex items-center transition-colors cursor-pointer ${
            collapsed ? 'justify-center' : 'justify-between'
          }`}
          title={collapsed ? 'ขยายแถบเมนู' : 'ย่อแถบเมนู'}
        >
          {!collapsed && <span>ย่อแถบเมนู</span>}
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
};
