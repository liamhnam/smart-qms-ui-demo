'use client';

import React, { useState, useEffect } from 'react';
import { CreditCard, Scan, CheckCircle2, X } from 'lucide-react';
import { CitizenInfo } from '@/types/qms';

interface CccdScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (citizen: CitizenInfo) => void;
}

export default function CccdScanModal({ isOpen, onClose, onScanSuccess }: CccdScanModalProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<CitizenInfo | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsScanning(true);
      setScannedData(null);

      // Simulate 1.8s NFC chip reading delay
      const timer = setTimeout(() => {
        setIsScanning(false);
        setScannedData({
          name: 'NGUYỄN VĂN AN',
          citizenId: '001089012345',
          birthYear: '1989',
          phone: '0912345678',
          address: 'P. Bến Nghé, Quận 1, TP. Hồ Chí Minh',
          isPriority: false,
        });
      }, 1800);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

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
            <CreditCard className="w-8 h-8" />
          </div>
          <span className="eyebrow-label text-[#bb302a] block mb-1">
            • ĐỊNH DANH ĐIỆN TỬ
          </span>
          <h3 className="text-xl font-medium text-[#141413]">Quét Căn cước công dân gắn chíp</h3>
          <p className="text-xs text-[#696969] mt-1">
            Đặt thẻ CCCD vào đầu đọc hoặc mặt kính cảm ứng
          </p>
        </div>

        {/* Scanner Simulation Window */}
        <div className="relative h-44 bg-[#141413] rounded-[24px] overflow-hidden flex flex-col items-center justify-center border border-[#141413]">
          {isScanning ? (
            <>
              {/* Laser line scanning animation */}
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#bb302a] to-transparent shadow-[0_0_15px_#bb302a] animate-[scan_2s_ease-in-out_infinite]" />
              <Scan className="w-12 h-12 text-[#F79E1B] animate-pulse mb-2" />
              <span className="text-xs text-[#F3F0EE] font-mono tracking-wide">
                Đang đọc chíp điện tử CCCD...
              </span>
            </>
          ) : scannedData ? (
            <div className="text-center p-4">
              <CheckCircle2 className="w-12 h-12 text-[#F79E1B] mx-auto mb-2" />
              <span className="text-xs text-[#F3F0EE] font-medium tracking-wider block">
                Đọc thẻ thành công!
              </span>
            </div>
          ) : (
            <span className="text-xs text-[#696969]">Chờ tín hiệu thẻ...</span>
          )}
        </div>

        {/* Scanned Data Preview */}
        {scannedData && (
          <div className="mt-5 p-4 bg-[#F3F0EE] border border-[#141413]/10 rounded-[20px] text-xs space-y-2 animate-in fade-in">
            <div className="flex justify-between">
              <span className="text-[#696969]">Họ và tên:</span>
              <strong className="text-[#141413] font-medium">{scannedData.name}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#696969]">Số định danh (CCCD):</span>
              <span className="font-mono text-[#141413]">{scannedData.citizenId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#696969]">Năm sinh:</span>
              <span className="text-[#141413]">{scannedData.birthYear}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#696969]">Nơi thường trú:</span>
              <span className="text-[#141413] truncate max-w-[210px]">{scannedData.address}</span>
            </div>
          </div>
        )}

        {/* Actions (Touchscreen Ergonomic) */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 min-h-[50px] py-3.5 bg-white border-[1.5px] border-[#141413] text-[#141413] text-sm font-bold rounded-[22px] hover:bg-[#F3F0EE] active:scale-95 transition-all touch-manipulation"
          >
            Hủy bỏ
          </button>
          <button
            disabled={!scannedData || isScanning}
            onClick={() => {
              if (scannedData) {
                onScanSuccess(scannedData);
                onClose();
              }
            }}
            className="flex-1 min-h-[50px] py-3.5 bg-[#141413] hover:bg-[#262627] active:bg-[#000000] disabled:opacity-40 text-[#F3F0EE] text-sm font-bold rounded-[22px] transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95 touch-manipulation"
          >
            <CheckCircle2 className="w-5 h-5 text-[#F79E1B]" />
            <span>Xác nhận thông tin</span>
          </button>
        </div>
      </div>
    </div>
  );
}
