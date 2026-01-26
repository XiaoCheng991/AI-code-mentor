"use client";
import React from 'react';
import LogoHeader from '@/components/branding/LogoHeader';

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header style={{ padding: '12px 20px', borderBottom: '1px solid #eee' }}>
        <LogoHeader />
      </header>
      <main>{children}</main>
    </div>
  );
}
