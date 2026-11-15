import React from 'react';
import { ActiveTab } from '../types';
import {
  LayoutDashboard,
  FilePlus2,
  FolderKanban,
  Activity,
  UserCheck,
  FileBarChart2,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Building2
} from 'lucide-react';
import { WaveMotif } from './WaveMotif';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  officerName: string;
  officerPosition: string;
  counts: {
    total: number;
    newCases: number;
    unassignedOrPending: number;
    overdue: number;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  collapsed,
  onToggleCollapse,
  officerName,
  officerPosition,
  counts
}) => {
  const menuItems: Array<{
    id: ActiveTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    count?: number;
  }> = [
    {
      id: 'dashboard',
      label: 'หน้าภาพรวม (Dashboard)',
      icon: LayoutDashboard
    },
    {
      id: 'intake',
      label: 'รับเรื่องร้องเรียนร้องทุกข์',
      icon: FilePlus2
    },
    {
      id: 'registry',
      label: 'ทะเบียนข้อมูลเรื่องร้องเรียน',
      icon: FolderKanban,
      count: counts.total
    },
    {
      id: 'tracking',
      label: 'ติดตามสถานะเรื่องร้องเรียน',
      icon: Activity,
      count: counts.overdue > 0 ? counts.overdue : undefined
    },
    {
      id: 'assignment',
      label: 'มอบหมายและประสานงาน',
      icon: UserCheck,
      count: counts.unassignedOrPending > 0 ? counts.unassignedOrPending : undefined
    },
    {
      id: 'reports',
      label: 'รายงานผลการดำเนินงาน',
      icon: FileBarChart2
    },
    {
      id: 'analytics',
      label: 'สถิติและวิเคราะห์ข้อมูล',
      icon: BarChart3
    },
    {
      id: 'settings',
      label: 'จัดการข้อมูลและตั้งค่าระบบ',
      icon: Settings
    }
  ];

  const initials = officerName.replace(/^(นาย|นางสาว|นาง|ว่าที่ ร\.ต\.|ดร\.)/, '').trim().slice(0, 2) || 'จท';

  return (
    <aside
      className={`shrink-0 hidden lg:flex flex-col justify-between bg-[#0B1F36] text-white border-r border-[#183354] select-none transition-layout sticky top-0 h-screen z-30 no-print ${
        collapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Top Brand + Nav */}
      <div className="flex flex-col min-h-0">
        {/* Brand Header */}
        <div className={`h-18 flex items-center border-b border-white/10 px-4 ${collapsed ? 'justify-center' : 'justify-between'}`}>
          <div className="flex items-center gap-3 min-w-0">
            <WaveMotif size="md" className="shrink-0" />
            {!collapsed && (
              <div className="min-w-0">
                <div className="font-brand font-bold text-sm tracking-tight text-white truncate">
                  SONGKHLA DAMRONGDHAM
                </div>
                <div className="text-[11px] text-[#C5A45A] font-medium tracking-wide truncate">
                  CONNECT · ศูนย์ดำรงธรรมจังหวัดสงขลา
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Agency Unit Context */}
        {!collapsed && (
          <div className="px-3.5 py-2.5 mx-3 mt-3 mb-1 rounded-lg bg-white/[0.04] border border-white/10">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-100">
              <Building2 className="w-3.5 h-3.5 text-[#C5A45A] shrink-0" />
              <span className="truncate">ศูนย์ดำรงธรรมจังหวัดสงขลา</span>
            </div>
            <div className="text-[11px] text-slate-300/80 mt-0.5 truncate pl-5">
              ศาลากลางจังหวัดสงขลา · ต้นแบบข้อมูลสมมติ
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="px-3 py-3 space-y-1 overflow-y-auto flex-1" aria-label="เมนูหลัก">
          {!collapsed && (
            <div className="px-3 pb-1.5 text-[11px] font-medium text-slate-400">
              ระบบงานบริการประชาชน
            </div>
          )}

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center rounded-lg text-[13px] transition-colors duration-150 cursor-pointer relative group whitespace-nowrap ${
                  collapsed ? 'justify-center py-2.5 px-2' : 'justify-between py-2.5 px-3'
                } ${
                  isActive
                    ? 'bg-[#143357] text-white font-semibold'
                    : 'text-slate-200/85 hover:text-white hover:bg-white/[0.06] font-normal'
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#C5A45A] rounded-r" />
                )}

                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-[#C5A45A]' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </div>

                {!collapsed && item.count !== undefined && (
                  <span
                    className={`text-xs font-mono-numbers ml-2 shrink-0 ${
                      isActive ? 'text-[#C5A45A] font-semibold' : 'text-slate-400'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Officer Summary & Collapse Control */}
      <div className="border-t border-white/10 p-3 space-y-2">
        <div
          className={`p-2 rounded-lg bg-white/[0.04] border border-white/10 flex items-center ${
            collapsed ? 'justify-center' : 'gap-2.5'
          }`}
        >
          <div className="w-8 h-8 rounded-lg bg-[#1C4678] border border-[#C5A45A]/40 text-[#C5A45A] flex items-center justify-center font-bold text-xs shrink-0">
            {initials}
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="text-xs font-semibold text-white truncate">{officerName}</div>
              <div className="text-[11px] text-slate-300/80 truncate">{officerPosition}</div>
            </div>
          )}
        </div>

        <button
          onClick={onToggleCollapse}
          className={`w-full py-2 px-3 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-white/[0.06] flex items-center transition-colors cursor-pointer ${
            collapsed ? 'justify-center' : 'justify-between'
          }`}
          title={collapsed ? 'ขยายแถบเมนู' : 'ย่อแถบเมนู'}
        >
          {!collapsed && <span>ย่อแถบเมนูด้านข้าง</span>}
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
};
