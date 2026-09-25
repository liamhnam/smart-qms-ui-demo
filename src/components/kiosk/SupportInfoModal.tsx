'use client';

import React from 'react';
import { Phone, Mail, X, QrCode, User, ExternalLink, ShieldCheck } from 'lucide-react';

interface SupportInfoModalProps {
  type: 'phone' | 'email' | null;
  onClose: () => void;
}

export default function SupportInfoModal({ type, onClose }: SupportInfoModalProps) {
  if (!type) return null;

  const phoneContacts = [
    {
      name: 'Đ/c Trần Văn Hùng',
      role: 'Tổ trưởng Bộ phận Tiếp nhận & Trả kết quả',
      phone: '0912 345 678',
      zaloUrl: 'https://zalo.me/0912345678',
      qrText: 'Zalo: 0912 345 678',
    },
    {
      name: 'Đ/c Nguyễn Thị Lan',
      role: 'Cán bộ hướng dẫn thủ tục & Tiếp công dân',
      phone: '0988 765 432',
      zaloUrl: 'https://zalo.me/0988765432',
      qrText: 'Zalo: 0988 765 432',
    },
    {
      name: 'Đường dây nóng Kiosk & Hỗ trợ Kỹ thuật',
      role: 'Tổng đài Thường trực Trung tâm HCC',
      phone: '0228 385 1234',
      zaloUrl: 'https://zalo.me/02283851234',
      qrText: 'Hotline: 0228 385 1234',
    },
  ];

  const emailContacts = [
    {
      name: 'Hộp thư tiếp nhận phản ánh, kiến nghị',
      role: 'Bộ phận Giám sát & Quản lý chất lượng DVC',
      email: 'hotro.motcua@nghiahung.namdinh.gov.vn',
    },
    {
      name: 'Đường dây nóng Cải cách Hành chính',
      role: 'Văn phòng HĐND & UBND Huyện Nghĩa Hưng',
      email: 'ubnd.nghiahung@namdinh.gov.vn',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#141413]/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-[36px] shadow-[0px_24px_50px_rgba(0,0,0,0.18)] overflow-hidden border border-[#141413]/10 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-[#bb302a] px-8 py-5 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center border border-white/20">
              {type === 'phone' ? (
                <Phone className="w-6 h-6 text-[#F79E1B]" />
              ) : (
                <Mail className="w-6 h-6 text-[#F79E1B]" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-xl tracking-tight">
                {type === 'phone' ? 'THÔNG TIN CÁN BỘ & ĐƯỜNG DÂY NÓNG HỖ TRỢ' : 'HỘP THƯ ĐIỆN TỬ TIẾP NHẬN PHẢN ÁNH'}
              </h3>
              <p className="text-xs text-white/80 mt-0.5 font-medium">
                Trung tâm Phục vụ Hành chính công Xã Nghĩa Hưng
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 text-white transition-all touch-manipulation"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-8 overflow-y-auto space-y-6 bg-[#FAF9F6]">
          {type === 'phone' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {phoneContacts.map((contact, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-[28px] border border-[#141413]/10 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center justify-between"
                >
                  <div className="w-full">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-[#bb302a]/10 border border-[#bb302a]/20 flex items-center justify-center text-[#bb302a] mb-3">
                      <User className="w-7 h-7" />
                    </div>
                    <h4 className="font-bold text-base text-[#141413]">{contact.name}</h4>
                    <p className="text-xs text-[#696969] mt-1 font-medium leading-relaxed min-h-[36px]">
                      {contact.role}
                    </p>
                    <div className="mt-3 px-4 py-2 bg-[#F3F0EE] rounded-xl font-mono font-bold text-lg text-[#bb302a]">
                      {contact.phone}
                    </div>
                  </div>

                  {/* QR Box */}
                  <div className="mt-4 pt-3 border-t border-dashed border-[#141413]/10 w-full flex flex-col items-center">
                    <div className="p-2.5 bg-white border border-[#141413]/10 rounded-xl shadow-xs">
                      <QrCode className="w-20 h-20 text-[#141413]" />
                    </div>
                    <span className="text-[11px] text-[#696969] mt-1.5 font-medium">
                      Quét Zalo kết nối trực tiếp
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {emailContacts.map((contact, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-[28px] border border-[#141413]/10 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#F79E1B]/15 text-[#9A3A0A] flex items-center justify-center mb-3">
                      <Mail className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-base text-[#141413]">{contact.name}</h4>
                    <p className="text-xs text-[#696969] mt-1 font-medium leading-relaxed">
                      {contact.role}
                    </p>
                    <div className="mt-4 p-3 bg-[#F3F0EE] rounded-xl font-mono text-sm text-[#141413] font-semibold select-all break-all border border-[#141413]/10">
                      {contact.email}
                    </div>
                  </div>
                  <div className="mt-4 text-xs text-[#696969] flex items-center gap-1.5 font-medium">
                    <ShieldCheck className="w-4 h-4 text-[#059669]" />
                    <span>Thư điện tử được xử lý và phản hồi trong 24 giờ làm việc</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="p-4 bg-[#F3F0EE] rounded-2xl text-center text-xs text-[#696969] font-medium">
            Mọi phản ánh, kiến nghị của công dân được bảo mật thông tin và tiếp nhận, giải quyết theo đúng quy định của Pháp luật.
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-8 py-4 bg-white border-t border-[#141413]/10 flex justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="min-h-[50px] px-8 py-3 bg-[#141413] hover:bg-[#262627] active:scale-95 text-white font-bold rounded-2xl transition-all shadow-sm touch-manipulation"
          >
            Đóng cửa sổ
          </button>
        </div>
      </div>
    </div>
  );
}
