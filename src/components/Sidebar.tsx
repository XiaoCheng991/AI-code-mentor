'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageCircle, Settings, Sparkles, FolderUp, Home } from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navigation: NavItem[] = [
  { name: "仪表盘", href: "/dashboard", icon: Sparkles },
  { name: "消息", href: "/chat", icon: MessageCircle },
  { name: "文件", href: "/drive", icon: FolderUp },
  { name: "设置", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mounted] = useState(true);

  if (!mounted) {
    return null; // 防止SSR不匹配
  }

  return (
    <aside 
      className="fixed top-24 left-8 w-16 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-lg shadow-gray-200/20 dark:shadow-gray-900/30 pt-4 pb-4 px-2 z-30 overflow-visible"

    >
      <div className="flex flex-col h-full">
        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            
            return (
              <div key={item.name} className="relative">
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 pl-3 pr-3 py-2.5 rounded-xl transition-colors duration-200 font-medium relative w-full ${
                    isActive 
                      ? 'bg-primary/20 text-primary' 
                      : 'text-muted-foreground hover:bg-gray-200/50 hover:text-foreground'
                  }`}
                >
                  {/* 图标 */}
                  <div className={`flex-shrink-0 transition-colors duration-200 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                    <item.icon className="h-5 w-5" />
                  </div>

                </Link>
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}