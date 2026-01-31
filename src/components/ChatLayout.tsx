'use client';

import { ReactNode } from 'react';

interface LayoutWithFullWidthProps {
  children: ReactNode;
}

export default function ChatLayout({ children }: LayoutWithFullWidthProps) {
  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <div className="h-full overflow-auto">
        {children}
      </div>
    </div>
  );
}