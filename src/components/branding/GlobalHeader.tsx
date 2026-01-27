"use client";
import React from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';

type GlobalHeaderProps = {
  className?: string;
};

const GlobalHeader: React.FC<GlobalHeaderProps> = ({
  className = '',
}) => {
  const [src, setSrc] = React.useState<string>('/logo_icon.svg');
  const [user, setUser] = React.useState<{ email?: string; displayName?: string } | null>(null);

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
          setUser({ email, displayName });
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    };
    fetchUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchUser();
    });
    return () => {
      subscription?.unsubscribe?.();
    };
  }, []);

  return (
    <header className={`w-full sticky top-0 z-50 glass border-b border-white/40 ${className}`} aria-label="站点头部">
      <div className="container mx-auto px-4 py-2.5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 -my-0.5">
          <img src={src} alt="NebulaHub Logo" style={{ height: 42, width: 'auto' }} onError={handleError} />
          <div className="flex flex-col w-[130px]">
            <span className="text-[17px] font-bold text-slate-800 dark:text-white tracking-wide text-left">
              Nebula<span className="font-bold text-slate-500 dark:text-slate-400">Hub</span>
            </span>
            <span className="text-[10.5px] font-bold text-orange-500 uppercase tracking-widest leading-none mt-0.5 text-left">
              <span className="font-normal text-slate-500 tracking-wide">Nova Pro</span>
              <span className="mx-1.5 text-slate-400">|</span>
              橙光
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
                {user.displayName?.charAt(0).toUpperCase() ?? (user.email?.[0] ?? '')}
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 hidden sm:block">
                {user.displayName || (user.email?.split('@')[0] ?? '')}
              </span>
              <button
                onClick={async () => {
                  await (supabase as any).auth.signOut();
                  setUser(null);
                  window.location.reload();
                }}
                className="px-4 py-1.5 rounded-xl text-sm font-medium bg-white/50 dark:bg-gray-800/50 hover:bg-white/80 dark:hover:bg-gray-700/80 border border-white/40 dark:border-gray-600/40 transition-all text-slate-700 dark:text-slate-300"
              >
                退出
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="px-5 py-2 rounded-xl text-sm font-medium bg-white/50 dark:bg-gray-800/50 hover:bg-white/80 dark:hover:bg-gray-700/80 border border-white/40 dark:border-gray-600/40 transition-all shadow-sm text-slate-700 dark:text-slate-300"
              >
                登录
              </Link>
              <Link
                href="/register"
                className="px-5 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg shadow-blue-500/20 transition-all"
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
