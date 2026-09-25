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
  Sparkles,
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
        return <Building2 className="w-8 h-8 text-[#141413]" />;
      case 'Scale':
        return <Scale className="w-8 h-8 text-[#141413]" />;
      case 'Briefcase':
        return <Briefcase className="w-8 h-8 text-[#141413]" />;
      case 'Zap':
      default:
        return <Zap className="w-8 h-8 text-[#141413]" />;
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
    <div className="min-h-screen bg-[#F3F0EE] text-[#141413] flex flex-col justify-between pt-16 sm:pt-20 pb-8 px-4 sm:px-8 select-none relative overflow-hidden">
      {/* Ghost Watermark Headline (Cream-on-cream typography) */}
      <div className="absolute top-28 left-1/2 -translate-x-1/2 text-[100px] sm:text-[140px] font-bold text-[#E8E2DA] select-none pointer-events-none whitespace-nowrap opacity-60 z-0">
        HÀNH CHÍNH CÔNG
      </div>

      {/* Top Kiosk Header (40px Stadium shape on #FCFBFA) */}
      <header className="relative z-10 max-w-5xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-4 py-5 px-8 bg-[#FCFBFA] rounded-[40px] border border-[#141413]/10 shadow-[0px_4px_24px_rgba(0,0,0,0.03)]">
        <div className="flex items-center gap-4 text-center md:text-left">
          {/* Dual-Circle Administrative Mark (#bb302a + #F79E1B) */}
          <div className="relative flex items-center h-12">
            <div className="w-10 h-10 rounded-full bg-[#bb302a] opacity-95 shadow-sm" />
            <div className="w-10 h-10 rounded-full bg-[#F79E1B] opacity-90 -ml-5 mix-blend-multiply" />
          </div>
          <div>
            <span className="eyebrow-label text-[#bb302a] block">
              • BỘ PHẬN TIẾP NHẬN & TRẢ KẾT QUẢ MỘT CỬA
            </span>
            <h1 className="text-xl sm:text-2xl font-medium text-[#141413] tracking-tight">
              Trung tâm Phục vụ Hành chính công
            </h1>
            <p className="text-xs text-[#696969] mt-0.5">
              Hệ thống Kiosk cấp số tự động theo chuẩn thủ tục hành chính
            </p>
          </div>
        </div>

        {/* Live Clock & Priority Toggle */}
        <div className="flex items-center gap-5">
          <div className="text-right hidden sm:block">
            <div className="text-xl font-medium font-mono text-[#141413] tracking-tight">
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

          {/* Priority Pill Button (20px radius) */}
          <button
            onClick={() => setIsPriorityMode(!isPriorityMode)}
            className={`px-4 py-2.5 rounded-[20px] text-xs font-medium transition-all flex items-center gap-2 ${
              isPriorityMode
                ? 'bg-[#bb302a] text-white shadow-sm'
                : 'bg-white border-[1.5px] border-[#141413] text-[#141413] hover:bg-[#F3F0EE]'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>{isPriorityMode ? 'Chế độ Ưu tiên: BẬT' : 'Khách hàng Ưu tiên?'}</span>
          </button>
        </div>
      </header>

      {/* Main Kiosk Content - Circular Portraits with Satellite Arrow CTAs */}
      <main className="relative z-10 max-w-5xl mx-auto w-full my-6 flex-1 flex flex-col justify-center">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-[#141413]/10 text-xs text-[#696969] font-medium mb-2 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#bb302a]" />
            <span>Chạm trực tiếp vào lĩnh vực để nhận số thứ tự</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-medium text-[#141413] tracking-tight">
            Quý công dân cần giải quyết thủ tục nào?
          </h2>
        </div>

        {/* 4 Service Cards with Circular Portraits & Docked Satellite Micro-CTAs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleSelectCategory(cat)}
              className="group relative cursor-pointer bg-[#FCFBFA] hover:bg-white rounded-[40px] p-6 sm:p-7 border border-[#141413]/10 shadow-[0px_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0px_24px_48px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col justify-between"
            >
              <div className="flex items-start gap-5">
                {/* Circular Portrait with Satellite Micro-CTA */}
                <div className="relative flex-shrink-0">
                  {/* Circular Orbit / Mask */}
                  <div className="w-20 h-20 rounded-full bg-[#F3F0EE] border border-[#141413]/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {getCategoryIcon(cat.iconName)}
                  </div>

                  {/* Satellite Circular Micro-CTA docked at bottom-right */}
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white border border-[#141413]/15 shadow-sm flex items-center justify-center text-[#141413] group-hover:bg-[#141413] group-hover:text-white transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Service Details */}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="eyebrow-label text-[#bb302a]">
                      • LĨNH VỰC {cat.prefix}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#696969] bg-[#F3F0EE] px-2.5 py-0.5 rounded-full">
                      Số hiện tại: {cat.prefix}-{String(cat.currentNumber).padStart(3, '0')}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-medium text-[#141413] mt-1 group-hover:text-[#bb302a] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-[#696969] mt-1 leading-relaxed line-clamp-2">
                    {cat.description}
                  </p>
                </div>
              </div>

              {/* Waiting Status Bar */}
              <div className="mt-5 pt-4 border-t border-[#141413]/10 flex items-center justify-between text-xs text-[#696969]">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#bb302a]" />
                    <span>Đang chờ: <strong className="text-[#141413] font-medium">{cat.waitingCount} người</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#bb302a]" />
                    <span>Dự kiến: <strong className="text-[#141413] font-medium">~{cat.waitingCount * cat.averageWaitMinutes} phút</strong></span>
                  </div>
                </div>

                <span className="text-xs font-medium text-[#141413] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  Lấy số ngay
                  <ArrowRight className="w-3.5 h-3.5 text-[#bb302a]" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Alternative Entry Options (CCCD Chip & Online QR Check-in) */}
      <footer className="relative z-10 max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Scan CCCD Chip Card */}
          <button
            onClick={() => setIsCccdOpen(true)}
            className="flex items-center justify-center gap-4 py-4 px-6 bg-white hover:bg-[#FCFBFA] border border-[#141413]/10 rounded-[40px] shadow-[0px_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0px_12px_32px_rgba(0,0,0,0.06)] transition-all group text-left"
          >
            <div className="w-12 h-12 rounded-full bg-[#bb302a]/10 text-[#bb302a] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#141413] flex items-center gap-2">
                <span>Quét thẻ Căn cước công dân gắn chíp</span>
                <span className="px-2 py-0.5 text-[9px] bg-[#bb302a]/10 text-[#bb302a] rounded-full font-bold">
                  TỰ ĐỘNG
                </span>
              </div>
              <div className="text-[11px] text-[#696969] mt-0.5">
                Đọc thông tin từ chíp điện tử, xác thực chính xác không cần gõ phím
              </div>
            </div>
          </button>

          {/* Scan QR Online Booking */}
          <button
            onClick={() => setIsQrOpen(true)}
            className="flex items-center justify-center gap-4 py-4 px-6 bg-white hover:bg-[#FCFBFA] border border-[#141413]/10 rounded-[40px] shadow-[0px_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0px_12px_32px_rgba(0,0,0,0.06)] transition-all group text-left"
          >
            <div className="w-12 h-12 rounded-full bg-[#F79E1B]/15 text-[#9A3A0A] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#141413] flex items-center gap-2">
                <span>Check-in Lịch hẹn Zalo / Trực tuyến</span>
                <span className="px-2 py-0.5 text-[9px] bg-[#F79E1B]/20 text-[#9A3A0A] rounded-full font-bold">
                  ƯU TIÊN
                </span>
              </div>
              <div className="text-[11px] text-[#696969] mt-0.5">
                Quét mã QR từ Zalo Mini App để nhận số theo giờ hẹn trước
              </div>
            </div>
          </button>
        </div>

        {/* Administrative footer note */}
        <div className="mt-4 text-center text-[11px] text-[#696969] flex items-center justify-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-[#bb302a]" />
          <span>Hệ thống lấy số điện tử chuẩn Hành chính công • Chuẩn bảo mật thông tin công dân</span>
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
