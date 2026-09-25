'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect } from 'react';
import { useQms } from '@/context/QmsContext';
import {
  Star,
  Sparkles,
  ChevronDown,
  UserCheck,
} from 'lucide-react';

export default function CounterSignPage() {
  const { counters, tickets, activeCounterId, setActiveCounterId } = useQms();
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentTime(new Date());
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const counter = counters.find((c) => c.id === activeCounterId) || counters[0];
  const servingTicket = tickets.find(
    (t) => t.id === counter?.currentTicketId && t.status === 'SERVING'
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between pt-16 sm:pt-20 pb-8 px-4 sm:px-8 select-none">
      {/* Top Banner Header */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between py-4 px-6 bg-slate-900/80 rounded-3xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center font-bold text-white text-xl shadow-lg">
            ★
          </div>
          <div>
            <span className="text-[11px] text-amber-400 font-bold uppercase tracking-widest block">
              BẢNG THÔNG TIN ĐIỆN TỬ TẠI QUẦY
            </span>
            <h1 className="text-lg sm:text-xl font-black text-white tracking-wide">
              TRUNG TÂM PHỤC VỤ HÀNH CHÍNH CÔNG
            </h1>
          </div>
        </div>

        {/* Counter Switcher & Clock */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <select
              value={activeCounterId}
              onChange={(e) => setActiveCounterId(e.target.value)}
              className="bg-slate-800 text-cyan-300 font-bold text-xs sm:text-sm px-3 py-1.5 rounded-xl border border-slate-700 cursor-pointer appearance-none pr-7 focus:outline-none"
            >
              {counters.map((c) => (
                <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                  Xem {c.title}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-cyan-400 absolute right-2 top-2.5 pointer-events-none" />
          </div>

          <div className="text-right hidden sm:block">
            <div className="text-lg font-black font-mono text-cyan-400">
              {currentTime
                ? currentTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
                : '--:--'}
            </div>
            <div className="text-[10px] text-slate-400">Thời gian thực</div>
          </div>
        </div>
      </header>

      {/* Main Counter Sign Board */}
      <main className="max-w-5xl mx-auto w-full my-6 flex-1 flex flex-col justify-center">
        <div className="bg-gradient-to-br from-slate-900/90 via-slate-900 to-indigo-950/80 rounded-3xl border border-slate-800 p-8 sm:p-10 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left: Officer Profile */}
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left space-y-4">
            <div className="inline-block px-4 py-1.5 bg-blue-600 text-white text-xs sm:text-sm font-black rounded-2xl shadow-lg uppercase tracking-wider">
              {counter.title}
            </div>

            <div className="flex items-center gap-5">
              <div className="relative">
                <img
                  src={counter.assignedStaff.avatarUrl}
                  alt={counter.assignedStaff.fullName}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-2 border-blue-500 shadow-xl"
                />
                <div className="absolute -bottom-2 -right-2 p-1.5 bg-emerald-500 text-white rounded-full shadow-md">
                  <UserCheck className="w-4 h-4" />
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-400 block mb-0.5">Cán bộ tiếp nhận & thụ lý:</span>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {counter.assignedStaff.fullName}
                </h2>
                <p className="text-xs text-blue-300 font-medium mt-0.5">
                  {counter.assignedStaff.title}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center text-amber-400 text-xs font-bold">
                    <Star className="w-4 h-4 fill-amber-400 mr-1" />
                    <span>{counter.assignedStaff.ratingAverage}</span>
                  </div>
                  <span className="text-xs text-slate-500">
                    ({counter.assignedStaff.ratingCount} lượt đánh giá)
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 text-xs text-slate-400 border-t border-slate-800/80 w-full">
              Bộ phận: <strong className="text-slate-300">{counter.assignedStaff.department}</strong>
            </div>
          </div>

          {/* Right: Giant Serving Number Display */}
          <div className="w-full md:w-80 bg-slate-950/80 rounded-3xl border border-slate-800/90 p-6 sm:p-8 text-center shadow-inner flex flex-col justify-center items-center">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
              SỐ THỨ TỰ ĐANG PHỤC VỤ
            </span>

            {servingTicket ? (
              <div>
                <div className="text-6xl sm:text-7xl font-black font-mono text-amber-400 tracking-tight animate-in zoom-in-95">
                  {servingTicket.ticketNumber}
                </div>
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  ĐANG PHỤC VỤ
                </div>
              </div>
            ) : (
              <div>
                <div className="text-6xl font-mono font-bold text-slate-700">
                  ----
                </div>
                <span className="mt-3 inline-block px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                  SẴN SÀNG ĐÓN TIẾP
                </span>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer motto */}
      <footer className="max-w-5xl mx-auto w-full text-center text-xs text-slate-500 flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-blue-400" />
        <span>Phương châm: &quot;Công khai - Minh bạch - Tận tình - Nhanh chóng&quot;</span>
      </footer>
    </div>
  );
}
