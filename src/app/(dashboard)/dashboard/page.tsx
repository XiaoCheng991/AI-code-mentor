
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import {Sparkles, BookOpen, Trophy, Clock, ArrowRight, Flame, Target, Brain, MessageCircle} from "lucide-react"

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Mock data for demonstration
  const stats = {
    learningHours: 12.5,
    completedLessons: 28,
    streakDays: 7,
    achievements: 5,
  }

  const recentCourses = [
    { id: "python-intro", title: "Python编程入门", progress: 75, nextLesson: "2.4 条件语句" },
    { id: "html-css", title: "HTML/CSS基础", progress: 45, nextLesson: "3.1 浮动与定位" },
  ]

  const aiRecommendations = [
    {
      title: "继续学习 Python",
      description: "你已经完成了75%的Python入门课程，继续加油！",
      icon: "🐍",
    },
    {
      title: "练习时间",
      description: "今天还没有做编程练习，来一道试试？",
      icon: "📝",
    },
    {
      title: "新技能解锁",
      description: "完成当前课程后，你将解锁「Python面向对象」技能",
      icon: "🎯",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            你好，{user?.email?.split("@")[0] || "学习者"}！👋
          </h1>
          <p className="text-muted-foreground mt-1">
            今天又是进步的一天，让我们开始学习吧！
          </p>
        </div>
        <Link href="/dashboard/learning">
          <Button className="gap-2">
            <Sparkles className="h-4 w-4" />
            生成学习路径
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">学习时长</p>
                <p className="text-3xl font-bold">{stats.learningHours}h</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">已完成课程</p>
                <p className="text-3xl font-bold">{stats.completedLessons}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">连续学习</p>
                <p className="text-3xl font-bold">{stats.streakDays}天</p>
              </div>
              <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center">
                <Flame className="h-6 w-6 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">获得成就</p>
                <p className="text-3xl font-bold">{stats.achievements}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                <Trophy className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Courses */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>最近学习</CardTitle>
                <CardDescription>继续你的学习进度</CardDescription>
              </div>
              <Link href="/dashboard/courses">
                <Button variant="ghost" size="sm" className="gap-1">
                  查看全部
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentCourses.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">
                    {course.id === "python-intro" ? "🐍" : "🎨"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold">{course.title}</h4>
                    <p className="text-sm text-muted-foreground">
下节课：{course.nextLesson}
                    </p>
                    <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium">{course.progress}%</span>
                  </div>
                  <Link href={`/dashboard/courses/${course.id}`}>
                    <Button size="sm" variant="outline">
                      继续
                    </Button>
                  </Link>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* AI Recommendations */}
        <div>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                <CardTitle>AI 建议</CardTitle>
              </div>
              <CardDescription>根据你的学习进度推荐</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {aiRecommendations.map((rec, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/10"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{rec.icon}</span>
                    <div>
                      <h4 className="font-semibold text-sm">{rec.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {rec.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <Link href="/dashboard/chat">
                <Button className="w-full gap-2" variant="outline">
                  <MessageCircle className="h-4 w-4" />
                  向AI导师提问
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>快捷操作</CardTitle>
          <CardDescription>快速开始你的学习</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/dashboard/learning">
              <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                <Target className="h-6 w-6" />
                <span>制定学习计划</span>
              </Button>
            </Link>
            <Link href="/dashboard/chat">
              <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                <MessageCircle className="h-6 w-6" />
                <span>AI 代码问答</span>
              </Button>
            </Link>
            <Link href="/dashboard/achievements">
              <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                <Trophy className="h-6 w-6" />
                <span>查看成就</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
