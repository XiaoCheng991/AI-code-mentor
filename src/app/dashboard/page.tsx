
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import LayoutWithFullWidth from "@/components/LayoutWithFullWidth";
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
    <LayoutWithFullWidth>
      <div className="space-y-4">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-800">仪表盘</h1>
            <p className="text-slate-500 mt-1">
              欢迎回来，这里是您的控制中心
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-sm text-slate-600 font-medium">系统运行正常</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 group">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold mt-1 text-slate-800">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingUp className="h-3 w-3 text-green-500" />
                      <span className="text-xs font-medium text-green-600">{stat.change}</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl ${
                    index === 0 ? 'bg-blue-500/10' :
                    index === 1 ? 'bg-green-500/10' :
                    index === 2 ? 'bg-purple-500/10' :
                    'bg-amber-500/10'
                  } group-hover:scale-110 transition-transform`}>
                    <stat.icon className={`h-5 w-5 ${
                      index === 0 ? 'text-blue-500' :
                      index === 1 ? 'text-green-500' :
                      index === 2 ? 'text-purple-500' :
                      'text-amber-500'
                    }`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Recent Activity */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-800">最近活动</h3>
                <span className="text-xs px-2 py-1 bg-slate-100 rounded-full text-slate-500">实时</span>
              </div>
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">{activity.user.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-700">{activity.user}</p>
                      <p className="text-sm text-slate-400">{activity.action}</p>
                    </div>
                    <span className="text-xs text-slate-400">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-slate-800">快捷操作</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-20 flex-col items-center justify-center gap-2 hover:bg-blue-50 hover:border-blue-200 transition-all group">
                  <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                    <MessageCircle className="h-5 w-5 text-blue-500 group-hover:text-white" />
                  </div>
                  <span className="text-sm font-medium text-slate-600">消息</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col items-center justify-center gap-2 hover:bg-green-50 hover:border-green-200 transition-all group">
                  <div className="p-2 rounded-lg bg-green-500/10 group-hover:bg-green-500 group-hover:text-white transition-colors">
                    <FileText className="h-5 w-5 text-green-500 group-hover:text-white" />
                  </div>
                  <span className="text-sm font-medium text-slate-600">文件</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col items-center justify-center gap-2 hover:bg-purple-50 hover:border-purple-200 transition-all group">
                  <div className="p-2 rounded-lg bg-purple-500/10 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                    <Settings className="h-5 w-5 text-purple-500 group-hover:text-white" />
                  </div>
                  <span className="text-sm font-medium text-slate-600">设置</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col items-center justify-center gap-2 hover:bg-amber-50 hover:border-amber-200 transition-all group">
                  <div className="p-2 rounded-lg bg-amber-500/10 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                    <BarChart3 className="h-5 w-5 text-amber-500 group-hover:text-white" />
                  </div>
                  <span className="text-sm font-medium text-slate-600">分析</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Welcome Section */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20">
                <Sparkles className="h-6 w-6 text-amber-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-800">欢迎来到 NebulaHub</h3>
                <p className="text-slate-500 mt-1">
                  您的应用程序仪表盘已准备就绪。从左侧导航栏访问各种功能，开启您的私密交流之旅。
                </p>
              </div>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg shadow-blue-500/25">
                开始探索
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </LayoutWithFullWidth>
  );
}
