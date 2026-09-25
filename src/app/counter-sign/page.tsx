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
    <div className="min-h-screen bg-[#F3F0EE] text-[#141413] flex flex-col justify-between pt-16 sm:pt-20 pb-8 px-4 sm:px-8 select-none relative overflow-hidden">
      {/* Ghost Watermark Headline */}
      <div className="absolute top-28 left-1/2 -translate-x-1/2 text-[120px] font-bold text-[#E8E2DA] select-none pointer-events-none whitespace-nowrap opacity-60 z-0">
        BẢNG ĐIỆN TỬ
      </div>

      {/* Top Banner Header (Stadium 40px on #FCFBFA) */}
      <header className="relative z-10 max-w-5xl mx-auto w-full flex items-center justify-between py-4 px-8 bg-[#FCFBFA] rounded-[40px] border border-[#141413]/10 shadow-[0px_4px_24px_rgba(0,0,0,0.03)]">
        <div className="flex items-center gap-4">
          {/* Dual-Circle Administrative Mark (#bb302a + #F79E1B) */}
          <div className="relative flex items-center h-10">
            <div className="w-8 h-8 rounded-full bg-[#bb302a] opacity-95 shadow-sm" />
            <div className="w-8 h-8 rounded-full bg-[#F79E1B] opacity-90 -ml-4 mix-blend-multiply" />
          </div>
          <div>
            <span className="eyebrow-label text-[#bb302a] block">
              • BẢNG THÔNG TIN ĐIỆN TỬ TẠI QUẦY
            </span>
            <h1 className="text-lg sm:text-xl font-medium text-[#141413] tracking-tight">
              Trung tâm Phục vụ Hành chính công
            </h1>
          </div>
        </div>

        {/* Counter Switcher & Clock */}
        <div className="flex items-center gap-5">
          <div className="relative">
            <select
              value={activeCounterId}
              onChange={(e) => setActiveCounterId(e.target.value)}
              className="bg-white text-[#141413] font-medium text-xs sm:text-sm px-3.5 py-1.5 rounded-full border border-[#141413]/15 cursor-pointer appearance-none pr-8 focus:outline-none shadow-sm"
            >
              {counters.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#FCFBFA] text-[#141413]">
                  Xem {c.title}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#696969] absolute right-2.5 top-2.5 pointer-events-none" />
          </div>

          <div className="text-right hidden sm:block">
            <div className="text-lg font-medium font-mono text-[#141413]">
              {currentTime
                ? currentTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
                : '--:--'}
            </div>
            <div className="text-[10px] text-[#696969]">Giờ tiếp nhận</div>
          </div>
        </div>
      </header>

      {/* Main Counter Sign Board (Stadium 40px on #FCFBFA) */}
      <main className="relative z-10 max-w-5xl mx-auto w-full my-6 flex-1 flex flex-col justify-center">
        <div className="bg-[#FCFBFA] rounded-[40px] border border-[#141413]/10 p-8 sm:p-12 shadow-[0px_24px_48px_rgba(0,0,0,0.06)] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10">
          {/* Left: Officer Profile with Circular Portrait & Satellite Badge */}
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left space-y-4">
            <div className="inline-block px-4 py-1.5 bg-[#bb302a] text-white text-xs sm:text-sm font-medium rounded-full shadow-sm uppercase tracking-wider">
              {counter.title}
            </div>

            <div className="flex items-center gap-6">
              {/* Circular portrait with satellite verified badge */}
              <div className="relative flex-shrink-0">
                <img
                  src={counter.assignedStaff.avatarUrl}
                  alt={counter.assignedStaff.fullName}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-white shadow-md"
                />
                {/* Satellite CTA / Badge docked onto perimeter */}
                <div className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-white border border-[#141413]/15 shadow-sm flex items-center justify-center text-[#bb302a]">
                  <UserCheck className="w-5 h-5" />
                </div>
              </div>

              <div>
                <span className="eyebrow-label text-[#696969] block mb-1">
                  • CÁN BỘ TIẾP NHẬN & THỤ LÝ
                </span>
                <h2 className="text-2xl sm:text-3xl font-medium text-[#141413] tracking-tight">
                  {counter.assignedStaff.fullName}
                </h2>
                <p className="text-xs text-[#555555] font-medium mt-0.5">
                  {counter.assignedStaff.title}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center text-[#F79E1B] text-xs font-bold">
                    <Star className="w-4 h-4 fill-[#F79E1B] mr-1" />
                    <span className="text-[#141413]">{counter.assignedStaff.ratingAverage}</span>
                  </div>
                  <span className="text-xs text-[#696969]">
                    ({counter.assignedStaff.ratingCount} lượt đánh giá hài lòng)
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 text-xs text-[#696969] border-t border-[#141413]/10 w-full">
              Bộ phận: <strong className="text-[#141413] font-medium">{counter.assignedStaff.department}</strong>
            </div>
          </div>

          {/* Right: Giant Serving Number Display (White Box with 32px corners) */}
          <div className="w-full md:w-88 bg-white rounded-[32px] border border-[#141413]/10 p-8 sm:p-10 text-center shadow-sm flex flex-col justify-center items-center">
            <span className="eyebrow-label text-[#696969] block mb-2">
              • SỐ THỨ TỰ ĐANG PHỤC VỤ
            </span>

            {servingTicket ? (
              <div>
                <div className="text-6xl sm:text-7xl font-medium font-mono text-[#bb302a] tracking-tight animate-in zoom-in-95">
                  {servingTicket.ticketNumber}
                </div>
                <div className="mt-3 inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-medium bg-[#bb302a]/10 text-[#bb302a]">
                  <span className="w-2 h-2 rounded-full bg-[#bb302a] animate-ping" />
                  ĐANG PHỤC VỤ
                </div>
              </div>
            ) : (
              <div>
                <div className="text-6xl font-mono font-medium text-[#696969]/40">
                  ----
                </div>
                <span className="mt-3 inline-block px-3.5 py-1 rounded-full text-xs font-medium bg-[#F3F0EE] text-[#696969]">
                  SẴN SÀNG ĐÓN TIẾP
                </span>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer Motto */}
      <footer className="relative z-10 max-w-5xl mx-auto w-full text-center text-xs text-[#696969] flex items-center justify-center gap-2 font-medium">
        <Sparkles className="w-3.5 h-3.5 text-[#F79E1B]" />
        <span>Phương châm: &quot;Công khai - Minh bạch - Tận tình - Nhanh chóng&quot;</span>
      </footer>
    </div>
  );
}
