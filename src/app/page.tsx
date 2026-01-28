import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, FolderUp, Lock, Users, ArrowRight, Sparkles, Shield, Download, Image, Zap } from "lucide-react";

export default function Home() {
  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        {/* 背景装饰 */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 -left-40 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
          <div className="absolute top-1/3 -right-40 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl" />
        </div>

        {/* Hero Section */}
        <section className="relative container mx-auto px-4 py-32 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-xl border border-white/40 px-4 py-2 rounded-full text-sm font-medium mb-8 shadow-sm">
              <Sparkles className="h-4 w-4 text-blue-500" />
              <span className="text-slate-700 dark:text-slate-300">强子出品 · 朋友专属</span>
            </div>

            {/* 标题 */}
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              NebulaHub
            </span>
              <span className="block text-2xl md:text-3xl font-medium text-slate-600 dark:text-slate-400 mt-2">
              橙光
            </span>
            </h1>

            {/* Slogan */}
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-4 max-w-2xl mx-auto leading-relaxed">
              和朋友的
              <span className="font-semibold text-blue-600 dark:text-blue-400">私密空间</span>
            </p>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-12 max-w-xl mx-auto">
              摸鱼聊天，大文件无损传输。只属于我们的小天地，不留痕迹。
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Link href="/login">
                <Button size="lg" className="w-full sm:w-auto gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg shadow-blue-500/25 px-8">
                  <MessageCircle className="h-5 w-5" />
                  开始摸鱼
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* 隐私承诺 */}
            <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
              <Shield className="h-4 w-4" />
              <span>端到端加密 · 不留存记录 · 隐私至上</span>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-24">
          <div className="max-w-5xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-800 dark:text-white">
                为朋友而生的私密空间
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                拒绝窥探，只留我们之间的悄悄话
              </p>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1: 私密聊天 */}
              <Card className="glass border-0 shadow-xl shadow-blue-500/5 overflow-hidden group card-hover">
                <CardContent className="p-6 pb-16">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform flex-shrink-0">
                      <Lock className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold mb-2 text-slate-800 dark:text-white">
                        隐私至上，不留痕迹
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                        公司IM会留存记录？这里不会。所有的聊天只存在于我们之间，阅后即焚，自由摸鱼。
                      </p>
                    </div>
                  </div>
                </CardContent>
                <div className="absolute bottom-4 right-4">
                  <Link
                      href="/login"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-600 hover:bg-blue-500 hover:text-white transition-all text-xs font-medium"
                  >
                    开始私密聊天
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </Card>

              {/* Feature 2: 单聊群聊 */}
              <Card className="glass border-0 shadow-xl shadow-purple-500/5 overflow-hidden group card-hover">
                <CardContent className="p-6 pb-16">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform flex-shrink-0">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold mb-2 text-slate-800 dark:text-white">
                        单聊 & 群聊
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                        和兄弟私聊吹水，拉个群一起摸鱼。想聊就聊，想安静就安静。
                      </p>
                    </div>
                  </div>
                </CardContent>
                <div className="absolute bottom-4 right-4">
                  <Link
                      href="/login"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-600 hover:bg-purple-500 hover:text-white transition-all text-xs font-medium"
                  >
                    选择聊天对象
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </Card>

              {/* Feature 3: 大文件传输 */}
              <Card className="glass border-0 shadow-xl shadow-indigo-500/5 overflow-hidden group card-hover">
                <CardContent className="p-6 pb-16">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform flex-shrink-0">
                      <FolderUp className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold mb-2 text-slate-800 dark:text-white">
                        大文件，无损传输
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                        微信限制？被压缩？这里直接传原图原档，文件库随时下载。
                      </p>
                    </div>
                  </div>
                </CardContent>
                <div className="absolute bottom-4 right-4">
                  <Link
                      href="/drive"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500 hover:text-white transition-all text-xs font-medium"
                  >
                    前往文件库
                    <Download className="h-3 w-3" />
                  </Link>
                </div>
              </Card>

              {/* Feature 4: 原图分享 */}
              <Card className="glass border-0 shadow-xl shadow-rose-500/5 overflow-hidden group card-hover">
                <CardContent className="p-6 pb-16">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/20 group-hover:scale-105 transition-transform flex-shrink-0">
                      <Image className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold mb-2 text-slate-800 dark:text-white">
                        原图分享，不压缩
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                        发送照片零压缩，朋友圈看图再也不用凑合。每一帧都清晰。
                      </p>
                    </div>
                  </div>
                </CardContent>
                <div className="absolute bottom-4 right-4">
                  <Link
                      href="/login"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-600 hover:bg-rose-500 hover:text-white transition-all text-xs font-medium"
                  >
                    分享原图
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </Card>

              {/* Feature 5: 快速上手 */}
              <Card className="glass border-0 shadow-xl shadow-green-500/5 overflow-hidden group card-hover">
                <CardContent className="p-6 pb-16">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20 group-hover:scale-105 transition-transform flex-shrink-0">
                      <Zap className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold mb-2 text-slate-800 dark:text-white">
                        随时随地，快速上手
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                        免复杂注册，登录即用。无论是在公司摸鱼，还是在家吹水，打开就能聊。
                      </p>
                    </div>
                  </div>
                </CardContent>
                <div className="absolute bottom-4 right-4">
                  <Link
                      href="/login"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-500/10 text-green-600 hover:bg-green-500 hover:text-white transition-all text-xs font-medium"
                  >
                    立即体验
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </Card>

              {/* Feature 6: 专属我们的小天地 */}
              <Card className="glass border-0 shadow-xl shadow-orange-500/5 overflow-hidden group card-hover">
                <CardContent className="p-6 pb-16">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform flex-shrink-0">
                      <MessageCircle className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold mb-2 text-slate-800 dark:text-white">
                        专属我们的小天地
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                        几个朋友，一拍即合。这里没有监控，没有广告，只有我们。
                      </p>
                    </div>
                  </div>
                </CardContent>
                <div className="absolute bottom-4 right-4">
                  <Link
                      href="/login"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-orange-500/10 text-orange-600 hover:bg-orange-500 hover:text-white transition-all text-xs font-medium"
                  >
                    加入我们
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-200/50 dark:border-slate-800/50 py-12 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-center gap-2">
              <p className="text-sm text-slate-500">
                © 2025 NebulaHub 橙光 · 强子出品
              </p>
              <p className="text-xs text-slate-400">
                朋友之间，简简单单
              </p>
            </div>
          </div>
        </footer>
      </div>
  );
}
