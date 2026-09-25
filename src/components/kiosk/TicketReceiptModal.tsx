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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 px-6 py-5 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-2 backdrop-blur-sm">
            <Printer className="w-6 h-6 text-white animate-pulse" />
          </div>
          <h3 className="font-bold text-lg tracking-wide uppercase">PHIẾU LẤY SỐ THỨ TỰ</h3>
          <p className="text-xs text-blue-100">Trung tâm Phục vụ Hành chính công</p>
        </div>

        {/* Receipt Content Body */}
        <div className="p-6 text-center space-y-4">
          <div className="border-b border-dashed border-slate-300 pb-4">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {ticket.categoryName}
            </span>
            {ticket.citizen.isPriority && (
              <div className="mt-1 inline-block px-2.5 py-0.5 bg-amber-100 text-amber-800 text-[11px] font-bold rounded-full">
                ★ KHÁCH HÀNG ƯU TIÊN
              </div>
            )}
            <div className="mt-2 text-6xl font-black text-slate-900 tracking-tight font-mono">
              {ticket.ticketNumber}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Quý khách vui lòng chú ý loa và màn hình thông báo
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-2 text-left bg-slate-50 p-3.5 rounded-2xl text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Họ tên:</span>
              <strong className="text-slate-800 text-sm truncate block">{ticket.citizen.name}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Giờ lấy vé:</span>
              <strong className="text-slate-800 text-sm block">
                {new Date(ticket.issuedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
              </strong>
            </div>
            <div className="flex items-center gap-1.5 text-blue-600 font-medium pt-1">
              <Users className="w-3.5 h-3.5" />
              <span>Chờ: ~{Math.max(1, Math.round(ticket.estimatedWaitMinutes / 5))} người</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-600 font-medium pt-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Dự kiến: ~{ticket.estimatedWaitMinutes} phút</span>
            </div>
          </div>

          {/* QR Code Simulation */}
          <div className="pt-2 flex flex-col items-center">
            <div className="p-2 bg-white border border-slate-200 rounded-xl shadow-inner">
              <QrCode className="w-20 h-20 text-slate-800" />
            </div>
            <span className="text-[10px] text-slate-400 mt-1.5">
              Quét QR để theo dõi số thứ tự qua Zalo / Mobile
            </span>
          </div>

          {/* Action Button */}
          <button
            onClick={onClose}
            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-95"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Hoàn tất & Nhận vé</span>
          </button>
        </div>

        {/* Paper tear simulation bottom edge */}
        <div className="flex justify-between -mb-1 px-1">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="w-3 h-3 bg-slate-950/70 rounded-full transform translate-y-1.5" />
          ))}
        </div>
      </div>
    </div>
  );
}
