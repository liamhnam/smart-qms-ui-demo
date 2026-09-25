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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between pt-14 sm:pt-16 pb-6 px-3 sm:px-6">
      {/* Top Workstation Header Bar */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-3 px-5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl mb-4">
        {/* Left: Counter Selection */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-md">
            {activeCounter?.code || '01'}
          </div>
          <div>
            <div className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">
              BÀN ĐIỀU KHIỂN CÁN BỘ
            </div>
            <div className="relative">
              <select
                value={activeCounterId}
                onChange={(e) => setActiveCounterId(e.target.value)}
                className="bg-transparent text-white font-bold text-base sm:text-lg focus:outline-none cursor-pointer pr-6 appearance-none border-b border-dashed border-slate-700 hover:border-blue-400"
              >
                {counters.map((c) => (
                  <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                    {c.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-0 top-1.5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Right: Assigned Staff & Shift Status */}
        <div className="flex items-center gap-4">
          {activeCounter?.assignedStaff && (
            <div className="flex items-center gap-3 bg-slate-800/80 py-1.5 px-3 rounded-xl border border-slate-700">
              <img
                src={activeCounter.assignedStaff.avatarUrl}
                alt={activeCounter.assignedStaff.fullName}
                className="w-9 h-9 rounded-full object-cover border border-slate-600"
              />
              <div className="text-left">
                <div className="text-xs font-bold text-white">{activeCounter.assignedStaff.fullName}</div>
                <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                  <span>{activeCounter.assignedStaff.employeeCode}</span>
                  <span>•</span>
                  <span className="text-amber-400">★ {activeCounter.assignedStaff.ratingAverage}</span>
                </div>
              </div>
            </div>
          )}

          {/* Shift State Toggle */}
          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs font-semibold">
            <button
              onClick={() => setShiftStatus('ACTIVE')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                shiftStatus === 'ACTIVE'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Đang làm việc
            </button>
            <button
              onClick={() => setShiftStatus('BREAK')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                shiftStatus === 'BREAK'
                  ? 'bg-amber-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Tạm nghỉ
            </button>
          </div>
        </div>
      </header>

      {/* Main 2-Column Workspace Grid */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
        {/* Left Column (7 cols): Active Ticket & Calling Controls */}
        <section className="lg:col-span-7 flex flex-col justify-between gap-4">
          {/* Active Serving Card */}
          <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 shadow-2xl relative overflow-hidden flex-1 flex flex-col justify-between">
            {/* Top Badge */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-bold flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                KHÁCH HÀNG ĐANG PHỤC VỤ TẠI QUẦY
              </span>

              {servingTicket && (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-600/20 text-blue-300 border border-blue-500/30 rounded-full text-xs font-mono font-bold">
                  <Timer className="w-3.5 h-3.5 text-blue-400 animate-spin" />
                  <span>Thời gian phục vụ: {formatTimer(servingSeconds)}</span>
                </div>
              )}
            </div>

            {/* Middle: Big Serving Number & Citizen Details */}
            <div className="py-6 text-center">
              {servingTicket ? (
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-1">
                    {servingTicket.categoryName}
                  </span>
                  <div className="text-7xl sm:text-8xl font-black font-mono text-amber-400 tracking-tight">
                    {servingTicket.ticketNumber}
                  </div>

                  <div className="mt-4 p-4 bg-slate-800/80 rounded-2xl border border-slate-700/80 max-w-md mx-auto text-left grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Họ tên công dân:</span>
                      <strong className="text-white text-sm block truncate">{servingTicket.citizen.name}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Số định danh (CCCD):</span>
                      <span className="text-slate-200 font-mono text-sm block">
                        {servingTicket.citizen.citizenId || '---'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Giờ lấy số:</span>
                      <span className="text-slate-300">
                        {new Date(servingTicket.issuedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Phân loại:</span>
                      <span className={servingTicket.citizen.isPriority ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                        {servingTicket.citizen.isPriority ? '★ Khách ưu tiên' : 'Tiêu chuẩn'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-slate-500">
                  <div className="w-20 h-20 rounded-full bg-slate-800/80 flex items-center justify-center mb-3">
                    <User className="w-10 h-10 text-slate-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-400">Quầy đang trống</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Bấm &quot;GỌI TIẾP THEO&quot; để mời khách hàng kế tiếp vào phục vụ
                  </p>
                </div>
              )}
            </div>

            {/* Tactical Control Action Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-4 border-t border-slate-800">
              {/* Call Next Button */}
              <button
                onClick={handleCallNext}
                className="py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all transform active:scale-95 text-xs sm:text-sm"
              >
                <PhoneCall className="w-4 h-4" />
                <span>GỌI TIẾP THEO</span>
              </button>

              {/* Recall Button */}
              <button
                disabled={!servingTicket}
                onClick={handleRecall}
                className="py-3.5 px-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all transform active:scale-95 text-xs sm:text-sm"
              >
                <RotateCcw className="w-4 h-4" />
                <span>GỌI LẠI</span>
              </button>

              {/* Complete & Rating Trigger Button */}
              <button
                disabled={!servingTicket}
                onClick={handleComplete}
                className="py-3.5 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all transform active:scale-95 text-xs sm:text-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>HOÀN THÀNH</span>
              </button>

              {/* Skip / Absent Button */}
              <button
                disabled={!servingTicket}
                onClick={handleSkip}
                className="py-3 px-4 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 font-semibold rounded-2xl border border-slate-700 flex items-center justify-center gap-2 transition-all text-xs"
              >
                <SkipForward className="w-4 h-4 text-amber-400" />
                <span>Bỏ qua / Vắng</span>
              </button>

              {/* Transfer Counter Button */}
              <button
                disabled={!servingTicket}
                onClick={() => setShowTransferModal(true)}
                className="py-3 px-4 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 font-semibold rounded-2xl border border-slate-700 flex items-center justify-center gap-2 transition-all text-xs"
              >
                <ArrowRightLeft className="w-4 h-4 text-blue-400" />
                <span>Chuyển quầy</span>
              </button>

              {/* Issue Direct Ticket Button */}
              <button
                onClick={handleDirectTicket}
                className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-2xl border border-slate-700 flex items-center justify-center gap-2 transition-all text-xs"
              >
                <PlusCircle className="w-4 h-4 text-emerald-400" />
                <span>Cấp vé tại quầy</span>
              </button>
            </div>
          </div>
        </section>

        {/* Right Column (5 cols): Queue Management Tabs & Stats */}
        <section className="lg:col-span-5 flex flex-col justify-between gap-4">
          {/* Workstation Shift Stats */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Đã phục vụ</span>
              <strong className="text-xl font-bold text-emerald-400 font-mono">
                {activeCounter?.todayServedCount || 0}
              </strong>
            </div>
            <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">TG trung bình</span>
              <strong className="text-xl font-bold text-cyan-400 font-mono">
                {activeCounter?.avgServeMinutes || 8.5}p
              </strong>
            </div>
            <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Đang đợi</span>
              <strong className="text-xl font-bold text-amber-400 font-mono">
                {waitingTickets.length}
              </strong>
            </div>
          </div>

          {/* Queue Tabbed Tables */}
          <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-4 shadow-xl flex-1 flex flex-col overflow-hidden">
            {/* Tab Header */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-3">
              <button
                onClick={() => setActiveTab('waiting')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'waiting'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Đang chờ ({waitingTickets.length})
              </button>
              <button
                onClick={() => setActiveTab('skipped')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'skipped'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Đã bỏ qua ({skippedTickets.length})
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'history'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Lịch sử hôm nay ({completedTodayTickets.length})
              </button>
            </div>

            {/* Tab Content List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[360px] scrollbar-thin">
              {activeTab === 'waiting' && (
                waitingTickets.length > 0 ? (
                  waitingTickets.map((ticket, idx) => (
                    <div
                      key={ticket.id}
                      className="p-3 bg-slate-800/70 hover:bg-slate-800 rounded-2xl border border-slate-700/60 flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-500 w-5">#{idx + 1}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-base text-white">
                              {ticket.ticketNumber}
                            </span>
                            {ticket.citizen.isPriority && (
                              <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 text-[10px] font-bold rounded">
                                Ưu tiên
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-slate-400">{ticket.citizen.name}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[11px] text-slate-400 block">
                          Chờ ~{ticket.estimatedWaitMinutes}p
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {new Date(ticket.issuedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-slate-500 text-xs italic">
                    Không có vé nào đang chờ trong hàng
                  </div>
                )
              )}

              {activeTab === 'skipped' && (
                skippedTickets.length > 0 ? (
                  skippedTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="p-3 bg-slate-800/70 rounded-2xl border border-slate-700/60 flex items-center justify-between"
                    >
                      <div>
                        <span className="font-mono font-bold text-base text-amber-400">
                          {ticket.ticketNumber}
                        </span>
                        <div className="text-xs text-slate-400">{ticket.citizen.name}</div>
                      </div>
                      <span className="text-xs text-red-400 font-semibold">Vắng mặt</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-slate-500 text-xs italic">
                    Không có vé nào bị bỏ qua
                  </div>
                )
              )}

              {activeTab === 'history' && (
                completedTodayTickets.length > 0 ? (
                  completedTodayTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="p-3 bg-slate-800/70 rounded-2xl border border-slate-700/60 flex items-center justify-between"
                    >
                      <div>
                        <span className="font-mono font-bold text-sm text-white">
                          {ticket.ticketNumber}
                        </span>
                        <div className="text-xs text-slate-400">{ticket.citizen.name}</div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-emerald-400 font-bold block">✓ Hoàn tất</span>
                        {ticket.rating && (
                          <span className="text-[10px] text-amber-400">
                            ★ {ticket.rating.score}/5 sao
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-slate-500 text-xs italic">
                    Chưa có lượt phục vụ nào hoàn tất
                  </div>
                )
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Transfer Counter Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="w-full max-w-sm bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Chuyển tiếp khách hàng</h3>
            <p className="text-xs text-slate-400 mb-4">
              Chuyển vé <strong>{servingTicket?.ticketNumber}</strong> sang quầy nghiệp vụ khác
            </p>

            <div className="space-y-2 mb-6">
              {counters
                .filter((c) => c.id !== activeCounterId)
                .map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setTargetCounterId(c.id)}
                    className={`w-full p-3 rounded-2xl border text-left text-xs font-semibold transition-all ${
                      targetCounterId === c.id
                        ? 'bg-blue-600/20 text-blue-300 border-blue-500'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <div className="font-bold">{c.title}</div>
                    <div className="text-[11px] text-slate-400">Cán bộ: {c.assignedStaff.fullName}</div>
                  </button>
                ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowTransferModal(false)}
                className="flex-1 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold"
              >
                Hủy
              </button>
              <button
                disabled={!targetCounterId}
                onClick={handleTransfer}
                className="flex-1 py-2.5 bg-blue-600 disabled:opacity-40 text-white rounded-xl text-xs font-bold shadow-md"
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
