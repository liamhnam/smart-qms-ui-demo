'use client';

import React from 'react';
import { Ticket } from '@/types/qms';
import { Printer, CheckCircle2, X, Clock, Users, QrCode } from 'lucide-react';

interface TicketReceiptModalProps {
  ticket: Ticket | null;
  onClose: () => void;
}

export default function TicketReceiptModal({ ticket, onClose }: TicketReceiptModalProps) {
  if (!ticket) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141413]/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-white rounded-[40px] shadow-[0px_24px_48px_rgba(0,0,0,0.12)] overflow-hidden border border-[#141413]/10 animate-in zoom-in-95 duration-200">
        {/* Top Header - Administrative Red #bb302a */}
        <div className="bg-[#bb302a] px-6 py-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2.5 rounded-full bg-white/20 hover:bg-white/30 active:scale-95 text-white transition-all touch-manipulation"
          >
            <X className="w-4 h-4" />
          </button>
          
          {/* Emblem Logo */}
          <div className="flex items-center justify-center mb-2.5">
            <div className="w-12 h-12 rounded-full bg-white p-1.5 shadow-md flex items-center justify-center">
              <img src="/logo.png" alt="Logo Một Cửa" className="w-9 h-9 object-contain" />
            </div>
          </div>

          <h3 className="font-bold text-base sm:text-lg tracking-tight uppercase">PHIẾU LẤY SỐ THỨ TỰ</h3>
          <p className="text-xs sm:text-sm text-white/90 mt-0.5 font-medium">Trung tâm Phục vụ Hành chính công</p>
        </div>

        {/* Receipt Content Body */}
        <div className="p-7 text-center space-y-5 bg-[#FCFBFA]">
          <div className="border-b border-dashed border-[#141413]/15 pb-5">
            <div className="text-xs sm:text-sm font-bold text-[#696969] tracking-wider uppercase">
              • {ticket.categoryName}
            </div>
            {ticket.citizen.isPriority && (
              <div className="mt-2 inline-block px-3.5 py-1 bg-[#F79E1B]/20 text-[#9A3A0A] text-xs font-bold rounded-full">
                ★ KHÁCH HÀNG ƯU TIÊN
              </div>
            )}
            <div className="mt-2 text-6xl sm:text-7xl font-bold text-[#bb302a] tracking-tight font-mono">
              {ticket.ticketNumber}
            </div>
            <p className="text-xs sm:text-sm text-[#696969] mt-2 font-medium">
              Quý khách vui lòng chú ý loa và màn hình thông báo
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-left bg-[#F3F0EE] p-4.5 rounded-[20px] text-xs sm:text-sm">
            <div>
              <span className="text-[#696969] block text-xs font-medium">Họ tên:</span>
              <strong className="text-[#141413] text-sm sm:text-base truncate block font-bold">{ticket.citizen.name}</strong>
            </div>
            <div>
              <span className="text-[#696969] block text-xs font-medium">Giờ lấy vé:</span>
              <strong className="text-[#141413] text-sm sm:text-base block font-bold font-mono">
                {new Date(ticket.issuedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
              </strong>
            </div>
            <div className="flex items-center gap-1.5 text-[#141413] font-semibold pt-1">
              <Users className="w-4 h-4 text-[#bb302a]" />
              <span>Chờ: ~{Math.max(1, Math.round(ticket.estimatedWaitMinutes / 5))} người</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#141413] font-semibold pt-1">
              <Clock className="w-4 h-4 text-[#bb302a]" />
              <span>Dự kiến: ~{ticket.estimatedWaitMinutes} phút</span>
            </div>
          </div>

          {/* QR Code Container */}
          <div className="pt-1 flex flex-col items-center">
            <div className="p-3 bg-white border border-[#141413]/10 rounded-[20px] shadow-sm">
              <QrCode className="w-20 h-20 text-[#141413]" />
            </div>
            <span className="text-xs text-[#696969] mt-2 font-medium">
              Quét QR để theo dõi tiến độ giải quyết
            </span>
          </div>

          {/* Primary Ink Pill Button (Touchscreen Ergonomic) */}
          <button
            onClick={onClose}
            className="w-full min-h-[54px] py-4 bg-[#141413] hover:bg-[#262627] active:bg-[#000000] text-[#F3F0EE] font-bold rounded-[22px] shadow-sm flex items-center justify-center gap-2 text-sm sm:text-base transition-all active:scale-[0.98] touch-manipulation select-none"
          >
            <CheckCircle2 className="w-5 h-5 text-[#F79E1B]" />
            <span>Hoàn tất & Nhận phiếu</span>
          </button>
        </div>

        {/* Paper tear simulation bottom edge */}
        <div className="flex justify-between -mb-1 px-1 bg-[#FCFBFA]">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="w-3 h-3 bg-[#141413]/60 rounded-full transform translate-y-1.5" />
          ))}
        </div>
      </div>
    </div>
  );
}
