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
  ChevronRight,
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
        return <Building2 className="w-8 h-8 sm:w-10 sm:h-10 text-white" />;
      case 'Scale':
        return <Scale className="w-8 h-8 sm:w-10 sm:h-10 text-white" />;
      case 'Briefcase':
        return <Briefcase className="w-8 h-8 sm:w-10 sm:h-10 text-white" />;
      case 'Zap':
      default:
        return <Zap className="w-8 h-8 sm:w-10 sm:h-10 text-white" />;
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
    // Pick first category or prompt
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100 flex flex-col justify-between pt-16 sm:pt-20 pb-8 px-4 sm:px-8 select-none">
      {/* Top Kiosk Header */}
      <header className="max-w-6xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-4 py-4 px-6 bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-600 via-amber-500 to-yellow-400 p-0.5 shadow-lg flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-black text-amber-400 text-xl tracking-wider">
              ★
            </div>
          </div>
          <div>
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest block">
              Ủy ban Nhân dân • Bộ phận Tiếp nhận & Trả kết quả
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              TRUNG TÂM PHỤC VỤ HÀNH CHÍNH CÔNG
            </h1>
            <p className="text-xs text-slate-400">
              Hệ thống Kiosk Lấy số tự động & Quản lý Xếp hàng Thông minh
            </p>
          </div>
        </div>

        {/* Live Clock & Date */}
        <div className="flex items-center gap-6 text-right">
          <div className="hidden sm:block">
            <div className="text-2xl font-black tracking-wider font-mono text-cyan-400">
              {currentTime
                ? currentTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                : '--:--:--'}
            </div>
            <div className="text-xs text-slate-400">
              {currentTime
                ? currentTime.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })
                : ''}
            </div>
          </div>

          {/* Priority Mode Toggle Button */}
          <button
            onClick={() => setIsPriorityMode(!isPriorityMode)}
            className={`px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all flex items-center gap-2 shadow-md ${
              isPriorityMode
                ? 'bg-amber-500/20 text-amber-300 border-amber-400/60 ring-2 ring-amber-400/30'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
            }`}
          >
            <HeartHandshake className="w-4 h-4 text-amber-400" />
            <span>{isPriorityMode ? 'Chế độ ƯU TIÊN: ĐANG BẬT' : 'Khách hàng Ưu tiên?'}</span>
          </button>
        </div>
      </header>

      {/* Main Kiosk Content - Service Selection Grid */}
      <main className="max-w-6xl mx-auto w-full my-6 flex-1 flex flex-col justify-center">
        <div className="text-center mb-6">
          <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Bước 1: Chạm vào màn hình để chọn lĩnh vực cần phục vụ
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            QUÝ KHÁCH CẦN THỰC HIỆN THỦ TỤC NÀO?
          </h2>
        </div>

        {/* 4 Large Interactive Touch Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleSelectCategory(cat)}
              className="group relative cursor-pointer overflow-hidden rounded-3xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-blue-500/50 p-6 sm:p-7 shadow-xl hover:shadow-2xl hover:shadow-blue-500/15 transition-all duration-300 transform hover:-translate-y-1 active:scale-[0.98] flex flex-col justify-between"
            >
              {/* Top Accent Gradient Bar */}
              <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${cat.color}`} />

              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div
                    className={`w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-tr ${cat.color} flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform`}
                  >
                    {getCategoryIcon(cat.iconName)}
                  </div>
                  <span className="text-2xl font-black font-mono text-slate-400 group-hover:text-blue-400">
                    MÃ {cat.prefix}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-blue-300 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
                  {cat.description}
                </p>
              </div>

              {/* Waiting Stats & CTA */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-4 text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-amber-400" />
                    <span>
                      Đang đợi: <strong className="text-white">{cat.waitingCount}</strong> người
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    <span>
                      Dự kiến: <strong className="text-white">~{cat.waitingCount * cat.averageWaitMinutes}</strong> phút
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-blue-400 font-bold group-hover:translate-x-1 transition-transform">
                  <span>Chạm để lấy số</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Alternative Fast Entry Options (CCCD / QR) */}
      <footer className="max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Scan CCCD Button */}
          <button
            onClick={() => setIsCccdOpen(true)}
            className="flex items-center justify-center gap-3 py-4 px-6 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/60 rounded-2xl shadow-lg transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <CreditCard className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>Quét Căn cước công dân gắn chíp</span>
                <span className="px-1.5 py-0.5 text-[9px] bg-cyan-500/20 text-cyan-300 rounded font-semibold">
                  Tự động điền
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                Nhận vé định danh chính xác, không cần nhập thông tin
              </div>
            </div>
          </button>

          {/* Scan QR Online Booking Button */}
          <button
            onClick={() => setIsQrOpen(true)}
            className="flex items-center justify-center gap-3 py-4 px-6 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/60 rounded-2xl shadow-lg transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <QrCode className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>Check-in Đặt lịch hẹn Zalo / Online</span>
                <span className="px-1.5 py-0.5 text-[9px] bg-emerald-500/20 text-emerald-300 rounded font-semibold">
                  Ưu tiên gọi trước
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                Quét mã QR từ Zalo Mini App để nhận số hẹn trước
              </div>
            </div>
          </button>
        </div>

        {/* Security & System Info Footer */}
        <div className="mt-4 text-center text-[11px] text-slate-500 flex items-center justify-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
          <span>Hệ thống lấy số tự động GoodM Smart QMS • Tự động đồng bộ thời gian thực</span>
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
