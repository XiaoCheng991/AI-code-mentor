import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: ' NebulaHub 橙光 - 即时通讯',
  description: '免登录的实时聊天工具',
};

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}
