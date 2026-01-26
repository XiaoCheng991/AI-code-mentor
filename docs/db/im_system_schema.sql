-- Im System Schema (初始草案，基于现有 Supabase Auth 的 auth.users)
-- 目的：支撑 IM、云盘与大文件传输等场景

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. 用户扩展信息
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

-- 2. 聊天室/群组
CREATE TABLE IF NOT EXISTS chat_rooms (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100),
  type VARCHAR(20) CHECK (type IN ('direct','group')),
  avatar_url TEXT,
  description TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 房间成员
CREATE TABLE IF NOT EXISTS room_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('admin','member')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  last_read_at TIMESTAMPTZ DEFAULT NOW(),
  is_muted BOOLEAN DEFAULT FALSE,
  UNIQUE(room_id, user_id)
);

-- 4. 消息
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  content TEXT NOT NULL,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  sender_name TEXT, -- 冗余，方便快速渲染
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

-- 5. 大文件传输记录
CREATE TABLE IF NOT EXISTS transfers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  room_id UUID REFERENCES chat_rooms(id) ON DELETE SET NULL,
  file_name TEXT,
  total_size BIGINT,
  transferred_size BIGINT,
  status VARCHAR(20) DEFAULT 'queued',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  finished_at TIMESTAMPTZ
);

-- 6. 分享与权限（简化）
CREATE TABLE IF NOT EXISTS share_links (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  resource_type TEXT,
  resource_id UUID,
  url TEXT,
  expires_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id)
);

-- 7. 审计日志
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action TEXT,
  target_type TEXT,
  target_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. 关系与好友（简化）
CREATE TABLE IF NOT EXISTS user_relationships (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  requester_id UUID REFERENCES auth.users(id),
  addressee_id UUID REFERENCES auth.users(id),
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(requester_id, addressee_id)
);

-- 9. 索引示例（用于优化查询）
CREATE INDEX IF NOT EXISTS idx_messages_room_id ON messages(room_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_room_members_room_id ON room_members(room_id);
CREATE INDEX IF NOT EXISTS idx_room_members_user_id ON room_members(user_id);

-- 备注：该 SQL 脚本为初步草案，后续可在测试环境中逐步演进并加入更完整的安全策略和迁移脚本
