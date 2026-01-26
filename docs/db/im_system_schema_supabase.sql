-- Supabase: IM System Schema (基于 auth.users, 使用 pgcrypto/gen_random_uuid())
-- 启用必要的扩展
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1) 用户扩展信息
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name VARCHAR(100) NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  is_online BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2) 聊天室/群组
CREATE TABLE IF NOT EXISTS chat_rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100),
  type VARCHAR(20) CHECK (type IN ('direct','group')),
  avatar_url TEXT,
  description TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3) 房间成员
CREATE TABLE IF NOT EXISTS room_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('admin','member')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  last_read_at TIMESTAMPTZ DEFAULT NOW(),
  is_muted BOOLEAN DEFAULT FALSE,
  UNIQUE(room_id, user_id)
);

-- 4) 消息
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  sender_name TEXT,
  room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE,
  message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text','image','file','system')),
  file_url TEXT,
  file_name TEXT,
  file_size BIGINT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_deleted BOOLEAN DEFAULT FALSE,
  reply_to_id UUID REFERENCES messages(id) ON DELETE SET NULL,
  quoted_content TEXT,
  quoted_sender_name TEXT,
  mentions TEXT[],
  read_by UUID[] DEFAULT '{}'
);

-- 5) 大文件传输记录
CREATE TABLE IF NOT EXISTS transfers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  room_id UUID REFERENCES chat_rooms(id) ON DELETE SET NULL,
  file_name TEXT,
  total_size BIGINT,
  transferred_size BIGINT,
  status VARCHAR(20) DEFAULT 'queued',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  finished_at TIMESTAMPTZ
);

-- 6) 分享与权限（简化）
CREATE TABLE IF NOT EXISTS share_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  resource_type TEXT,
  resource_id UUID,
  url TEXT,
  expires_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id)
);

-- 7) 审计日志
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action TEXT,
  target_type TEXT,
  target_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8) 关系与好友（简化）
CREATE TABLE IF NOT EXISTS user_relationships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id UUID REFERENCES auth.users(id),
  addressee_id UUID REFERENCES auth.users(id),
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(requester_id, addressee_id)
);

-- 9) 索引示例（用于优化查询）
CREATE INDEX IF NOT EXISTS idx_messages_room_id ON messages(room_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_room_members_room_id ON room_members(room_id);
CREATE INDEX IF NOT EXISTS idx_room_members_user_id ON room_members(user_id);

-- 说明：此脚本为起点，后续可在测试环境中完善 RLS 策略与迁移脚本
