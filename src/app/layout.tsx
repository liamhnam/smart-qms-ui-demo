import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import AppProviders from '@/components/providers/AppProviders';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'GoodM Smart QMS — Hệ thống Xếp hàng & Lấy số Thông minh (NextGen UI Demo)',
  description:
    'Bộ Demo UI/UX Thế hệ mới cho Hệ thống Lấy số và Điều phối xếp hàng thông minh (Kiosk, Màn hình TV 7:3, Bàn gọi số Cán bộ, Tablet Đánh giá, Bảng điện tử, Dashboard Điều hành).',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-slate-100`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
