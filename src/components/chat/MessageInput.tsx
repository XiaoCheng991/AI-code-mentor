'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Message } from '@/lib/supabase-chat';
import { 
  Send, 
  X, 
  Smile, 
  Image, 
  Paperclip,
  CornerUpLeft
} from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (content: string, replyToId?: string) => Promise<void>;
  replyingTo: Message | null;
  onCancelReply: () => void;
  disabled?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  replyingTo,
  onCancelReply,
  disabled = false,
}) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [cursorPosition, setCursorPosition] = useState(0);

  // 自动聚焦输入框
  useEffect(() => {
    textareaRef.current?.focus();
  }, [replyingTo]);

  // 调整文本框高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  // 发送消息
  const handleSend = async () => {
    if (!message.trim() || isSending || disabled) return;

    const content = message.trim();
    const replyToId = replyingTo?.id;

    setIsSending(true);
    try {
      await onSendMessage(content, replyToId);
      setMessage('');
      textareaRef.current?.focus();
    } finally {
      setIsSending(false);
    }
  };

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Enter 发送，Shift+Enter 换行
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 处理文本变化
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    setCursorPosition(e.target.selectionStart);
  };

  // 检测是否在引用回复
  const isReplying = replyingTo !== null;

  return (
    <div className="border-t border-gray-100 bg-white px-4 py-3">
      {/* 引用回复区域 */}
      {isReplying && (
        <div className="mb-2 p-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1 overflow-hidden">
              <CornerUpLeft size={14} className="text-blue-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-blue-600">
                  回复 {replyingTo.sender_name}
                </div>
                <div className="text-sm text-gray-600 truncate">
                  {replyingTo.content}
                </div>
              </div>
            </div>
            <button
              onClick={onCancelReply}
              className="p-1 hover:bg-blue-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* 输入区域 */}
      <div className="flex items-end gap-2">
        {/* 附加按钮 */}
        <div className="flex gap-1">
          <button 
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="发送图片"
          >
            <Image size={20} />
          </button>
          <button 
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="添加附件"
          >
            <Paperclip size={20} />
          </button>
          <button 
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="表情"
          >
            <Smile size={20} />
          </button>
        </div>

        {/* 输入框 */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={isReplying ? `回复 ${replyingTo.sender_name}...` : '输入消息...'}
            disabled={disabled || isSending}
            rows={1}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ 
              minHeight: '40px',
              maxHeight: '120px'
            }}
          />

          {/* 发送按钮 */}
          <button
            onClick={handleSend}
            disabled={!message.trim() || isSending || disabled}
            className={`absolute right-2 bottom-1.5 p-1.5 rounded-xl transition-all duration-200 ${
              message.trim() && !disabled
                ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg shadow-blue-500/30'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            } ${isSending ? 'opacity-70' : ''}`}
          >
            {isSending ? (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle 
                  className="opacity-25" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                  fill="none"
                />
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <Send size={18} />
            )}
          </button>
        </div>
      </div>

      {/* 提示文字 */}
      <div className="mt-1 text-xs text-gray-400 text-center">
        按 <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-500 font-medium">Enter</kbd> 发送，<kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-500 font-medium">Shift+Enter</kbd> 换行
      </div>
    </div>
  );
};

export default MessageInput;
