import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, ArrowRight, Github } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* 顶部导航统一由全局 GlobalHeader 处理 */}

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            <span>基于 XiaoCheng 的WebSite Test</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            你的
            <span className="gradient-text"> NebulaHub 橙光 </span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            强子的个人Idea空间，DO WHAT U WANT TO DO。
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto gap-2">
                TALK TO ME
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
              共享大文件，无损传输
            </p>
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
          <div className="flex flex-col md:flex-row items-center justify-center">
            <p className="text-sm text-muted-foreground">
              © 2025 NebulaHub 橙光. 保留所有权利。
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
