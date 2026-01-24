-- ============================================
-- Supabase Database Setup - Simplified Version
-- 在 Supabase Dashboard → SQL Editor 中执行
-- ============================================

-- 1. 删除旧的 messages 表（如果存在且需要重新创建）
-- 注意：这会删除所有消息数据，谨慎使用！
-- DROP TABLE IF EXISTS messages CASCADE;

-- 2. 创建消息表
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  sender_name VARCHAR(100) NOT NULL,
  sender_id VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_deleted BOOLEAN DEFAULT FALSE,
  
  -- 引用回复相关
  reply_to_id UUID REFERENCES messages(id) ON DELETE SET NULL,
  quoted_content TEXT,
  quoted_sender_name VARCHAR(100)
);

-- 3. 创建索引以优化查询性能
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_reply_to ON messages(reply_to_id);

-- 4. 启用实时订阅（重要！）
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- 5. 禁用行级安全策略（RLS）- 为了支持匿名用户
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;

-- 6. 授予权限给匿名用户
GRANT ALL ON messages TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- 7. 创建辅助函数
CREATE OR REPLACE FUNCTION delete_message(message_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE messages 
  SET is_deleted = true, updated_at = NOW()
  WHERE id = message_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_messages_updated_at ON messages;
CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 验证设置
-- ============================================
SELECT 
  'Table: messages' as info,
  (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'messages') as table_exists,
  (SELECT COUNT(*) FROM pg_indexes WHERE tablename = 'messages') as index_count,
  (SELECT relname FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'messages') as realtime_enabled;

-- ============================================
-- 使用说明：
-- 1. 在 Supabase Dashboard 中打开 SQL Editor
-- 2. 复制并执行以上所有 SQL 语句
-- 3. 检查输出结果确保所有设置都成功
-- 4. 开始使用聊天功能
-- ============================================
