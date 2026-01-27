"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, RefreshCw, Home, ArrowLeft } from "lucide-react"

const errorMessages: Record<string, string> = {
  auth_callback_error: "认证回调失败，请稍后重试",
  oauth_error: "GitHub 授权失败，请稍后重试",
  no_code: "未收到授权码，请稍后重试",
  session_creation_failed: "会话创建失败，请稍后重试",
  access_denied: "你取消了 GitHub 授权",
  default: "认证过程中出现错误，请稍后重试",
}

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error") || "default"
  const errorDescription = searchParams.get("error_description")

  const errorMessage = errorMessages[error] || errorMessages.default
  const showDetails = !!errorDescription

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-md glass border-0 shadow-2xl shadow-red-500/10">
        <CardHeader className="text-center pb-2">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-2xl text-red-700 dark:text-red-400">
            授权失败
          </CardTitle>
          <CardDescription className="text-base">
            {errorMessage}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* 错误详情 */}
          {showDetails && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-700 dark:text-red-300 font-medium">
                错误详情：
              </p>
              <p className="text-xs text-red-600 dark:text-red-400 mt-1 break-all">
                {errorDescription || error}
              </p>
            </div>
          )}

          {/* 提示信息 */}
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              常见原因：
            </p>
            <ul className="text-xs text-blue-600 dark:text-blue-400 mt-2 space-y-1 list-disc list-inside">
              <li>网络连接不稳定</li>
              <li>GitHub 授权被取消</li>
              <li>会话已过期，请重试</li>
            </ul>
          </div>

          {/* 操作按钮 */}
          <div className="space-y-3">
            <Button
              onClick={() => window.location.href = "/oauth/consent"}
              className="w-full gap-2 rounded-xl py-6 bg-gray-800 hover:bg-gray-900 text-white"
            >
              <RefreshCw className="h-5 w-5" />
              重新授权
            </Button>

            <Link href="/" className="block">
              <Button variant="outline" className="w-full gap-2 rounded-xl py-6">
                <Home className="h-4 w-4" />
                返回首页
              </Button>
            </Link>

            <Link href="/login" className="block">
              <Button variant="ghost" className="w-full gap-2 rounded-xl py-6">
                <ArrowLeft className="h-4 w-4" />
                返回登录页
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
