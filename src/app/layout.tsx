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
  title: 'Hệ thống Quản lý Xếp hàng & Lấy số Thông minh — Smart QMS (Hành chính công)',
  description:
    'Giao diện Hệ thống Lấy số và Điều phối Xếp hàng Thông minh chuẩn Hành chính công, lấy cảm hứng thiết kế tối giản, biên độ cong lớn, tone màu ấm Putty Cream và Đỏ Hành chính #bb302a.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#F3F0EE] text-[#141413] selection:bg-[#bb302a]/15 selection:text-[#bb302a]`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
