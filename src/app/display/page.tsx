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

  // Waiting tickets list
  const waitingTickets = tickets
    .filter((t) => t.status === 'WAITING')
    .slice(0, 8);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between pt-14 sm:pt-16 pb-2 px-3 sm:px-6 select-none overflow-hidden">
      {/* Top Header Bar for Hall Display */}
      <header className="flex items-center justify-between py-3 px-6 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-2xl mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center font-bold text-white text-lg shadow-md">
            ★
          </div>
          <div>
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest block">
              BẢNG ĐIỀU TIẾT GỌI SỐ TRUNG TÂM
            </span>
            <h1 className="text-lg sm:text-xl font-black text-white tracking-wide">
              TRUNG TÂM PHỤC VỤ HÀNH CHÍNH CÔNG
            </h1>
          </div>
        </div>

        {/* Layout Switcher & Live Clock */}
        <div className="flex items-center gap-5">
          {/* Layout buttons */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700 text-xs">
            <button
              onClick={() => setLayoutMode('7-3')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                layoutMode === '7-3' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Bố cục 7:3
            </button>
            <button
              onClick={() => setLayoutMode('5-5')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                layoutMode === '5-5' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Bố cục 5:5
            </button>
            <button
              onClick={() => setLayoutMode('full')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                layoutMode === 'full' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Toàn màn hình
            </button>
          </div>

          {/* Clock */}
          <div className="text-right">
            <div className="text-xl sm:text-2xl font-black font-mono text-cyan-400 tracking-wider">
              {currentTime
                ? currentTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                : '--:--:--'}
            </div>
            <div className="text-[11px] text-slate-400">
              {currentTime
                ? currentTime.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })
                : ''}
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid: Calling Area + Media/Info Panel */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 mb-2 min-h-0">
        {/* Left Side: Active Calling Counters (70% in 7:3 mode) */}
        <section
          className={`${
            layoutMode === '7-3'
              ? 'lg:col-span-8'
              : layoutMode === '5-5'
              ? 'lg:col-span-6'
              : 'lg:col-span-12'
          } flex flex-col justify-between gap-3`}
        >
          {/* Counters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
            {counters.map((counter) => {
              const servingTicket = tickets.find((t) => t.id === counter.currentTicketId);
              const isJustCalled =
                recentlyCalledTicket && servingTicket && recentlyCalledTicket.id === servingTicket.id;

              return (
                <div
                  key={counter.id}
                  className={`relative overflow-hidden rounded-3xl border transition-all duration-500 p-5 sm:p-6 flex flex-col justify-between ${
                    isJustCalled
                      ? 'bg-gradient-to-br from-blue-900/90 via-indigo-900/90 to-blue-950 border-cyan-400 shadow-[0_0_35px_rgba(34,211,238,0.35)] ring-2 ring-cyan-400'
                      : servingTicket
                      ? 'bg-slate-900/90 border-slate-700/80 shadow-xl'
                      : 'bg-slate-900/50 border-slate-800/80 opacity-75'
                  }`}
                >
                  {/* Top: Counter Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="px-3.5 py-1.5 rounded-xl bg-blue-600 text-white font-black text-sm tracking-wide shadow-md">
                        QUẦY {counter.code}
                      </div>
                      <div>
                        <h2 className="text-sm sm:text-base font-bold text-white truncate max-w-[200px]">
                          {counter.title.split('-')[1]?.trim() || counter.title}
                        </h2>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {servingTicket ? (
                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                          ĐANG PHỤC VỤ
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                          TẠM NGHỈ / CHỜ
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Middle: Giant Queue Number Display */}
                  <div className="py-4 text-center">
                    <div className="text-xs uppercase tracking-widest text-slate-400 mb-1 font-semibold">
                      SỐ THỨ TỰ ĐANG GỌI
                    </div>
                    {servingTicket ? (
                      <div
                        className={`text-6xl sm:text-7xl lg:text-8xl font-black font-mono tracking-tight transition-transform ${
                          isJustCalled ? 'text-cyan-300 scale-105 animate-pulse' : 'text-amber-400'
                        }`}
                      >
                        {servingTicket.ticketNumber}
                      </div>
                    ) : (
                      <div className="text-6xl sm:text-7xl font-mono font-bold text-slate-700">
                        ----
                      </div>
                    )}
                    {servingTicket?.citizen.isPriority && (
                      <span className="inline-block mt-1 px-3 py-0.5 bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold rounded-full">
                        ★ ƯU TIÊN
                      </span>
                    )}
                  </div>

                  {/* Bottom: Staff Info */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs text-slate-400">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={counter.assignedStaff.avatarUrl}
                        alt={counter.assignedStaff.fullName}
                        className="w-8 h-8 rounded-full object-cover border border-slate-600"
                      />
                      <div>
                        <div className="text-white font-medium">{counter.assignedStaff.fullName}</div>
                        <div className="text-[10px] text-slate-500">{counter.assignedStaff.employeeCode}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-slate-300 font-medium">Hôm nay: {counter.todayServedCount} vé</div>
                      <div className="text-[10px] text-emerald-400">★ {counter.assignedStaff.ratingAverage}/5</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Queue Banner: Next Waiting Numbers */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2 whitespace-nowrap">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                SẮP ĐẾN LƯỢT:
              </span>
            </div>

            <div className="flex items-center gap-2.5 overflow-x-auto w-full sm:w-auto py-1">
              {waitingTickets.length > 0 ? (
                waitingTickets.map((wt) => (
                  <div
                    key={wt.id}
                    className="px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 text-slate-200 font-mono font-bold text-sm sm:text-base flex items-center gap-1.5 shadow"
                  >
                    <span>{wt.ticketNumber}</span>
                    {wt.citizen.isPriority && (
                      <span className="text-[10px] text-amber-400">★</span>
                    )}
                  </div>
                ))
              ) : (
                <span className="text-xs text-slate-500 italic">Hiện không có vé đang chờ</span>
              )}
            </div>
          </div>
        </section>

        {/* Right Side: Media, News, Guidelines (30% in 7:3 mode) */}
        {layoutMode !== 'full' && (
          <section
            className={`${
              layoutMode === '7-3' ? 'lg:col-span-4' : 'lg:col-span-6'
            } flex flex-col justify-between gap-3`}
          >
            {/* Media Player Box (Simulated Video / Livestream) */}
            <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-4 shadow-xl flex-1 flex flex-col justify-between relative overflow-hidden group">
              <div className="relative rounded-2xl bg-slate-950 aspect-video overflow-hidden border border-slate-800 flex items-center justify-center">
                {/* Simulated propaganda video graphic */}
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/40 via-indigo-950/60 to-purple-900/40 flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white mb-3 shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-7 h-7 text-cyan-400 fill-cyan-400" />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">
                    Cổng Dịch vụ công Quốc gia & Định danh VNeID
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Hướng dẫn thực hiện nộp hồ sơ trực tuyến cấp đổi giấy tờ 24/7
                  </p>
                </div>

                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-red-600 text-white text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  PHÁT TRỰC TIẾP
                </div>
              </div>

              {/* Weather & Notice Section */}
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-3">
                  <CloudSun className="w-7 h-7 text-amber-400" />
                  <div>
                    <div className="text-sm font-bold text-white">29°C</div>
                    <div className="text-[10px] text-slate-400">TP. Hồ Chí Minh • Nắng đẹp</div>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-3">
                  <Bell className="w-6 h-6 text-blue-400" />
                  <div>
                    <div className="text-xs font-bold text-white">Hướng dẫn</div>
                    <div className="text-[10px] text-slate-400">Chuẩn bị sẵn CCCD gốc</div>
                  </div>
                </div>
              </div>

              {/* Public Notice Card */}
              <div className="mt-3 p-3.5 rounded-2xl bg-gradient-to-r from-blue-950/60 to-indigo-950/60 border border-blue-900/60 text-xs">
                <span className="text-[10px] font-bold uppercase text-blue-400 tracking-wider block mb-1">
                  THÔNG BÁO QUAN TRỌNG
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Quý công dân vui lòng giữ phiếu số thứ tự nguyên vẹn, chú ý lắng nghe số gọi trên hệ thống loa truyền thanh và tiến vào đúng quầy phục vụ.
                </p>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Running Marquee Ticker at the Bottom */}
      <footer className="bg-slate-900/90 rounded-xl border border-slate-800 py-2 px-4 shadow-lg overflow-hidden flex items-center gap-3">
        <div className="px-2.5 py-1 bg-red-600 text-white text-[11px] font-bold rounded-lg uppercase tracking-wider whitespace-nowrap shadow flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
          BẢN TIN
        </div>

        <div className="overflow-hidden relative w-full text-xs text-slate-300 whitespace-nowrap">
          <div className="inline-block animate-[marquee_25s_linear_infinite]">
            ★ Kính chào Quý công dân đến với Trung tâm Phục vụ Hành chính công. Vui lòng xuất trình CCCD gắn chíp khi tới lượt gọi số. • Dịch vụ công trực tuyến mức độ 4 giúp quý vị nộp hồ sơ tại nhà thuận tiện và nhanh chóng. • Đường dây nóng giải đáp thắc mắc: 1900 1234.
          </div>
        </div>
      </footer>
    </div>
  );
}
