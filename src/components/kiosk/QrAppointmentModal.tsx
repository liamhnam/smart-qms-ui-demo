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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141413]/60 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md bg-[#FCFBFA] rounded-[40px] shadow-[0px_24px_48px_rgba(0,0,0,0.12)] p-8 border border-[#141413]/10">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-[#696969] hover:text-[#141413] rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-[#bb302a]/10 text-[#bb302a] rounded-full flex items-center justify-center mx-auto mb-3">
            <QrCode className="w-8 h-8" />
          </div>
          <span className="eyebrow-label text-[#bb302a] block mb-1">
            • DỊCH VỤ CÔNG TRỰC TUYẾN
          </span>
          <h3 className="text-xl font-medium text-[#141413]">Check-in Lịch hẹn Online</h3>
          <p className="text-xs text-[#696969] mt-1">
            Quét mã QR từ Zalo Mini App hoặc Cổng Dịch vụ công
          </p>
        </div>

        {/* QR Scanner simulation */}
        <div className="relative h-44 bg-[#141413] rounded-[24px] overflow-hidden flex flex-col items-center justify-center border border-[#141413] p-4">
          <ScanLine className="w-10 h-10 text-[#F79E1B] animate-bounce mb-2" />
          <p className="text-xs text-[#F3F0EE] text-center font-medium">
            Đưa mã QR trên màn hình điện thoại vào vùng quét
          </p>
        </div>

        {/* Quick Demo Preset */}
        <div className="mt-5 p-4 bg-[#F3F0EE] rounded-[20px] border border-[#141413]/10 text-xs">
          <div className="flex items-center gap-2 text-[#bb302a] font-bold mb-1">
            <CalendarCheck className="w-4 h-4" />
            <span>Lịch hẹn hợp lệ tìm thấy:</span>
          </div>
          <p className="text-[#141413]">
            Công dân: <strong>Trần Thị Ngọc Hà</strong> • Mã: <span className="font-mono font-semibold">{bookingCode}</span>
          </p>
          <p className="text-[#696969] text-[11px] mt-0.5">
            Dịch vụ: Đất đai & Nhà ở (Giờ hẹn: 09:30 sáng nay)
          </p>
        </div>

        {/* Buttons (Pills 20px radius) */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-white border-[1.5px] border-[#141413] text-[#141413] text-xs font-medium rounded-[20px] hover:bg-[#F3F0EE] transition-all"
          >
            Hủy bỏ
          </button>
          <button
            disabled={isProcessing}
            onClick={handleSimulateCheckIn}
            className="flex-1 py-3 bg-[#141413] hover:bg-[#262627] text-[#F3F0EE] text-xs font-medium rounded-[20px] transition-all flex items-center justify-center gap-1.5 shadow-sm"
          >
            {isProcessing ? (
              <span>Đang xác thực...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#F79E1B]" />
                <span>Nhận số ưu tiên ngay</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
