'use client';

import React, { useState } from 'react';
import { useQms } from '@/context/QmsContext';
import confetti from 'canvas-confetti';
import {
  QrCode,
  ThumbsUp,
  CheckCircle2,
  ChevronDown,
  ShieldCheck,
  CreditCard,
  X,
} from 'lucide-react';

interface RatingOption {
  score: number;
  label: string;
  emoji: string;
  color: string;
  tags: string[];
}

const RATING_OPTIONS: RatingOption[] = [
  {
    score: 5,
    label: 'Rất hài lòng',
    emoji: '🤩',
    color: 'border-[#bb302a] bg-white shadow-md ring-2 ring-[#bb302a]/20',
    tags: ['Thái độ niềm nở', 'Nghiệp vụ thành thạo', 'Hướng dẫn tận tình', 'Thủ tục nhanh gọn'],
  },
  {
    score: 4,
    label: 'Hài lòng',
    emoji: '😊',
    color: 'border-[#141413] bg-white shadow-md ring-2 ring-[#141413]/10',
    tags: ['Đúng giờ hẹn', 'Giải thích dễ hiểu', 'Thời gian chờ hợp lý'],
  },
  {
    score: 3,
    label: 'Bình thường',
    emoji: '😐',
    color: 'border-[#F79E1B] bg-white shadow-md ring-2 ring-[#F79E1B]/20',
    tags: ['Thời gian chờ hơi lâu', 'Cần hướng dẫn thêm'],
  },
  {
    score: 2,
    label: 'Chưa hài lòng',
    emoji: '🙁',
    color: 'border-[#CF4500] bg-white shadow-md ring-2 ring-[#CF4500]/20',
    tags: ['Thủ tục rườm rà', 'Cán bộ chưa nhiệt tình', 'Hệ thống chậm'],
  },
  {
    score: 1,
    label: 'Rất không hài lòng',
    emoji: '😡',
    color: 'border-[#bb302a] bg-white shadow-md ring-2 ring-[#bb302a]/20',
    tags: ['Thái độ phục vụ kém', 'Giải quyết quá chậm trễ', 'Yêu cầu giấy tờ ngoài quy định'],
  },
];

