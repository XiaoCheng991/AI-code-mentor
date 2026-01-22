"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, Heart, Star, Gift, Music, Zap, Crown, Smile, Sun, Moon, Flower, Rainbow, PartyPopper, Play, Pause, Volume2 } from "lucide-react";
import { friendConfig } from "../config";

// 音乐配置 - 《失眠》音乐文件路径
const MUSIC_URL = "/music/失眠.mp3"; // 音乐文件路径

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
  const [playError, setPlayError] = useState("");
  const [hasStarted, setHasStarted] = useState(false);

  // 初始化音频
  useEffect(() => {
    const audio = new Audio(MUSIC_URL);
    audio.loop = true;
    audio.volume = 0.7; // 设置音量70%
    
    // 预加载
    audio.load();
    
    audio.oncanplaythrough = () => {
      setMusicLoaded(true);
    };
    
    audio.onerror = (e) => {
      console.error("音频加载失败:", e);
      setMusicLoaded(false);
      setPlayError("音乐文件加载失败");
    };
    
    audioRef.current = audio;
    
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

  // 切换音乐 - 修复移动端播放问题
  const toggleMusic = async () => {
    // 如果音频还没加载完成
    if (!audioRef.current || !musicLoaded) {
      setPlayError("音乐还在加载中，请稍等...");
      return;
    }
    
    try {
      if (isPlaying) {
        // 暂停
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        // 播放 - 移动端需要用户交互触发
        // 先重置到开头，确保从头播放
        audioRef.current.currentTime = 0;
        
        // 尝试播放
        await audioRef.current.play();
        setIsPlaying(true);
        setHasStarted(true);
        setPlayError("");
      }
    } catch (error: any) {
      // 处理移动端自动播放限制
      console.error("播放失败:", error);
      
      if (error.name === "NotAllowedError") {
        setPlayError("❌ 手机浏览器限制自动播放\n\n💡 请先点击页面任意位置，然后再点击播放按钮");
      } else if (error.name === "AbortError") {
        setPlayError("播放被中断，请重试");
      } else {
        setPlayError("播放失败，请重试");
      }
    }
  };

  // 处理首次用户交互（帮助解决移动端限制）
  const handleFirstInteraction = async () => {
    if (!hasStarted && musicLoaded && audioRef.current) {
      try {
        // 预播放一次，建立播放状态
        await audioRef.current.play();
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setHasStarted(true);
      } catch (e) {
        // 忽略错误，用户稍后会自己点击播放
      }
    }
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      onClick={handleFirstInteraction}
    >
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
                <button onClick={handleSurprise}
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
            <div className="mb-6">
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

            {/* 音乐开关 - 移动端友好 */}
            <div className="text-center mb-6">
              <button
                onClick={toggleMusic}
                disabled={!musicLoaded}
                className={`inline-flex items-center gap-3 px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 ${
                  isPlaying 
                    ? 'bg-pink-500 text-white shadow-lg animate-pulse' 
                    : 'bg-white/20 hover:bg-white/30 text-white shadow-md'
                } ${!musicLoaded ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-6 h-6" />
                    <span className="font-bold">🎵 正在播放《失眠》...</span>
                    <span className="animate-bounce">💜</span>
                  </>
                ) : (
                  <>
                    <Play className="w-6 h-6" />
                    <span className="font-bold">🎶 点击播放《失眠》</span>
                  </>
                )}
              </button>
              
              {/* 错误/状态提示 */}
              {playError && (
                <div className="mt-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl max-w-md mx-auto">
                  <p className="text-white/90 text-sm whitespace-pre-line">{playError}</p>
                </div>
              )}
              
              {/* 加载提示 */}
              {!musicLoaded && !playError && (
                <p className="text-white/60 text-sm mt-2">
                  音乐加载中... ⏳
                </p>
              )}
            </div>

            {/* 移动端播放提示 */}
            {isPlaying && (
              <div className="text-center mb-6">
                <p className="text-white/70 text-sm">
                  💡 如果音乐没声音，请检查手机音量设置 🔊
                </p>
              </div>
            )}

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
