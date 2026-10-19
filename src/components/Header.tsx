import React from 'react';
import { WaveMotif } from './WaveMotif';
import { PlusCircle, RotateCcw, Menu, X, Sparkles, ShieldAlert } from 'lucide-react';
import { ActiveTab } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenNewTaskModal: () => void;
  onOpenResetConfirm: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  totalPendingCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onOpenNewTaskModal,
  onOpenResetConfirm,
  mobileMenuOpen,
  setMobileMenuOpen,
  totalPendingCount
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Universal Demo Notice Banner */}
      <div className="bg-[#0B192C] text-slate-100 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 font-semibold text-amber-300">
              <ShieldAlert className="w-3.5 h-3.5" />
              DEMO • ข้อมูลสมมติ
            </span>
            <span className="hidden sm:inline text-slate-400">·</span>
            <span className="text-slate-300 text-[11px] sm:text-xs">
              ระบบต้นแบบโครงงานนวัตกรรมเพื่อการศึกษา • ยังไม่ใช่ระบบราชการจริงของจังหวัดสงขลา
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span className="hidden md:inline">ปีงบประมาณ 2569 (จำลอง)</span>
            <button
              onClick={onOpenResetConfirm}
              className="inline-flex items-center gap-1 text-amber-300 hover:text-amber-200 hover:underline transition-colors cursor-pointer"
              title="คืนค่าข้อมูลตัวอย่างเริ่มต้น"
            >
              <RotateCcw className="w-3 h-3" />
              <span>รีเซ็ตข้อมูลตัวอย่าง</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <WaveMotif size="md" />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-brand font-bold text-lg tracking-tight text-[#0F2038]">
                SONGKHLA AdminFlow
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
              ระบบต้นแบบสนับสนุนการจัดการข้อมูลและการประสานงานภาครัฐ
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links (Desktop/Tablet) */}
        <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-slate-600">
          <button
            onClick={() => onTabChange('dashboard')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-slate-100 text-[#0F2038] font-semibold'
                : 'hover:text-[#0F2038] hover:bg-slate-50'
            }`}
          >
            ภาพรวม
          </button>
          <button
            onClick={() => onTabChange('tracker')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'tracker'
                ? 'bg-slate-100 text-[#0F2038] font-semibold'
                : 'hover:text-[#0F2038] hover:bg-slate-50'
            }`}
          >
            <span>ติดตามงาน</span>
            {totalPendingCount > 0 && (
              <span className="text-[11px] px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded font-mono-numbers">
                {totalPendingCount}
              </span>
            )}
          </button>
          <button
            onClick={() => onTabChange('search')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'search'
                ? 'bg-slate-100 text-[#0F2038] font-semibold'
                : 'hover:text-[#0F2038] hover:bg-slate-50'
            }`}
          >
            ค้นหาข้อมูล
          </button>
          <button
            onClick={() => onTabChange('reports')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'reports'
                ? 'bg-slate-100 text-[#0F2038] font-semibold'
                : 'hover:text-[#0F2038] hover:bg-slate-50'
            }`}
          >
            รายงานสถิติ
          </button>
          <button
            onClick={() => onTabChange('about')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'about'
                ? 'bg-slate-100 text-[#0F2038] font-semibold'
                : 'hover:text-[#0F2038] hover:bg-slate-50'
            }`}
          >
            เกี่ยวกับนวัตกรรม
          </button>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onOpenNewTaskModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium text-white bg-[#0F2038] hover:bg-[#1E3A60] rounded-lg shadow-sm transition-all duration-150 cursor-pointer active:scale-95"
          >
            <PlusCircle className="w-4 h-4 text-amber-300" />
            <span className="whitespace-nowrap">บันทึกเรื่องใหม่</span>
          </button>

          {/* Mobile menu toggle button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="เมนูหลัก"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile / Tablet Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 shadow-lg space-y-1">
          <button
            onClick={() => {
              onTabChange('dashboard');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-slate-100 text-[#0F2038] font-semibold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            ภาพรวม (Dashboard)
          </button>
          <button
            onClick={() => {
              onTabChange('tracker');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition-colors flex items-center justify-between ${
              activeTab === 'tracker'
                ? 'bg-slate-100 text-[#0F2038] font-semibold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>ติดตามงาน (Work Tracker)</span>
            {totalPendingCount > 0 && (
              <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-mono-numbers">
                {totalPendingCount} ค้างอยู่
              </span>
            )}
          </button>
          <button
            onClick={() => {
              onTabChange('search');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'search'
                ? 'bg-slate-100 text-[#0F2038] font-semibold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            ค้นหาข้อมูล (Smart Search)
          </button>
          <button
            onClick={() => {
              onTabChange('reports');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'reports'
                ? 'bg-slate-100 text-[#0F2038] font-semibold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            รายงานสถิติ (Reports)
          </button>
          <button
            onClick={() => {
              onTabChange('about');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'about'
                ? 'bg-slate-100 text-[#0F2038] font-semibold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            เกี่ยวกับนวัตกรรม (About Innovation)
          </button>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">สถานะข้อมูลจำลอง</span>
            <button
              onClick={() => {
                onOpenResetConfirm();
                setMobileMenuOpen(false);
              }}
              className="text-xs text-amber-700 hover:text-amber-800 flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              รีเซ็ตข้อมูลตัวอย่าง
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
