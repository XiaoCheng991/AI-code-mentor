"use client";
import React from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import StateButton from '../ui/state-button';
 

type NavItem = {
  label: string;
  href: string;
};

type GlobalHeaderProps = {
  brand?: string;
  logoPath?: string;
  nav?: NavItem[];
  className?: string;
};

// A reusable site-wide header with a logo + brand and optional navigation
const GlobalHeader: React.FC<GlobalHeaderProps> = ({
  brand = 'NebulaHub 橙光',
  logoPath = '/logo_icon.svg',
  nav = [
    { label: '文档', href: '#features' },
    { label: '会话', href: '#how-it-works' },
  ],
  className = '',
}) => {
  const [src, setSrc] = React.useState<string>(logoPath);
  const [user, setUser] = React.useState<{ email?: string; displayName?: string } | null>(null);
  // no dropdown state: standalone actions for login/register and account actions
  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (src !== '/public/logo_icon.svg') {
      img.src = '/public/logo_icon.svg';
      setSrc('/public/logo_icon.svg');
    }
  };

  // Fetch current user and subscribe to auth changes for live updates
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

  // No dropdowns; actions are always visible
  return (
    <header className={`w-full sticky top-0 z-50 glass border-b border-white/40 ${className}`} aria-label="站点头部">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src={src} alt="NebulaHub Logo" style={{ height: 40, width: 'auto' }} onError={handleError} />
            <span className="text-xl font-bold">{brand}</span>
          </Link>
        <nav className="hidden md:flex items-center gap-6" aria-label="主导航">
          {nav.map((n) => (
            <Link key={n.label} href={n.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="relative flex items-center">
          {user ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs text-primary">
                {user.displayName?.charAt(0).toUpperCase() ?? (user.email?.[0] ?? '')}
              </div>
              <span className="text-sm font-medium">{user.displayName || (user.email?.split('@')[0] ?? '')}</span>
              <button
                onClick={async () => {
                  await (supabase as any).auth.signOut();
                  setUser(null);
                  window.location.reload();
                }}
                className="ml-2 px-3 py-2 rounded-md glass border border-white/40 text-sm text-gray-800 hover:bg-white/80"
              >
                退出登录
              </button>
            </div>
          ) : (
            <>
              <StateButton href="/register" label="注册" />
              <StateButton href="/login" label="登录" className="ml-2" />
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default GlobalHeader;
