'use client';

import React, { useState, useEffect } from 'react';
import { useQms } from '@/context/QmsContext';
import { Category, CitizenInfo, Ticket } from '@/types/qms';
import CccdScanModal from '@/components/kiosk/CccdScanModal';
import QrAppointmentModal from '@/components/kiosk/QrAppointmentModal';
import TicketReceiptModal from '@/components/kiosk/TicketReceiptModal';
import {
  Building2,
  Scale,
  Briefcase,
  Zap,
  CreditCard,
  QrCode,
  HeartHandshake,
  Clock,
  Users,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export default function KioskPage() {
  const { categories, issueTicket } = useQms();
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isPriorityMode, setIsPriorityMode] = useState(false);

  // Modals
  const [isCccdOpen, setIsCccdOpen] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [currentIssuedTicket, setCurrentIssuedTicket] = useState<Ticket | null>(null);

  // Auto-updating clock
  useEffect(() => {
    setCurrentTime(new Date());
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Building2':
        return <Building2 className="w-10 h-10 text-[#141413]" />;
      case 'Scale':
        return <Scale className="w-10 h-10 text-[#141413]" />;
      case 'Briefcase':
        return <Briefcase className="w-10 h-10 text-[#141413]" />;
      case 'Zap':
      default:
        return <Zap className="w-10 h-10 text-[#141413]" />;
    }
  };

  const handleSelectCategory = (cat: Category) => {
    const randomCitizenNames = [
      'Công dân Nguyễn Văn Nam',
      'Công dân Lê Thị Mai',
      'Công dân Trần Hoàng Long',
      'Công dân Phạm Thu Thảo',
      'Công dân Vũ Minh Trí',
    ];
    const citizenName =
      randomCitizenNames[Math.floor(Math.random() * randomCitizenNames.length)] +
      (isPriorityMode ? ' (Ưu tiên)' : '');

    const newTicket = issueTicket(cat.id, {
      name: citizenName,
      isPriority: isPriorityMode,
    });

    setCurrentIssuedTicket(newTicket);
  };

  const handleCccdScanSuccess = (citizen: CitizenInfo) => {
    const targetCat = categories[0];
    const newTicket = issueTicket(targetCat.id, {
      ...citizen,
      isPriority: isPriorityMode,
    });
    setCurrentIssuedTicket(newTicket);
  };

  const handleQrCheckInSuccess = (citizen: CitizenInfo, categoryId: string) => {
    const newTicket = issueTicket(categoryId, citizen);
    setCurrentIssuedTicket(newTicket);
  };

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-[#F3F0EE] text-[#141413] flex flex-col justify-between pt-16 sm:pt-18 pb-4 px-4 sm:px-8 select-none relative">
      {/* Top Kiosk Header (32px Stadium shape on #FCFBFA) */}
      <header className="max-w-5xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4 py-3.5 px-8 bg-[#FCFBFA] rounded-[32px] border border-[#141413]/10 shadow-[0px_4px_24px_rgba(0,0,0,0.03)] flex-shrink-0">
        <div className="flex items-center gap-4 text-center sm:text-left">
          {/* Administrative Emblem Logo */}
          <img
            src="/logo.png"
            alt="Logo Một Cửa"
            className="w-12 h-12 object-contain flex-shrink-0 drop-shadow-sm"
          />
          <div>
            <span className="text-xs font-bold text-[#bb302a] tracking-wider uppercase block">
              • BỘ PHẬN TIẾP NHẬN & TRẢ KẾT QUẢ MỘT CỬA
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-[#141413] tracking-tight">
              Trung tâm Phục vụ Hành chính công
            </h1>
          </div>
        </div>

        {/* Live Clock & Priority Toggle */}
        <div className="flex items-center gap-5">
          <div className="text-right hidden sm:block">
            <div className="text-xl sm:text-2xl font-bold font-mono text-[#141413] tracking-tight">
              {currentTime
                ? currentTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                : '--:--:--'}
            </div>
            <div className="text-xs text-[#696969] font-medium">
              {currentTime
                ? currentTime.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })
                : ''}
            </div>
          </div>

          {/* Priority Pill Button (Optimized for 22/24 inch touch) */}
          <button
            onClick={() => setIsPriorityMode(!isPriorityMode)}
            className={`px-5 py-2.5 min-h-[48px] rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shadow-sm active:scale-95 ${
              isPriorityMode
                ? 'bg-[#bb302a] text-white ring-2 ring-[#bb302a]/30'
                : 'bg-white border-[1.5px] border-[#141413] text-[#141413] hover:bg-[#F3F0EE]'
            }`}
          >
            <HeartHandshake className="w-5 h-5 text-[#F79E1B]" />
            <span>{isPriorityMode ? 'Chế độ Ưu tiên: BẬT' : 'Khách hàng Ưu tiên?'}</span>
          </button>
        </div>
      </header>

      {/* Main Kiosk Content - Service Selection Grid */}
      <main className="max-w-5xl mx-auto w-full my-auto flex-1 flex flex-col justify-center min-h-0 py-2">
        <div className="text-center mb-4 flex-shrink-0">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white rounded-full border border-[#141413]/10 text-xs text-[#555555] font-semibold mb-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#bb302a] animate-ping" />
            <span>Chạm trực tiếp vào lĩnh vực bên dưới để nhận số thứ tự</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#141413] tracking-tight">
            Quý công dân cần giải quyết thủ tục nào?
          </h2>
        </div>

        {/* 4 Service Cards with Circular Portraits & Docked Satellite Micro-CTAs (Touchscreen Optimized) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleSelectCategory(cat)}
              className="group relative cursor-pointer bg-[#FCFBFA] hover:bg-white active:bg-[#F0EBE6] active:scale-[0.98] rounded-[32px] p-5 sm:p-6 border border-[#141413]/10 shadow-[0px_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0px_20px_40px_rgba(0,0,0,0.08)] transition-all duration-150 flex flex-col justify-between touch-manipulation select-none"
            >
              <div className="flex items-start gap-4 sm:gap-5">
                {/* Circular Portrait with Satellite Micro-CTA */}
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#F3F0EE] border border-[#141413]/10 flex items-center justify-center group-hover:scale-105 transition-transform p-3.5 shadow-inner">
                    {getCategoryIcon(cat.iconName)}
                  </div>

                  {/* Satellite Circular Micro-CTA docked at bottom-right */}
                  <div className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-white border border-[#141413]/15 shadow-md flex items-center justify-center text-[#141413] group-hover:bg-[#141413] group-hover:text-white group-active:bg-[#bb302a] transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Service Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-[#bb302a] tracking-wider uppercase">
                      • LĨNH VỰC {cat.prefix}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#141413] bg-[#F3F0EE] px-3 py-1 rounded-full border border-[#141413]/5">
                      Số hiện tại: {cat.prefix}-{String(cat.currentNumber).padStart(3, '0')}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-[#141413] group-hover:text-[#bb302a] transition-colors leading-tight truncate">
                    {cat.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#555555] mt-1.5 leading-relaxed line-clamp-2">
                    {cat.description}
                  </p>
                </div>
              </div>

              {/* Waiting Status Bar */}
              <div className="mt-4 pt-3.5 border-t border-[#141413]/10 flex items-center justify-between text-xs sm:text-sm text-[#555555]">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-[#bb302a]" />
                    <span>Đang chờ: <strong className="text-[#141413] font-bold text-sm">{cat.waitingCount} người</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#bb302a]" />
                    <span>Dự kiến: <strong className="text-[#141413] font-bold text-sm">~{cat.waitingCount * cat.averageWaitMinutes}p</strong></span>
                  </div>
                </div>

                <span className="text-sm font-bold text-[#141413] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-[#141413]/10 shadow-sm">
                  <span>Chạm lấy số</span>
                  <ArrowRight className="w-4 h-4 text-[#bb302a]" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Alternative Entry Options (CCCD Chip & Online QR Check-in) */}
      <footer className="max-w-5xl mx-auto w-full flex-shrink-0 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Scan CCCD Chip Card (Touchscreen Ergonomic) */}
          <button
            onClick={() => setIsCccdOpen(true)}
            className="flex items-center justify-center gap-4 py-4 px-6 min-h-[76px] bg-white hover:bg-[#FCFBFA] active:bg-[#F3EDE8] active:scale-[0.98] border border-[#141413]/10 rounded-[28px] shadow-[0px_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0px_12px_28px_rgba(0,0,0,0.06)] transition-all group text-left touch-manipulation select-none"
          >
            <div className="w-12 h-12 rounded-full bg-[#bb302a]/10 text-[#bb302a] flex items-center justify-center flex-shrink-0 group-hover:scale-105 group-active:scale-95 transition-transform shadow-sm">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm sm:text-base font-bold text-[#141413] flex items-center gap-2">
                <span>Quét Căn cước công dân gắn chíp</span>
                <span className="px-2.5 py-0.5 text-[10px] bg-[#bb302a]/10 text-[#bb302a] rounded-full font-bold">
                  TỰ ĐỘNG
                </span>
              </div>
              <div className="text-xs text-[#555555] mt-0.5">
                Đọc thông tin định danh điện tử chính xác 100%
              </div>
            </div>
          </button>

          {/* Scan QR Online Booking (Touchscreen Ergonomic) */}
          <button
            onClick={() => setIsQrOpen(true)}
            className="flex items-center justify-center gap-4 py-4 px-6 min-h-[76px] bg-white hover:bg-[#FCFBFA] active:bg-[#F3EDE8] active:scale-[0.98] border border-[#141413]/10 rounded-[28px] shadow-[0px_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0px_12px_28px_rgba(0,0,0,0.06)] transition-all group text-left touch-manipulation select-none"
          >
            <div className="w-12 h-12 rounded-full bg-[#F79E1B]/15 text-[#9A3A0A] flex items-center justify-center flex-shrink-0 group-hover:scale-105 group-active:scale-95 transition-transform shadow-sm">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm sm:text-base font-bold text-[#141413] flex items-center gap-2">
                <span>Check-in Lịch hẹn Zalo / Trực tuyến</span>
                <span className="px-2.5 py-0.5 text-[10px] bg-[#F79E1B]/20 text-[#9A3A0A] rounded-full font-bold">
                  ƯU TIÊN
                </span>
              </div>
              <div className="text-xs text-[#555555] mt-0.5">
                Quét mã QR từ Zalo Mini App để nhận số theo hẹn
              </div>
            </div>
          </button>
        </div>

        {/* Administrative footer note */}
        <div className="mt-2 text-center text-xs text-[#696969] flex items-center justify-center gap-1.5 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-[#bb302a]" />
          <span>Hệ thống lấy số điện tử chuẩn Hành chính công • Bảo vệ quyền lợi và bảo mật thông tin công dân</span>
        </div>
      </footer>

      {/* Modals */}
      <CccdScanModal
        isOpen={isCccdOpen}
        onClose={() => setIsCccdOpen(false)}
        onScanSuccess={handleCccdScanSuccess}
      />

      <QrAppointmentModal
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
        onCheckInSuccess={handleQrCheckInSuccess}
      />

      <TicketReceiptModal
        ticket={currentIssuedTicket}
        onClose={() => setCurrentIssuedTicket(null)}
      />
    </div>
  );
}
