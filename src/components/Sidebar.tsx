import React from 'react';
import { ActiveTab } from '../types';
import { 
  LayoutDashboard, 
  ListTodo, 
  Search, 
  BarChart2, 
  Info, 
  RotateCcw, 
  ShieldAlert,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  totalRecordsCount: number;
  pendingCount: number;
  inProgressCount: number;
  onResetDemo: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  totalRecordsCount,
  pendingCount,
  inProgressCount,
  onResetDemo
}) => {
  const navItems: Array<{
    id: ActiveTab;
    labelTh: string;
    labelEn: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number | string;
    badgeColor?: string;
  }> = [
    {
      id: 'dashboard',
      labelTh: 'ภาพรวม',
      labelEn: 'Dashboard',
      icon: LayoutDashboard
    },
    {
      id: 'tracker',
      labelTh: 'ติดตามงาน',
      labelEn: 'Work Tracker',
      icon: ListTodo,
      badge: pendingCount + inProgressCount,
      badgeColor: 'bg-amber-100 text-amber-900'
    },
    {
      id: 'search',
      labelTh: 'ค้นหาข้อมูล',
      labelEn: 'Smart Search',
      icon: Search
    },
    {
      id: 'reports',
      labelTh: 'รายงานสถิติ',
      labelEn: 'Reports & Analytics',
      icon: BarChart2
    },
    {
      id: 'about',
      labelTh: 'เกี่ยวกับนวัตกรรม',
      labelEn: 'About Innovation',
      icon: Info
    }
  ];

  return (
    <aside className="w-64 shrink-0 hidden lg:flex flex-col justify-between bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] p-4 select-none">
      <div className="space-y-6">
        {/* Navigation Group */}
        <div className="space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider uppercase text-slate-400">
            ระบบงานหลัก (Core Modules)
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-[#0F2038] text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
                  <div className="text-left">
                    <span className="block leading-tight">{item.labelTh}</span>
                    <span className={`text-[10px] block leading-tight ${isActive ? 'text-slate-300' : 'text-slate-400'}`}>
                      {item.labelEn}
                    </span>
                  </div>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-mono-numbers px-2 py-0.5 rounded font-semibold ${
                      isActive ? 'bg-amber-400 text-[#0F2038]' : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Quick System Summary Card */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/90 text-xs space-y-2">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            สถานะคลังข้อมูลจำลอง
          </div>
          <div className="flex items-center justify-between text-slate-700">
            <span>ระเบียนงานสะสม</span>
            <span className="font-mono-numbers font-bold text-[#0F2038]">{totalRecordsCount} เรื่อง</span>
          </div>
          <div className="flex items-center justify-between text-slate-700">
            <span>งานรอดำเนินการ</span>
            <span className="font-mono-numbers text-amber-700 font-semibold">{pendingCount} เรื่อง</span>
          </div>
          <div className="flex items-center justify-between text-slate-700">
            <span>กำลังดำเนินการ</span>
            <span className="font-mono-numbers text-sky-700 font-semibold">{inProgressCount} เรื่อง</span>
          </div>

          <div className="pt-2 border-t border-slate-200">
            <button
              onClick={onResetDemo}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 text-[11px] font-medium text-amber-800 hover:text-amber-900 hover:bg-amber-100/60 rounded-md transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>คืนค่าข้อมูลจำลองเริ่มต้น</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar Footer Notice */}
      <div className="pt-4 border-t border-slate-100 space-y-2 text-[11px] text-slate-400">
        <div className="flex items-start gap-1.5 text-slate-500">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
          <span className="leading-tight">
            โครงงานต้นแบบระดับอุดมศึกษา ไม่ใช่ระบบราชการจริง
          </span>
        </div>
        <p className="text-[10px] text-slate-400">
          SONGKHLA AdminFlow · Prototype
        </p>
      </div>
    </aside>
  );
};
