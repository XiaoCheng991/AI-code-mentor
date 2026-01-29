'use client';

import React, { useState } from 'react';
import { Message } from '@/lib/supabase-chat';
import { 
  MoreVertical, 
  CornerUpLeft, 
  Trash2, 
  Copy, 
  CheckCheck,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { formatTime as utilsFormatTime } from '@/lib/utils';

interface MessageItemProps {
  message: Message;
  isOwn: boolean;
  onReply: (message: Message) => void;
  onDelete: (messageId: string) => void;
  showTime: boolean;
}

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  isOwn,
  onReply,
  onDelete,
  showTime,
}) => {
  const [showActions, setShowActions] = useState(false);
  const [copied, setCopied] = useState(false);

  // 获取消息内容的显示文本
  const getDisplayContent = () => {
    if (message.is_deleted) {
      return (
        <span className="italic text-gray-400 flex items-center gap-1">
          <Clock size={14} />
          此消息已撤回
        </span>
      );
    }
    return message.content;
  };

  // 复制消息内容
  const handleCopy = async () => {
    if (message.is_deleted) return;
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatMessageTime = (dateString: string) => {
    try {
      return utilsFormatTime(new Date(dateString));
    } catch {
      return '';
    }
  };

  // 获取头像首字
  const getAvatarInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <div 
      className={`group flex gap-3 px-4 py-2 hover:bg-gray-50/50 transition-colors duration-200 ${
        isOwn ? 'flex-row-reverse' : ''
      }`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* 头像 */}
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-lg shadow-sm ${
        isOwn ? 'bg-gradient-to-br from-green-400 to-green-500' : 'bg-gradient-to-br from-blue-400 to-blue-500'
      }`}>
        {getAvatarInitial(message.sender_name)}
      </div>

      {/* 消息内容 */}
      <div className={`flex flex-col max-w-[70%] ${isOwn ? 'items-end' : 'items-start'}`}>
        
        {/* 发送者名字 */}
        {!isOwn && (
          <span className="text-xs text-gray-500 mb-1 ml-1">
            {message.sender_name}
          </span>
        )}

        {/* 引用消息 */}
        {message.quoted_content && !message.is_deleted && (
          <div className={`mb-1 px-3 py-2 rounded-lg text-sm ${
            isOwn 
              ? 'bg-green-100/80 text-green-800' 
              : 'bg-gray-100/80 text-gray-700'
          }`}>
            <div className="flex items-center gap-1 mb-1">
              <CornerUpLeft size={12} className="opacity-60" />
              <span className="font-medium text-xs opacity-80">
                {message.quoted_sender_name || '我'}
              </span>
            </div>
            <p className="line-clamp-2 opacity-90">
              {message.quoted_content}
            </p>
          </div>
        )}

        {/* 气泡 */}
        <div className="relative">
          <div className={`px-4 py-2.5 rounded-2xl shadow-sm ${
            isOwn
              ? 'bg-gradient-to-br from-green-400 to-green-500 text-white rounded-tr-sm'
              : 'bg-white text-gray-800 rounded-tl-sm border border-gray-100'
          }`}>
            {getDisplayContent()}
          </div>

          {/* 操作按钮 */}
          <div className={`absolute top-0 ${
            isOwn ? '-left-14' : '-right-14'
          } opacity-0 group-hover:opacity-100 transition-all duration-200 ${
            showActions ? 'opacity-100' : ''
          }`}>
            <div className={`flex items-center gap-0.5 bg-white rounded-lg shadow-lg p-1 border border-gray-100 ${
              isOwn ? 'flex-row-reverse' : ''
            }`}>
              
              {/* 回复按钮 */}
              <button
                onClick={() => onReply(message)}
                className="p-1.5 hover:bg-gray-100 rounded-md transition-colors text-gray-500 hover:text-blue-500"
                title="引用回复"
              >
                <CornerUpLeft size={14} />
              </button>

              {/* 复制按钮 */}
              <button
                onClick={handleCopy}
                className="p-1.5 hover:bg-gray-100 rounded-md transition-colors text-gray-500 hover:text-blue-500"
                title={copied ? '已复制' : '复制'}
              >
                {copied ? <CheckCheck size={14} className="text-green-500" /> : <Copy size={14} />}
              </button>

              {/* 删除按钮 (自己的消息) */}
              {isOwn && (
                <button
                  onClick={() => onDelete(message.id)}
                  className="p-1.5 hover:bg-red-50 rounded-md transition-colors text-gray-500 hover:text-red-500"
                  title="撤回"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 时间 */}
        {showTime && (
          <span className="text-xs text-gray-400 mt-1 mx-1">
            {formatMessageTime(message.created_at)}
          </span>
        )}
      </div>
    </div>
  );
};

export default MessageItem;
