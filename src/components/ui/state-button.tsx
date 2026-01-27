import React from 'react';
import Link from 'next/link';

type StateButtonProps = {
  href: string;
  label: string;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
};

const StateButton: React.FC<StateButtonProps> = ({ href, label, disabled, loading, className }) => {
  const content = loading ? '加载中…' : label;
  return (
    <Link href={href} className={`inline-flex items-center justify-center rounded-full px-4 py-2 glass text-sm font-semibold text-gray-800 hover:bg-white/80 transition-colors ${disabled || loading ? 'opacity-60 cursor-not-allowed' : ''} ${className ?? ''}`} aria-disabled={!!disabled}>
      {content}
    </Link>
  );
};

export default StateButton;
