'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect } from 'react';
import { useQms } from '@/context/QmsContext';
import {
  PhoneCall,
  RotateCcw,
  CheckCircle2,
  SkipForward,
  ArrowRightLeft,
  PlusCircle,
  User,
  Timer,
  ChevronDown,
} from 'lucide-react';

export default function TellerPage() {
  const {
    counters,
    tickets,
    activeCounterId,
    setActiveCounterId,
    activeCounter,
    callNextTicket,
    recallTicket,
    completeServingTicket,
    skipServingTicket,
    transferServingTicket,
    issueTicket,
  } = useQms();

  const [activeTab, setActiveTab] = useState<'waiting' | 'skipped' | 'history'>('waiting');
  const [servingSeconds, setServingSeconds] = useState(0);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [targetCounterId, setTargetCounterId] = useState('');
  const [shiftStatus, setShiftStatus] = useState<'ACTIVE' | 'BREAK' | 'CLOSED'>('ACTIVE');

  // Currently serving ticket at the active counter
  const servingTicket = tickets.find(
    (t) => t.id === activeCounter?.currentTicketId && t.status === 'SERVING'
  );

  // Timer for active service
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (servingTicket) {
      setServingSeconds(servingTicket.serviceDurationSeconds || 0);
      interval = setInterval(() => {
        setServingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setServingSeconds(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [servingTicket]);

  // Queue lists for this counter
  const waitingTickets = tickets.filter(
    (t) => t.status === 'WAITING' && activeCounter?.categoryIds.includes(t.categoryId)
  );

  const skippedTickets = tickets.filter(
    (t) => t.status === 'SKIPPED' && activeCounter?.categoryIds.includes(t.categoryId)
  );

  const completedTodayTickets = tickets.filter(
    (t) => t.status === 'COMPLETED' && t.counterId === activeCounterId
  );

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleCallNext = () => {
    if (!activeCounter) return;
    callNextTicket(activeCounter.id);
  };

  const handleRecall = () => {
    if (!activeCounter) return;
    recallTicket(activeCounter.id);
  };

  const handleComplete = () => {
    if (!activeCounter) return;
    completeServingTicket(activeCounter.id);
  };

  const handleSkip = () => {
    if (!activeCounter) return;
    skipServingTicket(activeCounter.id);
  };

  const handleTransfer = () => {
    if (!activeCounter || !targetCounterId) return;
    transferServingTicket(activeCounter.id, targetCounterId);
    setShowTransferModal(false);
  };

  const handleDirectTicket = () => {
    if (!activeCounter) return;
    const catId = activeCounter.categoryIds[0];
    issueTicket(catId, {
      name: 'Khách nhận số tại Quầy',
      isPriority: true,
    });
  };

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-[#F3F0EE] text-[#141413] flex flex-col justify-between pt-16 sm:pt-18 pb-3 px-4 sm:px-6 select-none relative">
      {/* Top Workstation Header Bar (Stadium 28px / #FCFBFA) */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-2.5 px-6 sm:px-8 bg-[#FCFBFA] rounded-[28px] border border-[#141413]/10 shadow-[0px_4px_24px_rgba(0,0,0,0.03)] mb-2.5 flex-shrink-0">
        {/* Left: Counter Selection */}
        <div className="flex items-center gap-3.5">
          <img
            src="/logo.png"
            alt="Logo Một Cửa"
            className="w-10 h-10 object-contain flex-shrink-0 drop-shadow-sm"
          />
          <div className="w-10 h-10 rounded-full bg-[#bb302a] text-white flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0">
            {activeCounter?.code || '01'}
          </div>
          <div>
            <span className="text-xs font-bold text-[#bb302a] tracking-wider uppercase block">
              • BÀN ĐIỀU KHIỂN CÁN BỘ TIẾP NHẬN
            </span>
            <div className="relative">
              <select
                value={activeCounterId}
                onChange={(e) => setActiveCounterId(e.target.value)}
                className="bg-transparent text-[#141413] font-bold text-base sm:text-lg focus:outline-none cursor-pointer pr-6 appearance-none border-b border-dashed border-[#141413]/25 hover:border-[#bb302a]"
              >
                {counters.map((c) => (
                  <option key={c.id} value={c.id} className="bg-[#FCFBFA] text-[#141413]">
                    {c.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#696969] absolute right-0 top-1.5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Right: Assigned Staff & Shift Status */}
        <div className="flex items-center gap-3">
          {activeCounter?.assignedStaff && (
            <div className="flex items-center gap-2.5 bg-white py-1.5 px-3.5 rounded-full border border-[#141413]/10 shadow-sm">
              <img
                src={activeCounter.assignedStaff.avatarUrl}
                alt={activeCounter.assignedStaff.fullName}
                className="w-8 h-8 rounded-full object-cover border border-[#141413]/10"
              />
              <div className="text-left">
                <div className="text-xs font-bold text-[#141413]">{activeCounter.assignedStaff.fullName}</div>
                <div className="text-[10px] text-[#696969] flex items-center gap-1.5 font-medium">
                  <span>{activeCounter.assignedStaff.employeeCode}</span>
                  <span>•</span>
                  <span className="text-[#9A3A0A] font-bold">★ {activeCounter.assignedStaff.ratingAverage}</span>
                </div>
              </div>
            </div>
          )}

          {/* Shift State Toggle */}
          <div className="flex items-center gap-1 bg-[#F3F0EE] p-1 rounded-full border border-[#141413]/10 text-xs font-semibold">
            <button
              onClick={() => setShiftStatus('ACTIVE')}
              className={`px-3 py-1 rounded-full transition-all ${
                shiftStatus === 'ACTIVE'
                  ? 'bg-[#141413] text-[#F3F0EE] shadow-sm'
                  : 'text-[#696969] hover:text-[#141413]'
              }`}
            >
              Đang làm việc
            </button>
            <button
              onClick={() => setShiftStatus('BREAK')}
              className={`px-3 py-1 rounded-full transition-all ${
                shiftStatus === 'BREAK'
                  ? 'bg-[#bb302a] text-white shadow-sm'
                  : 'text-[#696969] hover:text-[#141413]'
              }`}
            >
              Tạm nghỉ
            </button>
          </div>
        </div>
      </header>

      {/* Main 2-Column Workspace Grid */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0 overflow-hidden">
        {/* Left Column (7 cols): Active Serving Card & Action Pills */}
        <section className="lg:col-span-7 flex flex-col justify-between min-h-0">
          <div className="bg-[#FCFBFA] rounded-[32px] border border-[#141413]/10 p-5 sm:p-6 shadow-[0px_4px_24px_rgba(0,0,0,0.03)] flex-1 flex flex-col justify-between min-h-0">
            {/* Top Serving Status */}
            <div className="flex items-center justify-between pb-3 border-b border-[#141413]/10 flex-shrink-0">
              <span className="text-xs font-bold text-[#bb302a] tracking-wider uppercase flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#bb302a] animate-ping" />
                • CÔNG DÂN ĐANG PHỤC VỤ TẠI QUẦY
              </span>

              {servingTicket && (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-[#141413]/10 rounded-full text-xs font-mono font-bold text-[#141413] shadow-sm">
                  <Timer className="w-3.5 h-3.5 text-[#bb302a] animate-spin" />
                  <span>Thời lượng: {formatTimer(servingSeconds)}</span>
                </div>
              )}
            </div>

            {/* Middle: Big Serving Number & Citizen Details */}
            <div className="py-2 text-center my-auto flex-1 flex flex-col justify-center min-h-0">
              {servingTicket ? (
                <div>
                  <span className="text-xs font-bold text-[#696969] uppercase tracking-wider block mb-0.5">
                    {servingTicket.categoryName}
                  </span>
                  <div className="text-7xl sm:text-8xl font-bold font-mono text-[#bb302a] tracking-tight leading-none">
                    {servingTicket.ticketNumber}
                  </div>

                  <div className="mt-3 p-3.5 sm:p-4 bg-[#F3F0EE] rounded-[20px] border border-[#141413]/10 max-w-md mx-auto text-left grid grid-cols-2 gap-2 text-xs sm:text-sm">
                    <div>
                      <span className="text-[#696969] block text-[11px] font-semibold">Họ tên công dân:</span>
                      <strong className="text-[#141413] text-sm sm:text-base block truncate font-bold">{servingTicket.citizen.name}</strong>
                    </div>
                    <div>
                      <span className="text-[#696969] block text-[11px] font-semibold">Số CCCD:</span>
                      <span className="text-[#141413] font-mono text-xs sm:text-sm block font-bold">
                        {servingTicket.citizen.citizenId || '---'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#696969] block text-[11px] font-semibold">Giờ lấy số:</span>
                      <span className="text-[#444444] font-medium">
                        {new Date(servingTicket.issuedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#696969] block text-[11px] font-semibold">Phân loại:</span>
                      <span className={servingTicket.citizen.isPriority ? 'text-[#bb302a] font-bold' : 'text-[#444444] font-medium'}>
                        {servingTicket.citizen.isPriority ? '★ Khách ưu tiên' : 'Tiêu chuẩn'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-8 flex flex-col items-center justify-center text-[#696969]">
                  <div className="w-16 h-16 rounded-full bg-[#F3F0EE] flex items-center justify-center mb-2">
                    <User className="w-8 h-8 text-[#696969]/50" />
                  </div>
                  <h3 className="text-lg font-bold text-[#141413]">Quầy đang sẵn sàng</h3>
                  <p className="text-xs text-[#696969] mt-1">
                    Bấm &quot;GỌI TIẾP THEO&quot; để mời công dân kế tiếp vào phục vụ
                  </p>
                </div>
              )}
            </div>

            {/* Tactical Control Action Buttons (Touchscreen Optimized for 22/24 inch) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-3 border-t border-[#141413]/10 flex-shrink-0">
              {/* Call Next Button (Administrative Red #bb302a) */}
              <button
                onClick={handleCallNext}
                className="min-h-[58px] sm:min-h-[62px] py-3 px-4 bg-[#bb302a] hover:bg-[#a62a25] active:bg-[#93231e] text-white font-bold rounded-[22px] shadow-sm flex items-center justify-center gap-2.5 transition-all active:scale-95 text-xs sm:text-sm lg:text-base tracking-wide touch-manipulation select-none"
              >
                <PhoneCall className="w-5 h-5" />
                <span>GỌI TIẾP THEO</span>
              </button>

              {/* Recall Button (Ink Black #141413) */}
              <button
                disabled={!servingTicket}
                onClick={handleRecall}
                className="min-h-[58px] sm:min-h-[62px] py-3 px-4 bg-[#141413] hover:bg-[#262627] active:bg-[#0a0a09] disabled:opacity-40 text-[#F3F0EE] font-bold rounded-[22px] shadow-sm flex items-center justify-center gap-2.5 transition-all active:scale-95 text-xs sm:text-sm lg:text-base tracking-wide touch-manipulation select-none"
              >
                <RotateCcw className="w-5 h-5 text-[#F79E1B]" />
                <span>GỌI LẠI</span>
              </button>

              {/* Complete & Rating Trigger Button */}
              <button
                disabled={!servingTicket}
                onClick={handleComplete}
                className="min-h-[58px] sm:min-h-[62px] py-3 px-4 bg-white border-[2px] border-[#141413] hover:bg-[#F3F0EE] active:bg-[#EAE5E2] disabled:opacity-40 text-[#141413] font-bold rounded-[22px] shadow-sm flex items-center justify-center gap-2.5 transition-all active:scale-95 text-xs sm:text-sm lg:text-base tracking-wide touch-manipulation select-none"
              >
                <CheckCircle2 className="w-5 h-5 text-[#bb302a]" />
                <span>HOÀN THÀNH</span>
              </button>

              {/* Skip Button */}
              <button
                disabled={!servingTicket}
                onClick={handleSkip}
                className="min-h-[46px] py-2.5 px-3 bg-white border border-[#141413]/15 hover:bg-[#F3F0EE] active:bg-[#EAE5E2] disabled:opacity-40 text-[#444444] font-bold rounded-[18px] flex items-center justify-center gap-2 transition-all active:scale-95 text-xs sm:text-sm touch-manipulation select-none"
              >
                <SkipForward className="w-4 h-4 text-[#CF4500]" />
                <span>Bỏ qua / Vắng</span>
              </button>

              {/* Transfer Counter Button */}
              <button
                disabled={!servingTicket}
                onClick={() => setShowTransferModal(true)}
                className="min-h-[46px] py-2.5 px-3 bg-white border border-[#141413]/15 hover:bg-[#F3F0EE] active:bg-[#EAE5E2] disabled:opacity-40 text-[#444444] font-bold rounded-[18px] flex items-center justify-center gap-2 transition-all active:scale-95 text-xs sm:text-sm touch-manipulation select-none"
              >
                <ArrowRightLeft className="w-4 h-4 text-[#141413]" />
                <span>Chuyển quầy</span>
              </button>

              {/* Issue Direct Ticket Button */}
              <button
                onClick={handleDirectTicket}
                className="min-h-[46px] py-2.5 px-3 bg-white border border-[#141413]/15 hover:bg-[#F3F0EE] active:bg-[#EAE5E2] text-[#444444] font-bold rounded-[18px] flex items-center justify-center gap-2 transition-all active:scale-95 text-xs sm:text-sm touch-manipulation select-none"
              >
                <PlusCircle className="w-4 h-4 text-[#bb302a]" />
                <span>Cấp vé tại quầy</span>
              </button>
            </div>
          </div>
        </section>

        {/* Right Column (5 cols): Queue Management Tabs & Stats */}
        <section className="lg:col-span-5 flex flex-col justify-between gap-2.5 min-h-0 overflow-hidden">
          {/* Workstation Shift Stats */}
          <div className="grid grid-cols-3 gap-2.5 flex-shrink-0">
            <div className="p-2.5 sm:p-3 bg-[#FCFBFA] rounded-[20px] border border-[#141413]/10 text-center shadow-sm">
              <span className="text-[11px] text-[#696969] uppercase font-bold block">Đã phục vụ</span>
              <strong className="text-xl sm:text-2xl font-bold text-[#141413] font-mono">
                {activeCounter?.todayServedCount || 0}
              </strong>
            </div>
            <div className="p-2.5 sm:p-3 bg-[#FCFBFA] rounded-[20px] border border-[#141413]/10 text-center shadow-sm">
              <span className="text-[11px] text-[#696969] uppercase font-bold block">TG trung bình</span>
              <strong className="text-xl sm:text-2xl font-bold text-[#bb302a] font-mono">
                {activeCounter?.avgServeMinutes || 8.5}p
              </strong>
            </div>
            <div className="p-2.5 sm:p-3 bg-[#FCFBFA] rounded-[20px] border border-[#141413]/10 text-center shadow-sm">
              <span className="text-[11px] text-[#696969] uppercase font-bold block">Đang đợi</span>
              <strong className="text-xl sm:text-2xl font-bold text-[#141413] font-mono">
                {waitingTickets.length}
              </strong>
            </div>
          </div>

          {/* Queue Tabbed Table */}
          <div className="bg-[#FCFBFA] rounded-[28px] border border-[#141413]/10 p-4 sm:p-5 shadow-sm flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Tab Header */}
            <div className="flex items-center gap-2 border-b border-[#141413]/10 pb-2.5 mb-2.5 overflow-x-auto scrollbar-none flex-shrink-0">
              <button
                onClick={() => setActiveTab('waiting')}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
                  activeTab === 'waiting'
                    ? 'bg-[#141413] text-[#F3F0EE] shadow-sm'
                    : 'text-[#696969] hover:text-[#141413]'
                }`}
              >
                Đang chờ ({waitingTickets.length})
              </button>
              <button
                onClick={() => setActiveTab('skipped')}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
                  activeTab === 'skipped'
                    ? 'bg-[#141413] text-[#F3F0EE] shadow-sm'
                    : 'text-[#696969] hover:text-[#141413]'
                }`}
              >
                Đã bỏ qua ({skippedTickets.length})
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
                  activeTab === 'history'
                    ? 'bg-[#141413] text-[#F3F0EE] shadow-sm'
                    : 'text-[#696969] hover:text-[#141413]'
                }`}
              >
                Lịch sử ca ({completedTodayTickets.length})
              </button>
            </div>

            {/* Tab Content List */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-[350px] scrollbar-thin">
              {activeTab === 'waiting' && (
                waitingTickets.length > 0 ? (
                  waitingTickets.map((ticket, idx) => (
                    <div
                      key={ticket.id}
                      className="p-4 bg-[#F3F0EE] hover:bg-white rounded-[24px] border border-[#141413]/5 flex items-center justify-between transition-colors shadow-sm"
                    >
                      <div className="flex items-center gap-3.5">
                        <span className="text-xs font-bold text-[#696969] w-6">#{idx + 1}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-lg text-[#141413]">
                              {ticket.ticketNumber}
                            </span>
                            {ticket.citizen.isPriority && (
                              <span className="px-2 py-0.5 bg-[#bb302a]/10 text-[#bb302a] text-[10px] font-bold rounded-full">
                                Ưu tiên
                              </span>
                            )}
                          </div>
                          <span className="text-xs sm:text-sm text-[#444444] font-medium">{ticket.citizen.name}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-[#696969] block font-medium">
                          Chờ ~{ticket.estimatedWaitMinutes}p
                        </span>
                        <span className="text-xs text-[#696969] font-mono">
                          {new Date(ticket.issuedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-[#696969] text-sm italic">
                    Không có vé nào đang chờ trong hàng
                  </div>
                )
              )}

              {activeTab === 'skipped' && (
                skippedTickets.length > 0 ? (
                  skippedTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="p-4 bg-[#F3F0EE] rounded-[24px] border border-[#141413]/5 flex items-center justify-between"
                    >
                      <div>
                        <span className="font-mono font-bold text-lg text-[#CF4500]">
                          {ticket.ticketNumber}
                        </span>
                        <div className="text-sm text-[#444444] font-medium">{ticket.citizen.name}</div>
                      </div>
                      <span className="text-xs font-bold text-[#CF4500]">Vắng mặt</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-[#696969] text-sm italic">
                    Không có vé nào bị bỏ qua
                  </div>
                )
              )}

              {activeTab === 'history' && (
                completedTodayTickets.length > 0 ? (
                  completedTodayTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="p-4 bg-[#F3F0EE] rounded-[24px] border border-[#141413]/5 flex items-center justify-between"
                    >
                      <div>
                        <span className="font-mono font-bold text-base text-[#141413]">
                          {ticket.ticketNumber}
                        </span>
                        <div className="text-sm text-[#444444] font-medium">{ticket.citizen.name}</div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-[#141413] block">✓ Hoàn tất</span>
                        {ticket.rating && (
                          <span className="text-xs text-[#F79E1B] font-bold">
                            ★ {ticket.rating.score}/5 sao
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-[#696969] text-sm italic">
                    Chưa có lượt phục vụ nào hoàn tất trong ca
                  </div>
                )
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Transfer Counter Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141413]/60 backdrop-blur-md">
          <div className="w-full max-w-sm bg-[#FCFBFA] rounded-[40px] border border-[#141413]/10 p-8 shadow-2xl">
            <span className="text-xs font-bold text-[#bb302a] tracking-wider uppercase block mb-1">
              • CHUYỂN TIẾP NGHIỆP VỤ
            </span>
            <h3 className="text-xl font-bold text-[#141413] mb-1">Chuyển tiếp công dân</h3>
            <p className="text-sm text-[#555555] mb-5">
              Chuyển vé <strong>{servingTicket?.ticketNumber}</strong> sang quầy nghiệp vụ khác
            </p>

            <div className="space-y-2.5 mb-6">
              {counters
                .filter((c) => c.id !== activeCounterId)
                .map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setTargetCounterId(c.id)}
                    className={`w-full p-4 rounded-[20px] border text-left transition-all ${
                      targetCounterId === c.id
                        ? 'bg-[#141413] text-[#F3F0EE] border-[#141413]'
                        : 'bg-white text-[#141413] border-[#141413]/10 hover:bg-[#F3F0EE]'
                    }`}
                  >
                    <div className="font-bold text-sm sm:text-base">{c.title}</div>
                    <div className="text-xs opacity-80 mt-0.5">Cán bộ: {c.assignedStaff.fullName}</div>
                  </button>
                ))}
            </div>

            <div className="flex gap-2.5">
              <button
                onClick={() => setShowTransferModal(false)}
                className="flex-1 py-3 bg-white border border-[#141413]/15 text-[#141413] rounded-[20px] text-sm font-bold"
              >
                Hủy bỏ
              </button>
              <button
                disabled={!targetCounterId}
                onClick={handleTransfer}
                className="flex-1 py-3 bg-[#bb302a] disabled:opacity-40 text-white rounded-[20px] text-sm font-bold shadow-sm"
              >
                Xác nhận chuyển
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
