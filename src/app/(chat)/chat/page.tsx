'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Message, supabase, generateUserId, getAvatarColor } from '@/lib/supabase-chat';
import { MessageItem } from '@/components/chat/MessageItem';
import { MessageInput } from '@/components/chat/MessageInput';
import { 
  Users, 
  MessageCircle, 
  Settings, 
  LogIn,
  Sparkles,
  Wifi,
  WifiOff
} from 'lucide-react';

// 样式配置
const COLORS = [
  'from-red-400 to-red-600',
  'from-orange-400 to-orange-600',
  'from-amber-400 to-amber-600',
  'from-yellow-400 to-yellow-600',
  'from-lime-400 to-lime-600',
  'from-green-400 to-green-600',
  'from-emerald-400 to-emerald-600',
  'from-teal-400 to-teal-600',
  'from-cyan-400 to-cyan-600',
  'from-sky-400 to-sky-600',
  'from-blue-400 to-blue-600',
  'from-indigo-400 to-indigo-600',
  'from-violet-400 to-violet-600',
  'from-purple-400 to-purple-600',
  'from-fuchsia-400 to-fuchsia-600',
  'from-pink-400 to-pink-600',
  'from-rose-400 to-rose-600',
];

export default function ChatPage() {
  // 用户状态
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // 消息状态
  const [messages, setMessages] = useState<Message[]>([]);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);

  // UI 状态
  const [showWelcome, setShowWelcome] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const subscriptionRef = useRef<any>(null);

  // 从本地存储恢复用户信息
  useEffect(() => {
    const savedName = localStorage.getItem('chat_user_name');
    const savedId = localStorage.getItem('chat_user_id');

    if (savedName && savedId) {
      setUserName(savedName);
      setUserId(savedId);
      setIsLoggedIn(true);
      setShowWelcome(false);
    }
  }, []);

  // 初始化消息订阅
  const initRealtimeSubscription = useCallback(() => {
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }

    // 订阅实时消息
    subscriptionRef.current = supabase
      .channel('messages-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((prev) => [...prev, newMessage]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          const updatedMessage = payload.new as Message;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === updatedMessage.id ? updatedMessage : msg
            )
          );
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
      });
  }, []);

  // 加载历史消息
  const loadMessages = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('is_deleted', false)
        .order('created_at', { ascending: true })
        .limit(100);

      if (error) {
        console.error('加载消息失败:', error);
        return;
      }

      if (data) {
        setMessages(data);
      }
    } catch (err) {
      console.error('加载消息出错:', err);
    }
  }, []);

  // 初始化
  useEffect(() => {
    if (isLoggedIn) {
      loadMessages();
      initRealtimeSubscription();
    }

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [isLoggedIn, loadMessages, initRealtimeSubscription]);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 登录
  const handleLogin = async () => {
    if (!userName.trim()) return;

    setIsLoading(true);
    try {
      // 生成用户 ID
      const newUserId = generateUserId();
      
      // 保存到本地存储
      localStorage.setItem('chat_user_name', userName.trim());
      localStorage.setItem('chat_user_id', newUserId);

      setUserId(newUserId);
      setIsLoggedIn(true);
      setShowWelcome(false);
    } finally {
      setIsLoading(false);
    }
  };

  // 登出
  const handleLogout = () => {
    localStorage.removeItem('chat_user_name');
    localStorage.removeItem('chat_user_id');
    setUserName('');
    setUserId('');
    setIsLoggedIn(false);
    setMessages([]);
    setShowWelcome(true);
  };

  // 发送消息
  const handleSendMessage = async (content: string, replyToId?: string) => {
    if (!userName || !userId) return;

    const messageData: any = {
      content,
      sender_name: userName,
      sender_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_deleted: false,
    };

    // 添加引用信息
    if (replyToId) {
      const quotedMessage = messages.find((m) => m.id === replyToId);
      if (quotedMessage) {
        messageData.reply_to_id = replyToId;
        messageData.quoted_content = quotedMessage.content;
        messageData.quoted_sender_name = quotedMessage.sender_name;
      }
    }

    try {
      const { error } = await supabase.from('messages').insert(messageData);

      if (error) {
        console.error('发送消息失败:', error);
        alert('发送消息失败，请检查网络连接');
        return;
      }

      // 清除引用状态
      setReplyingTo(null);
    } catch (err) {
      console.error('发送消息出错:', err);
      alert('发送消息出错');
    }
  };

  // 删除（撤回）消息
  const handleDeleteMessage = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ 
          is_deleted: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', messageId);

      if (error) {
        console.error('撤回消息失败:', error);
        alert('撤回消息失败');
        return;
      }
    } catch (err) {
      console.error('撤回消息出错:', err);
      alert('撤回消息出错');
    }
  };

  // 回复消息
  const handleReply = (message: Message) => {
    setReplyingTo(message);
    // 聚焦输入框
    const input = document.querySelector('textarea');
    input?.focus();
  };

  // 取消回复
  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  // 获取随机颜色
  const getRandomGradient = (index: number) => {
    return COLORS[index % COLORS.length];
  };

  // 获取在线用户数（模拟）
  const onlineUsers = messages.length > 0 
    ? new Set(messages.map(m => m.sender_id)).size + 1 
    : 1;

  // 登录界面
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        {/* 背景装饰 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink-200/20 rounded-full blur-3xl" />
        </div>

        <div className="relative w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl shadow-xl shadow-purple-500/20 mb-4">
              <MessageCircle size={40} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              即时通讯
            </h1>
            <p className="text-gray-500 mt-2">免登录，与朋友实时聊天</p>
          </div>

          {/* 登录卡片 */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-purple-500/10 p-8 border border-white/50">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  你的昵称
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="输入你的昵称"
                  maxLength={20}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-all"
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                />
                <p className="text-xs text-gray-400 mt-2">
                  输入昵称即可开始聊天，无需注册
                </p>
              </div>

              <button
                onClick={handleLogin}
                disabled={!userName.trim() || isLoading}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    进入中...
                  </>
                ) : (
                  <>
                    <LogIn size={18} />
                    开始聊天
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 特性展示 */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Sparkles size={20} className="text-blue-500" />
              </div>
              <p className="text-xs text-gray-500">免登录</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Users size={20} className="text-purple-500" />
              </div>
              <p className="text-xs text-gray-500">实时消息</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <MessageCircle size={20} className="text-pink-500" />
              </div>
              <p className="text-xs text-gray-500">引用回复</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 聊天界面
  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* 顶部导航栏 */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-100 px-4 py-3 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
            <MessageCircle size={20} className="text-white" />
          </div>
          
          {/* 标题和状态 */}
          <div>
            <h1 className="font-semibold text-gray-800">即时聊天</h1>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              {isConnected ? (
                <>
                  <Wifi size={12} className="text-green-500" />
                  <span className="text-green-600">在线</span>
                </>
              ) : (
                <>
                  <WifiOff size={12} className="text-red-500" />
                  <span className="text-red-600">离线</span>
                </>
              )}
              <span className="mx-1">·</span>
              <Users size={12} />
              <span>{onlineUsers} 人在线</span>
            </div>
          </div>
        </div>

        {/* 用户信息和设置 */}
        <div className="flex items-center gap-3">
          {/* 当前用户 */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full">
            <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${getRandomGradient(userName.charCodeAt(0))} flex items-center justify-center text-white text-sm font-medium`}>
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-gray-700">{userName}</span>
          </div>

          {/* 设置按钮 */}
          <button
            onClick={handleLogout}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="退出登录"
          >
            <Settings size={20} />
          </button>
        </div>
      </header>

      {/* 消息列表 */}
      <main className="flex-1 overflow-y-auto p-4 space-y-2">
        {/* 欢迎消息 */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
              <MessageCircle size={40} className="text-purple-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              欢迎，{userName}！
            </h2>
            <p className="text-gray-500 text-sm max-w-sm">
              发送一条消息开始聊天吧！你的朋友也会立即看到这条消息。
            </p>
          </div>
        )}

        {/* 消息列表 */}
        {messages.map((message, index) => {
          const isOwn = message.sender_id === userId;
          const showTime = index === 0 || 
            new Date(messages[index - 1].created_at).getTime() + 60000 < new Date(message.created_at).getTime();
          
          return (
            <MessageItem
              key={message.id}
              message={message}
              isOwn={isOwn}
              onReply={handleReply}
              onDelete={handleDeleteMessage}
              showTime={showTime}
            />
          );
        })}
        
        {/* 滚动锚点 */}
        <div ref={messagesEndRef} />
      </main>

      {/* 消息输入框 */}
      <MessageInput
        onSendMessage={handleSendMessage}
        replyingTo={replyingTo}
        onCancelReply={handleCancelReply}
        disabled={!isConnected}
      />
    </div>
  );
}
