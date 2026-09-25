'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect } from 'react';
import { useQms } from '@/context/QmsContext';
import {
  CloudSun,
  Bell,
  Play,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export default function DisplayPage() {
  const { counters, tickets, recentlyCalledTicket } = useQms();
  const [layoutMode, setLayoutMode] = useState<'7-3' | '5-5' | 'full'>('7-3');
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentTime(new Date());
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const waitingTickets = tickets
    .filter((t) => t.status === 'WAITING')
    .slice(0, 8);

  return (
    <div className="min-h-screen bg-[#F3F0EE] text-[#141413] flex flex-col justify-between pt-14 sm:pt-16 pb-3 px-4 sm:px-8 select-none overflow-hidden relative">
      {/* Top Header Bar (Stadium 40px / White Pill on Canvas Cream) */}
      <header className="flex items-center justify-between py-4 px-8 bg-[#FCFBFA] rounded-[40px] border border-[#141413]/10 shadow-[0px_4px_24px_rgba(0,0,0,0.03)] mb-4">
        <div className="flex items-center gap-4">
          {/* Dual-Circle Administrative Mark (#bb302a + #F79E1B) */}
          <div className="relative flex items-center h-10">
            <div className="w-8 h-8 rounded-full bg-[#bb302a] opacity-95 shadow-sm" />
            <div className="w-8 h-8 rounded-full bg-[#F79E1B] opacity-90 -ml-4 mix-blend-multiply" />
          </div>
          <div>
            <span className="eyebrow-label text-[#bb302a] block">
              • BẢNG ĐIỀU TIẾT GỌI SỐ TRUNG TÂM
            </span>
            <h1 className="text-lg sm:text-xl font-medium text-[#141413] tracking-tight">
              Trung tâm Phục vụ Hành chính công
            </h1>
          </div>
        </div>

        {/* Layout Switcher & Live Clock */}
        <div className="flex items-center gap-6">
          {/* Layout mode buttons (Pills 20px radius) */}
          <div className="hidden sm:flex items-center gap-1 bg-[#F3F0EE] p-1 rounded-full border border-[#141413]/10 text-xs font-medium">
            <button
              onClick={() => setLayoutMode('7-3')}
              className={`px-3 py-1.5 rounded-full transition-all ${
                layoutMode === '7-3'
                  ? 'bg-[#141413] text-[#F3F0EE] shadow-sm'
                  : 'text-[#696969] hover:text-[#141413]'
              }`}
            >
              Bố cục 7:3
            </button>
            <button
              onClick={() => setLayoutMode('5-5')}
              className={`px-3 py-1.5 rounded-full transition-all ${
                layoutMode === '5-5'
                  ? 'bg-[#141413] text-[#F3F0EE] shadow-sm'
                  : 'text-[#696969] hover:text-[#141413]'
              }`}
            >
              Bố cục 5:5
            </button>
            <button
              onClick={() => setLayoutMode('full')}
              className={`px-3 py-1.5 rounded-full transition-all ${
                layoutMode === 'full'
                  ? 'bg-[#141413] text-[#F3F0EE] shadow-sm'
                  : 'text-[#696969] hover:text-[#141413]'
              }`}
            >
              Toàn màn hình
            </button>
          </div>

          {/* Clock */}
          <div className="text-right">
            <div className="text-xl sm:text-2xl font-medium font-mono text-[#141413] tracking-tight">
              {currentTime
                ? currentTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                : '--:--:--'}
            </div>
            <div className="text-[11px] text-[#696969]">
              {currentTime
                ? currentTime.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })
                : ''}
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid: Calling Area + Media/Info Panel */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 mb-3 min-h-0">
        {/* Left Side: Active Calling Counters (70% in 7:3 mode) */}
        <section
          className={`${
            layoutMode === '7-3'
              ? 'lg:col-span-8'
              : layoutMode === '5-5'
              ? 'lg:col-span-6'
              : 'lg:col-span-12'
          } flex flex-col justify-between gap-4`}
        >
          {/* Counters Grid with 40px Stadium Containers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
            {counters.map((counter) => {
              const servingTicket = tickets.find((t) => t.id === counter.currentTicketId);
              const isJustCalled =
                recentlyCalledTicket && servingTicket && recentlyCalledTicket.id === servingTicket.id;

              return (
                <div
                  key={counter.id}
                  className={`relative overflow-hidden rounded-[40px] border transition-all duration-500 p-6 flex flex-col justify-between ${
                    isJustCalled
                      ? 'bg-white border-[#bb302a] shadow-[0px_24px_48px_rgba(187,48,42,0.18)] ring-2 ring-[#bb302a]/30'
                      : servingTicket
                      ? 'bg-[#FCFBFA] border-[#141413]/10 shadow-[0px_4px_24px_rgba(0,0,0,0.04)]'
                      : 'bg-[#FCFBFA]/60 border-[#141413]/5 opacity-80'
                  }`}
                >
                  {/* Top: Counter Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-[#141413]/10">
                    <div className="flex items-center gap-3">
                      {/* Counter code pill */}
                      <div className="px-3.5 py-1.5 rounded-full bg-[#bb302a] text-white font-medium text-xs tracking-wider shadow-sm uppercase">
                        QUẦY {counter.code}
                      </div>
                      <h2 className="text-sm sm:text-base font-medium text-[#141413] truncate max-w-[200px]">
                        {counter.title.split('-')[1]?.trim() || counter.title}
                      </h2>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {servingTicket ? (
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#bb302a]/10 text-[#bb302a]">
                          <span className="w-2 h-2 rounded-full bg-[#bb302a] animate-ping" />
                          ĐANG PHỤC VỤ
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#F3F0EE] text-[#696969]">
                          CHỜ PHỤC VỤ
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Middle: Giant Queue Number Display */}
                  <div className="py-4 text-center">
                    <span className="eyebrow-label text-[#696969] block mb-1">
                      • SỐ THỨ TỰ ĐANG GỌI
                    </span>
                    {servingTicket ? (
                      <div
                        className={`text-6xl sm:text-7xl lg:text-8xl font-medium font-mono tracking-tight transition-transform ${
                          isJustCalled ? 'text-[#bb302a] scale-105 animate-pulse' : 'text-[#141413]'
                        }`}
                      >
                        {servingTicket.ticketNumber}
                      </div>
                    ) : (
                      <div className="text-6xl sm:text-7xl font-mono font-medium text-[#696969]/40">
                        ----
                      </div>
                    )}
                    {servingTicket?.citizen.isPriority && (
                      <span className="inline-block mt-1 px-3 py-0.5 bg-[#F79E1B]/15 text-[#9A3A0A] text-xs font-bold rounded-full">
                        ★ ƯU TIÊN
                      </span>
                    )}
                  </div>

                  {/* Bottom: Circular Staff Portrait & Details */}
                  <div className="flex items-center justify-between pt-3 border-t border-[#141413]/10 text-xs text-[#696969]">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={counter.assignedStaff.avatarUrl}
                          alt={counter.assignedStaff.fullName}
                          className="w-10 h-10 rounded-full object-cover border border-[#141413]/10"
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
                      </div>
                      <div>
                        <div className="text-[#141413] font-medium">{counter.assignedStaff.fullName}</div>
                        <div className="text-[10px] text-[#696969]">{counter.assignedStaff.title}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[#141413] font-medium">Hôm nay: {counter.todayServedCount} lượt</div>
                      <div className="text-[10px] text-[#bb302a] font-bold">★ {counter.assignedStaff.ratingAverage}/5</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Queue Banner: Next Waiting Numbers (40px Stadium) */}
          <div className="bg-[#FCFBFA] rounded-[40px] border border-[#141413]/10 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0px_4px_24px_rgba(0,0,0,0.03)]">
            <div className="flex items-center gap-2 whitespace-nowrap pl-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#bb302a] animate-ping" />
              <span className="eyebrow-label text-[#bb302a]">
                • SẮP ĐẾN LƯỢT:
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto py-1 pr-2">
              {waitingTickets.length > 0 ? (
                waitingTickets.map((wt) => (
                  <div
                    key={wt.id}
                    className="px-3.5 py-1.5 rounded-full bg-[#F3F0EE] border border-[#141413]/10 text-[#141413] font-mono font-medium text-sm flex items-center gap-1.5 shadow-sm"
                  >
                    <span>{wt.ticketNumber}</span>
                    {wt.citizen.isPriority && (
                      <span className="text-[10px] text-[#bb302a]">★</span>
                    )}
                  </div>
                ))
              ) : (
                <span className="text-xs text-[#696969] italic">Hiện không có vé đang chờ</span>
              )}
            </div>
          </div>
        </section>

        {/* Right Side: Media, Weather, Administrative Notice (30% in 7:3 mode) */}
        {layoutMode !== 'full' && (
          <section
            className={`${
              layoutMode === '7-3' ? 'lg:col-span-4' : 'lg:col-span-6'
            } flex flex-col justify-between gap-4`}
          >
            {/* Media Player Stadium Box (Mastercard hero frame style: 40px radius) */}
            <div className="bg-[#FCFBFA] rounded-[40px] border border-[#141413]/10 p-5 shadow-[0px_4px_24px_rgba(0,0,0,0.03)] flex-1 flex flex-col justify-between">
              {/* Media Player Frame */}
              <div className="relative rounded-[28px] bg-[#141413] aspect-video overflow-hidden border border-[#141413] flex items-center justify-center group shadow-md">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#bb302a]/20 via-[#141413]/80 to-[#141413]/90 flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white mb-3 shadow-lg group-hover:scale-105 transition-transform">
                    <Play className="w-6 h-6 text-[#F79E1B] fill-[#F79E1B]" />
                  </div>
                  <h4 className="text-sm font-medium text-white mb-1">
                    Cổng Dịch vụ công Quốc gia & Định danh VNeID
                  </h4>
                  <p className="text-[11px] text-[#F3F0EE]/80 leading-snug">
                    Hướng dẫn thực hiện nộp hồ sơ trực tuyến cấp đổi giấy tờ 24/7
                  </p>
                </div>

                <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-[#bb302a] text-white text-[9px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  PHÁT TRỰC TIẾP
                </div>
              </div>

              {/* Weather & Notice Chips */}
              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-[20px] bg-[#F3F0EE] border border-[#141413]/5 flex items-center gap-3">
                  <CloudSun className="w-7 h-7 text-[#F79E1B]" />
                  <div>
                    <div className="text-sm font-medium text-[#141413]">29°C</div>
                    <div className="text-[10px] text-[#696969]">TP. Hồ Chí Minh • Nắng đẹp</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-[20px] bg-[#F3F0EE] border border-[#141413]/5 flex items-center gap-3">
                  <Bell className="w-6 h-6 text-[#bb302a]" />
                  <div>
                    <div className="text-xs font-medium text-[#141413]">Lưu ý</div>
                    <div className="text-[10px] text-[#696969]">Chuẩn bị sẵn CCCD gốc</div>
                  </div>
                </div>
              </div>

              {/* Public Notice Card */}
              <div className="mt-4 p-4 rounded-[24px] bg-[#F3F0EE] border border-[#141413]/10 text-xs">
                <span className="eyebrow-label text-[#bb302a] block mb-1">
                  • THÔNG BÁO QUAN TRỌNG
                </span>
                <p className="text-[#555555] text-[11px] leading-relaxed">
                  Quý công dân vui lòng giữ phiếu số thứ tự nguyên vẹn, chú ý lắng nghe số gọi trên hệ thống loa truyền thanh và tiến vào đúng quầy phục vụ.
                </p>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Running Marquee Ticker at the Bottom (White Pill) */}
      <footer className="bg-[#FCFBFA] rounded-full border border-[#141413]/10 py-2.5 px-6 shadow-sm overflow-hidden flex items-center gap-4">
        <div className="px-3 py-1 bg-[#bb302a] text-white text-[11px] font-bold rounded-full uppercase tracking-wider whitespace-nowrap shadow-sm flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
          BẢN TIN
        </div>

        <div className="overflow-hidden relative w-full text-xs text-[#555555] whitespace-nowrap font-medium">
          <div className="inline-block animate-[marquee_25s_linear_infinite]">
            ★ Kính chào Quý công dân đến với Trung tâm Phục vụ Hành chính công. Vui lòng xuất trình CCCD gắn chíp khi tới lượt gọi số. • Dịch vụ công trực tuyến mức độ 4 giúp quý vị nộp hồ sơ tại nhà thuận tiện và nhanh chóng. • Đường dây nóng giải đáp thắc mắc: 1900 1234.
          </div>
        </div>
      </footer>
    </div>
  );
}
