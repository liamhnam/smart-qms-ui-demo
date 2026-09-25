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
  Star,
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

  const getCategoryConfig = (id: string, iconName: string) => {
    switch (id) {
      case 'cat-a':
        return {
          icon: <Building2 className="w-10 h-10 text-[#bb302a]" />,
          bgIcon: 'bg-[#bb302a]/10 border-[#bb302a]/20',
          badgeColor: 'bg-[#bb302a]/10 text-[#bb302a]',
          hoverBorder: 'hover:border-[#bb302a]',
          accentText: 'text-[#bb302a]',
        };
      case 'cat-b':
        return {
          icon: <Scale className="w-10 h-10 text-[#9A3A0A]" />,
          bgIcon: 'bg-[#F79E1B]/15 border-[#F79E1B]/30',
          badgeColor: 'bg-[#F79E1B]/15 text-[#9A3A0A]',
          hoverBorder: 'hover:border-[#F79E1B]',
          accentText: 'text-[#9A3A0A]',
        };
      case 'cat-c':
        return {
          icon: <Briefcase className="w-10 h-10 text-[#1E3A8A]" />,
          bgIcon: 'bg-[#1E3A8A]/10 border-[#1E3A8A]/20',
          badgeColor: 'bg-[#1E3A8A]/10 text-[#1E3A8A]',
          hoverBorder: 'hover:border-[#1E3A8A]',
          accentText: 'text-[#1E3A8A]',
        };
      case 'cat-d':
      default:
        return {
          icon: <Zap className="w-10 h-10 text-[#059669]" />,
          bgIcon: 'bg-[#059669]/10 border-[#059669]/20',
          badgeColor: 'bg-[#059669]/10 text-[#059669]',
          hoverBorder: 'hover:border-[#059669]',
          accentText: 'text-[#059669]',
        };
    }
  };

  const getCategoryTags = (id: string) => {
    switch (id) {
      case 'cat-a':
        return ['Cấp đổi sổ đỏ/hồng', 'Chuyển nhượng nhà đất', 'Tách thửa - Hợp thửa', 'Đăng ký biến động'];
      case 'cat-b':
        return ['Đăng ký khai sinh', 'Chứng thực bản sao', 'Đăng ký kết hôn', 'Lý lịch tư pháp'];
      case 'cat-c':
        return ['Cấp mới GPKD', 'Thay đổi ĐKKD', 'Khai nộp lệ phí', 'Đăng ký hộ KD'];
      case 'cat-d':
      default:
        return ['Bổ sung hồ sơ', 'Nhận kết quả theo hẹn', 'Định danh VNeID', 'Thủ tục liên thông'];
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
    <div className="h-screen max-h-screen overflow-hidden bg-[#F3F0EE] text-[#141413] flex flex-col justify-between pt-20 sm:pt-22 pb-3 px-6 sm:px-10 lg:px-12 select-none relative">
      {/* Top Kiosk Header (Spacious, Clear Administrative Branding) */}
      <header className="max-w-[1540px] mx-auto w-full flex items-center justify-between py-3.5 px-8 bg-white rounded-[32px] border border-[#141413]/10 shadow-[0px_4px_24px_rgba(0,0,0,0.04)] flex-shrink-0 mb-2">
        <div className="flex items-center gap-4 text-left">
          {/* Administrative Official Logo */}
          <img
            src="/logo.png"
            alt="Logo Một Cửa Quốc Gia"
            className="w-13 h-13 sm:w-14 sm:h-14 object-contain flex-shrink-0 drop-shadow-sm"
          />
          <div>
            <span className="text-xs sm:text-sm font-bold text-[#bb302a] tracking-wider uppercase block">
              • BỘ PHẬN TIẾP NHẬN & TRẢ KẾT QUẢ MỘT CỬA
            </span>
            <h1 className="text-xl sm:text-2xl lg:text-[26px] font-extrabold text-[#141413] tracking-tight">
              Trung tâm Phục vụ Hành chính công
            </h1>
          </div>
        </div>

        {/* Priority Toggle & Live Digital Clock */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Priority Mode Toggle Button (Large, Highly Visible) */}
          <button
            onClick={() => setIsPriorityMode(!isPriorityMode)}
            className={`px-5 sm:px-6 py-2.5 min-h-[50px] rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-2.5 shadow-sm active:scale-95 touch-manipulation ${
              isPriorityMode
                ? 'bg-[#bb302a] text-white ring-4 ring-[#bb302a]/25 shadow-md'
                : 'bg-[#FCFBFA] border-2 border-[#141413]/20 hover:border-[#bb302a] text-[#141413]'
            }`}
          >
            {isPriorityMode ? (
              <>
                <Star className="w-5 h-5 text-[#F79E1B] fill-[#F79E1B]" />
                <span>CHẾ ĐỘ ƯU TIÊN: ĐANG BẬT</span>
              </>
            ) : (
              <>
                <HeartHandshake className="w-5 h-5 text-[#bb302a]" />
                <span>Đối tượng Ưu tiên? (Người già, Khuyết tật, Mang thai)</span>
              </>
            )}
          </button>

          {/* Clock */}
          <div className="text-right hidden sm:block pl-2 border-l border-[#141413]/10">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#141413] tracking-tight">
              {currentTime
                ? currentTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                : '--:--:--'}
            </div>
            <div className="text-xs text-[#696969] font-semibold">
              {currentTime
                ? currentTime.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })
                : ''}
            </div>
          </div>
        </div>
      </header>

      {/* Main Kiosk Body - 4 Grand Touch Cards filling horizontal canvas */}
      <main className="max-w-[1540px] mx-auto w-full my-auto flex-1 flex flex-col justify-center min-h-0 py-1.5">
        <div className="text-center mb-3 flex-shrink-0">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white rounded-full border border-[#141413]/10 text-xs sm:text-sm text-[#555555] font-semibold mb-1 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-[#bb302a] animate-ping" />
            <span>Chạm trực tiếp vào ô lĩnh vực bên dưới để nhận phiếu số thứ tự</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-[#141413] tracking-tight">
            Quý công dân cần giải quyết thủ tục nào?
          </h2>
        </div>

        {/* 4 Grand Service Touch Cards (Grid 2x2, Spacious & High Contrast) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 flex-1 min-h-0">
          {categories.map((cat) => {
            const config = getCategoryConfig(cat.id, cat.iconName);
            return (
              <div
                key={cat.id}
                onClick={() => handleSelectCategory(cat)}
                className={`group relative cursor-pointer bg-white active:bg-[#FAF8F6] active:scale-[0.985] rounded-[32px] p-5 sm:p-6 border-2 border-[#141413]/10 ${config.hoverBorder} shadow-[0px_8px_32px_rgba(0,0,0,0.04)] hover:shadow-[0px_20px_48px_rgba(0,0,0,0.08)] transition-all duration-200 flex flex-col justify-between touch-manipulation select-none overflow-hidden`}
              >
                {/* Top Part: Icon & Code Badges */}
                <div className="flex items-start gap-4 sm:gap-5">
                  {/* Category Circular Emblem Icon */}
                  <div
                    className={`w-18 h-18 sm:w-20 sm:h-20 rounded-full ${config.bgIcon} border flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-inner`}
                  >
                    {config.icon}
                  </div>

                  {/* Service Title & Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-xs sm:text-sm font-bold tracking-wider uppercase ${config.accentText}`}>
                        • LĨNH VỰC {cat.prefix}
                      </span>
                      <span className="text-xs sm:text-sm font-mono font-bold text-[#141413] bg-[#F3F0EE] px-3.5 py-1 rounded-full border border-[#141413]/5">
                        Số đang gọi: {cat.prefix}-{String(cat.currentNumber).padStart(3, '0')}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-extrabold text-[#141413] group-hover:text-[#bb302a] transition-colors leading-snug">
                      {cat.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#555555] mt-1 leading-relaxed">
                      {cat.description}
                    </p>

                    {/* Popular Sub-Procedure Tags */}
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2.5">
                      {getCategoryTags(cat.id).map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 bg-[#F3F0EE] group-hover:bg-[#F3EDE8] text-[#444444] rounded-full text-[11px] sm:text-xs font-semibold border border-[#141413]/5 transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Status Bar & Prominent Touch Action CTA */}
                <div className="mt-3 pt-3 border-t border-[#141413]/10 flex items-center justify-between">
                  <div className="flex items-center gap-5 text-xs sm:text-sm text-[#555555]">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#bb302a]" />
                      <span>Đang chờ: <strong className="text-[#141413] font-bold text-sm sm:text-base">{cat.waitingCount} người</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#bb302a]" />
                      <span>Dự kiến: <strong className="text-[#141413] font-bold text-sm sm:text-base">~{cat.waitingCount * cat.averageWaitMinutes}p</strong></span>
                    </div>
                  </div>

                  {/* Prominent Touch CTA Button */}
                  <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#141413] group-hover:bg-[#bb302a] group-active:bg-[#93231e] text-white rounded-full font-bold text-xs sm:text-sm shadow-md transition-all group-hover:translate-x-1">
                    <span>Chạm lấy số</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Alternative Entry Options (CCCD Chip & Online QR Check-in) */}
      <footer className="max-w-[1540px] mx-auto w-full flex-shrink-0 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Scan CCCD Chip Card (Touchscreen Ergonomic Grand Button) */}
          <button
            onClick={() => setIsCccdOpen(true)}
            className="flex items-center justify-center gap-5 py-3.5 sm:py-4 px-8 min-h-[82px] bg-white hover:bg-[#FAF8F6] active:bg-[#F3EDE8] active:scale-[0.985] border-2 border-[#141413]/10 hover:border-[#bb302a] rounded-[28px] shadow-[0px_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0px_12px_28px_rgba(0,0,0,0.06)] transition-all group text-left touch-manipulation select-none"
          >
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#bb302a]/10 text-[#bb302a] flex items-center justify-center flex-shrink-0 group-hover:scale-105 group-active:scale-95 transition-transform shadow-inner">
              <CreditCard className="w-7 h-7" />
            </div>
            <div>
              <div className="text-sm sm:text-base lg:text-lg font-extrabold text-[#141413] flex items-center gap-2.5">
                <span>Quét Căn cước công dân gắn chíp</span>
                <span className="px-2.5 py-0.5 text-[11px] bg-[#bb302a]/10 text-[#bb302a] rounded-full font-bold tracking-wider">
                  TỰ ĐỘNG
                </span>
              </div>
              <div className="text-xs sm:text-sm text-[#555555] mt-0.5">
                Đặt thẻ CCCD vào đầu đọc hoặc mặt kính cảm ứng để nhận diện chính xác 100%
              </div>
            </div>
          </button>

          {/* Scan QR Online Booking (Touchscreen Ergonomic Grand Button) */}
          <button
            onClick={() => setIsQrOpen(true)}
            className="flex items-center justify-center gap-5 py-3.5 sm:py-4 px-8 min-h-[82px] bg-white hover:bg-[#FAF8F6] active:bg-[#F3EDE8] active:scale-[0.985] border-2 border-[#141413]/10 hover:border-[#F79E1B] rounded-[28px] shadow-[0px_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0px_12px_28px_rgba(0,0,0,0.06)] transition-all group text-left touch-manipulation select-none"
          >
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#F79E1B]/15 text-[#9A3A0A] flex items-center justify-center flex-shrink-0 group-hover:scale-105 group-active:scale-95 transition-transform shadow-inner">
              <QrCode className="w-7 h-7" />
            </div>
            <div>
              <div className="text-sm sm:text-base lg:text-lg font-extrabold text-[#141413] flex items-center gap-2.5">
                <span>Check-in Lịch hẹn Zalo / Trực tuyến</span>
                <span className="px-2.5 py-0.5 text-[11px] bg-[#F79E1B]/20 text-[#9A3A0A] rounded-full font-bold tracking-wider">
                  ƯU TIÊN
                </span>
              </div>
              <div className="text-xs sm:text-sm text-[#555555] mt-0.5">
                Đưa mã QR trên Zalo Mini App hoặc Cổng DVC trước camera để quét lịch hẹn
              </div>
            </div>
          </button>
        </div>

        {/* Administrative footer reassurance note */}
        <div className="mt-2 text-center text-xs text-[#696969] flex items-center justify-center gap-2 font-medium">
          <ShieldCheck className="w-4 h-4 text-[#bb302a]" />
          <span>Hệ thống lấy số tự động chuẩn Quốc gia • Bảo vệ quyền lợi và bảo mật thông tin công dân</span>
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
