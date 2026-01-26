import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import GlobalHeader from '@/components/branding/GlobalHeader';
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NebulaHub 橙光 - 你的实用朋友小站",
  description: "一个面向朋友之间的实用小站，帮助协作、分享与日常生活的快速入口",
  keywords: ["NebulaHub", "橙光", "实用站点", "朋友协作", "工具"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={inter.className}>
        <GlobalHeader />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
