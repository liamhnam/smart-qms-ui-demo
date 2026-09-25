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
      label: 'Tổng quan Điều hành',
      badge: `${kpis.completedToday} hoàn tất`,
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
    showToast(`Đã thêm công dân: ${t.ticketNumber} (${t.citizen.name})`);
  };

  const handleReset = () => {
    if (window.confirm('Khôi phục dữ liệu demo ban đầu?')) {
      resetDemoData();
      showToast('Đã khôi phục dữ liệu demo thành công!');
    }
  };

  return (
    <header className="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[96%] max-w-6xl">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 px-5 py-2.5 bg-[#141413] text-[#F3F0EE] text-sm font-medium rounded-full shadow-2xl border border-white/10 animate-bounce flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#bb302a] animate-ping" />
          {toastMessage}
        </div>
      )}

      {/* Floating White Pill Container (Radius 999px) */}
      <div className="bg-white/95 text-[#141413] backdrop-blur-xl border border-[#141413]/10 rounded-full shadow-[0px_4px_24px_rgba(0,0,0,0.08)] px-4 py-2.5 transition-all duration-300">
        <div className="flex items-center justify-between gap-3">
          {/* Administrative Emblem Logo */}
          <Link href="/dashboard" className="flex items-center gap-3 pl-1 group flex-shrink-0 active:scale-95 transition-transform">
            <img
              src="/logo.png"
              alt="Logo Một Cửa"
              className="w-8 h-8 object-contain drop-shadow-sm transition-transform group-hover:scale-105"
            />
            <div className="hidden lg:block">
              <div className="text-sm font-bold tracking-tight text-[#141413] flex items-center gap-1.5">
                <span>Smart QMS</span>
                <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider bg-[#bb302a]/10 text-[#bb302a] rounded-full uppercase">
                  Hành chính công
                </span>
              </div>
              <div className="text-xs text-[#555555] flex items-center gap-1.5 font-medium">
                <span>Chờ: <strong className="text-[#141413] font-bold">{kpis.currentlyWaiting}</strong></span>
                <span>•</span>
                <span>Đang gọi: <strong className="text-[#bb302a] font-bold">{kpis.currentlyServing}</strong></span>
              </div>
            </div>
          </Link>

          {/* Navigation Links */}
          {!isMinimized && (
            <nav className="flex items-center gap-1.5 overflow-x-auto py-0.5 scrollbar-none">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href === '/dashboard' && pathname === '/');
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-3.5 py-2.5 min-h-[44px] rounded-[20px] text-xs sm:text-sm transition-all duration-200 whitespace-nowrap active:scale-95 ${
                      isActive
                        ? 'bg-[#141413] text-[#F3F0EE] font-semibold shadow-sm'
                        : 'text-[#444444] hover:text-[#141413] hover:bg-[#F3F0EE] font-medium'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#F79E1B]' : 'text-[#696969]'}`} />
                    <span className="hidden sm:inline tracking-tight">{item.label}</span>
                    <span className="sm:hidden">{item.label.split(' ')[0]}</span>
                    <span
                      className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full hidden md:inline-block font-medium ${
                        isActive
                          ? 'bg-white/20 text-[#F3F0EE]'
                          : 'bg-[#F3F0EE] text-[#555555]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Controls: Add Random, Sound, Reset, Minimize */}
          <div className="flex items-center gap-2 pr-1 flex-shrink-0">
            {/* Add Random Citizen Button */}
            <button
              onClick={handleAddRandomCitizen}
              title="Mô phỏng 1 công dân đến lấy số mới"
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold bg-[#bb302a] hover:bg-[#a62a25] text-white rounded-[20px] transition-all shadow-sm"
            >
              <UserPlus className="w-4 h-4" />
              <span className="hidden xl:inline">+ Thêm khách</span>
            </button>

            {/* Sound Toggle Button */}
            <button
              onClick={() => setIsSoundEnabled(!isSoundEnabled)}
              title={isSoundEnabled ? 'Tắt âm thanh chuông gọi số' : 'Bật chuông gọi số Ding-dong'}
              className={`p-2 sm:px-3 sm:py-2 rounded-[20px] text-xs sm:text-sm font-medium border transition-all flex items-center gap-1.5 ${
                isSoundEnabled
                  ? 'bg-white border-[#141413]/20 text-[#141413]'
                  : 'bg-[#F3F0EE] border-transparent text-[#696969]'
              }`}
            >
              {isSoundEnabled ? (
                <Volume2 className="w-4 h-4 text-[#bb302a]" />
              ) : (
                <VolumeX className="w-4 h-4 text-[#696969]" />
              )}
              <span className="hidden 2xl:inline">{isSoundEnabled ? 'Chuông: Bật' : 'Tắt'}</span>
            </button>

            {/* Reset Button */}
            <button
              onClick={handleReset}
              title="Khôi phục dữ liệu demo ban đầu"
              className="p-2 text-[#696969] hover:text-[#141413] hover:bg-[#F3F0EE] rounded-full transition-all"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Minimize Toggle */}
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              title={isMinimized ? 'Mở rộng thanh điều hướng' : 'Thu gọn thanh điều hướng'}
              className="p-2 text-[#696969] hover:text-[#141413] hover:bg-[#F3F0EE] rounded-full transition-all"
            >
              {isMinimized ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronUp className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
