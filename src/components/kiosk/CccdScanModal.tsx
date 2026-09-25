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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 border border-slate-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <CreditCard className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Quét Căn cước công dân gắn chíp</h3>
          <p className="text-xs text-slate-500 mt-1">
            Đặt thẻ CCCD vào khe đọc thẻ hoặc mặt kính cảm biến
          </p>
        </div>

        {/* Scanner Simulation Window */}
        <div className="relative h-48 bg-slate-900 rounded-2xl overflow-hidden flex flex-col items-center justify-center border-2 border-slate-700">
          {isScanning ? (
            <>
              {/* Laser line scanning animation */}
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-[scan_2s_ease-in-out_infinite]" />
              <Scan className="w-12 h-12 text-cyan-400 animate-pulse mb-2" />
              <span className="text-xs text-cyan-200 font-mono tracking-wide">
                Đang đọc chíp điện tử CCCD...
              </span>
            </>
          ) : scannedData ? (
            <div className="text-center p-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-2" />
              <span className="text-xs text-emerald-300 font-bold uppercase tracking-wider block">
                Đọc thẻ thành công!
              </span>
            </div>
          ) : (
            <span className="text-xs text-slate-400">Chờ tín hiệu thẻ...</span>
          )}
        </div>

        {/* Scanned Data Preview */}
        {scannedData && (
          <div className="mt-4 p-3.5 bg-blue-50/70 border border-blue-100 rounded-2xl text-xs space-y-1.5 animate-in fade-in">
            <div className="flex justify-between">
              <span className="text-slate-500">Họ và tên:</span>
              <strong className="text-slate-900 font-bold">{scannedData.name}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Số định danh (CCCD):</span>
              <span className="font-mono text-slate-800">{scannedData.citizenId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Năm sinh:</span>
              <span className="text-slate-800">{scannedData.birthYear}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Nơi thường trú:</span>
              <span className="text-slate-800 truncate max-w-[200px]">{scannedData.address}</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50"
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
            className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Xác nhận thông tin</span>
          </button>
        </div>
      </div>
    </div>
  );
}
