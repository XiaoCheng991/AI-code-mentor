import { redirect } from "next/navigation"
import Link from "next/link"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import {MessageCircle, Settings, Sparkles, FolderUp, Home} from "lucide-react"
import { LogoutButton } from "@/components/auth/LogoutButton"
import { headers } from "next/headers"
import { cache } from "react"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // 获取用户档案信息（包括头像）
  const { data: userProfile } = await supabase
    .from('user_profiles')
    .select('avatar_url, display_name, username')
    .eq('id', user.id)
    .single()

  // 创建缓存的头部读取函数
  const getCachedHeaders = cache(() => {
    const heads = headers();
    return {
      url: heads.get('x-url'),
    };
  });
  
  const { url } = getCachedHeaders();
  const currentPath = url ? new URL(url).pathname : '';
  
  const navigation = [
    { name: "首页", href: "/", icon: Home },
    { name: "仪表盘", href: "/dashboard", icon: Sparkles },
    { name: "消息", href: "/dashboard/chat", icon: MessageCircle },
    { name: "文件", href: "/dashboard/drive", icon: FolderUp },
    { name: "设置", href: "/dashboard/settings", icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Sidebar */}
      <aside className="fixed top-24 left-8 w-16 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-lg shadow-gray-200/20 dark:shadow-gray-900/30 pt-4 pb-4 px-2 group hover:w-44 transition-all duration-300 ease-in-out z-30">
        <div className="flex flex-col h-full">
          {/* Navigation */}
          <nav className="flex-1 space-y-1">
            {navigation.map((item) => {
              const isActive = currentPath === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl transition-all duration-300 font-medium relative overflow-hidden ${
                    isActive 
                      ? 'text-foreground bg-primary/10 hover:bg-primary/10' 
                      : 'text-muted-foreground hover:bg-gray-200/50 hover:text-foreground'
                  }`}
                >
                  <div className="relative w-5 h-5 flex-shrink-0 flex items-center justify-center">
                    <item.icon className="h-5 w-5 absolute left-1/2 -translate-x-1/2 transition-transform duration-200 group-hover:scale-110" />
                  </div>
                  <span className="text-sm absolute left-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-32 truncate font-medium origin-left">
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
      
      {/* Logout Button - aligned with sidebar */}
      <div className="fixed bottom-4 left-8 z-50 group-hover:left-[12rem] transition-all duration-300">
        <LogoutButton className="p-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-lg shadow-gray-200/20 dark:shadow-gray-900/30 hover:scale-110 transition-transform duration-200" iconOnly />
      </div>

      {/* Main content */}
      <main className="pt-8 pl-24 transition-all duration-300">
        <div className="container mx-auto px-6 py-6">
          {children}
        </div>
      </main>
    </div>
  )
}
