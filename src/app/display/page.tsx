'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect } from 'react';
import { useQms } from '@/context/QmsContext';
import {
  CloudSun,
  Bell,
  Play,
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
    <div className="min-h-screen bg-[#F3F0EE] text-[#141413] flex flex-col justify-between pt-24 sm:pt-28 pb-4 px-4 sm:px-8 select-none overflow-hidden relative">
      {/* Top Header Bar (Stadium 40px / White Pill on Canvas Cream) */}
      <header className="flex items-center justify-between py-5 px-8 sm:px-10 bg-[#FCFBFA] rounded-[40px] border border-[#141413]/10 shadow-[0px_4px_24px_rgba(0,0,0,0.03)] mb-4">
        <div className="flex items-center gap-5">
          {/* Dual-Circle Administrative Mark (#bb302a + #F79E1B) */}
          <div className="relative flex items-center h-12 flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-[#bb302a] opacity-95 shadow-sm" />
            <div className="w-10 h-10 rounded-full bg-[#F79E1B] opacity-90 -ml-5 mix-blend-multiply" />
          </div>
          <div>
            <span className="text-xs sm:text-sm font-bold text-[#bb302a] tracking-wider uppercase block mb-0.5">
              • BẢNG ĐIỀU TIẾT GỌI SỐ TRUNG TÂM
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-[#141413] tracking-tight">
              Trung tâm Phục vụ Hành chính công
            </h1>
          </div>
        </div>

        {/* Layout Switcher & Live Clock */}
        <div className="flex items-center gap-6">
          {/* Layout mode buttons */}
          <div className="hidden sm:flex items-center gap-1.5 bg-[#F3F0EE] p-1.5 rounded-full border border-[#141413]/10 text-xs sm:text-sm font-semibold">
            <button
              onClick={() => setLayoutMode('7-3')}
              className={`px-4 py-2 rounded-full transition-all ${
                layoutMode === '7-3'
                  ? 'bg-[#141413] text-[#F3F0EE] shadow-sm'
                  : 'text-[#696969] hover:text-[#141413]'
              }`}
            >
              Bố cục 7:3
            </button>
            <button
              onClick={() => setLayoutMode('5-5')}
              className={`px-4 py-2 rounded-full transition-all ${
                layoutMode === '5-5'
                  ? 'bg-[#141413] text-[#F3F0EE] shadow-sm'
                  : 'text-[#696969] hover:text-[#141413]'
              }`}
            >
              Bố cục 5:5
            </button>
            <button
              onClick={() => setLayoutMode('full')}
              className={`px-4 py-2 rounded-full transition-all ${
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
            <div className="text-2xl sm:text-3xl font-bold font-mono text-[#141413] tracking-tight">
              {currentTime
                ? currentTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                : '--:--:--'}
            </div>
            <div className="text-xs sm:text-sm text-[#696969] font-medium mt-0.5">
              {currentTime
                ? currentTime.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })
                : ''}
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid: Calling Area + Media/Info Panel */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 mb-4 min-h-0">
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
                  className={`relative overflow-hidden rounded-[40px] border transition-all duration-500 p-6 sm:p-7 flex flex-col justify-between ${
                    isJustCalled
                      ? 'bg-white border-[#bb302a] shadow-[0px_24px_48px_rgba(187,48,42,0.18)] ring-2 ring-[#bb302a]/30'
                      : servingTicket
                      ? 'bg-[#FCFBFA] border-[#141413]/10 shadow-[0px_4px_24px_rgba(0,0,0,0.04)]'
                      : 'bg-[#FCFBFA]/60 border-[#141413]/5 opacity-80'
                  }`}
                >
                  {/* Top: Counter Header */}
                  <div className="flex items-center justify-between pb-3.5 border-b border-[#141413]/10">
                    <div className="flex items-center gap-3.5">
                      <div className="px-4 py-1.5 rounded-full bg-[#bb302a] text-white font-bold text-xs sm:text-sm tracking-wider shadow-sm uppercase">
                        QUẦY {counter.code}
                      </div>
                      <h2 className="text-base sm:text-lg font-bold text-[#141413] truncate max-w-[210px]">
                        {counter.title.split('-')[1]?.trim() || counter.title}
                      </h2>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {servingTicket ? (
                        <span className="flex items-center gap-2 px-3.5 py-1 rounded-full text-xs sm:text-sm font-bold bg-[#bb302a]/10 text-[#bb302a]">
                          <span className="w-2 h-2 rounded-full bg-[#bb302a] animate-ping" />
                          ĐANG PHỤC VỤ
                        </span>
                      ) : (
                        <span className="px-3.5 py-1 rounded-full text-xs sm:text-sm font-medium bg-[#F3F0EE] text-[#696969]">
                          CHỜ PHỤC VỤ
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Middle: Giant Queue Number Display */}
                  <div className="py-5 text-center">
                    <span className="text-xs sm:text-sm font-bold text-[#696969] tracking-wider uppercase block mb-1">
                      • SỐ THỨ TỰ ĐANG GỌI
                    </span>
                    {servingTicket ? (
                      <div
                        className={`text-7xl sm:text-8xl lg:text-9xl font-bold font-mono tracking-tight transition-transform ${
                          isJustCalled ? 'text-[#bb302a] scale-105 animate-pulse' : 'text-[#141413]'
                        }`}
                      >
                        {servingTicket.ticketNumber}
                      </div>
                    ) : (
                      <div className="text-7xl sm:text-8xl font-mono font-medium text-[#696969]/30">
                        ----
                      </div>
                    )}
                    {servingTicket?.citizen.isPriority && (
                      <span className="inline-block mt-2 px-4 py-1 bg-[#F79E1B]/15 text-[#9A3A0A] text-xs sm:text-sm font-bold rounded-full">
                        ★ KHÁCH ƯU TIÊN
                      </span>
                    )}
                  </div>

                  {/* Bottom: Staff Portrait & Details */}
                  <div className="flex items-center justify-between pt-3.5 border-t border-[#141413]/10 text-xs sm:text-sm text-[#555555]">
                    <div className="flex items-center gap-3.5">
                      <div className="relative">
                        <img
                          src={counter.assignedStaff.avatarUrl}
                          alt={counter.assignedStaff.fullName}
                          className="w-11 h-11 rounded-full object-cover border border-[#141413]/10"
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
                      </div>
                      <div>
                        <div className="text-[#141413] font-bold text-sm sm:text-base">{counter.assignedStaff.fullName}</div>
                        <div className="text-xs text-[#696969] font-medium">{counter.assignedStaff.title}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[#141413] font-bold">Hôm nay: {counter.todayServedCount} lượt</div>
                      <div className="text-xs text-[#bb302a] font-bold">★ {counter.assignedStaff.ratingAverage}/5</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Queue Banner: Next Waiting Numbers (40px Stadium) */}
          <div className="bg-[#FCFBFA] rounded-[40px] border border-[#141413]/10 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0px_4px_24px_rgba(0,0,0,0.03)]">
            <div className="flex items-center gap-2.5 whitespace-nowrap pl-2">
              <span className="w-3 h-3 rounded-full bg-[#bb302a] animate-ping" />
              <span className="text-xs sm:text-sm font-bold text-[#bb302a] tracking-wider uppercase">
                • SẮP ĐẾN LƯỢT:
              </span>
            </div>

            <div className="flex items-center gap-2.5 overflow-x-auto w-full sm:w-auto py-1 pr-2">
              {waitingTickets.length > 0 ? (
                waitingTickets.map((wt) => (
                  <div
                    key={wt.id}
                    className="px-4 py-2 rounded-full bg-[#F3F0EE] border border-[#141413]/10 text-[#141413] font-mono font-bold text-base sm:text-lg flex items-center gap-1.5 shadow-sm"
                  >
                    <span>{wt.ticketNumber}</span>
                    {wt.citizen.isPriority && (
                      <span className="text-xs text-[#bb302a]">★</span>
                    )}
                  </div>
                ))
              ) : (
                <span className="text-sm text-[#696969] italic">Hiện không có vé nào đang chờ trong hàng</span>
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
            {/* Media Player Stadium Box */}
            <div className="bg-[#FCFBFA] rounded-[40px] border border-[#141413]/10 p-6 shadow-[0px_4px_24px_rgba(0,0,0,0.03)] flex-1 flex flex-col justify-between">
              {/* Media Player Frame */}
              <div className="relative rounded-[28px] bg-[#141413] aspect-video overflow-hidden border border-[#141413] flex items-center justify-center group shadow-md">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#bb302a]/20 via-[#141413]/80 to-[#141413]/90 flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white mb-3 shadow-lg group-hover:scale-105 transition-transform">
                    <Play className="w-7 h-7 text-[#F79E1B] fill-[#F79E1B]" />
                  </div>
                  <h4 className="text-base font-bold text-white mb-1">
                    Cổng Dịch vụ công Quốc gia & Định danh VNeID
                  </h4>
                  <p className="text-xs sm:text-sm text-[#F3F0EE]/80 leading-relaxed">
                    Hướng dẫn thực hiện nộp hồ sơ trực tuyến cấp đổi giấy tờ 24/7
                  </p>
                </div>

                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#bb302a] text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  PHÁT TRỰC TIẾP
                </div>
              </div>

              {/* Weather & Notice Chips */}
              <div className="mt-4 grid grid-cols-2 gap-3.5 text-xs">
                <div className="p-4 rounded-[24px] bg-[#F3F0EE] border border-[#141413]/5 flex items-center gap-3.5">
                  <CloudSun className="w-8 h-8 text-[#F79E1B]" />
                  <div>
                    <div className="text-base font-bold text-[#141413]">29°C</div>
                    <div className="text-xs text-[#555555]">TP. Hồ Chí Minh • Nắng đẹp</div>
                  </div>
                </div>

                <div className="p-4 rounded-[24px] bg-[#F3F0EE] border border-[#141413]/5 flex items-center gap-3.5">
                  <Bell className="w-7 h-7 text-[#bb302a]" />
                  <div>
                    <div className="text-sm font-bold text-[#141413]">Lưu ý</div>
                    <div className="text-xs text-[#555555]">Chuẩn bị sẵn CCCD gốc</div>
                  </div>
                </div>
              </div>

              {/* Public Notice Card */}
              <div className="mt-4 p-5 rounded-[28px] bg-[#F3F0EE] border border-[#141413]/10 text-xs">
                <span className="text-xs sm:text-sm font-bold text-[#bb302a] tracking-wider uppercase block mb-1">
                  • THÔNG BÁO QUAN TRỌNG
                </span>
                <p className="text-[#444444] text-xs sm:text-sm leading-relaxed font-medium">
                  Quý công dân vui lòng giữ phiếu số thứ tự nguyên vẹn, chú ý lắng nghe số gọi trên hệ thống loa truyền thanh và tiến vào đúng quầy phục vụ tương ứng.
                </p>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Running Marquee Ticker at the Bottom */}
      <footer className="bg-[#FCFBFA] rounded-full border border-[#141413]/10 py-3 px-6 sm:px-8 shadow-sm overflow-hidden flex items-center gap-4">
        <div className="px-3.5 py-1 bg-[#bb302a] text-white text-xs font-bold rounded-full uppercase tracking-wider whitespace-nowrap shadow-sm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          BẢN TIN
        </div>

        <div className="overflow-hidden relative w-full text-xs sm:text-sm text-[#444444] whitespace-nowrap font-medium">
          <div className="inline-block animate-[marquee_25s_linear_infinite]">
            ★ Kính chào Quý công dân đến với Trung tâm Phục vụ Hành chính công. Vui lòng xuất trình CCCD gắn chíp khi tới lượt gọi số. • Dịch vụ công trực tuyến mức độ 4 giúp quý vị nộp hồ sơ tại nhà thuận tiện và nhanh chóng. • Đường dây nóng giải đáp thắc mắc: 1900 1234.
          </div>
        </div>
      </footer>
    </div>
  );
}