export default function RatingPage() {
  const {
    activeCounter,
    activeCounterId,
    setActiveCounterId,
    counters,
    activeEvaluationTicket,
    submitTicketRating,
    dismissEvaluation,
  } = useQms();

  const [selectedScore, setSelectedScore] = useState<number | null>(5);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showQrPaymentModal, setShowQrPaymentModal] = useState(false);

  const activeTicket = activeEvaluationTicket;
  const currentOption = RATING_OPTIONS.find((o) => o.score === selectedScore) || RATING_OPTIONS[0];

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    if (!selectedScore) return;

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#bb302a', '#F79E1B', '#141413', '#FCFBFA'],
      });
    } catch {
      // Ignore if canvas is unavailable
    }

    setIsSubmitted(true);

    if (activeTicket) {
      submitTicketRating(activeTicket.id, {
        score: selectedScore,
        tags: selectedTags,
        feedback: feedbackText,
      });
    }

    setTimeout(() => {
      setIsSubmitted(false);
      setSelectedScore(5);
      setSelectedTags([]);
      setFeedbackText('');
      dismissEvaluation();
    }, 3500);
  };

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-[#F3F0EE] text-[#141413] flex flex-col justify-between pt-16 sm:pt-18 pb-4 px-4 sm:px-8 select-none relative">
      {/* Top Tablet Header (Stadium 32px on #FCFBFA) */}
      <header className="relative z-10 max-w-4xl mx-auto w-full flex items-center justify-between py-3 px-6 sm:px-8 bg-[#FCFBFA] rounded-[32px] border border-[#141413]/10 shadow-[0px_4px_24px_rgba(0,0,0,0.03)] flex-shrink-0">
        <div className="flex items-center gap-3.5">
          <img
            src="/logo.png"
            alt="Logo Một Cửa"
            className="w-10 h-10 object-contain flex-shrink-0 drop-shadow-sm"
          />
          <div>
            <span className="eyebrow-label text-[#bb302a] block text-xs font-bold">
              • KHẢO SÁT ĐỘ HÀI LÒNG CỦA CÔNG DÂN
            </span>
            <h1 className="text-base sm:text-lg font-bold text-[#141413]">
              {activeCounter?.title || 'Quầy phục vụ'}
            </h1>
          </div>
        </div>

        {/* Counter Switcher & VietQR Trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowQrPaymentModal(true)}
            className="min-h-[44px] flex items-center gap-2 px-4 py-2 bg-white border border-[#141413]/15 text-[#141413] rounded-full text-xs sm:text-sm font-semibold hover:bg-[#F3F0EE] active:scale-95 transition-all shadow-sm touch-manipulation"
          >
            <CreditCard className="w-4 h-4 text-[#bb302a]" />
            <span>Thu phí VietQR</span>
          </button>

          <div className="relative">
            <select
              value={activeCounterId}
              onChange={(e) => setActiveCounterId(e.target.value)}
              className="min-h-[44px] bg-white text-[#141413] font-semibold text-xs sm:text-sm px-4 py-2 rounded-full border border-[#141413]/15 cursor-pointer appearance-none pr-8 focus:outline-none shadow-sm touch-manipulation"
            >
              {counters.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#FCFBFA] text-[#141413]">
                  Quầy {c.code}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-[#696969] absolute right-3 top-3 pointer-events-none" />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-4xl mx-auto w-full my-auto flex-1 flex flex-col justify-center min-h-0 py-2">
        {isSubmitted ? (
          /* Thank You Screen (Stadium 32px) */
          <div className="bg-[#FCFBFA] rounded-[32px] border border-[#141413]/10 p-8 sm:p-10 text-center shadow-[0px_24px_48px_rgba(0,0,0,0.06)] animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-[#bb302a]/10 text-[#bb302a] rounded-full flex items-center justify-center mx-auto mb-3 border border-[#bb302a]/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <span className="eyebrow-label text-[#bb302a] block mb-1 text-xs font-bold">
              • CẢM ƠN QUÝ CÔNG DÂN
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#141413] mb-2 tracking-tight">
              Xin chân thành cảm ơn ý kiến đóng góp của Quý khách!
            </h2>
            <p className="text-xs sm:text-sm text-[#696969] max-w-md mx-auto leading-relaxed">
              Mỗi đánh giá của Quý khách là cơ sở để chúng tôi liên tục cải tiến quy trình phục vụ ngày càng tận tâm, minh bạch và hiệu quả hơn.
            </p>
            <div className="mt-5 inline-block px-5 py-2 bg-white border border-[#141413]/10 text-[#141413] rounded-full text-xs font-semibold shadow-sm">
              Chúc Quý khách một ngày làm việc thuận lợi & vạn sự như ý!
            </div>
          </div>
        ) : (
          /* Rating Form (Stadium 32px on #FCFBFA) */
          <div className="bg-[#FCFBFA] rounded-[32px] border border-[#141413]/10 p-5 sm:p-7 shadow-[0px_24px_48px_rgba(0,0,0,0.04)]">
            {/* Header context */}
            <div className="text-center mb-4 pb-3 border-b border-[#141413]/10">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-xs text-[#696969]">Đánh giá phiên phục vụ vé:</span>
                <span className="font-mono font-bold text-[#bb302a] text-base">
                  {activeTicket ? activeTicket.ticketNumber : 'A-101'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#141413] tracking-tight">
                Quý công dân cảm thấy mức độ phục vụ hôm nay như thế nào?
              </h2>
              <p className="text-xs text-[#696969] mt-1">
                Cán bộ tiếp nhận: <strong className="text-[#141413] font-bold">{activeCounter?.assignedStaff.fullName}</strong>
              </p>
            </div>

            {/* 5 Circular/Pill Emoji Options (Touchscreen Ergonomic) */}
            <div className="grid grid-cols-5 gap-2.5 sm:gap-3.5 mb-4">
              {RATING_OPTIONS.map((option) => {
                const isSelected = selectedScore === option.score;
                return (
                  <button
                    key={option.score}
                    onClick={() => {
                      setSelectedScore(option.score);
                      setSelectedTags([]);
                    }}
                    className={`min-h-[110px] sm:min-h-[120px] py-4 px-2 rounded-[22px] border transition-all duration-150 flex flex-col items-center justify-center gap-2 transform active:scale-95 touch-manipulation select-none ${
                      isSelected
                        ? `${option.color} scale-105 shadow-md ring-2 ring-[#bb302a]/20`
                        : 'bg-[#F3F0EE] text-[#696969] border-transparent hover:bg-white hover:text-[#141413] active:bg-[#ECE6E2]'
                    }`}
                  >
                    <span className="text-4xl sm:text-5xl filter drop-shadow-sm transition-transform hover:scale-110">
                      {option.emoji}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-center leading-tight text-[#141413]">
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Dynamic Reason Tags (Pill 20px radius, Touchscreen Ergonomic) */}
            <div className="mb-3.5 p-4 bg-[#F3F0EE] rounded-[22px] border border-[#141413]/5">
              <span className="eyebrow-label text-[#696969] block mb-2.5 text-xs font-bold">
                • LÝ DO QUÝ KHÁCH ĐÁNH GIÁ (CHẠM ĐỂ CHỌN MỘT HOẶC NHIỀU TIÊU CHÍ):
              </span>
              <div className="flex flex-wrap gap-2.5">
                {currentOption.tags.map((tag) => {
                  const isChecked = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => handleTagToggle(tag)}
                      className={`px-4 sm:px-5 py-2.5 min-h-[42px] rounded-full text-xs sm:text-sm font-bold border transition-all active:scale-95 touch-manipulation select-none ${
                        isChecked
                          ? 'bg-[#141413] text-[#F3F0EE] border-[#141413] shadow-sm'
                          : 'bg-white text-[#141413] border-[#141413]/10 hover:border-[#141413] active:bg-[#F3F0EE]'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Optional Comment Input */}
            <div className="mb-4">
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Ý kiến đóng góp thêm của Quý khách (không bắt buộc)..."
                rows={2}
                className="w-full p-3.5 bg-white rounded-[18px] border border-[#141413]/15 text-xs sm:text-sm text-[#141413] placeholder-[#696969] focus:outline-none focus:border-[#bb302a] resize-none"
              />
            </div>

            {/* Submit Primary CTA (Touchscreen Ergonomic) */}
            <button
              onClick={handleSubmit}
              className="w-full min-h-[58px] sm:min-h-[62px] py-4 bg-[#141413] hover:bg-[#262627] active:bg-[#000000] text-[#F3F0EE] font-bold rounded-[22px] shadow-sm flex items-center justify-center gap-2.5 text-sm sm:text-base lg:text-lg transition-all active:scale-[0.98] touch-manipulation select-none"
            >
              <ThumbsUp className="w-5 h-5 text-[#F79E1B]" />
              <span>GỬI ĐÁNH GIÁ Ý KIẾN</span>
            </button>
          </div>
        )}
      </main>

      {/* Footer Disclaimer */}
      <footer className="relative z-10 max-w-4xl mx-auto w-full text-center text-xs text-[#696969] flex items-center justify-center gap-1.5 font-medium flex-shrink-0">
        <ShieldCheck className="w-3.5 h-3.5 text-[#bb302a]" />
        <span>Khảo sát độc lập phục vụ đánh giá chỉ số cải cách hành chính (PAR INDEX)</span>
      </footer>

      {/* VietQR Dynamic Payment Modal (Stadium 40px) */}
      {showQrPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141413]/60 backdrop-blur-md">
          <div className="relative w-full max-w-sm bg-[#FCFBFA] text-[#141413] rounded-[40px] p-7 shadow-2xl border border-[#141413]/10">
            <button
              onClick={() => setShowQrPaymentModal(false)}
              className="absolute top-5 right-5 p-2 text-[#696969] hover:text-[#141413] rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-4">
              <div className="w-14 h-14 bg-[#bb302a]/10 text-[#bb302a] rounded-full flex items-center justify-center mx-auto mb-2">
                <QrCode className="w-7 h-7" />
              </div>
              <span className="eyebrow-label text-[#bb302a] block mb-1">
                • CỔNG THANH TOÁN QUỐC GIA
              </span>
              <h3 className="font-medium text-base text-[#141413]">Thanh toán Lệ phí Hành chính</h3>
              <p className="text-xs text-[#696969]">Quét mã VietQR bằng ứng dụng Ngân hàng</p>
            </div>

            {/* Simulated VietQR Card */}
            <div className="p-4 bg-white rounded-[24px] border border-[#141413]/10 text-center mb-4 shadow-sm">
              <div className="w-48 h-48 bg-[#F3F0EE] mx-auto p-3 rounded-[20px] border border-[#141413]/10 flex items-center justify-center">
                <QrCode className="w-40 h-40 text-[#141413]" />
              </div>
              <div className="mt-3 text-xs">
                <div className="text-[#696969]">Số tiền lệ phí:</div>
                <div className="text-2xl font-medium text-[#141413] font-mono mt-0.5">30.000 VNĐ</div>
                <div className="text-[11px] text-[#696969] mt-1">
                  Nội dung: <strong>QMS {activeTicket?.ticketNumber || 'A-101'}</strong>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setShowQrPaymentModal(false);
                alert('Mô phỏng thanh toán VietQR thành công!');
              }}
              className="w-full py-3.5 bg-[#141413] hover:bg-[#262627] text-[#F3F0EE] text-xs font-medium rounded-[20px] shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4 text-[#F79E1B]" />
              <span>Xác nhận đã thanh toán</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
