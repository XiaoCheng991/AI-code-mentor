'use client';

import { ReactNode } from 'react';

interface LayoutWithFullWidthProps {
  children: ReactNode;
}

export default function LayoutWithFullWidth({ children }: LayoutWithFullWidthProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Main content - full width, below header */}
      <main className="flex-1 pl-0 pr-0 mr-0 transition-all duration-300">
        <div className="container mx-auto px-6 py-6 pt-0 pr-0">
          {children}
        </div>
      </main>
    </div>
  );
}