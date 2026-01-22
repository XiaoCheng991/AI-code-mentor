import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI编程导师 - 你的智能编程学习伙伴",
  description: "基于AI的个性化编程学习平台，从零开始学习编程，掌握实用技能",
  keywords: ["编程学习", "AI导师", "编程教程", "Python学习", "JavaScript学习"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
