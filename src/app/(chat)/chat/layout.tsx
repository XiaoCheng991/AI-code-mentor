import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '即时通讯 | AI编程导师',
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
