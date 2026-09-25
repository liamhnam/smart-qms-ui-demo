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
    <div className="min-h-screen bg-[#F3F0EE] text-[#141413] pt-24 sm:pt-28 pb-16 px-4 sm:px-8 relative overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto space-y-6">
        {/* Dashboard Title & Quick Launch Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-2">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white border border-[#141413]/10 rounded-full text-xs sm:text-sm font-semibold mb-2.5 shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-[#bb302a] animate-ping" />
              <span className="eyebrow-label text-[#bb302a] font-bold">• GIÁM SÁT THỜI GIAN THỰC</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#141413] tracking-tight">
              Trung tâm Giám sát & Điều hành Xếp hàng Thông minh
            </h1>
            <p className="text-sm sm:text-base text-[#696969] mt-1">
              Phân tích chỉ số hiệu năng (KPIs), lưu lượng công dân và mức độ hài lòng tại Trung tâm Hành chính công
            </p>
          </div>

          {/* Quick Nav Pills (White pills 20px radius) */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/kiosk"
              className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-[#FCFBFA] text-[#141413] text-xs sm:text-sm font-semibold rounded-[20px] border border-[#141413]/15 shadow-sm transition-all"
            >
              <Touchpad className="w-4 h-4 text-[#bb302a]" />
              <span>Kiosk</span>
            </Link>
            <Link
              href="/display"
              className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-[#FCFBFA] text-[#141413] text-xs sm:text-sm font-semibold rounded-[20px] border border-[#141413]/15 shadow-sm transition-all"
            >
              <Tv className="w-4 h-4 text-[#bb302a]" />
              <span>Màn hình TV</span>
            </Link>
            <Link
              href="/teller"
              className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-[#FCFBFA] text-[#141413] text-xs sm:text-sm font-semibold rounded-[20px] border border-[#141413]/15 shadow-sm transition-all"
            >
              <Headphones className="w-4 h-4 text-[#bb302a]" />
              <span>Bàn gọi số</span>
            </Link>
            <Link
              href="/counter-sign"
              className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-[#FCFBFA] text-[#141413] text-xs sm:text-sm font-semibold rounded-[20px] border border-[#141413]/15 shadow-sm transition-all"
            >
              <MonitorDot className="w-4 h-4 text-[#bb302a]" />
              <span>Bảng Quầy</span>
            </Link>
            <Link
              href="/rating"
              className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-[#FCFBFA] text-[#141413] text-xs sm:text-sm font-semibold rounded-[20px] border border-[#141413]/15 shadow-sm transition-all"
            >
              <Sparkles className="w-4 h-4 text-[#F79E1B]" />
              <span>Tablet Đánh giá</span>
            </Link>
          </div>
        </div>

        {/* 6 Key KPI Cards (Stadium 40px on #FCFBFA) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Total Issued */}
          <div className="p-5 bg-[#FCFBFA] rounded-[32px] border border-[#141413]/10 shadow-[0px_4px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div className="w-10 h-10 rounded-full bg-[#bb302a]/10 text-[#bb302a] flex items-center justify-center mb-3">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="eyebrow-label text-[#696969] block mb-1 text-xs font-bold">TỔNG VÉ HÔM NAY</span>
              <div className="text-3xl sm:text-4xl font-bold text-[#141413] font-mono">
                {kpis.totalIssuedToday}
              </div>
            </div>
            <div className="text-xs text-[#bb302a] flex items-center gap-1 mt-2.5 font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18.5% so với TB</span>
            </div>
          </div>

          {/* Currently Waiting */}
          <div className="p-5 bg-[#FCFBFA] rounded-[32px] border border-[#141413]/10 shadow-[0px_4px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div className="w-10 h-10 rounded-full bg-[#F79E1B]/15 text-[#9A3A0A] flex items-center justify-center mb-3">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="eyebrow-label text-[#696969] block mb-1 text-xs font-bold">ĐANG ĐỢI TRONG HÀNG</span>
              <div className="text-3xl sm:text-4xl font-bold text-[#141413] font-mono">
                {kpis.currentlyWaiting}
              </div>
            </div>
            <span className="text-xs text-[#696969] mt-2.5 block font-semibold">Phân bổ 4 lĩnh vực</span>
          </div>

          {/* Currently Serving */}
          <div className="p-5 bg-[#FCFBFA] rounded-[32px] border border-[#141413]/10 shadow-[0px_4px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div className="w-10 h-10 rounded-full bg-[#141413] text-[#F3F0EE] flex items-center justify-center mb-3">
              <Headphones className="w-5 h-5 text-[#F79E1B]" />
            </div>
            <div>
              <span className="eyebrow-label text-[#696969] block mb-1 text-xs font-bold">ĐANG PHỤC VỤ</span>
              <div className="text-3xl sm:text-4xl font-bold text-[#bb302a] font-mono">
                {kpis.currentlyServing}
              </div>
            </div>
            <span className="text-xs text-[#696969] mt-2.5 block font-semibold">4/4 quầy mở cửa</span>
          </div>

          {/* Completed */}
          <div className="p-5 bg-[#FCFBFA] rounded-[32px] border border-[#141413]/10 shadow-[0px_4px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div className="w-10 h-10 rounded-full bg-[#bb302a]/10 text-[#bb302a] flex items-center justify-center mb-3">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="eyebrow-label text-[#696969] block mb-1 text-xs font-bold">ĐÃ HOÀN TẤT</span>
              <div className="text-3xl sm:text-4xl font-bold text-[#141413] font-mono">
                {kpis.completedToday}
              </div>
            </div>
            <span className="text-xs text-[#bb302a] font-bold mt-2.5 block">
              Đúng hẹn 99.1%
            </span>
          </div>

          {/* Avg Wait Time */}
          <div className="p-5 bg-[#FCFBFA] rounded-[32px] border border-[#141413]/10 shadow-[0px_4px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div className="w-10 h-10 rounded-full bg-[#F3F0EE] text-[#141413] flex items-center justify-center mb-3">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="eyebrow-label text-[#696969] block mb-1 text-xs font-bold">THỜI GIAN CHỜ TB</span>
              <div className="text-3xl sm:text-4xl font-bold text-[#141413] font-mono">
                {kpis.averageWaitMinutes}p
              </div>
            </div>
            <span className="text-xs text-[#696969] mt-2.5 block font-semibold">Mục tiêu: &lt; 10 phút</span>
          </div>

          {/* Satisfaction Rate */}
          <div className="p-5 bg-[#FCFBFA] rounded-[32px] border border-[#141413]/10 shadow-[0px_4px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div className="w-10 h-10 rounded-full bg-[#F79E1B]/15 text-[#9A3A0A] flex items-center justify-center mb-3">
              <Star className="w-5 h-5 fill-[#F79E1B]" />
            </div>
            <div>
              <span className="eyebrow-label text-[#696969] block mb-1 text-xs font-bold">CHỈ SỐ HÀI LÒNG</span>
              <div className="text-3xl sm:text-4xl font-bold text-[#bb302a] font-mono">
                {kpis.satisfactionRate}%
              </div>
            </div>
            <span className="text-xs text-[#696969] mt-2.5 block font-semibold">Đánh giá 4-5 sao</span>
          </div>
        </div>

        {/* Charts & Graphs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Hourly Traffic Bar Visualizer (8 cols - Stadium 40px) */}
          <div className="lg:col-span-8 p-7 bg-[#FCFBFA] rounded-[40px] border border-[#141413]/10 shadow-[0px_4px_24px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="eyebrow-label text-[#bb302a] block mb-1 text-xs sm:text-sm font-bold">
                  • THỐNG KÊ LƯU LƯỢNG
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-[#141413]">Biểu đồ Phân bổ Hồ sơ theo Khung giờ</h3>
                <p className="text-sm text-[#696969]">Số lượng công dân giao dịch trong ngày hôm nay</p>
              </div>
              <div className="text-xs sm:text-sm text-[#696969] font-mono bg-[#F3F0EE] px-4 py-2 rounded-full font-medium">
                Cao điểm: <strong className="text-[#bb302a] font-bold">09h30 - 10h30</strong>
              </div>
            </div>

            {/* Custom pure CSS bar chart with Mastercard-inspired palette */}
            <div className="h-56 flex items-end justify-between gap-3 sm:gap-4 pt-6 px-2">
              {hourlyData.map((d) => {
                const heightPercent = Math.round((d.count / maxHourlyCount) * 100);
                const isPeak = d.count >= 60;
                return (
                  <div key={d.hour} className="flex-1 flex flex-col items-center gap-2 group">
                    <span className="text-xs text-[#696969] font-mono font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      {d.count}
                    </span>
                    <div className="w-full bg-[#F3F0EE] rounded-t-xl h-44 flex items-end p-1">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-lg transition-all duration-500 ${
                          isPeak
                            ? 'bg-[#bb302a] shadow-sm'
                            : 'bg-[#141413] group-hover:bg-[#bb302a]'
                        }`}
                      />
                    </div>
                    <span className="text-xs sm:text-sm font-mono text-[#696969] whitespace-nowrap font-medium">
                      {d.hour}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Service Categories Breakdown (4 cols - Stadium 40px) */}
          <div className="lg:col-span-4 p-7 bg-[#FCFBFA] rounded-[40px] border border-[#141413]/10 shadow-[0px_4px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div>
              <span className="eyebrow-label text-[#bb302a] block mb-1 text-xs sm:text-sm font-bold">
                • CƠ CẤU THỦ TỤC
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#141413]">Tỷ trọng Lĩnh vực</h3>
              <p className="text-sm text-[#696969] mb-4">Phân bổ hồ sơ theo từng danh mục dịch vụ</p>

              <div className="space-y-4">
                {categories.map((cat, idx) => {
                  const catTickets = tickets.filter((t) => t.categoryId === cat.id);
                  const percent = Math.round((catTickets.length / (tickets.length || 1)) * 100);
                  const colors = ['bg-[#bb302a]', 'bg-[#141413]', 'bg-[#F79E1B]', 'bg-[#696969]'];

                  return (
                    <div key={cat.id} className="space-y-1.5">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-[#141413] font-semibold">{cat.name}</span>
                        <span className="text-[#696969] font-mono font-bold">
                          {catTickets.length} vé ({percent}%)
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-[#F3F0EE] rounded-full overflow-hidden">
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

            <div className="mt-6 pt-4 border-t border-[#141413]/10 text-xs sm:text-sm text-[#696969] flex items-center justify-between">
              <span>Trạng thái máy in vé Kiosk:</span>
              <span className="text-[#bb302a] font-bold flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#bb302a]" />
                Hoạt động tốt
              </span>
            </div>
          </div>
        </div>

        {/* Counter Performance Table & Recent Live Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Counter Performance Table (7 cols - Stadium 40px) */}
          <div className="lg:col-span-7 p-7 bg-[#FCFBFA] rounded-[40px] border border-[#141413]/10 shadow-[0px_4px_24px_rgba(0,0,0,0.03)]">
            <span className="eyebrow-label text-[#bb302a] block mb-1 text-xs sm:text-sm font-bold">
              • NĂNG SUẤT QUẦY GIAO DỊCH
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-[#141413] mb-1">Hiệu năng Phục vụ theo Từng Quầy</h3>
            <p className="text-sm text-[#696969] mb-4">Chi tiết năng suất và sự hài lòng của cán bộ tiếp nhận</p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-[#141413]/10 text-[#696969]">
                    <th className="pb-3.5 font-bold uppercase tracking-wider text-xs">QUẦY</th>
                    <th className="pb-3.5 font-bold uppercase tracking-wider text-xs">CÁN BỘ TIẾP NHẬN</th>
                    <th className="pb-3.5 font-bold uppercase tracking-wider text-xs text-center">ĐÃ PHỤC VỤ</th>
                    <th className="pb-3.5 font-bold uppercase tracking-wider text-xs text-center">TG TRUNG BÌNH</th>
                    <th className="pb-3.5 font-bold uppercase tracking-wider text-xs text-right">ĐÁNH GIÁ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#141413]/5">
                  {counters.map((c) => (
                    <tr key={c.id} className="hover:bg-white transition-colors">
                      <td className="py-3.5 font-bold text-[#bb302a] font-mono text-sm sm:text-base">
                        Quầy {c.code}
                      </td>
                      <td className="py-3.5">
                        <div className="font-bold text-[#141413] text-sm sm:text-base">{c.assignedStaff.fullName}</div>
                        <div className="text-xs text-[#696969]">{c.assignedStaff.department}</div>
                      </td>
                      <td className="py-3.5 text-center font-mono font-bold text-[#141413] text-sm sm:text-base">
                        {c.todayServedCount}
                      </td>
                      <td className="py-3.5 text-center font-mono font-bold text-[#bb302a] text-sm sm:text-base">
                        {c.avgServeMinutes} phút
                      </td>
                      <td className="py-3.5 text-right">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-[#141413]/10 text-[#141413] font-bold shadow-sm text-xs sm:text-sm">
                          <span className="text-[#F79E1B]">★</span> {c.assignedStaff.ratingAverage}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Activity Audit Feed (5 cols - Stadium 40px) */}
          <div className="lg:col-span-5 p-7 bg-[#FCFBFA] rounded-[40px] border border-[#141413]/10 shadow-[0px_4px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div>
              <span className="eyebrow-label text-[#bb302a] block mb-1 text-xs sm:text-sm font-bold">
                • NHẬT KÝ THỜI GIAN THỰC
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#141413] mb-1">Sự kiện Hệ thống Gần nhất</h3>
              <p className="text-sm text-[#696969] mb-4">Nhật ký trực tiếp các giao dịch lấy số và gọi số</p>

              <div className="space-y-3">
                {recentTickets.map((t) => (
                  <div
                    key={t.id}
                    className="p-3.5 bg-[#F3F0EE] rounded-[20px] border border-[#141413]/5 flex items-center justify-between text-xs sm:text-sm"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#141413] text-sm sm:text-base">{t.ticketNumber}</span>
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
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
                      <span className="text-xs sm:text-sm text-[#696969] mt-1 block">{t.citizen.name} • {t.categoryName}</span>
                    </div>

                    <div className="text-right text-xs sm:text-sm text-[#696969] font-mono font-semibold">
                      {new Date(t.issuedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#141413]/10 text-center">
              <span className="text-xs sm:text-sm text-[#696969] font-medium">
                Tự động đồng bộ mỗi giây qua WebSocket & State Engine
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
