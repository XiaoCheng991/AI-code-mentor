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
  { name: "首页", href: "/", icon: Home },
  { name: "仪表盘", href: "/dashboard", icon: Sparkles },
  { name: "消息", href: "/chat", icon: MessageCircle },
  { name: "文件", href: "/drive", icon: FolderUp },
  { name: "设置", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setMounted(true);
    // 从localStorage恢复展开状态
    const savedExpanded = localStorage.getItem('sidebarExpanded');
    if (savedExpanded) {
      setIsExpanded(JSON.parse(savedExpanded));
    }
  }, []);

  // 保存展开状态到localStorage
  const handleMouseEnter = () => {
    setIsExpanded(true);
    localStorage.setItem('sidebarExpanded', JSON.stringify(true));
  };

  const handleMouseLeave = () => {
    setIsExpanded(false);
    localStorage.setItem('sidebarExpanded', JSON.stringify(false));
  };

  if (!mounted) {
    return null; // 防止SSR不匹配
  }

  return (
    <aside 
      className={`fixed top-24 left-8 w-16 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-lg shadow-gray-200/20 dark:shadow-gray-900/30 pt-4 pb-4 px-2 z-30 overflow-visible transition-[width] duration-300 ease-in-out ${
        isExpanded ? 'w-44' : 'w-16 hover:w-44'
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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
                  {/* 导航文字 - 收起时隐藏，展开时显示 */}
                  <span className={`text-sm ${isExpanded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 whitespace-nowrap font-medium absolute left-9`}>
                    {item.name}
                  </span>
                </Link>
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}