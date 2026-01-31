'use client';

import { ReactNode } from 'react';

interface LayoutWithFullWidthProps {
  children: ReactNode;
}

export default function ChatLayout({ children }: LayoutWithFullWidthProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Main content - fixed height for chat layout, below header */}
      <main className="pt-16 pl-0 pr-0 mr-0 transition-all duration-300">
        <div className="px-0 py-0 h-[calc(100vh-4rem)] overflow-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}