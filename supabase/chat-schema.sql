-- ============================================
-- Supabase Database Schema for IM Chat
-- 在 Supabase Dashboard → SQL Editor 中执行
-- ============================================

-- 1. 创建消息表
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

-- 2. 创建索引以优化查询性能
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_reply_to ON messages(reply_to_id);

-- 3. 启用实时订阅
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- 4. 设置行级安全策略（RLS）
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 允许所有人读取和插入消息（因为是免登录的）
CREATE POLICY "Allow public read access" ON messages
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access" ON messages
  FOR INSERT WITH CHECK (true);

-- 允许发送者更新和删除自己的消息
CREATE POLICY "Allow sender update own messages" ON messages
  FOR UPDATE USING (
    sender_id = auth.uid()::text OR 
    -- 免登录用户使用 session_id 作为 sender_id
    sender_id LIKE 'anon_%' OR
    sender_id LIKE 'guest_%'
  )
  WITH CHECK (
    sender_id = auth.uid()::text OR
    sender_id LIKE 'anon_%' OR
    sender_id LIKE 'guest_%'
  );

CREATE POLICY "Allow sender delete own messages" ON messages
  FOR DELETE USING (
    sender_id = auth.uid()::text OR
    sender_id LIKE 'anon_%' OR
    sender_id LIKE 'guest_%'
  );

-- 5. 创建函数用于更新消息（软删除）
CREATE OR REPLACE FUNCTION delete_message(message_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE messages 
  SET is_deleted = true, updated_at = NOW()
  WHERE id = message_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. 创建触发器自动更新 updated_at
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
-- 使用说明：
-- 1. 在 Supabase Dashboard 中打开 SQL Editor
-- 2. 复制并执行以上所有 SQL 语句
-- 3. 创建完成后，RLS 策略可能需要调整以支持匿名用户
-- ============================================
