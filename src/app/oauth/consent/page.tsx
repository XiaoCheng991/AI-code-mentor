import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, ArrowLeft, Check, Shield } from "lucide-react";

export default function OAuthConsentPage() {
  const permissions = [
    { name: "公开资料", description: "获取你的公开用户名、头像和邮箱", required: true },
    { name: "邮箱访问", description: "读取你的邮箱地址用于账号关联", required: true },
    { name: "无写入权限", description: "我们不会修改你的 GitHub 账户", required: false },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-4">
      {/* 背景装饰 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-md glass border-0 shadow-2xl shadow-blue-500/10">
        <CardHeader className="text-center pb-2">
          <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Github className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl">授权登录</CardTitle>
          <CardDescription className="text-base">
            使用 GitHub 账号登录 NebulaHub
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* 权限列表 */}
          <div className="space-y-4">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              以下是 NebulaHub 将会请求的权限：
            </p>
            <div className="space-y-3">
              {permissions.map((perm, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-white/50 dark:bg-gray-800/50">
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
          </div>

          {/* 隐私说明 */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
            <Shield className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                隐私说明
              </p>
              <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                我们仅获取登录所需的最小权限，不会发布任何内容到你的 GitHub 账户。
              </p>
            </div>
          </div>

          {/* 按钮组 */}
          <div className="space-y-3">
            <Link href="/auth/github-login" className="block">
              <Button className="w-full gap-2 rounded-xl bg-gray-800 hover:bg-gray-900 text-white py-6">
                <Github className="h-5 w-5" />
                继续使用 GitHub 登录
              </Button>
            </Link>

            <Link href="/login" className="block">
              <Button variant="outline" className="w-full gap-2 rounded-xl py-6">
                <ArrowLeft className="h-4 w-4" />
                返回登录
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
