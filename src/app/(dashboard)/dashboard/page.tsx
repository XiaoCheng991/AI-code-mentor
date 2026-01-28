import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  Settings, 
  Sparkles, 
  BarChart3, 
  Activity,
  TrendingUp,
  Users,
  FileText
} from "lucide-react";

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Mock data for demonstration
  const stats = [
    { title: "总用户数", value: "1,234", change: "+12%", icon: Users },
    { title: "活跃会话", value: "56", change: "+5%", icon: Activity },
    { title: "消息总数", value: "2,458", change: "+18%", icon: MessageCircle },
    { title: "文件数量", value: "342", change: "+8%", icon: FileText },
  ];

  const recentActivity = [
    { id: 1, user: "Luna", action: "上传了新文件", time: "2分钟前" },
    { id: 2, user: "张三", action: "发送了新消息", time: "5分钟前" },
    { id: 3, user: "李四", action: "更新了资料", time: "10分钟前" },
    { id: 4, user: "王五", action: "加入了聊天", time: "15分钟前" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">仪表盘</h1>
        <p className="text-muted-foreground">
          欢迎回来，这里是您的控制中心
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <Badge variant="secondary" className="mt-2">
                    {stat.change} <TrendingUp className="ml-1 h-3 w-3" />
                  </Badge>
                </div>
                <div className="rounded-full bg-primary/10 p-3">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">最近活动</h3>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{activity.user}</p>
                    <p className="text-sm text-muted-foreground">{activity.action}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">快捷操作</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-1">
                <MessageCircle className="h-5 w-5" />
                <span className="text-xs">消息</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-1">
                <FileText className="h-5 w-5" />
                <span className="text-xs">文件</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-1">
                <Settings className="h-5 w-5" />
                <span className="text-xs">设置</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-1">
                <BarChart3 className="h-5 w-5" />
                <span className="text-xs">分析</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Welcome Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">欢迎来到 NebulaHub</h3>
              <p className="text-muted-foreground mt-1">
                您的应用程序仪表盘已准备就绪。从左侧导航栏访问各种功能。
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}