"use client";
import React from 'react';
import Link from 'next/link';

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
    { label: '功能特点', href: '#features' },
    { label: '如何使用', href: '#how-it-works' },
    { label: '定价', href: '#pricing' },
  ],
  className = '',
}) => {
  const [src, setSrc] = React.useState<string>(logoPath);
  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (src !== '/public/logo_icon.svg') {
      img.src = '/public/logo_icon.svg';
      setSrc('/public/logo_icon.svg');
    }
  };
  return (
    <header className={`w-full sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b ${className}`} aria-label="站点头部">
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
      </div>
    </header>
  );
};

export default GlobalHeader;
