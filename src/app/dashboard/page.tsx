'use client';

import React from 'react';
import Link from 'next/link';
import { useQms } from '@/context/QmsContext';
import {
  Users,
  Clock,
  CheckCircle2,
  TrendingUp,
  Star,
  Activity,
  Tv,
  Touchpad,
  Headphones,
  Sparkles,
  MonitorDot,
} from 'lucide-react';

export default function DashboardPage() {
  const { kpis, counters, tickets, categories } = useQms();

  const recentTickets = [...tickets]
    .sort((a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime())
    .slice(0, 6);

  // Hourly traffic simulated data
  const hourlyData = [
    { hour: '07h30', count: 18 },
    { hour: '08h30', count: 42 },
    { hour: '09h30', count: 68 },
    { hour: '10h30', count: 54 },
    { hour: '11h30', count: 20 },
    { hour: '13h30', count: 35 },
    { hour: '14h30', count: 62 },
    { hour: '15h30', count: 48 },
    { hour: '16h30', count: 24 },
  ];

  const maxHourlyCount = Math.max(...hourlyData.map((d) => d.count));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-16 sm:pt-20 pb-12 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Dashboard Title & Quick Launch Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-2">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-semibold mb-2">
              <Activity className="w-3.5 h-3.5" />
              <span>DỮ LIỆU ĐIỀU HÀNH THỜI GIAN THỰC</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              TRUNG TÂM GIÁM SÁT & ĐIỀU HÀNH XẾP HÀNG THÔNG MINH
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Phân tích chỉ số hiệu năng (KPIs), lưu lượng công dân và mức độ hài lòng tại Trung tâm Hành chính công
            </p>
          </div>

          {/* Quick Showcase Links */}
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/kiosk"
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 shadow-sm transition-all"
            >
              <Touchpad className="w-3.5 h-3.5 text-blue-400" />
              <span>Kiosk</span>
            </Link>
            <Link
              href="/display"
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 shadow-sm transition-all"
            >
              <Tv className="w-3.5 h-3.5 text-cyan-400" />
              <span>Màn hình TV</span>
            </Link>
            <Link
              href="/teller"
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 shadow-sm transition-all"
            >
              <Headphones className="w-3.5 h-3.5 text-emerald-400" />
              <span>Bàn gọi số</span>
            </Link>
            <Link
              href="/counter-sign"
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 shadow-sm transition-all"
            >
              <MonitorDot className="w-3.5 h-3.5 text-purple-400" />
              <span>Bảng Quầy</span>
            </Link>
            <Link
              href="/rating"
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 shadow-sm transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Tablet Đánh giá</span>
            </Link>
          </div>
        </div>

        {/* 6 Top Key KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {/* Total Issued */}
          <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-2">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-[11px] text-slate-400 font-medium block">Tổng vé hôm nay</span>
            <div className="text-2xl font-black text-white font-mono mt-0.5">
              {kpis.totalIssuedToday}
            </div>
            <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1 font-semibold">
              <TrendingUp className="w-3 h-3" />
              <span>+18.5% so với TB</span>
            </div>
          </div>

          {/* Currently Waiting */}
          <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-2">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-[11px] text-slate-400 font-medium block">Đang đợi trong hàng</span>
            <div className="text-2xl font-black text-amber-400 font-mono mt-0.5">
              {kpis.currentlyWaiting}
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">Phân bổ 4 lĩnh vực</span>
          </div>

          {/* Currently Serving */}
          <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-2">
              <Headphones className="w-4 h-4" />
            </div>
            <span className="text-[11px] text-slate-400 font-medium block">Đang phục vụ tại quầy</span>
            <div className="text-2xl font-black text-cyan-400 font-mono mt-0.5">
              {kpis.currentlyServing}
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">4/4 quầy mở cửa</span>
          </div>

          {/* Completed */}
          <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span className="text-[11px] text-slate-400 font-medium block">Đã giải quyết xong</span>
            <div className="text-2xl font-black text-emerald-400 font-mono mt-0.5">
              {kpis.completedToday}
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold block mt-1">
              Đúng hẹn 99.1%
            </span>
          </div>

          {/* Avg Wait Time */}
          <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-2">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-[11px] text-slate-400 font-medium block">Thời gian chờ TB</span>
            <div className="text-2xl font-black text-purple-300 font-mono mt-0.5">
              {kpis.averageWaitMinutes}p
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">Mục tiêu: &lt; 10 phút</span>
          </div>

          {/* Satisfaction Rate */}
          <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-2">
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
            <span className="text-[11px] text-slate-400 font-medium block">Chỉ số hài lòng</span>
            <div className="text-2xl font-black text-amber-300 font-mono mt-0.5">
              {kpis.satisfactionRate}%
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">Đánh giá 4-5 sao</span>
          </div>
        </div>

        {/* Charts & Graphs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Hourly Traffic Bar Visualizer (8 cols) */}
          <div className="lg:col-span-8 p-6 bg-slate-900/90 rounded-3xl border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-white">Biểu đồ Lưu lượng Lấy số theo Khung giờ</h3>
                <p className="text-xs text-slate-400">Số lượng công dân giao dịch trong ngày hôm nay</p>
              </div>
              <div className="text-xs text-slate-400 font-mono">
                Cao điểm: <strong className="text-cyan-400">09h30 - 10h30</strong>
              </div>
            </div>

            {/* Custom pure CSS bar chart */}
            <div className="h-56 flex items-end justify-between gap-2 sm:gap-4 pt-6 px-2">
              {hourlyData.map((d) => {
                const heightPercent = Math.round((d.count / maxHourlyCount) * 100);
                const isPeak = d.count >= 60;
                return (
                  <div key={d.hour} className="flex-1 flex flex-col items-center gap-2 group">
                    <span className="text-[10px] text-slate-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                      {d.count}
                    </span>
                    <div className="w-full bg-slate-800/80 rounded-t-xl h-44 flex items-end p-1">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-lg transition-all duration-500 ${
                          isPeak
                            ? 'bg-gradient-to-t from-blue-600 via-indigo-500 to-cyan-400 shadow-lg shadow-cyan-500/20'
                            : 'bg-gradient-to-t from-blue-700/60 to-blue-500/80 group-hover:from-blue-600 group-hover:to-cyan-400'
                        }`}
                      />
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 whitespace-nowrap">
                      {d.hour}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Service Categories Breakdown (4 cols) */}
          <div className="lg:col-span-4 p-6 bg-slate-900/90 rounded-3xl border border-slate-800 shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-white mb-1">Tỷ trọng Lĩnh vực Hồ sơ</h3>
              <p className="text-xs text-slate-400 mb-4">Phân bổ hồ sơ theo từng danh mục dịch vụ</p>

              <div className="space-y-3.5">
                {categories.map((cat) => {
                  const catTickets = tickets.filter((t) => t.categoryId === cat.id);
                  const percent = Math.round((catTickets.length / (tickets.length || 1)) * 100);

                  return (
                    <div key={cat.id} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300 font-medium">{cat.name}</span>
                        <span className="text-slate-400 font-mono font-bold">
                          {catTickets.length} vé ({percent}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${percent}%` }}
                          className={`h-full bg-gradient-to-r ${cat.color} rounded-full`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
              <span>Trạng thái máy in vé Kiosk:</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Hoạt động tốt
              </span>
            </div>
          </div>
        </div>

        {/* Counter Performance Table & Recent Live Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Counter Performance Table (7 cols) */}
          <div className="lg:col-span-7 p-6 bg-slate-900/90 rounded-3xl border border-slate-800 shadow-xl">
            <h3 className="text-base font-bold text-white mb-1">Hiệu năng Phục vụ theo Từng Quầy</h3>
            <p className="text-xs text-slate-400 mb-4">Chi tiết năng suất và sự hài lòng của cán bộ tiếp nhận</p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3 font-semibold">QUẦY</th>
                    <th className="pb-3 font-semibold">CÁN BỘ TIẾP NHẬN</th>
                    <th className="pb-3 font-semibold text-center">ĐÃ PHỤC VỤ</th>
                    <th className="pb-3 font-semibold text-center">TG TRUNG BÌNH</th>
                    <th className="pb-3 font-semibold text-right">ĐÁNH GIÁ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {counters.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 font-bold text-blue-400 font-mono">
                        Quầy {c.code}
                      </td>
                      <td className="py-3">
                        <div className="font-semibold text-white">{c.assignedStaff.fullName}</div>
                        <div className="text-[10px] text-slate-500">{c.assignedStaff.department}</div>
                      </td>
                      <td className="py-3 text-center font-mono font-bold text-slate-200">
                        {c.todayServedCount}
                      </td>
                      <td className="py-3 text-center font-mono text-cyan-400">
                        {c.avgServeMinutes} phút
                      </td>
                      <td className="py-3 text-right">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 font-bold">
                          ★ {c.assignedStaff.ratingAverage}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Activity Audit Feed (5 cols) */}
          <div className="lg:col-span-5 p-6 bg-slate-900/90 rounded-3xl border border-slate-800 shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-white mb-1">Nhật ký Hoạt động Thời gian thực</h3>
              <p className="text-xs text-slate-400 mb-4">Sự kiện gần nhất trong toàn hệ thống QMS</p>

              <div className="space-y-3">
                {recentTickets.map((t) => (
                  <div
                    key={t.id}
                    className="p-3 bg-slate-800/60 rounded-2xl border border-slate-700/60 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white">{t.ticketNumber}</span>
                        <span
                          className={`text-[10px] px-2 py-0.2 rounded-full font-bold ${
                            t.status === 'SERVING'
                              ? 'bg-blue-500/20 text-blue-300'
                              : t.status === 'COMPLETED'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : t.status === 'WAITING'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-red-500/20 text-red-300'
                          }`}
                        >
                          {t.status === 'SERVING'
                            ? 'Đang phục vụ'
                            : t.status === 'COMPLETED'
                            ? 'Đã hoàn tất'
                            : t.status === 'WAITING'
                            ? 'Đang chờ'
                            : 'Đã bỏ qua'}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">{t.citizen.name} • {t.categoryName}</span>
                    </div>

                    <div className="text-right text-[10px] text-slate-500 font-mono">
                      {new Date(t.issuedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 text-center">
              <span className="text-[11px] text-slate-500">
                Tự động đồng bộ mỗi giây qua WebSocket & State Engine
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
