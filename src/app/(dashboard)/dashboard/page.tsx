
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import {Sparkles, ArrowRight, Flame, Target, Brain, MessageCircle, Users, FolderUp, BarChart3, TrendingUp} from "lucide-react"

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 获取用户档案信息（包括显示名称）
  let userProfile = null;
  if (user) {
    const { data: profileData } = await supabase
      .from('user_profiles')
      .select('display_name, username')
      .eq('id', user.id)
      .single();
    
    userProfile = profileData;
  }

  // Mock data for demonstration
  const stats = {
    friendsCount: 12,
    sharedFiles: 42,
    chatMessages: 128,
    activeGroups: 3,
    onlineNow: 5,
    lastActive: "2分钟前"
  }

  const weeklyActivity = [
    { day: "周一", messages: 42 },
    { day: "周二", messages: 38 },
    { day: "周三", messages: 56 },
    { day: "周四", messages: 71 },
    { day: "周五", messages: 89 },
    { day: "周六", messages: 63 },
    { day: "周日", messages: 47 },
  ];

  const recentActivities = [
    { id: "group-1", title: "周末聚餐群", activity: "Luna 分享了一张美食照片", time: "2小时前" },
    { id: "friend-2", title: "张三", activity: "发送了一个有趣的视频", time: "5小时前" },
    { id: "group-3", title: "工作闲聊群", activity: "Bob 创建了一个投票", time: "昨天" },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            你好，{userProfile?.display_name || userProfile?.username || user?.email?.split("@")[0] || "朋友"}！👋
          </h1>
          <p className="text-muted-foreground mt-1">
            今天又是愉快的一天，和朋友们聊聊吧！
          </p>
        </div>
        <Link href="/dashboard/im">
          <Button className="gap-2">
            <MessageCircle className="h-4 w-4" />
            开始聊天
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">好友数</p>
                <p className="text-3xl font-bold">{stats.friendsCount}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">共享文件</p>
                <p className="text-3xl font-bold">{stats.sharedFiles}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                <FolderUp className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">聊天消息</p>
                <p className="text-3xl font-bold">{stats.chatMessages}</p>
              </div>
              <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">活跃群组</p>
                <p className="text-3xl font-bold">{stats.activeGroups}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>最近活动</CardTitle>
                <CardDescription>查看最新的动态</CardDescription>
              </div>
              <Link href="/dashboard/im">
                <Button variant="ghost" size="sm" className="gap-1">
                  查看全部
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">
                    {activity.id.includes("group") ? "👥" : "👤"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold">{activity.title}</h4>
                    <p className="text-sm text-muted-foreground">
{activity.activity}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
{activity.time}
                    </p>
                  </div>
                  <Link href={`/chat/${activity.id}`}>
                    <Button size="sm" variant="outline">
                      查看
                    </Button>
                  </Link>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Activity Chart */}
        <div>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <CardTitle>本周活动</CardTitle>
              </div>
              <CardDescription>聊天消息趋势统计</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyActivity.map((day, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{day.day}</span>
                      <span>{day.messages}</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-500" 
                        style={{ width: `${(day.messages / Math.max(...weeklyActivity.map(d => d.messages))) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">较上周增长 12.5%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>快捷操作</CardTitle>
          <CardDescription>快速访问常用功能</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/dashboard/im">
              <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                <MessageCircle className="h-6 w-6" />
                <span>开始聊天</span>
              </Button>
            </Link>
            <Link href="/dashboard/drive">
              <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                <FolderUp className="h-6 w-6" />
                <span>文件传输</span>
              </Button>
            </Link>
            <Link href="/dashboard/settings">
              <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                <Users className="h-6 w-6" />
                <span>好友管理</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
