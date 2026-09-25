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
    color: 'from-emerald-500 to-teal-600',
    tags: ['Thái độ niềm nở', 'Nghiệp vụ thành thạo', 'Hướng dẫn tận tình', 'Thủ tục nhanh gọn'],
  },
  {
    score: 4,
    label: 'Hài lòng',
    emoji: '😊',
    color: 'from-blue-500 to-indigo-600',
    tags: ['Đúng giờ hẹn', 'Giải thích dễ hiểu', 'Thời gian chờ hợp lý'],
  },
  {
    score: 3,
    label: 'Bình thường',
    emoji: '😐',
    color: 'from-amber-500 to-yellow-600',
    tags: ['Thời gian chờ hơi lâu', 'Cần hướng dẫn thêm'],
  },
  {
    score: 2,
    label: 'Chưa hài lòng',
    emoji: '🙁',
    color: 'from-orange-500 to-red-500',
    tags: ['Thủ tục rườm rà', 'Cán bộ chưa nhiệt tình', 'Hệ thống chậm'],
  },
  {
    score: 1,
    label: 'Rất không hài lòng',
    emoji: '😡',
    color: 'from-red-600 to-rose-700',
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

  // If activeEvaluationTicket is present or manually testing
  const activeTicket = activeEvaluationTicket;

  const currentOption = RATING_OPTIONS.find((o) => o.score === selectedScore) || RATING_OPTIONS[0];

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    if (!selectedScore) return;

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between pt-16 sm:pt-20 pb-8 px-4 sm:px-8 select-none">
      {/* Top Tablet Header */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between py-3 px-6 bg-slate-900/80 rounded-3xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-md">
            ★
          </div>
          <div>
            <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider block">
              MÁY TÍNH BẢNG KHẢO SÁT Ý KIẾN TẠI QUẦY
            </span>
            <h1 className="text-base sm:text-lg font-black text-white">
              {activeCounter?.title || 'Quầy phục vụ'}
            </h1>
          </div>
        </div>

        {/* Counter Switcher & VietQR Trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowQrPaymentModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold hover:bg-emerald-600/30 transition-all"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Thanh toán VietQR</span>
          </button>

          <div className="relative">
            <select
              value={activeCounterId}
              onChange={(e) => setActiveCounterId(e.target.value)}
              className="bg-slate-800 text-slate-200 font-bold text-xs px-3 py-1.5 rounded-xl border border-slate-700 cursor-pointer appearance-none pr-6 focus:outline-none"
            >
              {counters.map((c) => (
                <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                  Quầy {c.code}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2 pointer-events-none" />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto w-full my-6 flex-1 flex flex-col justify-center">
        {isSubmitted ? (
          /* Thank You Screen */
          <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-10 text-center shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/40">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
              XIN CHÂN THÀNH CẢM ƠN QUÝ KHÁCH!
            </h2>
            <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
              Ý kiến đánh giá quý báu của Quý khách sẽ giúp chúng tôi không ngừng nâng cao chất lượng phục vụ nhân dân ngày càng tốt hơn.
            </p>
            <div className="mt-6 inline-block px-4 py-1.5 bg-blue-500/10 text-blue-300 border border-blue-500/20 rounded-full text-xs font-semibold">
              Chúc Quý khách một ngày làm việc thuận lợi & may mắn!
            </div>
          </div>
        ) : (
          /* Rating Form */
          <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl">
            {/* Citizen Context Banner */}
            <div className="text-center mb-6 pb-4 border-b border-slate-800">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-xs text-slate-400">Đánh giá phiên phục vụ vé:</span>
                <span className="font-mono font-bold text-amber-400 text-base">
                  {activeTicket ? activeTicket.ticketNumber : 'A-101'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                QUÝ KHÁCH CẢM THẤY MỨC ĐỘ PHỤC VỤ HÔM NAY NHƯ THẾ NÀO?
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Cán bộ tiếp nhận: <strong className="text-slate-200">{activeCounter?.assignedStaff.fullName}</strong>
              </p>
            </div>

            {/* 5 Big Animated Emoji Buttons */}
            <div className="grid grid-cols-5 gap-2 sm:gap-4 mb-6">
              {RATING_OPTIONS.map((option) => {
                const isSelected = selectedScore === option.score;
                return (
                  <button
                    key={option.score}
                    onClick={() => {
                      setSelectedScore(option.score);
                      setSelectedTags([]);
                    }}
                    className={`py-4 sm:py-5 px-2 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center gap-2 transform active:scale-95 ${
                      isSelected
                        ? `bg-gradient-to-b ${option.color} text-white border-white/40 shadow-xl scale-105 ring-2 ring-white/30`
                        : 'bg-slate-800/80 text-slate-400 border-slate-700/80 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span className="text-3xl sm:text-4xl filter drop-shadow-md transition-transform hover:scale-110">
                      {option.emoji}
                    </span>
                    <span className="text-[11px] sm:text-xs font-bold text-center leading-tight">
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Dynamic Reason Tags */}
            <div className="mb-6 p-4 bg-slate-800/60 rounded-2xl border border-slate-700/60">
              <span className="text-xs text-slate-400 font-semibold block mb-2">
                Lý do Quý khách đánh giá mức này (chọn một hoặc nhiều tiêu chí):
              </span>
              <div className="flex flex-wrap gap-2">
                {currentOption.tags.map((tag) => {
                  const isChecked = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => handleTagToggle(tag)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                        isChecked
                          ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Optional Comment Input */}
            <div className="mb-6">
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Ý kiến đóng góp thêm của Quý khách (không bắt buộc)..."
                rows={2}
                className="w-full p-3 bg-slate-800/80 rounded-2xl border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="w-full py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-xl shadow-blue-600/25 flex items-center justify-center gap-2 text-sm sm:text-base transition-all transform active:scale-95"
            >
              <ThumbsUp className="w-5 h-5" />
              <span>GỬI ĐÁNH GIÁ NGAY</span>
            </button>
          </div>
        )}
      </main>

      {/* Footer Disclaimer */}
      <footer className="max-w-4xl mx-auto w-full text-center text-[11px] text-slate-500 flex items-center justify-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
        <span>Khảo sát độc lập phục vụ đánh giá chỉ số cải cách hành chính (PAR INDEX)</span>
      </footer>

      {/* VietQR Dynamic Payment Modal */}
      {showQrPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="relative w-full max-w-sm bg-white text-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200">
            <button
              onClick={() => setShowQrPaymentModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Thanh toán Lệ phí Hành chính</h3>
              <p className="text-xs text-slate-500">Quét mã VietQR bằng ứng dụng Ngân hàng</p>
            </div>

            {/* Simulated VietQR Card */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center mb-4">
              <div className="w-48 h-48 bg-white mx-auto p-3 rounded-2xl border border-slate-200 shadow-inner flex items-center justify-center">
                <QrCode className="w-40 h-40 text-slate-900" />
              </div>
              <div className="mt-3 text-xs">
                <div className="text-slate-500">Số tiền lệ phí:</div>
                <div className="text-xl font-black text-blue-600 font-mono">30.000 VNĐ</div>
                <div className="text-[11px] text-slate-600 mt-1">
                  Nội dung: <strong>QMS {activeTicket?.ticketNumber || 'A-101'}</strong>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setShowQrPaymentModal(false);
                alert('Mô phỏng thanh toán VietQR thành công!');
              }}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Xác nhận đã thanh toán</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
