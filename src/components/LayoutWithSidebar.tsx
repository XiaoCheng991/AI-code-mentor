'use client';

import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import { LogoutButton } from '@/components/auth/LogoutButton';

interface LayoutWithSidebarProps {
  children: ReactNode;
}

export default function LayoutWithSidebar({ children }: LayoutWithSidebarProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <Sidebar />
      
      {/* Logout Button - aligned with sidebar */}
      <div className="fixed bottom-4 left-8 z-40 transition-all duration-300">
        <LogoutButton className="p-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-lg shadow-gray-200/20 dark:shadow-gray-900/30 hover:scale-110 transition-transform duration-200" iconOnly />
      </div>

      {/* Main content */}
      <main className="pt-16 pl-24 pr-0 mr-0 transition-all duration-300">
        <div className="container mx-auto px-6 py-6 pt-0 pr-0">
          {children}
        </div>
      </main>
    </div>
  );
}