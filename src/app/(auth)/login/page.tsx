"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase/client"
import { Github, Mail, Lock, ArrowRight, Check } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(true)
  const [showConsentModal, setShowConsentModal] = useState(false)
  const [consentLoading, setConsentLoading] = useState(false)
  const router = useRouter()

  const permissions = [
    { name: "公开资料", description: "获取你的公开用户名、头像和邮箱", required: true },
    { name: "邮箱访问", description: "读取你的邮箱地址用于账号关联", required: true },
    { name: "无写入权限", description: "我们不会修改你的 GitHub 账户", required: false },
  ]

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace("/dashboard")
      } else {
        setLoading(false)
      }
    })
  }, [router])

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast({
          title: "登录失败",
          description: error.message,
          variant: "destructive",
        })
        return
      }

      toast({
        title: "登录成功",
        description: "欢迎回来！正在跳转...",
      })

      setTimeout(() => {
        window.location.href = "/dashboard"
      }, 500)

    } catch (error) {
      toast({
        title: "错误",
        description: "发生未知错误，请重试",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGithubLogin = () => {
    setShowConsentModal(true)
  }

  const handleConsentContinue = async () => {
    setConsentLoading(true)
    try {
      const response = await fetch("/auth/github-login")
      const data = await response.json()
      if (data.url) {
        window.open(
          data.url,
          '__blank',
        )
        setShowConsentModal(false)
      }
    } catch (error) {
      toast({
        title: "错误",
        description: "发生未知错误，请重试",
        variant: "destructive",
      })
    } finally {
      setConsentLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">检查登录状态中...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">欢迎回来</CardTitle>
          <CardDescription>登录你的账户，继续使用 NebulaHub</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full gap-2" onClick={handleGithubLogin} disabled={loading}>
            <Github className="h-4 w-4" />
            GitHub 账号登录
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">或者使用邮箱</span>
            </div>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">邮箱</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">密码</Label>
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  忘记密码？
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="输入你的密码"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full gap-2" disabled={loading}>
              {loading ? "登录中..." : "登录"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            还没有账户？{" "}
            <Link href="/register" className="text-primary hover:underline font-medium">
              立即注册
            </Link>
          </p>
        </CardFooter>
      </Card>

      <Dialog open={showConsentModal} onOpenChange={setShowConsentModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <Github className="h-5 w-5" />
                授权登录
              </DialogTitle>
            </div>
            <DialogDescription>
              使用 GitHub 账号登录 NebulaHub
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-3">
              {permissions.map((perm, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-gray-800">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${perm.required ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-white">
                      {perm.name}
                      {perm.required && <span className="ml-2 text-xs text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">必需</span>}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {perm.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowConsentModal(false)}>
                返回
              </Button>
              <Button className="flex-1 gap-2 bg-gray-800 hover:bg-gray-900" onClick={handleConsentContinue} disabled={consentLoading}>
                <Github className="h-4 w-4" />
                {consentLoading ? "跳转中..." : "继续"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
