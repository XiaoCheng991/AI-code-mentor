"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function LogoutButton({ className, iconOnly }: { className?: string, iconOnly?: boolean }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      // 客户端清除 session
      await supabase.auth.signOut()
      
      // 调用服务端 API 清除 cookies
      await fetch('/auth/signout', {
        method: 'POST',
      })
      
      // 清除本地存储
      if (typeof window !== 'undefined') {
        localStorage.clear()
        sessionStorage.clear()
      }
      
      // 跳转到登录页
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      className={className || "w-full justify-start gap-2 rounded-2xl font-medium bg-white/80 dark:bg-gray-700/80 hover:bg-gray-100/80 dark:hover:bg-gray-600/80"}
      onClick={handleLogout}
      disabled={isLoading}
    >
      <LogOut className="h-4 w-4" />
      {!iconOnly && (isLoading ? "退出中..." : "退出登录")}
    </Button>
  )
}
