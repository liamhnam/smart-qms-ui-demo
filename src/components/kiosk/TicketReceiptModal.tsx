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
        <div className="bg-[#bb302a] px-6 py-4 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 active:scale-95 text-white transition-all touch-manipulation"
          >
            <X className="w-4 h-4" />
          </button>
          
          {/* Emblem Logo */}
          <div className="flex items-center justify-center mb-2">
            <div className="w-10 h-10 rounded-full bg-white p-1 shadow-md flex items-center justify-center">
              <img src="/logo.png" alt="Logo Một Cửa" className="w-8 h-8 object-contain" />
            </div>
          </div>

          <h3 className="font-bold text-base tracking-tight uppercase">PHIẾU LẤY SỐ THỨ TỰ</h3>
          <p className="text-xs text-white/90 mt-0.5 font-medium">Trung tâm Phục vụ Hành chính công</p>
        </div>

        {/* Receipt Content Body */}
        <div className="p-5 sm:p-6 text-center space-y-3.5 bg-[#FCFBFA]">
          <div className="border-b border-dashed border-[#141413]/15 pb-3">
            <div className="text-xs sm:text-sm font-bold text-[#696969] tracking-wider uppercase">
              • {ticket.categoryName}
            </div>
            {ticket.citizen.isPriority && (
              <div className="mt-1.5 inline-block px-3 py-0.5 bg-[#F79E1B]/20 text-[#9A3A0A] text-xs font-bold rounded-full">
                ★ KHÁCH HÀNG ƯU TIÊN
              </div>
            )}
            <div className="mt-1.5 text-5xl sm:text-6xl font-bold text-[#bb302a] tracking-tight font-mono">
              {ticket.ticketNumber}
            </div>
            <p className="text-xs text-[#696969] mt-1 font-medium">
              Quý khách vui lòng chú ý loa và màn hình thông báo
            </p>
          </div>

          {/* Details Grid (Full-width Name & compact stats) */}
          <div className="space-y-1.5 text-left bg-[#F3F0EE] p-3 rounded-[20px] text-xs sm:text-sm">
            <div className="flex items-center justify-between pb-1 border-b border-[#141413]/10">
              <span className="text-[#696969] text-xs font-medium">Họ tên:</span>
              <strong className="text-[#141413] text-sm sm:text-base font-bold text-right">{ticket.citizen.name}</strong>
            </div>
            <div className="flex items-center justify-between pb-1 border-b border-[#141413]/10">
              <span className="text-[#696969] text-xs font-medium">Giờ lấy vé:</span>
              <strong className="text-[#141413] text-sm sm:text-base font-bold font-mono">
                {new Date(ticket.issuedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
              </strong>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-0.5">
              <div className="flex items-center gap-1.5 text-[#141413] font-semibold">
                <Users className="w-4 h-4 text-[#bb302a]" />
                <span>Chờ: ~{Math.max(1, Math.round(ticket.estimatedWaitMinutes / 5))} người</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#141413] font-semibold justify-end">
                <Clock className="w-4 h-4 text-[#bb302a]" />
                <span>Dự kiến: ~{ticket.estimatedWaitMinutes}p</span>
              </div>
            </div>
          </div>

          {/* QR Code Container */}
          <div className="pt-0.5 flex flex-col items-center">
            <div className="p-2.5 bg-white border border-[#141413]/10 rounded-[18px] shadow-sm">
              <QrCode className="w-16 h-16 text-[#141413]" />
            </div>
            <span className="text-xs text-[#696969] mt-1.5 font-medium">
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
        <div className="flex justify-between px-2 py-1.5 bg-[#FCFBFA] border-t border-dashed border-[#141413]/10">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="w-2.5 h-2.5 bg-[#141413]/20 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
