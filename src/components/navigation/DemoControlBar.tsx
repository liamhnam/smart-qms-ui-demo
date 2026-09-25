'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useQms } from '@/context/QmsContext';
import {
  LayoutDashboard,
  Touchpad,
  Tv,
  Headphones,
  Sparkles,
  Volume2,
  VolumeX,
  RotateCcw,
  UserPlus,
  ChevronUp,
  ChevronDown,
  MonitorDot,
} from 'lucide-react';

export default function DemoControlBar() {
  const pathname = usePathname();
  const {
    kpis,
    isSoundEnabled,
    setIsSoundEnabled,
    injectRandomCitizen,
    resetDemoData,
  } = useQms();

  const [isMinimized, setIsMinimized] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const navItems = [
    {
      href: '/dashboard',
      label: 'Tổng quan & Báo cáo',
      badge: `${kpis.completedToday} hoàn thành`,
      icon: LayoutDashboard,
    },
    {
      href: '/kiosk',
      label: 'Kiosk Lấy số',
      badge: `${kpis.totalIssuedToday} vé`,
      icon: Touchpad,
    },
    {
      href: '/display',
      label: 'Màn hình LED TV (7:3)',
      badge: `${kpis.currentlyServing} đang gọi`,
      icon: Tv,
    },
    {
      href: '/teller',
      label: 'Bàn gọi số Cán bộ',
      badge: `${kpis.currentlyWaiting} chờ`,
      icon: Headphones,
    },
    {
      href: '/counter-sign',
      label: 'Bảng điện tử Quầy',
      badge: 'Signage',
      icon: MonitorDot,
    },
    {
      href: '/rating',
      label: 'Tablet Đánh giá',
      badge: `${kpis.satisfactionRate}% hài lòng`,
      icon: Sparkles,
    },
  ];

  const handleAddRandomCitizen = () => {
    const t = injectRandomCitizen();
    showToast(`Đã thêm khách hàng mới: ${t.ticketNumber} (${t.citizen.name})`);
  };

  const handleReset = () => {
    if (window.confirm('Đặt lại toàn bộ dữ liệu demo về trạng thái ban đầu?')) {
      resetDemoData();
      showToast('Đã khôi phục dữ liệu demo ban đầu!');
    }
  };

  return (
    <div className="fixed top-2 left-1/2 -translate-x-1/2 z-50 w-[96%] max-w-7xl">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 px-4 py-2 bg-slate-900/95 text-white text-xs sm:text-sm font-medium rounded-full shadow-2xl backdrop-blur-md border border-slate-700/80 animate-bounce flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          {toastMessage}
        </div>
      )}

      {/* Main Glass Nav Bar */}
      <div className="bg-slate-900/90 text-slate-100 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-2xl p-1.5 sm:p-2 transition-all duration-300">
        <div className="flex items-center justify-between gap-1 sm:gap-3">
          {/* Brand & Mini Status */}
          <div className="flex items-center gap-2 pl-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center font-black text-white shadow-md text-xs sm:text-sm">
              Q
            </div>
            <div className="hidden lg:block">
              <div className="text-xs font-bold tracking-tight text-white flex items-center gap-1.5">
                <span>Smart QMS</span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-md">
                  DEMO SUITE
                </span>
              </div>
              <div className="text-[10px] text-slate-400 flex items-center gap-2">
                <span>Chờ: <strong className="text-amber-400">{kpis.currentlyWaiting}</strong></span>
                <span>•</span>
                <span>Gọi: <strong className="text-emerald-400">{kpis.currentlyServing}</strong></span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          {!isMinimized && (
            <div className="flex items-center gap-1 overflow-x-auto py-0.5 scrollbar-none">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href === '/dashboard' && pathname === '/');
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{item.label}</span>
                    <span className="sm:hidden">{item.label.split(' ')[0]}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-full hidden md:inline-block ${
                        isActive
                          ? 'bg-blue-700/60 text-blue-100'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Quick Simulation Tools */}
          <div className="flex items-center gap-1 pr-1">
            {/* Inject Citizen Button */}
            <button
              onClick={handleAddRandomCitizen}
              title="Mô phỏng 1 công dân đến lấy số mới"
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-500/30 rounded-xl transition-all"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">+ Khách mẫu</span>
            </button>

            {/* Audio Toggle */}
            <button
              onClick={() => setIsSoundEnabled(!isSoundEnabled)}
              title={isSoundEnabled ? 'Tắt âm thanh chuông gọi số' : 'Bật chuông gọi số Ding-dong'}
              className={`p-1.5 sm:px-2 sm:py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1 ${
                isSoundEnabled
                  ? 'bg-blue-600/20 text-blue-300 border-blue-500/30'
                  : 'bg-slate-800 text-slate-500 border-slate-700'
              }`}
            >
              {isSoundEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-blue-400" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-slate-500" />
              )}
              <span className="hidden 2xl:inline">{isSoundEnabled ? 'Âm thanh' : 'Tắt tiếng'}</span>
            </button>

            {/* Reset Button */}
            <button
              onClick={handleReset}
              title="Khôi phục trạng thái demo ban đầu"
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Minimize / Expand Bar */}
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              title={isMinimized ? 'Mở rộng thanh điều hướng' : 'Thu gọn thanh điều hướng'}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all ml-0.5"
            >
              {isMinimized ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronUp className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
