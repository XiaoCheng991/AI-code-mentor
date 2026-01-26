import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, BookOpen, Code2, Trophy, ArrowRight, Github } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo_icon.svg" alt="NebulaHub Logo" style={{ height: 60, width: 'auto' }} />
            <span className="text-xl font-bold">NebulaHub</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              功能特点
            </Link>
            <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              如何使用
            </Link>
            <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              定价
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">登录</Button>
            </Link>
            <Link href="/register">
              <Button>开始学习</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            <span>基于 AI 的个性化编程学习</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            你的
            <span className="gradient-text"> NebulaHub 橙光 </span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            从零开始学习编程，AI 将根据你的水平和目标，定制个性化学习路径。
            互动式代码练习，即时反馈，让学习更高效。
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto gap-2">
                免费开始学习
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2">
                <Github className="h-4 w-4" />
                已有账号？登录
              </Button>
            </Link>
          </div>

            <p className="mt-4 text-sm text-muted-foreground">
              7 天免费试用，无需信用卡
            </p>
        </div>
      </section>

      {/* Features Section */}
          <section id="features" className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">为什么选择 NebulaHub 橙光？</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            我们结合了人工智能和教学最佳实践，为你提供最优质的编程学习体验
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="card-hover">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>AI 个性化定制</CardTitle>
              <CardDescription>
                根据你的水平和目标，AI 自动生成最适合你的学习路径
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-green-500" />
              </div>
              <CardTitle>系统化课程</CardTitle>
              <CardDescription>
                从基础到高级，覆盖 Python、JavaScript、React 等主流技术栈
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4">
                <Code2 className="h-6 w-6 text-purple-500" />
              </div>
              <CardTitle>实战练习</CardTitle>
              <CardDescription>
                边学边练，在线代码编辑器，实时运行和测试你的代码
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mb-4">
                <Trophy className="h-6 w-6 text-orange-500" />
              </div>
              <CardTitle>成就系统</CardTitle>
              <CardDescription>
                解锁成就、获取徽章，让学习过程充满乐趣和动力
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="bg-muted/50 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">三步开始学习</h2>
            <p className="text-muted-foreground">
              简单几步，开始你的编程学习之旅
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">设定学习目标</h3>
              <p className="text-muted-foreground">
                告诉我们你想学习的方向和目标，AI 将为你规划专属学习路径
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">跟随课程学习</h3>
              <p className="text-muted-foreground">
                观看视频课程、阅读教程，完成互动式练习，巩固所学知识
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">获得 AI 指导</h3>
              <p className="text-muted-foreground">
                随时向 AI 导师提问，获得即时解答和个性化建议
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24">
        <Card className="bg-primary text-primary-foreground border-0">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">准备好开始了吗？</h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              加入 thousands of 开发者，提升你的编程技能，开启新的职业机会
            </p>
            <Link href="/register">
              <Button size="lg" variant="secondary" className="gap-2">
                立即免费试用
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Code2 className="h-6 w-6 text-primary" />
              <span className="font-semibold">NebulaHub 橙光</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 NebulaHub 橙光. 保留所有权利。
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
