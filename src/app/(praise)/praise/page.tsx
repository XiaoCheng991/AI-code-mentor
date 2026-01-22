"use client";

import { Sparkles, Heart, Star, Crown, Smile, Sun, Moon, Flower, Music, Rainbow } from "lucide-react";
import { friendConfig } from "./config";

// 夸赞词汇库
const praiseEmojis = ["💖", "🌟", "💫", "⭐", "🌸", "💝", "🎀", "🦄", "🌺", "🎨"];

export default function PraisePage() {
  const { name, message, praiseWords, themeColor, signature } = friendConfig;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 动态渐变背景 */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-300 via-rose-300 to-purple-400" />
        
        {/* 漂浮的爱心和星星 */}
        <FloatingElements />
      </div>

      {/* 主要内容 */}
      <main className="container mx-auto px-4 py-12 relative z-10">
        {/* 标题区域 */}
        <div className="text-center mb-12">
          {/* 皇冠图标 */}
          <div className="inline-block mb-4 animate-bounce">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center shadow-lg">
              <Crown className="w-10 h-10 text-white" />
            </div>
          </div>
          
          {/* 大标题 */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg animate-pulse">
            给{name}的一封信 💌
          </h1>
          
          {/* 装饰线 */}
          <div className="flex items-center justify-center gap-4 my-6">
            <div className="h-1 w-16 bg-white/50 rounded" />
            <Sparkles className="w-6 h-6 text-white animate-spin" style={{ animationDuration: '3s' }} />
            <div className="h-1 w-16 bg-white/50 rounded" />
          </div>
        </div>

        {/* 主要卡片 */}
        <div className="max-w-4xl mx-auto">
          <div className="glass-card backdrop-blur-xl bg-white/20 border-2 border-white/40 rounded-3xl p-8 md:p-12 shadow-2xl">
            {/* 顶部装饰 */}
            <div className="text-center mb-8">
              <span className="text-6xl">👑</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-4 drop-shadow-md">
                致最可爱的{name} 🌸
              </h2>
            </div>

            {/* 消息内容 */}
            <div className="bg-white/30 rounded-2xl p-6 md:p-8 mb-8">
              <p className="text-xl md:text-2xl text-white leading-relaxed whitespace-pre-line text-center font-medium drop-shadow-sm">
                {message}
              </p>
            </div>

            {/* 夸赞词汇标签 */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {praiseWords.map((word, index) => (
                <span
                  key={word}
                  className="px-4 py-2 bg-white/30 backdrop-blur-sm rounded-full text-white font-medium shadow-md hover:bg-white/40 transition-all duration-300 hover:scale-110 cursor-default"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {word} ✨
                </span>
              ))}
            </div>

            {/* 装饰性分隔线 */}
            <div className="flex items-center justify-center gap-2 mb-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <Heart
                  key={i}
                  className="w-6 h-6 text-pink-600 animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s`, fill: "currentColor" }}
                />
              ))}
            </div>

            {/* 底部签名 */}
            <div className="text-center">
              <p className="text-lg md:text-xl text-white/90 font-medium drop-shadow-md">
                {signature}
              </p>
              <p className="text-white/70 mt-2 text-sm">
                来自一颗真诚的心 💝
              </p>
            </div>
          </div>
        </div>

        {/* 底部装饰 */}
        <div className="text-center mt-12">
          <p className="text-white/80 text-lg">
            希望这个页面能让你开心一整天！ 🎉
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <Heart className="w-8 h-8 text-pink-600 animate-bounce" fill="currentColor" />
            <Star className="w-8 h-8 text-yellow-500 animate-bounce" style={{ animationDelay: '0.1s' }} />
            <Smile className="w-8 h-8 text-orange-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
        </div>
      </main>

      {/* CSS样式 */}
      <style jsx global>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.4);
          box-shadow: 
            0 20px 60px rgba(0, 0, 0, 0.15),
            inset 0 2px 0 rgba(255, 255, 255, 0.4);
        }
        
        .glass-card:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
          transition: all 0.3s ease;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

// 漂浮元素组件
function FloatingElements() {
  const elements = [
    { icon: Heart, count: 5 },
    { icon: Star, count: 4 },
    { icon: Sparkles, count: 3 },
    { icon: Flower, count: 3 },
  ];

  return (
    <>
      {elements.map(({ icon: Icon, count }) =>
        Array.from({ length: count }).map((_, i) => (
          <div
            key={`${Icon.name}-${i}`}
            className="absolute text-white/20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
              fontSize: `${20 + Math.random() * 30}px`,
            }}
          >
            <Icon />
          </div>
        ))
      )}
    </>
  );
}
