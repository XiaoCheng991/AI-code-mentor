"use client";
import React from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { UserAvatar } from '@/components/ui/user-avatar';
import { MessageCircle, Settings, Sparkles, FolderUp } from 'lucide-react';

type GlobalHeaderProps = {
  className?: string;
  initialUser?: {
    email?: string;
    displayName?: string;
    avatarUrl?: string;
  } | null;
};

const GlobalHeader: React.FC<GlobalHeaderProps> = ({
  className = '',
  initialUser = null,
}) => {
  const [src, setSrc] = React.useState<string>('/logo_icon.svg');
  const [user, setUser] = React.useState<{ email?: string; displayName?: string; avatarUrl?: string } | null>(initialUser);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (src !== '/public/logo_icon.svg') {
      img.src = '/public/logo_icon.svg';
      setSrc('/public/logo_icon.svg');
    }
  };

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        const u = data?.user;
        if (u && (u as any).email) {
          const email: string | undefined = (u as any).email;
          const displayName = email?.split('@')[0] ?? (u as any).user_metadata?.full_name ?? '';
          
          // 获取 user_profiles 中的头像
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('avatar_url, display_name, username')
            .eq('id', u.id)
            .single();
          
          setUser({ 
            email, 
            displayName: profile?.display_name || profile?.username || displayName,
            avatarUrl: profile?.avatar_url 
          });
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    };
    
    // 如果没有初始用户数据，才去获取
    if (!initialUser) {
      fetchUser();
    }
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
      } else {
        fetchUser();
      }
    });
    
    return () => {
      subscription?.unsubscribe?.();
    };
  }, [initialUser]);

  return (
    <header className={`w-full sticky top-0 z-50 bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm ${className}`} aria-label="站点头部">
      <div className="container mx-auto px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <img src={src} alt="NebulaHub Logo" style={{ height: 40, width: 'auto' }} onError={handleError} className="rounded-xl" />
          <div className="flex flex-col">
            <span className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">
              Nebula<span className="font-semibold text-slate-500 dark:text-slate-400">Hub</span>
            </span>
            <span className="text-[11px] font-medium text-orange-500 tracking-wide leading-tight">
              <span className="text-slate-500">Nova Pro</span>
              <span className="mx-1.5 text-slate-400">|</span>
              橙光
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center space-x-1 mx-auto">
          <Link 
            href="/dashboard" 
            className="flex items-center gap-2 p-2 rounded-lg transition-colors duration-200 hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
          >
            <Sparkles className="h-5 w-5" />
            <span className="text-sm font-medium hidden sm:block">仪表盘</span>
          </Link>
          <Link 
            href="/chat" 
            className="flex items-center gap-2 p-2 rounded-lg transition-colors duration-200 hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
          >
            <MessageCircle className="h-5 w-5" />
            <span className="text-sm font-medium hidden sm:block">消息</span>
          </Link>
          <Link 
            href="/drive" 
            className="flex items-center gap-2 p-2 rounded-lg transition-colors duration-200 hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
          >
            <FolderUp className="h-5 w-5" />
            <span className="text-sm font-medium hidden sm:block">文件</span>
          </Link>
          <Link 
            href="/settings" 
            className="flex items-center gap-2 p-2 rounded-lg transition-colors duration-200 hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
          >
            <Settings className="h-5 w-5" />
            <span className="text-sm font-medium hidden sm:block">设置</span>
          </Link>
        </nav>
        
        <div className="flex items-center gap-2">
          {user ? (
            <Link href="/dashboard/settings" className="flex items-center gap-2.5 p-2 rounded-xl bg-transparent hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-all duration-200">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 hidden sm:block">
                Hi {user.displayName || (user.email?.split('@')[0] ?? '')}!
              </span>
              <UserAvatar
                avatarUrl={user.avatarUrl}
                displayName={user.displayName}
                email={user.email}
                size="sm"
              />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 rounded-xl text-sm font-medium bg-gray-100/60 dark:bg-gray-800/60 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 border border-gray-300/50 dark:border-gray-600/50 transition-all text-slate-700 dark:text-slate-300"
              >
                登录
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white transition-all shadow-md shadow-blue-500/20"
              >
                注册
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default GlobalHeader;
