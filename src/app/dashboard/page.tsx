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
    <div className="h-screen max-h-screen overflow-hidden bg-[#F3F0EE] text-[#141413] pt-16 sm:pt-18 pb-3 px-4 sm:px-6 select-none relative flex flex-col justify-between">
      <div className="relative z-10 max-w-7xl mx-auto w-full flex-1 flex flex-col justify-between min-h-0 space-y-2.5">
        {/* Dashboard Title & Quick Launch Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 py-1 flex-shrink-0">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#141413]/10 rounded-full text-xs font-semibold mb-1 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#bb302a] animate-ping" />
              <span className="eyebrow-label text-[#bb302a] font-bold">• GIÁM SÁT THỜI GIAN THỰC</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#141413] tracking-tight">
              Trung tâm Giám sát & Điều hành Xếp hàng Thông minh
            </h1>
          </div>

          {/* Quick Nav Pills (White pills 20px radius) */}
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/kiosk"
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-[#FCFBFA] text-[#141413] text-xs font-semibold rounded-[20px] border border-[#141413]/15 shadow-sm transition-all"
            >
              <Touchpad className="w-3.5 h-3.5 text-[#bb302a]" />
              <span>Kiosk</span>
            </Link>
            <Link
              href="/display"
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-[#FCFBFA] text-[#141413] text-xs font-semibold rounded-[20px] border border-[#141413]/15 shadow-sm transition-all"
            >
              <Tv className="w-3.5 h-3.5 text-[#bb302a]" />
              <span>Màn hình TV</span>
            </Link>
            <Link
              href="/teller"
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-[#FCFBFA] text-[#141413] text-xs font-semibold rounded-[20px] border border-[#141413]/15 shadow-sm transition-all"
            >
              <Headphones className="w-3.5 h-3.5 text-[#bb302a]" />
              <span>Bàn gọi số</span>
            </Link>
            <Link
              href="/counter-sign"
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-[#FCFBFA] text-[#141413] text-xs font-semibold rounded-[20px] border border-[#141413]/15 shadow-sm transition-all"
            >
              <MonitorDot className="w-3.5 h-3.5 text-[#bb302a]" />
              <span>Bảng Quầy</span>
            </Link>
            <Link
              href="/rating"
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-[#FCFBFA] text-[#141413] text-xs font-semibold rounded-[20px] border border-[#141413]/15 shadow-sm transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F79E1B]" />
              <span>Tablet Đánh giá</span>
            </Link>
          </div>
        </div>

        {/* 6 Key KPI Cards (Stadium 24px on #FCFBFA) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 flex-shrink-0">
          {/* Total Issued */}
          <div className="p-3 bg-[#FCFBFA] rounded-[22px] border border-[#141413]/10 shadow-[0px_4px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1">
              <span className="eyebrow-label text-[#696969] text-[11px] font-bold">TỔNG VÉ HÔM NAY</span>
              <div className="w-7 h-7 rounded-full bg-[#bb302a]/10 text-[#bb302a] flex items-center justify-center">
                <Users className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#141413] font-mono leading-none my-1">
              {kpis.totalIssuedToday}
            </div>
            <div className="text-[11px] text-[#bb302a] flex items-center gap-1 font-bold">
              <TrendingUp className="w-3 h-3" />
              <span>+18.5% so với TB</span>
            </div>
          </div>

          {/* Currently Waiting */}
          <div className="p-3 bg-[#FCFBFA] rounded-[22px] border border-[#141413]/10 shadow-[0px_4px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1">
              <span className="eyebrow-label text-[#696969] text-[11px] font-bold">ĐANG ĐỢI HÀNG</span>
              <div className="w-7 h-7 rounded-full bg-[#F79E1B]/15 text-[#9A3A0A] flex items-center justify-center">
                <Clock className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#141413] font-mono leading-none my-1">
              {kpis.currentlyWaiting}
            </div>
            <span className="text-[11px] text-[#696969] block font-semibold">Phân bổ 4 lĩnh vực</span>
          </div>

          {/* Currently Serving */}
          <div className="p-3 bg-[#FCFBFA] rounded-[22px] border border-[#141413]/10 shadow-[0px_4px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1">
              <span className="eyebrow-label text-[#696969] text-[11px] font-bold">ĐANG PHỤC VỤ</span>
              <div className="w-7 h-7 rounded-full bg-[#141413] text-[#F3F0EE] flex items-center justify-center">
                <Headphones className="w-3.5 h-3.5 text-[#F79E1B]" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#bb302a] font-mono leading-none my-1">
              {kpis.currentlyServing}
            </div>
            <span className="text-[11px] text-[#696969] block font-semibold">4/4 quầy mở cửa</span>
          </div>

          {/* Completed */}
          <div className="p-3 bg-[#FCFBFA] rounded-[22px] border border-[#141413]/10 shadow-[0px_4px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1">
              <span className="eyebrow-label text-[#696969] text-[11px] font-bold">ĐÃ HOÀN TẤT</span>
              <div className="w-7 h-7 rounded-full bg-[#bb302a]/10 text-[#bb302a] flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#141413] font-mono leading-none my-1">
              {kpis.completedToday}
            </div>
            <span className="text-[11px] text-[#bb302a] font-bold block">
              Đúng hẹn 99.1%
            </span>
          </div>

          {/* Avg Wait Time */}
          <div className="p-3 bg-[#FCFBFA] rounded-[22px] border border-[#141413]/10 shadow-[0px_4px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1">
              <span className="eyebrow-label text-[#696969] text-[11px] font-bold">TG CHỜ TB</span>
              <div className="w-7 h-7 rounded-full bg-[#F3F0EE] text-[#141413] flex items-center justify-center">
                <Clock className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#141413] font-mono leading-none my-1">
              {kpis.averageWaitMinutes}p
            </div>
            <span className="text-[11px] text-[#696969] block font-semibold">Mục tiêu: &lt; 10p</span>
          </div>

          {/* Satisfaction Rate */}
          <div className="p-3 bg-[#FCFBFA] rounded-[22px] border border-[#141413]/10 shadow-[0px_4px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1">
              <span className="eyebrow-label text-[#696969] text-[11px] font-bold">HÀI LÒNG</span>
              <div className="w-7 h-7 rounded-full bg-[#F79E1B]/15 text-[#9A3A0A] flex items-center justify-center">
                <Star className="w-3.5 h-3.5 fill-[#F79E1B]" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#bb302a] font-mono leading-none my-1">
              {kpis.satisfactionRate}%
            </div>
            <span className="text-[11px] text-[#696969] block font-semibold">Đánh giá 4-5 sao</span>
          </div>
        </div>

        {/* Charts & Graphs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 flex-1 min-h-0">
          {/* Hourly Traffic Bar Visualizer (8 cols - Stadium 24px) */}
          <div className="lg:col-span-8 p-3.5 sm:p-4 bg-[#FCFBFA] rounded-[24px] border border-[#141413]/10 shadow-sm flex flex-col justify-between min-h-0">
            <div className="flex items-center justify-between mb-1.5 flex-shrink-0">
              <div>
                <span className="eyebrow-label text-[#bb302a] block text-[11px] font-bold">
                  • THỐNG KÊ LƯU LƯỢNG
                </span>
                <h3 className="text-sm sm:text-base font-bold text-[#141413]">Biểu đồ Phân bổ Hồ sơ theo Khung giờ</h3>
              </div>
              <div className="text-xs text-[#696969] font-mono bg-[#F3F0EE] px-3 py-1 rounded-full font-medium">
                Cao điểm: <strong className="text-[#bb302a] font-bold">09h30 - 10h30</strong>
              </div>
            </div>

            {/* Custom pure CSS bar chart with Mastercard-inspired palette */}
            <div className="h-28 sm:h-32 flex items-end justify-between gap-2 pt-1 px-1">
              {hourlyData.map((d) => {
                const heightPercent = Math.round((d.count / maxHourlyCount) * 100);
                const isPeak = d.count >= 60;
                return (
                  <div key={d.hour} className="flex-1 flex flex-col items-center gap-1 group">
                    <span className="text-[10px] text-[#696969] font-mono font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      {d.count}
                    </span>
                    <div className="w-full bg-[#F3F0EE] rounded-t-lg h-22 sm:h-24 flex items-end p-0.5">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-md transition-all duration-500 ${
                          isPeak
                            ? 'bg-[#bb302a] shadow-sm'
                            : 'bg-[#141413] group-hover:bg-[#bb302a]'
                        }`}
                      />
                    </div>
                    <span className="text-[10px] sm:text-xs font-mono text-[#696969] whitespace-nowrap font-medium">
                      {d.hour}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Service Categories Breakdown (4 cols - Stadium 24px) */}
          <div className="lg:col-span-4 p-3.5 sm:p-4 bg-[#FCFBFA] rounded-[24px] border border-[#141413]/10 shadow-sm flex flex-col justify-between min-h-0">
            <div>
              <span className="eyebrow-label text-[#bb302a] block text-[11px] font-bold">
                • CƠ CẤU THỦ TỤC
              </span>
              <h3 className="text-sm sm:text-base font-bold text-[#141413] mb-2">Tỷ trọng Lĩnh vực</h3>

              <div className="space-y-2">
                {categories.map((cat, idx) => {
                  const catTickets = tickets.filter((t) => t.categoryId === cat.id);
                  const percent = Math.round((catTickets.length / (tickets.length || 1)) * 100);
                  const colors = ['bg-[#bb302a]', 'bg-[#141413]', 'bg-[#F79E1B]', 'bg-[#696969]'];

                  return (
                    <div key={cat.id} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-[#141413] font-semibold">{cat.name}</span>
                        <span className="text-[#696969] font-mono font-bold">
                          {catTickets.length} vé ({percent}%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-[#F3F0EE] rounded-full overflow-hidden">
                        <div
                          style={{ width: `${percent}%` }}
                          className={`h-full ${colors[idx % colors.length]} rounded-full`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-[#141413]/10 text-[11px] text-[#696969] flex items-center justify-between">
              <span>Máy in vé Kiosk:</span>
              <span className="text-[#bb302a] font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#bb302a]" />
                Hoạt động tốt
              </span>
            </div>
          </div>
        </div>

        {/* Counter Performance Table & Recent Live Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 flex-1 min-h-0">
          {/* Counter Performance Table (7 cols - Stadium 24px) */}
          <div className="lg:col-span-7 p-3.5 sm:p-4 bg-[#FCFBFA] rounded-[24px] border border-[#141413]/10 shadow-sm flex flex-col justify-between min-h-0">
            <div>
              <span className="eyebrow-label text-[#bb302a] block text-[11px] font-bold">
                • NĂNG SUẤT QUẦY GIAO DỊCH
              </span>
              <h3 className="text-sm sm:text-base font-bold text-[#141413] mb-1.5">Hiệu năng Phục vụ theo Từng Quầy</h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#141413]/10 text-[#696969]">
                      <th className="pb-2 font-bold uppercase tracking-wider text-[11px]">QUẦY</th>
                      <th className="pb-2 font-bold uppercase tracking-wider text-[11px]">CÁN BỘ TIẾP NHẬN</th>
                      <th className="pb-2 font-bold uppercase tracking-wider text-[11px] text-center">ĐÃ PHỤC VỤ</th>
                      <th className="pb-2 font-bold uppercase tracking-wider text-[11px] text-center">TG TRUNG BÌNH</th>
                      <th className="pb-2 font-bold uppercase tracking-wider text-[11px] text-right">ĐÁNH GIÁ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#141413]/5">
                    {counters.map((c) => (
                      <tr key={c.id} className="hover:bg-white transition-colors">
                        <td className="py-2 font-bold text-[#bb302a] font-mono text-xs sm:text-sm">
                          Quầy {c.code}
                        </td>
                        <td className="py-2">
                          <div className="font-bold text-[#141413] text-xs sm:text-sm">{c.assignedStaff.fullName}</div>
                          <div className="text-[10px] text-[#696969]">{c.assignedStaff.department}</div>
                        </td>
                        <td className="py-2 text-center font-mono font-bold text-[#141413] text-xs sm:text-sm">
                          {c.todayServedCount}
                        </td>
                        <td className="py-2 text-center font-mono font-bold text-[#bb302a] text-xs sm:text-sm">
                          {c.avgServeMinutes} phút
                        </td>
                        <td className="py-2 text-right">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white border border-[#141413]/10 text-[#141413] font-bold shadow-sm text-xs">
                            <span className="text-[#F79E1B]">★</span> {c.assignedStaff.ratingAverage}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Recent Activity Audit Feed (5 cols - Stadium 24px) */}
          <div className="lg:col-span-5 p-3.5 sm:p-4 bg-[#FCFBFA] rounded-[24px] border border-[#141413]/10 shadow-sm flex flex-col justify-between min-h-0">
            <div>
              <span className="eyebrow-label text-[#bb302a] block text-[11px] font-bold">
                • NHẬT KÝ THỜI GIAN THỰC
              </span>
              <h3 className="text-sm sm:text-base font-bold text-[#141413] mb-1.5">Sự kiện Hệ thống Gần nhất</h3>

              <div className="space-y-2">
                {recentTickets.slice(0, 4).map((t) => (
                  <div
                    key={t.id}
                    className="p-2 sm:p-2.5 bg-[#F3F0EE] rounded-[16px] border border-[#141413]/5 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#141413] text-xs sm:text-sm">{t.ticketNumber}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            t.status === 'SERVING'
                              ? 'bg-[#bb302a] text-white'
                              : t.status === 'COMPLETED'
                              ? 'bg-[#141413] text-[#F3F0EE]'
                              : t.status === 'WAITING'
                              ? 'bg-white border border-[#141413]/10 text-[#141413]'
                              : 'bg-[#CF4500]/10 text-[#CF4500]'
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
                      <span className="text-[11px] text-[#696969] mt-0.5 block">{t.citizen.name} • {t.categoryName}</span>
                    </div>

                    <div className="text-right text-[11px] text-[#696969] font-mono font-semibold">
                      {new Date(t.issuedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-2 pt-1.5 border-t border-[#141413]/10 text-center">
              <span className="text-[10px] text-[#696969] font-medium">
                Tự động đồng bộ mỗi giây qua WebSocket & State Engine
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
