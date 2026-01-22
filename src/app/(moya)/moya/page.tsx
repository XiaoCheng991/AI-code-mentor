"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, Heart, Star, Gift, Music, Zap, Crown, Smile, Sun, Moon, Flower, Rainbow, PartyPopper, Play, Pause, Volume2 } from "lucide-react";
import { friendConfig } from "../config";

// 音乐配置 - 把《失眠》音乐文件放到 public/music 目录下
const MUSIC_URL = "/music/insomnia.mp3"; // 请放入音乐文件

// 惊喜效果组件
function SurpriseEffect({ show }: { show: boolean }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* 彩带效果 */}
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={`confetti-${i}`}
          className="confetti"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            backgroundColor: ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff', '#5f27cd'][Math.floor(Math.random() * 6)],
          }}
        />
      ))}
      
      {/* 星星闪烁 */}
      {Array.from({ length: 20 }).map((_, i) => (
        <Sparkles
          key={`sparkle-${i}`}
          className="absolute text-yellow-400 animate-ping"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 0.5}s`,
            fontSize: `${20 + Math.random() * 30}px`,
          }}
        />
      ))}
    </div>
  );
}

// 气泡组件
function FloatingBubble({ emoji }: { emoji: string }) {
  const [position, setPosition] = useState({ x: Math.random() * 100, y: 100 });
  
  useEffect(() => {
    const animate = () => {
      setPosition(prev => ({
        x: prev.x + (Math.random() - 0.5) * 0.5,
        y: prev.y - 0.5 - Math.random() * 0.5
      }));
    };
    
    const interval = setInterval(animate, 50);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div
      className="fixed text-2xl animate-bubble opacity-50"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transition: 'all 3s ease-out',
      }}
    >
      {emoji}
    </div>
  );
}

export default function MoyaPraisePage() {
  const { name, opening, message, praiseWords, surprisePraises, signature } = friendConfig;
  
  const [showSurprise, setShowSurprise] = useState(false);
  const [currentPraise, setCurrentPraise] = useState("");
  const [clickCount, setClickCount] = useState(0);
  const [showBubbles, setShowBubbles] = useState(false);

  // 音乐播放器引用
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [musicLoaded, setMusicLoaded] = useState(false);

  // 初始化音频
  useEffect(() => {
    audioRef.current = new Audio(MUSIC_URL);
    audioRef.current.loop = true; // 循环播放
    
    audioRef.current.oncanplaythrough = () => {
      setMusicLoaded(true);
    };
    
    audioRef.current.onerror = () => {
      console.log("音乐加载失败，请确保已添加音乐文件");
      setMusicLoaded(false);
    };
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // 处理惊喜
  const handleSurprise = () => {
    setShowSurprise(true);
    setShowBubbles(true);
    
    // 随机选择一句夸赞
    const randomPraise = surprisePraises[Math.floor(Math.random() * surprisePraises.length)];
    setCurrentPraise(randomPraise);
    
    // 3秒后关闭效果
    setTimeout(() => {
      setShowSurprise(false);
    }, 3000);
  };

  // 切换音乐
  const toggleMusic = async () => {
    if (!audioRef.current) {
      alert("音乐文件还未加载，请稍等或检查音乐文件是否已放入 public/music 目录");
      return;
    }
    
    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("播放失败:", error);
      alert("播放失败，请确保音乐文件已正确放置");
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 惊喜效果 */}
      <SurpriseEffect show={showSurprise} />
      
      {/* 漂浮气泡 */}
      {showBubbles && (
        <>
          <FloatingBubble emoji="💜" />
          <FloatingBubble emoji="✨" />
          <FloatingBubble emoji="🌟" />
          <FloatingBubble emoji="💖" />
          <FloatingBubble emoji="🎉" />
        </>
      )}

      {/* 动态背景 */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500" />
        
        {/* 背景装饰 */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-64 h-64 bg-purple-400 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-indigo-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
      </div>

      <main className="container mx-auto px-4 py-12 relative z-10">
        {/* 标题区域 */}
        <div className="text-center mb-10">
          {/* 皇冠动画 */}
          <div className="inline-block mb-4 relative group">
            <div className="text-6xl animate-bounce cursor-pointer hover:scale-110 transition-transform">
              👑
            </div>
            {/* 悬浮提示 */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-white text-sm whitespace-nowrap">
              点击皇冠有惊喜！
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            {opening}
          </h1>
          
          {/* 装饰音符 */}
          <div className="flex justify-center gap-4 mt-4">
            <Music className="w-8 h-8 text-purple-200 animate-bounce" style={{ animationDelay: '0s' }} />
            <Music className="w-8 h-8 text-pink-200 animate-bounce" style={{ animationDelay: '0.2s' }} />
            <Music className="w-8 h-8 text-indigo-200 animate-bounce" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>

        {/* 惊喜按钮 */}
        <div className="text-center mb-8">
          <button
            onClick={handleSurprise}
            className="group relative px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-xl rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Gift className="w-6 h-6" />
              点击领取任慕瑶专属惊喜！
              <Sparkles className="w-6 h-6" />
            </span>
            {/* 光效 */}
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>

        {/* 惊喜结果 */}
        {showSurprise && currentPraise && (
          <div className="max-w-2xl mx-auto mb-8 animate-bounce-in">
            <div className="glass-card backdrop-blur-xl bg-white/30 border-2 border-white/50 rounded-3xl p-6 shadow-2xl">
              <div className="text-center">
                <PartyPopper className="w-16 h-16 mx-auto mb-4 text-yellow-400 animate-bounce" />
                <p className="text-2xl md:text-3xl font-bold text-white drop-shadow-md">
                  {currentPraise}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 主卡片 */}
        <div className="max-w-4xl mx-auto">
          <div className="glass-card backdrop-blur-xl bg-white/20 border-2 border-white/40 rounded-3xl p-8 md:p-12 shadow-2xl">
            
            {/* 顶部装饰 */}
            <div className="text-center mb-8">
              <span className="text-6xl">💜</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-4 drop-shadow-md">
                致可爱的 {name} 💕
              </h2>
            </div>

            {/* 消息内容 */}
            <div className="bg-white/30 rounded-2xl p-6 md:p-8 mb-8">
              <p className="text-xl md:text-2xl text-white leading-relaxed whitespace-pre-line text-center font-medium drop-shadow-sm">
                {message}
              </p>
            </div>

            {/* 互动：点击获取更多夸奖 */}
            <div className="mb-8">
              <div className="text-center mb-4">
                <button
onClick={handleSurprise}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all duration-300"
                >
                  <Zap className="w-5 h-5" />
                  <span>点击获取更多夸奖！</span>
                  <span className="text-sm opacity-70">（已点击 {clickCount} 次）</span>
                </button>
              </div>
            </div>

            {/* 夸赞词汇云 */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {praiseWords.map((word, index) => (
                <span
                  key={word}
                  className="px-4 py-2 bg-white/30 backdrop-blur-sm rounded-full text-white font-medium shadow-md hover:bg-white/40 hover:scale-110 transition-all duration-300 cursor-pointer"
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                    fontSize: `${14 + Math.random() * 6}px`,
                  }}
                  onClick={() => {
                    setClickCount(prev => prev + 1);
                    handleSurprise();
                  }}
                >
                  {word} ✨
                </span>
              ))}
            </div>

            {/* 进度条：夸赞指数 */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">今日夸赞指数</span>
                <span className="text-white font-bold">{Math.min(clickCount * 10, 100)}%</span>
              </div>
              <div className="h-4 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(clickCount * 10, 100)}%` }}
                />
              </div>
            </div>

            {/* 音乐开关 */}
            <div className="text-center mb-8">
              <button
                onClick={toggleMusic}
                disabled={!musicLoaded}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ${
                  isPlaying 
                    ? 'bg-pink-500 text-white animate-pulse' 
                    : 'bg-white/20 hover:bg-white/30 text-white'
                } ${!musicLoaded ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-5 h-5" />
                    <span>🎵 正在播放《失眠》...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    <span>🎶 点击播放《失眠》</span>
                  </>
                )}
              </button>
              {!musicLoaded && (
                <p className="text-white/60 text-sm mt-2">
                  💡 提示：请将《失眠》音乐文件放入 public/music/insomnia.mp3
                </p>
              )}
            </div>

            {/* 装饰性分隔线 */}
            <div className="flex items-center justify-center gap-2 mb-8">
              {Array.from({ length: 7 }).map((_, i) => (
                <Heart
                  key={i}
                  className="w-5 h-5 text-purple-300 animate-pulse"
                  style={{ animationDelay: `${i * 0.15}s`, fill: "currentColor" }}
                />
              ))}
            </div>

            {/* 底部签名 */}
            <div className="text-center">
              <p className="text-lg md:text-xl text-white/90 font-medium drop-shadow-md">
                {signature}
              </p>
              <p className="text-white/70 mt-2 text-sm">
                点击页面上的 ✨ 获取专属惊喜 💫
              </p>
            </div>
          </div>
        </div>

        {/* 底部装饰 */}
        <div className="text-center mt-12">
          <p className="text-white/80 text-lg mb-4">
            希望这个页面能让你开心每一天！ 🎊
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="text-4xl animate-bounce">💜</span>
            <span className="text-4xl animate-bounce" style={{ animationDelay: '0.2s' }}>✨</span>
            <span className="text-4xl animate-bounce" style={{ animationDelay: '0.4s' }}>🌟</span>
            <span className="text-4xl animate-bounce" style={{ animationDelay: '0.6s' }}>💖</span>
            <span className="text-4xl animate-bounce" style={{ animationDelay: '0.8s' }}>🎉</span>
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

        /* 彩带效果 */
        .confetti {
          position: absolute;
          width: 10px;
          height: 10px;
          border-radius: 2px;
          animation: confetti-fall 4s ease-in-out forwards;
        }

        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        /* 气泡动画 */
        @keyframes bubble {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0.5;
          }
          100% {
            transform: translateY(-100vh) scale(1.5);
            opacity: 0;
          }
        }

        .animate-bubble {
          animation: bubble 8s linear infinite;
        }

        /* 弹跳进入 */
        @keyframes bounce-in {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
