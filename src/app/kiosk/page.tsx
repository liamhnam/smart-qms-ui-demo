'use client';

import React, { useState, useEffect } from 'react';
import { useQms } from '@/context/QmsContext';
import { Category, CitizenInfo, Counter, Ticket } from '@/types/qms';
import CccdScanModal from '@/components/kiosk/CccdScanModal';
import QrAppointmentModal from '@/components/kiosk/QrAppointmentModal';
import TicketReceiptModal from '@/components/kiosk/TicketReceiptModal';
import SupportInfoModal from '@/components/kiosk/SupportInfoModal';
import { playDingDongChime } from '@/utils/audio';
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
  Phone,
  Mail,
  ChevronLeft,
  Ticket as TicketIcon,
  LayoutGrid,
  CheckCircle2,
  Monitor,
  RefreshCw,
  Home,
  Layers,
} from 'lucide-react';

export default function KioskPage() {
  const { categories, counters, issueTicket } = useQms();
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isPriorityMode, setIsPriorityMode] = useState(false);

  // Kiosk UI Mode: 'classic' (Giao diện Gốc Restyle) vs 'direct' (Giao diện Mới 1-Chạm)
  const [kioskMode, setKioskMode] = useState<'classic' | 'direct'>('classic');

  // Classic sub-screens: 'HOME' | 'CHON_QUAY' | 'CHON_DANH_MUC'
  const [currentScreen, setCurrentScreen] = useState<'HOME' | 'CHON_QUAY' | 'CHON_DANH_MUC'>('HOME');

  // Modals
  const [isCccdOpen, setIsCccdOpen] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [supportType, setSupportType] = useState<'phone' | 'email' | null>(null);
  const [currentIssuedTicket, setCurrentIssuedTicket] = useState<Ticket | null>(null);

  // Auto-updating clock
  useEffect(() => {
    setCurrentTime(new Date());
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle ticket issuance with sound
  const handleIssueTicket = (
    categoryId: string,
    counterTitle?: string,
    explicitCounterId?: string
  ) => {
    const randomCitizenNames = [
      'Công dân Nguyễn Văn Nam',
      'Công dân Lê Thị Mai',
      'Công dân Trần Hoàng Long',
      'Công dân Phạm Thu Thảo',
      'Công dân Vũ Minh Trí',
      'Công dân Hoàng Đức Thịnh',
      'Công dân Đỗ Quỳnh Nga',
    ];
    const citizen: CitizenInfo = {
      name: randomCitizenNames[Math.floor(Math.random() * randomCitizenNames.length)],
      isPriority: isPriorityMode,
    };

    try {
      playDingDongChime();
    } catch {
      // Audio fallback
    }

    const t = issueTicket(categoryId, citizen);
    if (counterTitle) {
      t.counterTitle = counterTitle;
    }
    if (explicitCounterId) {
      t.counterId = explicitCounterId;
    }
    setCurrentIssuedTicket(t);
  };

  // Select counter in CHON_QUAY screen
  const handleSelectCounter = (counter: Counter) => {
    const primaryCatId = counter.categoryIds[0] || categories[0]?.id || 'cat-a';
    handleIssueTicket(primaryCatId, counter.title, counter.id);
  };

  // Select category in CHON_DANH_MUC or direct screen
  const handleSelectCategory = (cat: Category) => {
    handleIssueTicket(cat.id);
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

  return (
    <div className="h-screen max-h-screen w-screen bg-[#F8FAFC] text-[#141413] flex flex-col justify-between overflow-hidden select-none font-sans">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER - CHUẨN HÀNH CHÍNH CÔNG VỚI ĐỎ #bb302a & VÀNG GOLD #F79E1B */}
      {/* ========================================================================= */}
      <header className="bg-white border-b-4 border-[#bb302a] shadow-sm px-6 py-2.5 flex items-center justify-between flex-shrink-0 z-20">
        {/* Left: Official Emblem & Unit Title */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white p-1 border border-[#141413]/10 shadow-xs flex items-center justify-center flex-shrink-0">
            <img
              src="/logo.png"
              alt="Logo Một Cửa Nghĩa Hưng"
              className="w-12 h-12 object-contain"
            />
          </div>
          <div>
            <div className="text-[12px] font-bold text-[#bb302a] uppercase tracking-wider flex items-center gap-2">
              <span>UBND TỈNH NAM ĐỊNH • TRUNG TÂM PHỤC VỤ HÀNH CHÍNH CÔNG</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#bb302a]" />
              <span className="text-[#696969] font-normal normal-case">Hệ thống Lấy số Thứ tự Điện tử</span>
            </div>
            <h1 className="text-xl font-extrabold text-[#141413] uppercase tracking-tight leading-tight mt-0.5">
              BỘ PHẬN TIẾP NHẬN VÀ TRẢ KẾT QUẢ XÃ NGHĨA HƯNG
            </h1>
          </div>
        </div>

        {/* Center / Right: UI Mode Switcher & Utilities */}
        <div className="flex items-center gap-3">
          {/* Mode Switcher Toggle Pill */}
          <div className="bg-[#F3F0EE] p-1 rounded-2xl border border-[#141413]/10 flex items-center gap-1 shadow-inner">
            <button
              onClick={() => {
                setKioskMode('classic');
                setCurrentScreen('HOME');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                kioskMode === 'classic'
                  ? 'bg-[#bb302a] text-white shadow-sm'
                  : 'text-[#696969] hover:text-[#141413]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Giao diện Gốc Restyle</span>
            </button>
            <button
              onClick={() => setKioskMode('direct')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                kioskMode === 'direct'
                  ? 'bg-[#bb302a] text-white shadow-sm'
                  : 'text-[#696969] hover:text-[#141413]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Giao diện Mới 1-Chạm</span>
            </button>
          </div>

          {/* Priority Toggle Button */}
          <button
            onClick={() => setIsPriorityMode(!isPriorityMode)}
            className={`min-h-[46px] px-4 py-2 rounded-2xl font-bold text-xs tracking-tight transition-all flex items-center gap-2 border touch-manipulation active:scale-95 ${
              isPriorityMode
                ? 'bg-[#F79E1B] text-[#141413] border-[#F79E1B] shadow-md ring-2 ring-[#F79E1B]/30'
                : 'bg-white text-[#696969] border-[#141413]/15 hover:border-[#F79E1B] hover:text-[#141413]'
            }`}
          >
            <HeartHandshake className="w-4 h-4 text-[#bb302a]" />
            <span>Ưu tiên Người già / Bầu:</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
                isPriorityMode ? 'bg-[#141413] text-[#F79E1B]' : 'bg-[#F3F0EE] text-[#696969]'
              }`}
            >
              {isPriorityMode ? 'ĐANG BẬT' : 'TẮT'}
            </span>
          </button>

          {/* Live Server Digital Clock */}
          <div className="bg-[#F8FAFC] border border-[#141413]/10 px-4 py-1.5 rounded-2xl flex items-center gap-2.5 shadow-xs">
            <Clock className="w-4 h-4 text-[#bb302a]" />
            <div className="text-right">
              <div className="text-sm font-bold font-mono text-[#141413] leading-none">
                {currentTime
                  ? currentTime.toLocaleTimeString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })
                  : '--:--:--'}
              </div>
              <div className="text-[10px] text-[#696969] font-medium mt-0.5 leading-none capitalize">
                {currentTime
                  ? currentTime.toLocaleDateString('vi-VN', {
                      weekday: 'short',
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })
                  : '--'}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. MAIN BODY AREA (CHUYỂN ĐỔI THEO MODE VÀ THEO SUB-SCREEN)               */}
      {/* ========================================================================= */}
      <main className="flex-1 flex flex-col justify-between p-5 max-w-[1600px] w-full mx-auto overflow-hidden">
        {/* MODE A: GIAO DIỆN GỐC RESTYLE (BỐ CỤC CHUẨN CỦA DỰ ÁN GỐC QMS) */}
        {kioskMode === 'classic' && (
          <>
            {/* SUB-SCREEN 1: TRANG CHỦ LẤY SỐ (/lay-so) */}
            {currentScreen === 'HOME' && (
              <div className="flex-1 flex flex-col justify-between space-y-4">
                {/* Title Section */}
                <div className="text-center pt-2 pb-1 flex-shrink-0">
                  <span className="inline-block px-4 py-1 bg-[#bb302a]/10 text-[#bb302a] text-xs font-bold rounded-full mb-1.5 tracking-wider uppercase">
                    Hệ thống Kiosk Một cửa Thông minh
                  </span>
                  <h2 className="text-3xl font-extrabold text-[#141413] tracking-tight">
                    Chào mừng Quý khách đến với Hệ thống Lấy số Thứ tự
                  </h2>
                  <p className="text-base text-[#696969] mt-1 font-medium">
                    Vui lòng chạm chọn phương thức lấy số phù hợp trên màn hình cảm ứng
                  </p>
                </div>

                {/* 3 Main Action Cards (Touch Ergonomic for 22-24 inch) */}
                <div className="grid grid-cols-3 gap-6 flex-1 items-stretch py-2 min-h-0">
                  {/* Card 1: LẤY SỐ THEO QUẦY */}
                  <div
                    onClick={() => setCurrentScreen('CHON_QUAY')}
                    className="group bg-white rounded-[32px] p-8 border-2 border-[#141413]/10 hover:border-[#bb302a] shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between relative overflow-hidden active:scale-[0.99] touch-manipulation"
                  >
                    {/* Top colored accent bar */}
                    <div className="absolute top-0 left-0 right-0 h-3 bg-[#bb302a]" />

                    {/* Top row: Icon + Arrow */}
                    <div className="flex items-center justify-between mt-1">
                      <div className="w-20 h-20 rounded-3xl bg-[#bb302a]/10 border border-[#bb302a]/20 flex items-center justify-center text-[#bb302a] group-hover:scale-105 transition-transform">
                        <TicketIcon className="w-10 h-10" />
                      </div>
                      <div className="w-12 h-12 rounded-full bg-[#F3F0EE] group-hover:bg-[#bb302a] group-hover:text-white text-[#696969] flex items-center justify-center transition-colors">
                        <ArrowRight className="w-6 h-6" />
                      </div>
                    </div>

                    {/* Middle: Content */}
                    <div className="my-auto py-4">
                      <div className="text-xs font-bold text-[#bb302a] uppercase tracking-wider">
                        Phương thức truyền thống
                      </div>
                      <h3 className="text-2xl font-black text-[#141413] group-hover:text-[#bb302a] transition-colors mt-1">
                        LẤY SỐ THEO QUẦY
                      </h3>
                      <p className="text-sm text-[#696969] font-medium leading-relaxed mt-2">
                        Đăng ký lấy số thứ tự phục vụ trực tiếp tại các quầy giao dịch chuyên môn
                      </p>
                    </div>

                    {/* Bottom: Action badge */}
                    <div className="pt-4 border-t border-[#141413]/10 flex items-center justify-between">
                      <span className="text-xs font-bold text-[#696969]">
                        {counters.length} quầy đang sẵn sàng
                      </span>
                      <span className="px-4 py-2 bg-[#bb302a] text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 group-hover:bg-[#a12822] transition-colors">
                        <span>Chọn quầy ngay</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>

                  {/* Card 2: CHỌN THEO DANH MỤC */}
                  <div
                    onClick={() => setCurrentScreen('CHON_DANH_MUC')}
                    className="group bg-white rounded-[32px] p-8 border-2 border-[#141413]/10 hover:border-[#F79E1B] shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between relative overflow-hidden active:scale-[0.99] touch-manipulation"
                  >
                    {/* Top colored accent bar */}
                    <div className="absolute top-0 left-0 right-0 h-3 bg-[#F79E1B]" />

                    {/* Top row: Icon + Arrow */}
                    <div className="flex items-center justify-between mt-1">
                      <div className="w-20 h-20 rounded-3xl bg-[#F79E1B]/15 border border-[#F79E1B]/30 flex items-center justify-center text-[#9A3A0A] group-hover:scale-105 transition-transform">
                        <LayoutGrid className="w-10 h-10" />
                      </div>
                      <div className="w-12 h-12 rounded-full bg-[#F3F0EE] group-hover:bg-[#F79E1B] group-hover:text-[#141413] text-[#696969] flex items-center justify-center transition-colors">
                        <ArrowRight className="w-6 h-6" />
                      </div>
                    </div>

                    {/* Middle: Content */}
                    <div className="my-auto py-4">
                      <div className="text-xs font-bold text-[#9A3A0A] uppercase tracking-wider">
                        Phân loại lĩnh vực DVC
                      </div>
                      <h3 className="text-2xl font-black text-[#141413] group-hover:text-[#9A3A0A] transition-colors mt-1">
                        CHỌN DANH MỤC
                      </h3>
                      <p className="text-sm text-[#696969] font-medium leading-relaxed mt-2">
                        Chọn danh mục dịch vụ (Đất đai, Hộ tịch, Kinh doanh, Hồ sơ nhanh) để lấy số
                      </p>
                    </div>

                    {/* Bottom: Action badge */}
                    <div className="pt-4 border-t border-[#141413]/10 flex items-center justify-between">
                      <span className="text-xs font-bold text-[#696969]">
                        {categories.length} nhóm thủ tục hành chính
                      </span>
                      <span className="px-4 py-2 bg-[#F79E1B] text-[#141413] rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 group-hover:bg-[#e08c14] transition-colors">
                        <span>Xem danh mục</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>

                  {/* Card 3: NHẬN SỐ HẸN ONLINE / QR */}
                  <div
                    onClick={() => setIsQrOpen(true)}
                    className="group bg-white rounded-[32px] p-8 border-2 border-[#141413]/10 hover:border-[#059669] shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between relative overflow-hidden active:scale-[0.99] touch-manipulation"
                  >
                    {/* Top colored accent bar */}
                    <div className="absolute top-0 left-0 right-0 h-3 bg-[#059669]" />

                    {/* Top row: Icon + Arrow */}
                    <div className="flex items-center justify-between mt-1">
                      <div className="w-20 h-20 rounded-3xl bg-[#059669]/10 border border-[#059669]/20 flex items-center justify-center text-[#059669] group-hover:scale-105 transition-transform">
                        <QrCode className="w-10 h-10" />
                      </div>
                      <div className="w-12 h-12 rounded-full bg-[#F3F0EE] group-hover:bg-[#059669] group-hover:text-white text-[#696969] flex items-center justify-center transition-colors">
                        <ArrowRight className="w-6 h-6" />
                      </div>
                    </div>

                    {/* Middle: Content */}
                    <div className="my-auto py-4">
                      <div className="text-xs font-bold text-[#059669] uppercase tracking-wider">
                        Dịch vụ công trực tuyến
                      </div>
                      <h3 className="text-2xl font-black text-[#141413] group-hover:text-[#059669] transition-colors mt-1">
                        NHẬN SỐ ONLINE
                      </h3>
                      <p className="text-sm text-[#696969] font-medium leading-relaxed mt-2">
                        Quét mã QR hoặc nhập mã đặt hẹn trước qua Cổng DVC Quốc gia / Zalo Mini App
                      </p>
                    </div>

                    {/* Bottom: Action badge */}
                    <div className="pt-4 border-t border-[#141413]/10 flex items-center justify-between">
                      <span className="text-xs font-bold text-[#696969]">
                        Ưu tiên phục vụ theo giờ hẹn
                      </span>
                      <span className="px-4 py-2 bg-[#059669] text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 group-hover:bg-[#047857] transition-colors">
                        <span>Quét QR nhận vé</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Support Information Container (Chuẩn khối Thông tin hỗ trợ của bản gốc) */}
                <div className="bg-white rounded-[26px] p-4 border border-[#141413]/10 shadow-xs flex items-center justify-between gap-4 flex-shrink-0">
                  <div className="flex items-center gap-3 pl-2">
                    <div className="w-10 h-10 rounded-xl bg-[#bb302a]/10 text-[#bb302a] flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#141413]">Thông tin hỗ trợ công dân</h4>
                      <p className="text-xs text-[#696969] font-medium">
                        Cần hướng dẫn thủ tục hoặc gặp sự cố khi lấy số? Chọn một trong các hỗ trợ sau:
                      </p>
                    </div>
                  </div>

                  {/* Support Option Buttons */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSupportType('phone')}
                      className="min-h-[46px] px-5 py-2.5 bg-[#F8FAFC] hover:bg-[#F3F0EE] active:scale-95 border border-[#141413]/10 text-[#141413] rounded-2xl text-xs font-bold flex items-center gap-2 transition-all touch-manipulation shadow-xs"
                    >
                      <Phone className="w-4 h-4 text-[#bb302a]" />
                      <span>Cán bộ hỗ trợ</span>
                    </button>

                    <button
                      onClick={() => setSupportType('email')}
                      className="min-h-[46px] px-5 py-2.5 bg-[#F8FAFC] hover:bg-[#F3F0EE] active:scale-95 border border-[#141413]/10 text-[#141413] rounded-2xl text-xs font-bold flex items-center gap-2 transition-all touch-manipulation shadow-xs"
                    >
                      <Mail className="w-4 h-4 text-[#F79E1B]" />
                      <span>Email hỗ trợ</span>
                    </button>

                    <button
                      onClick={() => setIsCccdOpen(true)}
                      className="min-h-[46px] px-5 py-2.5 bg-[#bb302a] hover:bg-[#a12822] active:scale-95 text-white rounded-2xl text-xs font-bold flex items-center gap-2 transition-all touch-manipulation shadow-sm"
                    >
                      <CreditCard className="w-4 h-4 text-[#F79E1B]" />
                      <span>Quét CCCD gắn chip</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-SCREEN 2: MÀN HÌNH CHỌN QUẦY (/lay-so/chon-quay) */}
            {currentScreen === 'CHON_QUAY' && (
              <div className="flex-1 flex flex-col justify-between space-y-3">
                {/* Top Nav: Back to Home + Screen Title */}
                <div className="flex items-center justify-between pb-1 border-b border-[#141413]/10 flex-shrink-0">
                  <button
                    onClick={() => setCurrentScreen('HOME')}
                    className="min-h-[50px] px-6 py-2.5 bg-white hover:bg-[#F3F0EE] active:scale-95 border-2 border-[#141413]/15 hover:border-[#bb302a] text-[#141413] font-bold rounded-2xl text-sm flex items-center gap-2.5 transition-all shadow-xs touch-manipulation"
                  >
                    <ChevronLeft className="w-5 h-5 text-[#bb302a]" />
                    <span>Quay lại Trang chủ</span>
                  </button>

                  <div className="text-center">
                    <h2 className="text-2xl font-extrabold text-[#bb302a] uppercase tracking-tight">
                      VUI LÒNG CHỌN QUẦY PHỤC VỤ
                    </h2>
                    <p className="text-xs text-[#696969] font-medium mt-0.5">
                      Chạm vào ô quầy tương ứng với lĩnh vực thủ tục Quý khách cần giải quyết
                    </p>
                  </div>

                  <div className="w-[180px] text-right">
                    <span className="text-xs font-bold text-[#696969] bg-white px-3 py-1.5 rounded-xl border border-[#141413]/10">
                      Tổng số: {counters.length} Quầy
                    </span>
                  </div>
                </div>

                {/* 6-Counter Grid (2 rows x 3 cols or 3 cols x 2 rows) */}
                <div className="grid grid-cols-3 gap-5 flex-1 items-stretch py-1 min-h-0">
                  {counters.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => handleSelectCounter(c)}
                      className="group bg-white rounded-[28px] p-6 border-2 border-[#141413]/10 hover:border-[#bb302a] shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between relative overflow-hidden active:scale-[0.98] touch-manipulation"
                    >
                      {/* Top Badges */}
                      <div className="flex items-center justify-between">
                        <div className="px-3.5 py-1.5 rounded-xl bg-[#bb302a] text-white text-xs font-extrabold tracking-wide uppercase shadow-xs">
                          {c.code ? `Quầy số ${c.code}` : c.title}
                        </div>
                        <div className="px-3 py-1 rounded-xl bg-[#059669]/10 text-[#059669] text-xs font-bold flex items-center gap-1.5 border border-[#059669]/20">
                          <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse" />
                          <span>Đang hoạt động</span>
                        </div>
                      </div>

                      {/* Main Center Content */}
                      <div className="my-auto py-2">
                        <h3 className="text-xl font-black text-[#141413] group-hover:text-[#bb302a] transition-colors leading-snug">
                          {c.title}
                        </h3>
                        <p className="text-xs text-[#696969] mt-1.5 font-medium flex items-center gap-2">
                          <span className="text-[#141413] font-bold">Cán bộ:</span>
                          <span>{c.assignedStaff?.fullName || 'Chuyên viên tiếp nhận'}</span>
                        </p>
                      </div>

                      {/* Bottom Info & Touch Action */}
                      <div className="pt-3 border-t border-[#141413]/10 flex items-center justify-between">
                        <div className="text-xs text-[#696969] font-medium flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-[#bb302a]" />
                          <span>Chờ: ~{c.todayServedCount > 20 ? 3 : 1} người</span>
                        </div>
                        <div className="px-4 py-2 bg-[#141413] group-hover:bg-[#bb302a] text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5">
                          <span>Chạm lấy số</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUB-SCREEN 3: MÀN HÌNH CHỌN DANH MỤC (/lay-so/chon-danh-muc) */}
            {currentScreen === 'CHON_DANH_MUC' && (
              <div className="flex-1 flex flex-col justify-between space-y-3">
                {/* Top Nav */}
                <div className="flex items-center justify-between pb-1 border-b border-[#141413]/10 flex-shrink-0">
                  <button
                    onClick={() => setCurrentScreen('HOME')}
                    className="min-h-[50px] px-6 py-2.5 bg-white hover:bg-[#F3F0EE] active:scale-95 border-2 border-[#141413]/15 hover:border-[#bb302a] text-[#141413] font-bold rounded-2xl text-sm flex items-center gap-2.5 transition-all shadow-xs touch-manipulation"
                  >
                    <ChevronLeft className="w-5 h-5 text-[#bb302a]" />
                    <span>Quay lại Trang chủ</span>
                  </button>

                  <div className="text-center">
                    <h2 className="text-2xl font-extrabold text-[#bb302a] uppercase tracking-tight">
                      VUI LÒNG CHỌN DANH MỤC DỊCH VỤ CÔNG
                    </h2>
                    <p className="text-xs text-[#696969] font-medium mt-0.5">
                      Chạm vào nhóm lĩnh vực thủ tục hành chính để cấp số thứ tự tương ứng
                    </p>
                  </div>

                  <div className="w-[180px] text-right">
                    <span className="text-xs font-bold text-[#696969] bg-white px-3 py-1.5 rounded-xl border border-[#141413]/10">
                      {categories.length} Nhóm lĩnh vực
                    </span>
                  </div>
                </div>

                {/* 4 Category Cards Grid */}
                <div className="grid grid-cols-2 gap-5 flex-1 items-stretch py-1 min-h-0">
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      onClick={() => handleSelectCategory(cat)}
                      className="group bg-white rounded-[28px] p-6 border-2 border-[#141413]/10 hover:border-[#bb302a] shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between relative overflow-hidden active:scale-[0.98] touch-manipulation"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 rounded-2xl bg-[#bb302a]/10 border border-[#bb302a]/20 flex items-center justify-center text-[#bb302a]">
                            <LayoutGrid className="w-7 h-7" />
                          </div>
                          <div>
                            <span className="text-[11px] font-bold text-[#bb302a] uppercase tracking-wider">
                              Nhóm {cat.prefix}
                            </span>
                            <h3 className="text-xl font-black text-[#141413] group-hover:text-[#bb302a] transition-colors leading-tight">
                              {cat.name}
                            </h3>
                          </div>
                        </div>

                        <div className="px-3 py-1 bg-[#F3F0EE] rounded-xl text-xs font-bold font-mono text-[#696969]">
                          Đang chờ: {cat.waitingCount}
                        </div>
                      </div>

                      {/* Description & tags */}
                      <p className="text-xs text-[#696969] font-medium my-2">
                        {cat.description}
                      </p>

                      <div className="flex flex-wrap gap-2 my-1">
                        {getCategoryTags(cat.id).map((tag, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 bg-[#F8FAFC] border border-[#141413]/10 rounded-lg text-[11px] text-[#141413] font-medium"
                          >
                            • {tag}
                          </span>
                        ))}
                      </div>

                      {/* Action Button */}
                      <div className="pt-3 border-t border-[#141413]/10 flex items-center justify-between">
                        <span className="text-xs text-[#696969] font-medium">
                          Thời gian chờ ước tính: ~{cat.averageWaitMinutes * (cat.waitingCount + 1)} phút
                        </span>
                        <div className="px-4 py-2 bg-[#bb302a] text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5">
                          <span>Chạm lấy số ngay</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* MODE B: GIAO DIỆN MỚI 1-CHẠM (HIỂN THỊ TRỰC TIẾP TRÊN TRANG CHỦ) */}
        {kioskMode === 'direct' && (
          <div className="flex-1 flex flex-col justify-between space-y-3">
            {/* Title Section */}
            <div className="text-center pt-1 pb-1 flex-shrink-0">
              <span className="inline-block px-3 py-0.5 bg-[#bb302a]/10 text-[#bb302a] text-xs font-bold rounded-full mb-1 tracking-wider uppercase">
                Giao diện Cảm ứng 1-Chạm Hiện đại
              </span>
              <h2 className="text-2xl font-extrabold text-[#141413] tracking-tight">
                Chạm vào Lĩnh vực cần nộp hồ sơ để In Phiếu Thứ tự
              </h2>
            </div>

            {/* Direct 4-Box Grid with Procedures */}
            <div className="grid grid-cols-2 gap-5 flex-1 items-stretch py-1 min-h-0">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => handleSelectCategory(cat)}
                  className="group bg-white rounded-[28px] p-6 border-2 border-[#141413]/10 hover:border-[#bb302a] shadow-sm hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between relative overflow-hidden active:scale-[0.98] touch-manipulation"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-[#bb302a]/10 border border-[#bb302a]/20 flex items-center justify-center text-[#bb302a]">
                        <Building2 className="w-7 h-7" />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-[#bb302a] uppercase tracking-wider">
                          Lĩnh vực {cat.prefix}
                        </span>
                        <h3 className="text-xl font-black text-[#141413] group-hover:text-[#bb302a] transition-colors leading-tight">
                          {cat.name}
                        </h3>
                      </div>
                    </div>

                    <div className="px-3.5 py-1 bg-[#F3F0EE] rounded-xl text-xs font-bold font-mono text-[#696969]">
                      Chờ: {cat.waitingCount} người
                    </div>
                  </div>

                  <p className="text-xs text-[#696969] font-medium my-2">{cat.description}</p>

                  {/* Procedures Tag Grid */}
                  <div className="grid grid-cols-2 gap-2 my-2">
                    {getCategoryTags(cat.id).map((tag, idx) => (
                      <div
                        key={idx}
                        className="px-3 py-2 bg-[#F8FAFC] border border-[#141413]/10 rounded-xl text-xs text-[#141413] font-semibold flex items-center gap-2 group-hover:border-[#bb302a]/30 transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#bb302a] flex-shrink-0" />
                        <span className="truncate">{tag}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Pill */}
                  <div className="pt-3 border-t border-[#141413]/10 flex items-center justify-between">
                    <span className="text-xs text-[#696969] font-medium">
                      Ước tính phục vụ: ~{cat.averageWaitMinutes} phút/lượt
                    </span>
                    <div className="px-5 py-2.5 bg-[#bb302a] text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-2 group-hover:bg-[#a12822] transition-colors">
                      <span>CHẠM LẤY SỐ NGAY</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Action Bar for Direct Mode */}
            <div className="flex items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-[#141413]/10 flex-shrink-0">
              <div className="text-xs text-[#696969] font-medium pl-2">
                Hỗ trợ thêm: Quét CCCD hoặc Quét mã hẹn QR đặt trước
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsCccdOpen(true)}
                  className="px-4 py-2 bg-[#F8FAFC] hover:bg-[#F3F0EE] border border-[#141413]/15 text-[#141413] rounded-xl text-xs font-bold flex items-center gap-2"
                >
                  <CreditCard className="w-4 h-4 text-[#bb302a]" />
                  <span>Quét CCCD</span>
                </button>
                <button
                  onClick={() => setIsQrOpen(true)}
                  className="px-4 py-2 bg-[#059669] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Quét QR Hẹn</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* 3. FOOTER - CHUẨN THÔNG TIN BẢN QUYỀN VÀ HOTLINE HỖ TRỢ                   */}
      {/* ========================================================================= */}
      <footer className="bg-white border-t border-[#141413]/10 px-8 py-2.5 flex items-center justify-between text-xs text-[#696969] font-medium flex-shrink-0 z-20">
        <div className="flex items-center gap-4">
          <span className="font-bold text-[#bb302a] uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse" />
            <span>Hệ thống Hoạt động Ổn định</span>
          </span>
          <span>•</span>
          <span>Trung tâm Phục vụ Hành chính công Xã Nghĩa Hưng - Huyện Nghĩa Hưng - Tỉnh Nam Định</span>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-[#141413]">
            <Phone className="w-3.5 h-3.5 text-[#bb302a]" />
            <span className="font-bold">Hotline tiếp nhận: 0228 385 1234</span>
          </div>
          <span>•</span>
          <span className="font-mono text-[#696969]">Kiosk v2.4 (1920x1080@100%)</span>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* 4. MODALS (CCCD, QR HẸN, THÔNG TIN HỖ TRỢ, PHIẾU LẤY SỐ KHÔNG RĂNG CƯA)   */}
      {/* ========================================================================= */}
      <CccdScanModal
        isOpen={isCccdOpen}
        onClose={() => setIsCccdOpen(false)}
        onScanSuccess={(citizen) => {
          setIsCccdOpen(false);
          const t = issueTicket('cat-a', { ...citizen, isPriority: isPriorityMode });
          playDingDongChime();
          setCurrentIssuedTicket(t);
        }}
      />

      <QrAppointmentModal
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
        onCheckInSuccess={(citizen, categoryId) => {
          setIsQrOpen(false);
          const t = issueTicket(categoryId, {
            ...citizen,
            isPriority: true,
          });
          playDingDongChime();
          setCurrentIssuedTicket(t);
        }}
      />

      <SupportInfoModal
        type={supportType}
        onClose={() => setSupportType(null)}
      />

      <TicketReceiptModal
        ticket={currentIssuedTicket}
        onClose={() => {
          setCurrentIssuedTicket(null);
          // Auto return to home screen if was in sub-screen
          if (currentScreen !== 'HOME') {
            setCurrentScreen('HOME');
          }
        }}
      />
    </div>
  );
}
