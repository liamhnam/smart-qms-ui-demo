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
            className="absolute top-5 right-5 p-2 rounded-full bg-white/15 hover:bg-white/25 text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
          
          {/* Dual circular logo indicator */}
          <div className="flex items-center justify-center mb-2">
            <div className="w-5 h-5 rounded-full bg-white opacity-95" />
            <div className="w-5 h-5 rounded-full bg-[#F79E1B] opacity-90 -ml-2.5 mix-blend-screen" />
          </div>

          <h3 className="font-medium text-base tracking-tight uppercase">PHIẾU LẤY SỐ THỨ TỰ</h3>
          <p className="text-xs text-white/80 mt-0.5">Trung tâm Phục vụ Hành chính công</p>
        </div>

        {/* Receipt Content Body */}
        <div className="p-7 text-center space-y-5 bg-[#FCFBFA]">
          <div className="border-b border-dashed border-[#141413]/15 pb-5">
            <div className="text-xs font-bold text-[#696969] tracking-wider uppercase">
              • {ticket.categoryName}
            </div>
            {ticket.citizen.isPriority && (
              <div className="mt-1.5 inline-block px-3 py-1 bg-[#F79E1B]/15 text-[#9A3A0A] text-[11px] font-bold rounded-full">
                ★ KHÁCH HÀNG ƯU TIÊN
              </div>
            )}
            <div className="mt-2 text-6xl font-medium text-[#141413] tracking-tight font-mono">
              {ticket.ticketNumber}
            </div>
            <p className="text-xs text-[#696969] mt-1.5">
              Quý khách vui lòng chú ý loa và màn hình thông báo
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-left bg-[#F3F0EE] p-4 rounded-[20px] text-xs">
            <div>
              <span className="text-[#696969] block text-[11px]">Họ tên:</span>
              <strong className="text-[#141413] text-sm truncate block font-medium">{ticket.citizen.name}</strong>
            </div>
            <div>
              <span className="text-[#696969] block text-[11px]">Giờ lấy vé:</span>
              <strong className="text-[#141413] text-sm block font-medium">
                {new Date(ticket.issuedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
              </strong>
            </div>
            <div className="flex items-center gap-1.5 text-[#141413] font-medium pt-1">
              <Users className="w-3.5 h-3.5 text-[#bb302a]" />
              <span>Chờ: ~{Math.max(1, Math.round(ticket.estimatedWaitMinutes / 5))} người</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#141413] font-medium pt-1">
              <Clock className="w-3.5 h-3.5 text-[#bb302a]" />
              <span>Dự kiến: ~{ticket.estimatedWaitMinutes} phút</span>
            </div>
          </div>

          {/* QR Code Container */}
          <div className="pt-1 flex flex-col items-center">
            <div className="p-3 bg-white border border-[#141413]/10 rounded-[20px] shadow-sm">
              <QrCode className="w-20 h-20 text-[#141413]" />
            </div>
            <span className="text-[11px] text-[#696969] mt-2 font-medium">
              Quét QR để theo dõi tiến độ giải quyết
            </span>
          </div>

          {/* Primary Ink Pill Button (20px radius) */}
          <button
            onClick={onClose}
            className="w-full py-3.5 bg-[#141413] hover:bg-[#262627] text-[#F3F0EE] font-medium rounded-[20px] shadow-sm flex items-center justify-center gap-2 transition-all transform active:scale-98"
          >
            <CheckCircle2 className="w-4 h-4 text-[#F79E1B]" />
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
