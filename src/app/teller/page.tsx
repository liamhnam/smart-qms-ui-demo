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
    <div className="min-h-screen bg-[#F3F0EE] text-[#141413] flex flex-col justify-between pt-14 sm:pt-16 pb-6 px-4 sm:px-8">
      {/* Top Workstation Header Bar (Stadium 40px / #FCFBFA) */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 px-8 bg-[#FCFBFA] rounded-[40px] border border-[#141413]/10 shadow-[0px_4px_24px_rgba(0,0,0,0.03)] mb-4">
        {/* Left: Counter Selection with dual mark */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#bb302a] text-white flex items-center justify-center font-bold text-sm shadow-sm">
            {activeCounter?.code || '01'}
          </div>
          <div>
            <span className="eyebrow-label text-[#bb302a] block">
              • BÀN ĐIỀU KHIỂN CÁN BỘ TIẾP NHẬN
            </span>
            <div className="relative">
              <select
                value={activeCounterId}
                onChange={(e) => setActiveCounterId(e.target.value)}
                className="bg-transparent text-[#141413] font-medium text-base sm:text-lg focus:outline-none cursor-pointer pr-6 appearance-none border-b border-dashed border-[#141413]/20 hover:border-[#bb302a]"
              >
                {counters.map((c) => (
                  <option key={c.id} value={c.id} className="bg-[#FCFBFA] text-[#141413]">
                    {c.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-[#696969] absolute right-0 top-1.5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Right: Assigned Staff & Shift Status */}
        <div className="flex items-center gap-4">
          {activeCounter?.assignedStaff && (
            <div className="flex items-center gap-3 bg-white py-1.5 px-4 rounded-full border border-[#141413]/10 shadow-sm">
              <img
                src={activeCounter.assignedStaff.avatarUrl}
                alt={activeCounter.assignedStaff.fullName}
                className="w-9 h-9 rounded-full object-cover border border-[#141413]/10"
              />
              <div className="text-left">
                <div className="text-xs font-medium text-[#141413]">{activeCounter.assignedStaff.fullName}</div>
                <div className="text-[10px] text-[#696969] flex items-center gap-1.5 font-medium">
                  <span>{activeCounter.assignedStaff.employeeCode}</span>
                  <span>•</span>
                  <span className="text-[#9A3A0A] font-bold">★ {activeCounter.assignedStaff.ratingAverage}</span>
                </div>
              </div>
            </div>
          )}

          {/* Shift State Toggle (Pill shape) */}
          <div className="flex items-center gap-1 bg-[#F3F0EE] p-1 rounded-full border border-[#141413]/10 text-xs font-medium">
            <button
              onClick={() => setShiftStatus('ACTIVE')}
              className={`px-3 py-1.5 rounded-full transition-all ${
                shiftStatus === 'ACTIVE'
                  ? 'bg-[#141413] text-[#F3F0EE] shadow-sm'
                  : 'text-[#696969] hover:text-[#141413]'
              }`}
            >
              Đang làm việc
            </button>
            <button
              onClick={() => setShiftStatus('BREAK')}
              className={`px-3 py-1.5 rounded-full transition-all ${
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
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1">
        {/* Left Column (7 cols): Active Serving Card & Action Pills */}
        <section className="lg:col-span-7 flex flex-col justify-between gap-4">
          <div className="bg-[#FCFBFA] rounded-[40px] border border-[#141413]/10 p-7 shadow-[0px_4px_24px_rgba(0,0,0,0.03)] flex-1 flex flex-col justify-between">
            {/* Top Serving Status */}
            <div className="flex items-center justify-between pb-4 border-b border-[#141413]/10">
              <span className="eyebrow-label text-[#bb302a] flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#bb302a] animate-ping" />
                • CÔNG DÂN ĐANG PHỤC VỤ TẠI QUẦY
              </span>

              {servingTicket && (
                <div className="flex items-center gap-1.5 px-3.5 py-1 bg-white border border-[#141413]/10 rounded-full text-xs font-mono font-medium text-[#141413] shadow-sm">
                  <Timer className="w-3.5 h-3.5 text-[#bb302a] animate-spin" />
                  <span>Thời lượng phục vụ: {formatTimer(servingSeconds)}</span>
                </div>
              )}
            </div>

            {/* Middle: Big Serving Number & Citizen Details */}
            <div className="py-6 text-center">
              {servingTicket ? (
                <div>
                  <span className="text-xs font-medium text-[#696969] uppercase tracking-wider block mb-1">
                    {servingTicket.categoryName}
                  </span>
                  <div className="text-7xl sm:text-8xl font-medium font-mono text-[#141413] tracking-tight">
                    {servingTicket.ticketNumber}
                  </div>

                  <div className="mt-5 p-5 bg-[#F3F0EE] rounded-[24px] border border-[#141413]/10 max-w-md mx-auto text-left grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[#696969] block text-[11px]">Họ tên công dân:</span>
                      <strong className="text-[#141413] text-sm block truncate font-medium">{servingTicket.citizen.name}</strong>
                    </div>
                    <div>
                      <span className="text-[#696969] block text-[11px]">Số định danh (CCCD):</span>
                      <span className="text-[#141413] font-mono text-sm block">
                        {servingTicket.citizen.citizenId || '---'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#696969] block text-[11px]">Giờ lấy số:</span>
                      <span className="text-[#555555]">
                        {new Date(servingTicket.issuedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#696969] block text-[11px]">Phân loại:</span>
                      <span className={servingTicket.citizen.isPriority ? 'text-[#bb302a] font-bold' : 'text-[#555555]'}>
                        {servingTicket.citizen.isPriority ? '★ Khách ưu tiên' : 'Tiêu chuẩn'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-[#696969]">
                  <div className="w-20 h-20 rounded-full bg-[#F3F0EE] flex items-center justify-center mb-3">
                    <User className="w-10 h-10 text-[#696969]/50" />
                  </div>
                  <h3 className="text-lg font-medium text-[#141413]">Quầy đang sẵn sàng</h3>
                  <p className="text-xs text-[#696969] mt-1">
                    Bấm &quot;GỌI TIẾP THEO&quot; để mời công dân kế tiếp vào phục vụ
                  </p>
                </div>
              )}
            </div>

            {/* Tactical Control Action Buttons (Mastercard 20px radius pills) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-[#141413]/10">
              {/* Call Next Button (Administrative Red #bb302a pill) */}
              <button
                onClick={handleCallNext}
                className="py-3.5 px-4 bg-[#bb302a] hover:bg-[#a62a25] text-white font-medium rounded-[20px] shadow-sm flex items-center justify-center gap-2 transition-all transform active:scale-98 text-xs sm:text-sm"
              >
                <PhoneCall className="w-4 h-4" />
                <span>GỌI TIẾP THEO</span>
              </button>

              {/* Recall Button (Ink Black #141413 pill) */}
              <button
                disabled={!servingTicket}
                onClick={handleRecall}
                className="py-3.5 px-4 bg-[#141413] hover:bg-[#262627] disabled:opacity-40 text-[#F3F0EE] font-medium rounded-[20px] shadow-sm flex items-center justify-center gap-2 transition-all transform active:scale-98 text-xs sm:text-sm"
              >
                <RotateCcw className="w-4 h-4 text-[#F79E1B]" />
                <span>GỌI LẠI</span>
              </button>

              {/* Complete & Rating Trigger Button (White outlined pill) */}
              <button
                disabled={!servingTicket}
                onClick={handleComplete}
                className="py-3.5 px-4 bg-white border-[1.5px] border-[#141413] hover:bg-[#F3F0EE] disabled:opacity-40 text-[#141413] font-medium rounded-[20px] shadow-sm flex items-center justify-center gap-2 transition-all transform active:scale-98 text-xs sm:text-sm"
              >
                <CheckCircle2 className="w-4 h-4 text-[#bb302a]" />
                <span>HOÀN THÀNH</span>
              </button>

              {/* Skip Button */}
              <button
                disabled={!servingTicket}
                onClick={handleSkip}
                className="py-3 px-4 bg-white border border-[#141413]/15 hover:bg-[#F3F0EE] disabled:opacity-40 text-[#555555] font-medium rounded-[20px] flex items-center justify-center gap-2 transition-all text-xs"
              >
                <SkipForward className="w-4 h-4 text-[#CF4500]" />
                <span>Bỏ qua / Vắng</span>
              </button>

              {/* Transfer Counter Button */}
              <button
                disabled={!servingTicket}
                onClick={() => setShowTransferModal(true)}
                className="py-3 px-4 bg-white border border-[#141413]/15 hover:bg-[#F3F0EE] disabled:opacity-40 text-[#555555] font-medium rounded-[20px] flex items-center justify-center gap-2 transition-all text-xs"
              >
                <ArrowRightLeft className="w-4 h-4 text-[#141413]" />
                <span>Chuyển quầy</span>
              </button>

              {/* Issue Direct Ticket Button */}
              <button
                onClick={handleDirectTicket}
                className="py-3 px-4 bg-white border border-[#141413]/15 hover:bg-[#F3F0EE] text-[#555555] font-medium rounded-[20px] flex items-center justify-center gap-2 transition-all text-xs"
              >
                <PlusCircle className="w-4 h-4 text-[#bb302a]" />
                <span>Cấp vé tại quầy</span>
              </button>
            </div>
          </div>
        </section>

        {/* Right Column (5 cols): Queue Management Tabs & Stats */}
        <section className="lg:col-span-5 flex flex-col justify-between gap-4">
          {/* Workstation Shift Stats (20px radius cards) */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 bg-[#FCFBFA] rounded-[24px] border border-[#141413]/10 text-center shadow-[0px_4px_24px_rgba(0,0,0,0.02)]">
              <span className="text-[10px] text-[#696969] uppercase font-bold block">Đã phục vụ</span>
              <strong className="text-xl font-medium text-[#141413] font-mono">
                {activeCounter?.todayServedCount || 0}
              </strong>
            </div>
            <div className="p-3.5 bg-[#FCFBFA] rounded-[24px] border border-[#141413]/10 text-center shadow-[0px_4px_24px_rgba(0,0,0,0.02)]">
              <span className="text-[10px] text-[#696969] uppercase font-bold block">TG trung bình</span>
              <strong className="text-xl font-medium text-[#bb302a] font-mono">
                {activeCounter?.avgServeMinutes || 8.5}p
              </strong>
            </div>
            <div className="p-3.5 bg-[#FCFBFA] rounded-[24px] border border-[#141413]/10 text-center shadow-[0px_4px_24px_rgba(0,0,0,0.02)]">
              <span className="text-[10px] text-[#696969] uppercase font-bold block">Đang đợi</span>
              <strong className="text-xl font-medium text-[#141413] font-mono">
                {waitingTickets.length}
              </strong>
            </div>
          </div>

          {/* Queue Tabbed Table (Stadium 40px / #FCFBFA) */}
          <div className="bg-[#FCFBFA] rounded-[40px] border border-[#141413]/10 p-6 shadow-[0px_4px_24px_rgba(0,0,0,0.03)] flex-1 flex flex-col overflow-hidden">
            {/* Tab Header (Pill switchers) */}
            <div className="flex items-center gap-1.5 border-b border-[#141413]/10 pb-3 mb-3 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setActiveTab('waiting')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeTab === 'waiting'
                    ? 'bg-[#141413] text-[#F3F0EE] shadow-sm'
                    : 'text-[#696969] hover:text-[#141413]'
                }`}
              >
                Đang chờ ({waitingTickets.length})
              </button>
              <button
                onClick={() => setActiveTab('skipped')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeTab === 'skipped'
                    ? 'bg-[#141413] text-[#F3F0EE] shadow-sm'
                    : 'text-[#696969] hover:text-[#141413]'
                }`}
              >
                Đã bỏ qua ({skippedTickets.length})
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeTab === 'history'
                    ? 'bg-[#141413] text-[#F3F0EE] shadow-sm'
                    : 'text-[#696969] hover:text-[#141413]'
                }`}
              >
                Lịch sử ca ({completedTodayTickets.length})
              </button>
            </div>

            {/* Tab Content List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[350px] scrollbar-thin">
              {activeTab === 'waiting' && (
                waitingTickets.length > 0 ? (
                  waitingTickets.map((ticket, idx) => (
                    <div
                      key={ticket.id}
                      className="p-3.5 bg-[#F3F0EE] hover:bg-white rounded-[20px] border border-[#141413]/5 flex items-center justify-between transition-colors shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-medium text-[#696969] w-5">#{idx + 1}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-medium text-base text-[#141413]">
                              {ticket.ticketNumber}
                            </span>
                            {ticket.citizen.isPriority && (
                              <span className="px-2 py-0.2 bg-[#bb302a]/10 text-[#bb302a] text-[10px] font-bold rounded-full">
                                Ưu tiên
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-[#696969]">{ticket.citizen.name}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[11px] text-[#696969] block">
                          Chờ ~{ticket.estimatedWaitMinutes}p
                        </span>
                        <span className="text-[10px] text-[#696969]">
                          {new Date(ticket.issuedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-[#696969] text-xs italic">
                    Không có vé nào đang chờ trong hàng
                  </div>
                )
              )}

              {activeTab === 'skipped' && (
                skippedTickets.length > 0 ? (
                  skippedTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="p-3.5 bg-[#F3F0EE] rounded-[20px] border border-[#141413]/5 flex items-center justify-between"
                    >
                      <div>
                        <span className="font-mono font-medium text-base text-[#CF4500]">
                          {ticket.ticketNumber}
                        </span>
                        <div className="text-xs text-[#696969]">{ticket.citizen.name}</div>
                      </div>
                      <span className="text-xs text-[#CF4500] font-medium">Vắng mặt</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-[#696969] text-xs italic">
                    Không có vé nào bị bỏ qua
                  </div>
                )
              )}

              {activeTab === 'history' && (
                completedTodayTickets.length > 0 ? (
                  completedTodayTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="p-3.5 bg-[#F3F0EE] rounded-[20px] border border-[#141413]/5 flex items-center justify-between"
                    >
                      <div>
                        <span className="font-mono font-medium text-sm text-[#141413]">
                          {ticket.ticketNumber}
                        </span>
                        <div className="text-xs text-[#696969]">{ticket.citizen.name}</div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-[#141413] font-medium block">✓ Hoàn tất</span>
                        {ticket.rating && (
                          <span className="text-[10px] text-[#F79E1B] font-bold">
                            ★ {ticket.rating.score}/5 sao
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-[#696969] text-xs italic">
                    Chưa có lượt phục vụ nào hoàn tất
                  </div>
                )
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Transfer Counter Modal (Stadium 40px) */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141413]/60 backdrop-blur-md">
          <div className="w-full max-w-sm bg-[#FCFBFA] rounded-[40px] border border-[#141413]/10 p-7 shadow-2xl">
            <span className="eyebrow-label text-[#bb302a] block mb-1">
              • CHUYỂN TIẾP NGHIỆP VỤ
            </span>
            <h3 className="text-lg font-medium text-[#141413] mb-1">Chuyển tiếp công dân</h3>
            <p className="text-xs text-[#696969] mb-4">
              Chuyển vé <strong>{servingTicket?.ticketNumber}</strong> sang quầy nghiệp vụ khác
            </p>

            <div className="space-y-2 mb-6">
              {counters
                .filter((c) => c.id !== activeCounterId)
                .map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setTargetCounterId(c.id)}
                    className={`w-full p-3.5 rounded-[20px] border text-left text-xs transition-all ${
                      targetCounterId === c.id
                        ? 'bg-[#141413] text-[#F3F0EE] border-[#141413]'
                        : 'bg-white text-[#141413] border-[#141413]/10 hover:bg-[#F3F0EE]'
                    }`}
                  >
                    <div className="font-medium text-sm">{c.title}</div>
                    <div className="text-[11px] opacity-80">Cán bộ: {c.assignedStaff.fullName}</div>
                  </button>
                ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowTransferModal(false)}
                className="flex-1 py-3 bg-white border border-[#141413]/15 text-[#141413] rounded-[20px] text-xs font-medium"
              >
                Hủy bỏ
              </button>
              <button
                disabled={!targetCounterId}
                onClick={handleTransfer}
                className="flex-1 py-3 bg-[#bb302a] disabled:opacity-40 text-white rounded-[20px] text-xs font-medium shadow-sm"
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
