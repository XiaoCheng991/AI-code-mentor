"use client";

import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Phone, Video, Search, Plus, Send, MoreVertical, Users, UserPlus } from "lucide-react";
import Link from "next/link";
import ChatLayout from "@/components/ChatLayout";
import { formatTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'busy';
  lastSeen?: string;
}

interface Conversation {
  id: string;
  type: 'user' | 'group';
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  isPinned: boolean;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
}

export default function ChatPage() {
  const [users] = useState<User[]>([
    { id: '1', name: 'Luna', avatar: '', status: 'online' },
    { id: '2', name: '张三', avatar: '', status: 'online' },
    { id: '3', name: '李四', avatar: '', status: 'offline', lastSeen: '今天 15:30' },
    { id: '4', name: '王五', avatar: '', status: 'busy' },
    { id: '5', name: '赵六', avatar: '', status: 'online' },
    { id: '6', name: '孙七', avatar: '', status: 'online' },
    { id: '7', name: '周八', avatar: '', status: 'offline', lastSeen: '今天 14:10' },
  ]);

  const [conversations, setConversations] = useState<Conversation[]>([
    { id: 'conv-1', type: 'user', name: 'Luna', avatar: '', lastMessage: '晚上一起吃饭吗？', time: '18:30', unread: 2, isPinned: true },
    { id: 'conv-2', type: 'group', name: '周末聚餐群', avatar: '', lastMessage: 'Bob: 我可以带自制蛋糕', time: '17:45', unread: 0, isPinned: true },
    { id: 'conv-3', type: 'user', name: '张三', avatar: '', lastMessage: '收到，谢谢！', time: '16:20', unread: 0, isPinned: false },
    { id: 'conv-4', type: 'group', name: '工作闲聊群', avatar: '', lastMessage: 'Alice: 会议推迟到明天', time: '昨天', unread: 3, isPinned: false },
    { id: 'conv-5', type: 'user', name: '李四', avatar: '', lastMessage: '记得明天的会议', time: '昨天', unread: 0, isPinned: false },
    // { id: 'conv-6', type: 'user', name: '孙七', avatar: '', lastMessage: '记得明天的会议', time: '昨天', unread: 0, isPinned: false },
    // { id: 'conv-7', type: 'user', name: '周八', avatar: '', lastMessage: '记得明天的会议', time: '昨天', unread: 0, isPinned: false },
  ]);

  const [activeConversation, setActiveConversation] = useState<string | null>('conv-1');
  const [messages, setMessages] = useState<Message[]>([
    { id: 'msg-1', senderId: '1', senderName: 'Luna', content: '晚上一起吃饭吗？', timestamp: new Date(Date.now() - 3600000), status: 'read' },
    { id: 'msg-2', senderId: 'me', senderName: 'Me', content: '好啊，你想吃什么？', timestamp: new Date(Date.now() - 3500000), status: 'read' },
    { id: 'msg-3', senderId: '1', senderName: 'Luna', content: '我想吃火锅，你觉得呢？', timestamp: new Date(Date.now() - 3400000), status: 'read' },
    { id: 'msg-4', senderId: 'me', senderName: 'Me', content: '火锅不错，我知道一家很好的店', timestamp: new Date(Date.now() - 3300000), status: 'read' },
    { id: 'msg-5', senderId: '1', senderName: 'Luna', content: '太好了，那就这么定了！', timestamp: new Date(Date.now() - 3200000), status: 'read' },
    { id: 'msg-6', senderId: 'me', senderName: 'Me', content: '嗯，到时候见！', timestamp: new Date(Date.now() - 3100000), status: 'delivered' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  // 滚动到底部功能（仅在发送新消息时调用）
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 初始化时不自动滚动到底部，避免页面跳转时的意外滚动
  // 只在发送新消息时调用scrollToBottom()


  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: 'me',
      senderName: 'Me',
      content: newMessage,
      timestamp: new Date(),
      status: 'sent'
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const activeConv = conversations.find(c => c.id === activeConversation);

  // 判断是否显示时间戳 - 如果与上一条消息间隔超过5分钟，则显示时间
  const shouldShowTime = (index: number, messagesArray: Message[]) => {
    if (index === 0) return true;

    const currentMessageTime = new Date(messagesArray[index].timestamp).getTime();
    const prevMessageTime = new Date(messagesArray[index - 1].timestamp).getTime();

    // 如果时间差超过5分钟（300000毫秒），则显示时间
    return (currentMessageTime - prevMessageTime) > 300000;
  };

  return (
    <ChatLayout>
      {/*手动计算固定距离*/}
      <div className="flex h-[calc(100vh-85px)] overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Sidebar - Contact list */}
        <div className="h-full border-r bg-white flex flex-col shadow-sm pl-2">
          {/* Header */}
          <div className="p-4 border-b bg-white">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-800">聊天</h2>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="hover:bg-slate-100">
                  <UserPlus className="h-5 w-5 text-slate-600" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-slate-100">
                  <Users className="h-5 w-5 text-slate-600" />
                </Button>
                <Link href="/dashboard">
                  <Button variant="ghost" size="icon" className="hover:bg-slate-100">
                    <MoreVertical className="h-5 w-5 text-slate-600" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="搜索对话..."
                className="pl-10 bg-slate-50 border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto">
            {conversations
              .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0))
              .map((conversation) => (
                <div
                  key={conversation.id}
                  className={cn(
                    "flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer transition-all duration-200 border-l-4",
                    activeConversation === conversation.id
                      ? "bg-blue-50 border-l-blue-500"
                      : "border-l-transparent"
                  )}
                  onClick={() => setActiveConversation(conversation.id)}
                >
                  <div className="relative">
                    <Avatar className="w-12 h-12 ring-2 ring-slate-100">
                      <AvatarImage src={conversation.avatar} />
                      <AvatarFallback className={cn(
                        "text-lg",
                        conversation.type === 'group'
                          ? "bg-gradient-to-br from-violet-400 to-violet-500 text-white"
                          : "bg-gradient-to-br from-blue-400 to-blue-500 text-white"
                      )}>
                        {conversation.type === 'group' ? '👥' : conversation.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {conversation.type === 'user' && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className={cn(
                        "font-semibold truncate",
                        conversation.unread > 0 ? "text-slate-800" : "text-slate-600"
                      )}>
                        {conversation.name}
                      </h3>
                      <span className="text-xs text-slate-400">{conversation.time}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className={cn(
                        "text-sm truncate",
                        conversation.unread > 0 ? "text-slate-700 font-medium" : "text-slate-400"
                      )}>
                        {conversation.lastMessage}
                      </p>
                      {conversation.unread > 0 && (
                        <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ml-2 font-medium">
                          {conversation.unread}
                        </span>
                      )}
                      {conversation.isPinned && (
                        <span className="text-amber-500 ml-2" title="已置顶">📌</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="h-full flex-1 flex flex-col bg-white/50 backdrop-blur-sm">
          {activeConv ? (
            <div className="flex flex-col h-full">
              {/* Chat Header */}
              <div className="border-b p-4 flex items-center justify-between bg-white shadow-sm z-10">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-10 h-10 ring-2 ring-slate-100">
                      <AvatarImage src={activeConv.avatar} />
                      <AvatarFallback className={cn(
                        "font-medium",
                        activeConv.type === 'group'
                          ? "bg-gradient-to-br from-violet-400 to-violet-500 text-white"
                          : "bg-gradient-to-br from-blue-400 to-blue-500 text-white"
                      )}>
                        {activeConv.type === 'group' ? '👥' : activeConv.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">{activeConv.name}</h3>
                    <p className="text-xs text-slate-500">
                      {activeConv.type === 'user' ? '在线' : '2 位成员在线'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="hover:bg-slate-100">
                    <Phone className="h-5 w-5 text-slate-600" />
                  </Button>
                  <Button variant="ghost" size="icon" className="hover:bg-slate-100">
                    <Video className="h-5 w-5 text-slate-600" />
                  </Button>
                  <Button variant="ghost" size="icon" className="hover:bg-slate-100">
                    <MoreVertical className="h-5 w-5 text-slate-600" />
                  </Button>
                </div>
              </div>

              {/* Messages & Input Container - Use flex to ensure input stays at bottom */}
              <div className="flex-1 flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gradient-to-b from-slate-50 to-white">
                  {messages.map((message, index) => (
                    <div key={message.id} className="flex flex-col items-start w-full">
                      {/* 时间标签 - 仅在间隔超过5分钟时显示 */}
                      {shouldShowTime(index, messages) && (
                        <div className="self-center my-2 px-3 py-1 bg-slate-200 text-slate-600 text-xs rounded-full">
                          {formatTime(message.timestamp instanceof Date ? message.timestamp : new Date(message.timestamp))}
                        </div>
                      )}
                      <div className="flex w-full">
                        <div
                          className={cn(
                            "max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md",
                            message.senderId === 'me'
                              ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-sm ml-auto'
                              : 'bg-white text-slate-800 rounded-tl-sm border border-slate-100 mr-auto'
                          )}
                        >
                          <p className="leading-relaxed">{message.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input - Fixed at bottom */}
                <div className="border-t p-2 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] flex-shrink-0">
                  <div className="flex items-end gap-2">
                    <div className="flex-1 bg-slate-50 rounded-2xl p-2 border border-slate-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-400/20 transition-all">
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="输入消息..."
                        className="w-full bg-transparent border-none resize-none focus:outline-none h-10 max-h-20 text-slate-700 placeholder:text-slate-400"
                        style={{ maxHeight: '6rem', resize: 'none' }}
                      />
                    </div>
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className={cn(
                        "h-10 w-10 p-0 rounded-xl transition-all duration-200",
                        newMessage.trim()
                          ? "bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/30"
                          : "bg-slate-200"
                      )}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400 bg-gradient-to-br from-slate-50 to-slate-100">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-slate-200 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-10 w-10" />
                </div>
                <p className="text-lg font-medium">选择一个聊天开始对话</p>
                <p className="text-sm mt-1">从左侧选择一个对话或创建新对话</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </ChatLayout>
  );
}