"use client";

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Phone, Video, Search, Plus, Send, MoreVertical, Users, UserPlus } from "lucide-react";
import Link from "next/link";
import LayoutWithSidebar from "@/components/LayoutWithSidebar";
import { formatTime } from "@/lib/utils";

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
  ]);

  const [conversations, setConversations] = useState<Conversation[]>([
    { id: 'conv-1', type: 'user', name: 'Luna', avatar: '', lastMessage: '晚上一起吃饭吗？', time: '18:30', unread: 2, isPinned: true },
    { id: 'conv-2', type: 'group', name: '周末聚餐群', avatar: '', lastMessage: 'Bob: 我可以带自制蛋糕', time: '17:45', unread: 0, isPinned: true },
    { id: 'conv-3', type: 'user', name: '张三', avatar: '', lastMessage: '收到，谢谢！', time: '16:20', unread: 0, isPinned: false },
    { id: 'conv-4', type: 'group', name: '工作闲聊群', avatar: '', lastMessage: 'Alice: 会议推迟到明天', time: '昨天', unread: 3, isPinned: false },
    { id: 'conv-5', type: 'user', name: '李四', avatar: '', lastMessage: '记得明天的会议', time: '昨天', unread: 0, isPinned: false },
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  return (
    <LayoutWithSidebar>
      <div className="flex h-screen bg-background">
        {/* Sidebar - Hidden on mobile since it's a dedicated chat page */}
        <div className="w-80 border-r flex flex-col">
          {/* Header */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">聊天</h2>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <UserPlus className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Users className="h-5 w-5" />
                </Button>
                <Link href="/dashboard">
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="搜索"
                className="pl-10"
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
                  className={`flex items-center gap-3 p-3 hover:bg-accent cursor-pointer transition-colors ${
                    activeConversation === conversation.id ? 'bg-accent' : ''
                  }`}
                  onClick={() => setActiveConversation(conversation.id)}
                >
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={conversation.avatar} />
                    <AvatarFallback>{conversation.type === 'group' ? '👥' : conversation.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold truncate">{conversation.name}</h3>
                      <span className="text-xs text-muted-foreground">{conversation.time}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                      {conversation.unread > 0 && (
                        <span className="bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center ml-2">
                          {conversation.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {activeConv ? (
            <>
              {/* Chat Header */}
              <div className="border-b p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={activeConv.avatar} />
                    <AvatarFallback>{activeConv.type === 'group' ? '👥' : activeConv.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{activeConv.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {activeConv.type === 'user' ? '在线' : '2 在线'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Phone className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Video className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.senderId === 'me'
                          ? 'bg-primary text-primary-foreground rounded-br-none'
                          : 'bg-muted rounded-bl-none'
                      }`}
                    >
                      <p>{message.content}</p>
                      <p className={`text-xs mt-1 ${message.senderId === 'me' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                        {formatTime(message.timestamp instanceof Date ? message.timestamp : new Date(message.timestamp))}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="border-t p-4">
                <div className="flex items-end gap-2">
                  <div className="flex-1 bg-muted rounded-lg p-2">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="输入消息..."
                      className="w-full bg-transparent border-none resize-none focus:outline-none h-12 max-h-32"
                    />
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="h-12 w-12 p-0"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              选择一个聊天开始对话
            </div>
          )}
        </div>
      </div>
    </LayoutWithSidebar>
  );
}