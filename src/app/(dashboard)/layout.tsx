import { redirect } from "next/navigation"
import Link from "next/link"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { Code2, Home, BookOpen, MessageCircle, Trophy, Settings, Sparkles, ChevronRight } from "lucide-react"
import { LogoutButton } from "@/components/auth/LogoutButton"
import { UserAvatar } from "@/components/ui/user-avatar"

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

  const navigation = [
    { name: "首页", href: "/dashboard", icon: Home },
    { name: "学习路径", href: "/dashboard/learning", icon: BookOpen },
    { name: "AI对话", href: "/dashboard/chat", icon: MessageCircle },
    { name: "成就", href: "/dashboard/achievements", icon: Trophy },
    { name: "设置", href: "/dashboard/settings", icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-r pt-16">
        <div className="flex flex-col h-full">
          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 pt-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200"
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* User */}
          <div className="p-4 border-t">
            <Link href="/dashboard/settings" className="block mb-4">
              <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-primary/5 transition-colors">
                <UserAvatar
                  avatarUrl={userProfile?.avatar_url}
                  displayName={userProfile?.display_name}
                  email={user.email}
                  size="md"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {userProfile?.display_name || userProfile?.username || user.email?.split("@")[0]}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            </Link>
            <LogoutButton />
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="pl-64">
        <div className="container mx-auto px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
