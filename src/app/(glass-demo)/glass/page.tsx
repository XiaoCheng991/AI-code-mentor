import { Button } from "@/components/ui/button";
import { Sparkles, BookOpen, Trophy, Clock, Flame, ArrowRight, MessageCircle, Settings } from "lucide-react";

export default function GlassDemoPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 动态渐变背景 */}
      <div className="fixed inset-0 -z-10">
        {/* 背景渐变层 */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800" />
        
        {/* 装饰性圆形模糊 */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-pink-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-indigo-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
        
        {/* 网格纹理 */}
        <div className="absolute inset-0 opacity-10" 
             style={{ 
               backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
               backgroundSize: '40px 40px'
             }} 
        />
      </div>

      {/* 顶部导航栏 - 液态玻璃效果 */}
      <header className="sticky top-4 z-50 mx-4 mt-4">
        <div className="glass-nav backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl px-6 py-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-lg">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">CodeWisdom</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-2">
            {['首页', '学习路径', 'AI对话', '成就', '设置'].map((item, index) => (
              <button 
                key={item}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  index === 0 
                    ? 'bg-white/20 text-white' 
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {item}
              </button>
            ))}
          </nav>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-medium shadow-lg">
              U
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* 欢迎区域 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            晚上好，开发者！👋
          </h1>
          <p className="text-white/70 text-lg">
            今天又是进步的一天，让我们开始学习吧
          </p>
        </div>

        {/* 统计卡片网格 - 液态玻璃效果 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { icon: Clock, label: '学习时长', value: '12.5h', color: 'from-blue-400 to-cyan-400', bg: 'bg-blue-500/20' },
            { icon: BookOpen, label: '已完成课程', value: '28', color: 'from-green-400 to-emerald-400', bg: 'bg-green-500/20' },
            { icon: Flame, label: '连续学习', value: '7天', color: 'from-orange-400 to-red-400', bg: 'bg-orange-500/20' },
            { icon: Trophy, label: '获得成就', value: '5', color: 'from-purple-400 to-pink-400', bg: 'bg-purple-500/20' },
          ].map((stat) => (
            <div 
              key={stat.label}
              className="glass-card backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-white/40 text-sm">总学习时长</span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-white/60 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* 双栏布局 */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* 主要内容区 - 2/3宽度 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 今日学习 */}
            <div className="glass-card backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">今日学习</h2>
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 border-0 text-white rounded-xl hover:opacity-90">
                  生成学习路径 <Sparkles className="ml-2 h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                {[
                  { title: 'Python条件语句', progress: 75, chapter: '第2章 第4节', color: 'from-blue-400 to-cyan-400' },
                  { title: 'HTML/CSS基础', progress: 45, chapter: '第3章 第1节', color: 'from-green-400 to-emerald-400' },
                  { title: 'JavaScript函数', progress: 30, chapter: '第4章 第2节', color: 'from-yellow-400 to-orange-400' },
                ].map((course, index) => (
                  <div 
                    key={course.title}
                    className="bg-white/5 hover:bg-white/10 rounded-2xl p-4 transition-all duration-300 cursor-pointer border border-white/10 hover:border-white/20"
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${course.color} flex items-center justify-center text-2xl`}>
                        {index === 0 ? '🐍' : index === 1 ? '🎨' : '⚡'}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-semibold">{course.title}</h3>
                        <p className="text-white/50 text-sm">{course.chapter}</p>
                      </div>
                      <span className="text-white/70 font-medium">{course.progress}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${course.color} rounded-full transition-all duration-500`}
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI推荐 */}
            <div className="glass-card backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">AI智能推荐</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { title: '继续学习 Python', desc: '你已经完成了75%的Python入门课程，继续加油！', icon: '🐍' },
                  { title: '练习时间', desc: '今天还没有做编程练习，来一道试试？', icon: '📝' },
                  { title: '新技能解锁', desc: '完成当前课程后，你将解锁「Python面向对象」技能', icon: '🎯' },
                  { title: '效率提示', desc: '建议每天学习30分钟，保持连续学习习惯', icon: '💡' },
                ].map((rec) => (
                  <div 
                    key={rec.title}
                    className="bg-white/5 hover:bg-white/10 rounded-2xl p-4 transition-all duration-300 cursor-pointer border border-white/10 hover:border-white/20 group"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{rec.icon}</span>
                      <div>
                        <h3 className="text-white font-semibold mb-1 group-hover:text-purple-300 transition-colors">{rec.title}</h3>
                        <p className="text-white/50 text-sm">{rec.desc}</p>
                      </div>
                    </div>
                </div>
                  ))}
              </div>
            </div>
          </div>

          {/* 侧边栏 - 1/3宽度 */}
          <div className="space-y-6">
            {/* 成就卡片 */}
            <div className="glass-card backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-white mb-4">最近成就</h2>
              <div className="space-y-3">
                {[
                  { title: 'Python入门', desc: '完成Python基础课程', icon: '🐍', color: 'from-blue-400 to-cyan-400' },
                  { title: '连续学习7天', desc: '保持7天不间断学习', icon: '🔥', color: 'from-orange-400 to-red-400' },
                  { title: '第一个程序', desc: '编写第一个Hello World', icon: '👋', color: 'from-green-400 to-emerald-400' },
                ].map((achievement) => (
                  <div 
                    key={achievement.title}
                    className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300"
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${achievement.color} flex items-center justify-center text-lg`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium text-sm">{achievement.title}</h4>
                      <p className="text-white/40 text-xs">{achievement.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-4 text-white/70 hover:text-white hover:bg-white/10 rounded-xl">
                查看全部成就 <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            {/* 快捷操作 */}
            <div className="glass-card backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-white mb-4">快捷操作</h2>
              <div className="space-y-2">
                {[
                  { icon: MessageCircle, label: 'AI导师对话', color: 'from-purple-400 to-pink-400' },
                  { icon: BookOpen, label: '继续学习', color: 'from-blue-400 to-cyan-400' },
                  { icon: Settings, label: '学习设置', color: 'from-green-400 to-emerald-400' },
                ].map((action) => (
                  <button 
                    key={action.label}
                    className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-300 border border-white/10 hover:border-white/20 group"
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform`}>
                      <action.icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-white/80 group-hover:text-white transition-colors">{action.label}</span>
                    <ArrowRight className="ml-auto h-4 w-4 text-white/40 group-hover:text-white/70 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 液态玻璃CSS样式 */}
      <style jsx global>{`
        /* 液态玻璃卡片 */
        .glass-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }
        
        /* 导航栏液态玻璃 */
        .glass-nav {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }
        
        /* 悬浮效果 */
        .glass-card:hover {
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 
            0 12px 40px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
}
