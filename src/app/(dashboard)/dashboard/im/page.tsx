import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { Users, MessageCircle, Search, Plus, Phone, Video, MoreVertical, Send } from "lucide-react"

export default async function IMPage() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Mock data for demonstration
  const friends = [
    { id: "friend-1", name: "Luna", status: "在线", lastSeen: "刚刚", unread: 2, avatar: "👩‍💼" },
    { id: "friend-2", name: "张三", status: "在线", lastSeen: "2分钟前", unread: 0, avatar: "👨‍💻" },
    { id: "friend-3", name: "李四", status: "离线", lastSeen: "今天 15:30", unread: 5, avatar: "🧑‍🎓" },
    { id: "friend-4", name: "王五", status: "忙碌", lastSeen: "刚刚", unread: 0, avatar: "👨‍🔬" },
    { id: "friend-5", name: "赵六", status: "在线", lastSeen: "1分钟前", unread: 1, avatar: "👩‍🎨" },
  ];

  const recentChats = [
    { id: "chat-1", name: "Luna", lastMessage: "晚上一起吃饭吗？", time: "18:30", unread: 2, avatar: "👩‍💼" },
    { id: "chat-2", name: "周末聚餐群", lastMessage: "Bob: 我可以带自制蛋糕", time: "17:45", unread: 0, avatar: "👥" },
    { id: "chat-3", name: "张三", lastMessage: "收到，谢谢！", time: "16:20", unread: 0, avatar: "👨‍💻" },
    { id: "chat-4", name: "工作闲聊群", lastMessage: "Alice: 会议推迟到明天", time: "昨天", unread: 3, avatar: "👥" },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            消息中心
          </h1>
          <p className="text-muted-foreground mt-1">
            与好友和群组的聊天记录
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            新建聊天
          </Button>
          <Button className="gap-2">
            <MessageCircle className="h-4 w-4" />
            开始聊天
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Friends List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>我的好友</CardTitle>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="搜索好友..."
                  className="pl-8 pr-4 py-2 w-full rounded-lg border bg-background text-sm"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {friends.map((friend) => (
                  <div 
                    key={friend.id} 
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors"
                  >
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">
                        {friend.avatar}
                      </div>
                      <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border border-background ${
                        friend.status === "在线" ? "bg-green-500" : 
                        friend.status === "忙碌" ? "bg-red-500" : "bg-gray-400"
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium truncate">{friend.name}</h4>
                        {friend.unread > 0 && (
                          <span className="ml-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {friend.unread}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {friend.status === "在线" ? "在线" : `最后在线: ${friend.lastSeen}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Chat History */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Chats */}
          <Card>
            <CardHeader>
              <CardTitle>最近聊天</CardTitle>
              <CardDescription>最近的消息记录</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentChats.map((chat) => (
                  <div 
                    key={chat.id} 
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-xl">
                      {chat.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{chat.name}</h4>
                        <span className="text-xs text-muted-foreground">{chat.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                    </div>
                    {chat.unread > 0 && (
                      <span className="bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {chat.unread}
                      </span>
                    )}
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>聊天操作</CardTitle>
              <CardDescription>快速发起聊天或创建群组</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/chat/new">
                  <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                    <MessageCircle className="h-6 w-6" />
                    <span>新建私聊</span>
                  </Button>
                </Link>
                <Link href="/chat/group">
                  <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                    <Users className="h-6 w-6" />
                    <span>创建群聊</span>
                  </Button>
                </Link>
                <Link href="/call">
                  <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                    <Phone className="h-6 w-6" />
                    <span>语音通话</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}