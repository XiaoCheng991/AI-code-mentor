"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase/client"
import { Code2, Github, Mail, Lock, User, ArrowRight, Check } from "lucide-react"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // 两种注册方法
  // 1. 邮箱注册
  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast({
        title: "密码不匹配",
        description: "两次输入的密码不一致，请检查",
        variant: "destructive",
      })
      return
    }

    if (password.length < 6) {
      toast({
        title: "密码太短",
        description: "密码至少需要6个字符",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      console.log("开始调研Supabase注册")
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name || email.split("@")[0],
          },
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      })

      console.log("注册出错", error)

      if (error) {
        toast({
          title: "注册失败",
          description: error.message,
          variant: "destructive",
        })
        return
      }

      toast({
        title: "注册成功",
        description: "请检查你的邮箱，点击验证链接完成注册",
      })

      router.push("/login")
      router.refresh()
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

  // 2. GitHub注册
  const handleGithubRegister = async () => {
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${location.origin}/auth/callback`,
        },
      })

      if (error) {
        toast({
          title: "注册失败",
          description: error.message,
          variant: "destructive",
        })
      }
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

  // 3. 密码校验
  const passwordRequirements = [
    { met: password.length >= 6, text: "至少6个字符" },
    { met: password === confirmPassword && password.length > 0, text: "两次密码一致" },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Link href="/" className="flex items-center gap-2">
              <Code2 className="h-10 w-10 text-primary" />
              <span className="text-2xl font-bold">NebulaHub 橙光</span>
            </Link>
          </div>
          <CardTitle className="text-2xl">创建账户</CardTitle>
          <CardDescription>开始你的编程学习之旅</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={handleGithubRegister}
            disabled={loading}
          >
            <Github className="h-4 w-4" />
            GitHub 账号注册
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">或者使用邮箱</span>
            </div>
          </div>

          <form onSubmit={handleEmailRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">昵称</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="给自己起个名字"
                  className="pl-10"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

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
              <Label htmlFor="password">密码</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
id="password"
                  type="password"
                  placeholder="设置密码"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">确认密码</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="再次输入密码"
                  className="pl-10"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {password.length > 0 && (
              <div className="space-y-2">
                {passwordRequirements.map((req, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <Check
                      className={`h-4 w-4 ${
                        req.met ? "text-green-500" : "text-muted-foreground"
                      }`}
                    />
                    <span className={req.met ? "text-green-500" : "text-muted-foreground"}>
                      {req.text}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <Button type="submit" className="w-full gap-2" disabled={loading}>
              {loading ? "注册中..." : "创建账户"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            已有账号？{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              立即登录
            </Link>
          </p>
          <p className="text-xs text-muted-foreground text-center">
            注册即表示同意{" "}
            <Link href="/terms" className="text-primary hover:underline">
              服务条款
            </Link>{" "}
            和{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              隐私政策
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
