import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import GlobalHeader from '@/components/branding/GlobalHeader';
import { Toaster } from "@/components/ui/toaster";
import { createServerSupabaseClient } from '@/lib/supabase/server';
import ScrollTopOnMount from '@/components/ScrollTopOnMount';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NebulaHub 橙光 - 你的实用朋友小站",
  description: "一个面向朋友之间的实用小站，帮助协作、分享与日常生活的快速入口",
  keywords: ["NebulaHub", "橙光", "实用站点", "朋友协作", "工具"],
  icons: {
    icon: [
      { url: '/logo_icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/logo_icon.svg',
    shortcut: '/logo_icon.svg',
  },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // 在服务端获取用户信息，传给 GlobalHeader
  let initialUser: {
    email: string;
    displayName: string;
    avatarUrl: string;
  } | null = null;
  
  try {
    const supabase = createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // 获取 user_profiles 中的头像和显示名
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('avatar_url, display_name, username')
        .eq('id', user.id)
        .single();
      
      initialUser = {
        email: user.email || '',
        displayName: profile?.display_name || profile?.username || user.email?.split('@')[0] || '',
        avatarUrl: profile?.avatar_url || '',
      };
    }
  } catch (error) {
    // 忽略错误，使用 null 作为默认值
    console.error('Error fetching user in layout:', error);
  }
  
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`${inter.className} scroll-smooth`}>
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 overflow-hidden">
          <GlobalHeader initialUser={initialUser} />
          <main className="flex-1 w-full overflow-y-auto pt-4">
            {children}
          </main>
        </div>
        <ScrollTopOnMount />
        <Toaster />
      </body>
    </html>
  );
}
