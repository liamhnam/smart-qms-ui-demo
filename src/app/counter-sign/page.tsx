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
    <div className="min-h-screen bg-[#F3F0EE] text-[#141413] flex flex-col justify-between pt-24 sm:pt-28 pb-10 px-4 sm:px-8 select-none relative">
      {/* Top Banner Header (Stadium 40px on #FCFBFA) */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between py-5 px-8 sm:px-10 bg-[#FCFBFA] rounded-[40px] border border-[#141413]/10 shadow-[0px_4px_24px_rgba(0,0,0,0.03)]">
        <div className="flex items-center gap-5">
          {/* Dual-Circle Administrative Mark (#bb302a + #F79E1B) */}
          <div className="relative flex items-center h-12 flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-[#bb302a] opacity-95 shadow-sm" />
            <div className="w-10 h-10 rounded-full bg-[#F79E1B] opacity-90 -ml-5 mix-blend-multiply" />
          </div>
          <div>
            <span className="text-xs sm:text-sm font-bold text-[#bb302a] tracking-wider uppercase block mb-0.5">
              • BẢNG THÔNG TIN ĐIỆN TỬ TẠI QUẦY
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-[#141413] tracking-tight">
              Trung tâm Phục vụ Hành chính công
            </h1>
          </div>
        </div>

        {/* Counter Switcher & Clock */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <select
              value={activeCounterId}
              onChange={(e) => setActiveCounterId(e.target.value)}
              className="bg-white text-[#141413] font-bold text-sm px-4 py-2 rounded-full border border-[#141413]/15 cursor-pointer appearance-none pr-9 focus:outline-none shadow-sm"
            >
              {counters.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#FCFBFA] text-[#141413]">
                  Xem {c.title}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-[#696969] absolute right-3 top-3 pointer-events-none" />
          </div>

          <div className="text-right hidden sm:block">
            <div className="text-xl font-bold font-mono text-[#141413]">
              {currentTime
                ? currentTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
                : '--:--'}
            </div>
            <div className="text-xs text-[#696969] font-medium">Giờ tiếp nhận</div>
          </div>
        </div>
      </header>

      {/* Main Counter Sign Board */}
      <main className="max-w-5xl mx-auto w-full my-8 flex-1 flex flex-col justify-center">
        <div className="bg-[#FCFBFA] rounded-[40px] border border-[#141413]/10 p-8 sm:p-14 shadow-[0px_24px_48px_rgba(0,0,0,0.06)] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Left: Officer Profile with Circular Portrait & Satellite Badge */}
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left space-y-5">
            <div className="inline-block px-5 py-2 bg-[#bb302a] text-white text-sm sm:text-base font-bold rounded-full shadow-sm uppercase tracking-wider">
              {counter.title}
            </div>

            <div className="flex items-center gap-6 sm:gap-8">
              {/* Circular portrait with satellite verified badge */}
              <div className="relative flex-shrink-0">
                <img
                  src={counter.assignedStaff.avatarUrl}
                  alt={counter.assignedStaff.fullName}
                  className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-white shadow-lg"
                />
                {/* Satellite CTA / Badge docked onto perimeter */}
                <div className="absolute -bottom-1 -right-1 w-11 h-11 rounded-full bg-white border border-[#141413]/15 shadow-md flex items-center justify-center text-[#bb302a]">
                  <UserCheck className="w-6 h-6" />
                </div>
              </div>

              <div>
                <span className="text-xs sm:text-sm font-bold text-[#696969] tracking-wider uppercase block mb-1">
                  • CÁN BỘ TIẾP NHẬN & THỤ LÝ
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#141413] tracking-tight leading-snug">
                  {counter.assignedStaff.fullName}
                </h2>
                <p className="text-sm sm:text-base text-[#444444] font-medium mt-1">
                  {counter.assignedStaff.title}
                </p>
                <div className="flex items-center gap-2.5 mt-2.5">
                  <div className="flex items-center text-[#F79E1B] text-sm font-bold">
                    <Star className="w-5 h-5 fill-[#F79E1B] mr-1.5" />
                    <span className="text-[#141413] text-base">{counter.assignedStaff.ratingAverage}</span>
                  </div>
                  <span className="text-xs sm:text-sm text-[#696969]">
                    ({counter.assignedStaff.ratingCount} lượt đánh giá hài lòng)
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 text-xs sm:text-sm text-[#696969] border-t border-[#141413]/10 w-full font-medium">
              Bộ phận: <strong className="text-[#141413] font-bold">{counter.assignedStaff.department}</strong>
            </div>
          </div>

          {/* Right: Giant Serving Number Display */}
          <div className="w-full md:w-96 bg-white rounded-[36px] border border-[#141413]/10 p-8 sm:p-12 text-center shadow-sm flex flex-col justify-center items-center">
            <span className="text-xs sm:text-sm font-bold text-[#696969] tracking-widest uppercase block mb-2">
              • SỐ THỨ TỰ ĐANG PHỤC VỤ
            </span>

            {servingTicket ? (
              <div>
                <div className="text-7xl sm:text-8xl lg:text-9xl font-bold font-mono text-[#bb302a] tracking-tight animate-in zoom-in-95 leading-none py-2">
                  {servingTicket.ticketNumber}
                </div>
                <div className="mt-4 inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm sm:text-base font-bold bg-[#bb302a]/10 text-[#bb302a]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#bb302a] animate-ping" />
                  ĐANG PHỤC VỤ
                </div>
              </div>
            ) : (
              <div>
                <div className="text-7xl sm:text-8xl font-mono font-medium text-[#696969]/30 py-2">
                  ----
                </div>
                <span className="mt-4 inline-block px-5 py-2 rounded-full text-sm font-semibold bg-[#F3F0EE] text-[#696969]">
                  SẴN SÀNG ĐÓN TIẾP
                </span>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer Motto */}
      <footer className="max-w-5xl mx-auto w-full text-center text-xs sm:text-sm text-[#696969] flex items-center justify-center gap-2 font-medium">
        <Sparkles className="w-4 h-4 text-[#F79E1B]" />
        <span>Phương châm: &quot;Công khai - Minh bạch - Tận tình - Nhanh chóng&quot;</span>
      </footer>
    </div>
  );
}
