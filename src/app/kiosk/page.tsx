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
          {/* Dual-Circle Administrative Mark (#bb302a + #F79E1B) */}
          <div className="relative flex items-center h-12 flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-[#bb302a] opacity-95 shadow-sm" />
            <div className="w-10 h-10 rounded-full bg-[#F79E1B] opacity-90 -ml-5 mix-blend-multiply" />
          </div>
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

          {/* Priority Pill Button */}
          <button
            onClick={() => setIsPriorityMode(!isPriorityMode)}
            className={`px-4 py-2.5 rounded-[20px] text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shadow-sm ${
              isPriorityMode
                ? 'bg-[#bb302a] text-white ring-2 ring-[#bb302a]/30'
                : 'bg-white border-[1.5px] border-[#141413] text-[#141413] hover:bg-[#F3F0EE]'
            }`}
          >
            <HeartHandshake className="w-4 h-4 text-[#F79E1B]" />
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

        {/* 4 Service Cards with Circular Portraits & Docked Satellite Micro-CTAs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleSelectCategory(cat)}
              className="group relative cursor-pointer bg-[#FCFBFA] hover:bg-white rounded-[32px] p-5 sm:p-6 border border-[#141413]/10 shadow-[0px_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0px_20px_40px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col justify-between"
            >
              <div className="flex items-start gap-4 sm:gap-5">
                {/* Circular Portrait with Satellite Micro-CTA */}
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-[#F3F0EE] border border-[#141413]/10 flex items-center justify-center group-hover:scale-105 transition-transform p-3">
                    {getCategoryIcon(cat.iconName)}
                  </div>

                  {/* Satellite Circular Micro-CTA docked at bottom-right */}
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white border border-[#141413]/15 shadow-md flex items-center justify-center text-[#141413] group-hover:bg-[#141413] group-hover:text-white transition-all">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Service Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-[#bb302a] tracking-wider uppercase">
                      • LĨNH VỰC {cat.prefix}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#141413] bg-[#F3F0EE] px-2.5 py-0.5 rounded-full">
                      Số hiện tại: {cat.prefix}-{String(cat.currentNumber).padStart(3, '0')}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-[#141413] group-hover:text-[#bb302a] transition-colors leading-snug truncate">
                    {cat.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#555555] mt-1 leading-relaxed line-clamp-2">
                    {cat.description}
                  </p>
                </div>
              </div>

              {/* Waiting Status Bar */}
              <div className="mt-4 pt-3 border-t border-[#141413]/10 flex items-center justify-between text-xs sm:text-sm text-[#555555]">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#bb302a]" />
                    <span>Đang chờ: <strong className="text-[#141413] font-bold">{cat.waitingCount} người</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#bb302a]" />
                    <span>Dự kiến: <strong className="text-[#141413] font-bold">~{cat.waitingCount * cat.averageWaitMinutes}p</strong></span>
                  </div>
                </div>

                <span className="text-xs sm:text-sm font-bold text-[#141413] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  Lấy số ngay
                  <ArrowRight className="w-3.5 h-3.5 text-[#bb302a]" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Alternative Entry Options (CCCD Chip & Online QR Check-in) */}
      <footer className="max-w-5xl mx-auto w-full flex-shrink-0 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Scan CCCD Chip Card */}
          <button
            onClick={() => setIsCccdOpen(true)}
            className="flex items-center justify-center gap-4 py-3.5 px-6 bg-white hover:bg-[#FCFBFA] border border-[#141413]/10 rounded-[28px] shadow-[0px_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0px_12px_28px_rgba(0,0,0,0.06)] transition-all group text-left"
          >
            <div className="w-11 h-11 rounded-full bg-[#bb302a]/10 text-[#bb302a] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-[#141413] flex items-center gap-2">
                <span>Quét Căn cước công dân gắn chíp</span>
                <span className="px-2 py-0.5 text-[10px] bg-[#bb302a]/10 text-[#bb302a] rounded-full font-bold">
                  TỰ ĐỘNG
                </span>
              </div>
              <div className="text-xs text-[#555555] mt-0.5">
                Đọc thông tin định danh điện tử chính xác 100%
              </div>
            </div>
          </button>

          {/* Scan QR Online Booking */}
          <button
            onClick={() => setIsQrOpen(true)}
            className="flex items-center justify-center gap-4 py-3.5 px-6 bg-white hover:bg-[#FCFBFA] border border-[#141413]/10 rounded-[28px] shadow-[0px_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0px_12px_28px_rgba(0,0,0,0.06)] transition-all group text-left"
          >
            <div className="w-11 h-11 rounded-full bg-[#F79E1B]/15 text-[#9A3A0A] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-[#141413] flex items-center gap-2">
                <span>Check-in Lịch hẹn Zalo / Trực tuyến</span>
                <span className="px-2 py-0.5 text-[10px] bg-[#F79E1B]/20 text-[#9A3A0A] rounded-full font-bold">
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
