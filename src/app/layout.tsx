import type { Metadata } from 'next';
import { Be_Vietnam_Pro, Roboto_Mono } from 'next/font/google';
import './globals.css';
import AppProviders from '@/components/providers/AppProviders';

const beVietnamPro = Be_Vietnam_Pro({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin', 'vietnamese'],
  variable: '--font-sans',
  display: 'swap',
});

const robotoMono = Roboto_Mono({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin', 'vietnamese'],
  variable: '--font-mono',
  display: 'swap',
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
      <body className={`${beVietnamPro.variable} ${robotoMono.variable} font-sans antialiased bg-[#F3F0EE] text-[#141413] selection:bg-[#bb302a]/15 selection:text-[#bb302a]`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
