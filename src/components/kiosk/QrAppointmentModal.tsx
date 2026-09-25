'use client';

import React, { useState } from 'react';
import { QrCode, ScanLine, CheckCircle2, X, CalendarCheck } from 'lucide-react';
import { CitizenInfo } from '@/types/qms';

interface QrAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckInSuccess: (citizen: CitizenInfo, categoryId: string) => void;
}

export default function QrAppointmentModal({
  isOpen,
  onClose,
  onCheckInSuccess,
}: QrAppointmentModalProps) {
  const bookingCode = 'ZL-9824';
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleSimulateCheckIn = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onCheckInSuccess(
        {
          name: 'TRẦN THỊ NGỌC HÀ',
          citizenId: '079198007788',
          phone: '0908889999',
          isPriority: true, // Booked appointment gets priority
        },
        'cat-a' // Đất đai
      );
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 border border-slate-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <QrCode className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Check-in Lịch hẹn Online</h3>
          <p className="text-xs text-slate-500 mt-1">
            Quét mã QR từ Zalo Mini App hoặc Cổng Dịch vụ công
          </p>
        </div>

        {/* QR Scanner simulation */}
        <div className="relative h-44 bg-slate-900 rounded-2xl overflow-hidden flex flex-col items-center justify-center border-2 border-dashed border-emerald-500/40 p-4">
          <ScanLine className="w-12 h-12 text-emerald-400 animate-bounce mb-2" />
          <p className="text-xs text-slate-300 text-center">
            Đưa mã QR trên màn hình điện thoại vào vùng quét
          </p>
        </div>

        {/* Quick Demo Preset */}
        <div className="mt-4 p-3 bg-emerald-50/75 rounded-2xl border border-emerald-100 text-xs">
          <div className="flex items-center gap-2 text-emerald-800 font-bold mb-1">
            <CalendarCheck className="w-4 h-4" />
            <span>Thông tin đặt trước tìm thấy:</span>
          </div>
          <p className="text-slate-600">
            Khách hàng: <strong>Trần Thị Ngọc Hà</strong> • Mã: <span className="font-mono">{bookingCode}</span>
          </p>
          <p className="text-slate-500 text-[11px] mt-0.5">
            Dịch vụ: Đất đai & Nhà ở (Hẹn: 09:30 hôm nay)
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50"
          >
            Hủy
          </button>
          <button
            disabled={isProcessing}
            onClick={handleSimulateCheckIn}
            className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            {isProcessing ? (
              <span>Đang xác thực...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Nhận vé ưu tiên ngay</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
