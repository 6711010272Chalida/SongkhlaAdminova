import React, { useState } from 'react';
import { ActiveTab, ComplaintRecord } from '../types';
import {
  Menu,
  X,
  Search,
  Bell,
  ChevronRight,
  FilePlus2,
  AlertTriangle,
  Clock,
  Info
} from 'lucide-react';
import { isComplaintOverdue } from '../services/storageService';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSubmitGlobalSearch: () => void;
  complaints: ComplaintRecord[];
  onSelectComplaintForTracking: (id: string) => void;
}

const TAB_LABELS: Record<ActiveTab, string> = {
  dashboard: 'หน้าภาพรวม (Dashboard)',
  intake: 'รับเรื่องร้องเรียนร้องทุกข์',
  registry: 'ทะเบียนข้อมูลเรื่องร้องเรียน',
  tracking: 'ติดตามสถานะเรื่องร้องเรียน',
  assignment: 'มอบหมายและประสานงาน',
  reports: 'รายงานผลการดำเนินงาน',
  analytics: 'สถิติและวิเคราะห์ข้อมูล',
  settings: 'จัดการข้อมูลและตั้งค่าระบบ'
};

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  sidebarCollapsed,
  onToggleSidebar,
  mobileMenuOpen,
  setMobileMenuOpen,
  searchQuery,
  onSearchChange,
  onSubmitGlobalSearch,
  complaints,
  onSelectComplaintForTracking
}) => {
  const [notifOpen, setNotifOpen] = useState(false);

  const overdueList = complaints.filter((c) => isComplaintOverdue(c));
  const newList = complaints.filter((c) => c.status === 'new');
  const alertCount = overdueList.length + newList.length;

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSubmitGlobalSearch();
    }
  };

  return (
    <header className="sticky top-0 z-20 w-full bg-white border-b border-[#E5EAF0] no-print">
      {/* Main Topbar */}
      <div className="px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Navigation Toggle & Breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-[#102C4C] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="สลับเมนูนำทาง"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            onClick={onToggleSidebar}
            className="hidden lg:flex p-2 text-slate-500 hover:text-[#102C4C] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title={sidebarCollapsed ? 'ขยายแถบเมนู' : 'ย่อแถบเมนู'}
          >
            <Menu className="w-5 h-5" />
          </button>

          <nav className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 min-w-0" aria-label="Breadcrumb">
            <button
              onClick={() => onTabChange('dashboard')}
              className="hover:text-[#102C4C] transition-colors cursor-pointer whitespace-nowrap hidden sm:inline"
            >
              ศูนย์ดำรงธรรมจังหวัดสงขลา
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 hidden sm:inline" />
            <span className="font-semibold text-[#102C4C] truncate">
              {TAB_LABELS[activeTab]}
            </span>
          </nav>
        </div>

        {/* Center: Search Input */}
        <div className="hidden md:flex items-center flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="ค้นหาเลขที่รับเรื่อง, ชื่อผู้ร้องเรียน, หัวข้อ (กด Enter)..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#E5EAF0] bg-[#F8FAFC] text-[#1B2B3A] placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/15 transition-colors"
            />
          </div>
        </div>

        {/* Right: Notifications & Primary Action */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Prototype Notice Text (quiet, unboxed) */}
          <span className="hidden xl:inline-flex items-center gap-1.5 text-[11px] text-slate-500 pr-2 border-r border-[#E5EAF0] whitespace-nowrap">
            <Info className="w-3.5 h-3.5 text-[#C5A45A]" />
            <span>ระบบต้นแบบ · ข้อมูลสมมติ</span>
          </span>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="p-2 text-slate-600 hover:text-[#102C4C] hover:bg-slate-100 rounded-lg relative transition-colors cursor-pointer"
              title="แจ้งเตือนเรื่องร้องเรียนเร่งด่วนและเกินกำหนด"
              aria-label="การแจ้งเตือน"
            >
              <Bell className="w-4 h-4" />
              {alertCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-[#B91C1C] text-white text-[10px] font-mono-numbers font-semibold flex items-center justify-center">
                  {alertCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-[#E5EAF0] p-3 z-40 text-xs">
                <div className="flex items-center justify-between pb-2.5 border-b border-[#E5EAF0]">
                  <span className="font-semibold text-[#102C4C]">การแจ้งเตือนการติดตาม</span>
                  <span className="text-[11px] font-mono-numbers text-slate-500">{alertCount} รายการ</span>
                </div>

                <div className="py-2 space-y-2 max-h-72 overflow-y-auto">
                  {overdueList.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setNotifOpen(false);
                        onSelectComplaintForTracking(item.id);
                      }}
                      className="w-full text-left p-2.5 rounded-lg bg-rose-50/70 border border-rose-200 hover:bg-rose-50 transition-colors cursor-pointer space-y-0.5"
                    >
                      <div className="flex items-center justify-between text-rose-800 font-semibold">
                        <span className="inline-flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          <span>เกินกำหนดติดตาม</span>
                        </span>
                        <span className="font-mono-numbers text-[11px]">{item.caseNumber}</span>
                      </div>
                      <div className="text-[11px] text-slate-700 truncate">{item.subject}</div>
                    </button>
                  ))}

                  {newList.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setNotifOpen(false);
                        onSelectComplaintForTracking(item.id);
                      }}
                      className="w-full text-left p-2.5 rounded-lg bg-blue-50/70 border border-blue-200 hover:bg-blue-50 transition-colors cursor-pointer space-y-0.5"
                    >
                      <div className="flex items-center justify-between text-blue-800 font-semibold">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 shrink-0" />
                          <span>เรื่องรับใหม่รอดำเนินการ</span>
                        </span>
                        <span className="font-mono-numbers text-[11px]">{item.caseNumber}</span>
                      </div>
                      <div className="text-[11px] text-slate-700 truncate">{item.subject}</div>
                    </button>
                  ))}

                  {alertCount === 0 && (
                    <div className="py-4 text-center text-slate-500">ไม่มีรายการค้างติดตาม</div>
                  )}
                </div>

                <button
                  onClick={() => {
                    setNotifOpen(false);
                    onTabChange('assignment');
                  }}
                  className="w-full mt-1 pt-2 border-t border-[#E5EAF0] text-center text-[11px] font-semibold text-[#1D4ED8] hover:underline cursor-pointer"
                >
                  ไปที่หน้ามอบหมายและประสานงาน
                </button>
              </div>
            )}
          </div>

          {/* Primary Action Button */}
          <button
            onClick={() => onTabChange('intake')}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-[#102C4C] hover:bg-[#1D4ED8] rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <FilePlus2 className="w-4 h-4 text-[#C5A45A]" />
            <span>รับเรื่องร้องเรียนใหม่</span>
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E5EAF0] bg-[#0B1F36] text-white px-4 py-3 space-y-1">
          <div className="mb-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setMobileMenuOpen(false);
                    onSubmitGlobalSearch();
                  }
                }}
                placeholder="ค้นหาเลขที่รับเรื่อง หรือชื่อผู้ร้องเรียน..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-white/10 border border-white/15 text-white placeholder:text-slate-300 focus:outline-none"
              />
            </div>
          </div>

          {(Object.keys(TAB_LABELS) as ActiveTab[]).map((tabId) => (
            <button
              key={tabId}
              onClick={() => {
                onTabChange(tabId);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeTab === tabId
                  ? 'bg-[#143357] text-[#C5A45A] font-semibold'
                  : 'text-slate-200 hover:bg-white/10'
              }`}
            >
              {TAB_LABELS[tabId]}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
