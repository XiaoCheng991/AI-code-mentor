-- ============================================
-- NebulaHub 数据库 Schema (修正版)
-- 支持: IM聊天、群组/私聊、文件上传、好友关系
-- 在 Supabase Dashboard → SQL Editor 中执行
-- ============================================

-- ⚠️ 重要：执行前请先备份现有数据
-- ⚠️ 如果已有表，请先删除:
-- DROP TABLE IF EXISTS messages CASCADE;
-- DROP TABLE IF EXISTS message_reads CASCADE;
-- DROP TABLE IF EXISTS room_members CASCADE;
-- DROP TABLE IF EXISTS chat_rooms CASCADE;
-- DROP TABLE IF EXISTS friends CASCADE;
-- DROP TABLE IF EXISTS friend_requests CASCADE;
-- DROP TABLE IF EXISTS user_profiles CASCADE;

-- ============================================
-- 第一部分：用户档案 (联动 Supabase Auth)
-- ============================================

CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100),
    avatar_url TEXT,
    bio TEXT,
    status VARCHAR(20) DEFAULT 'offline' CHECK (status IN ('online', 'offline', 'busy', 'away')),
    last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_user_profiles_status ON user_profiles(status);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public users can read profiles" ON user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- 触发器：自动更新 updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 触发器：自动创建用户档案
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM user_profiles WHERE id = NEW.id) THEN
        INSERT INTO user_profiles (id, username, display_name, avatar_url)
        VALUES (
            NEW.id,
            COALESCE(
                NEW.raw_user_meta_data->>'username',
                NEW.raw_user_meta_data->>'full_name',
                'user_' || LEFT(NEW.id::text, 8)
            ),
            COALESCE(
                NEW.raw_user_meta_data->>'display_name',
                NEW.raw_user_meta_data->>'full_name',
                NEW.email
            ),
            NEW.raw_user_meta_data->>'avatar_url'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 第二部分：聊天室 (先创建，后面再加 RLS)
-- ============================================

CREATE TABLE IF NOT EXISTS chat_rooms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(200),
    description TEXT,
    type VARCHAR(20) NOT NULL CHECK (type IN ('direct', 'group')),
    avatar_url TEXT,
    created_by UUID REFERENCES auth.users(id),
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_rooms_type ON chat_rooms(type);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_last_message ON chat_rooms(last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_created_by ON chat_rooms(created_by);

DROP TRIGGER IF EXISTS update_chat_rooms_updated_at ON chat_rooms;
CREATE TRIGGER update_chat_rooms_updated_at
    BEFORE UPDATE ON chat_rooms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 第三部分：聊天室成员 (需要在 chat_rooms RLS 之前创建)
-- ============================================

CREATE TABLE IF NOT EXISTS room_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    left_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(room_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_room_members_room ON room_members(room_id);
CREATE INDEX IF NOT EXISTS idx_room_members_user ON room_members(user_id);

ALTER TABLE room_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view room members" ON room_members FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM room_members r
        WHERE r.room_id = room_members.room_id
        AND r.user_id = auth.uid()
    )
);

CREATE POLICY "Users can join rooms" ON room_members FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave rooms" ON room_members FOR UPDATE USING (
    auth.uid() = user_id AND left_at IS NULL
);

CREATE POLICY "Room admins can manage members" ON room_members FOR ALL USING (
    EXISTS (
        SELECT 1 FROM room_members r
        WHERE r.room_id = room_members.room_id
        AND r.user_id = auth.uid()
        AND r.role IN ('owner', 'admin')
    )
);

-- ============================================
-- 第四部分：现在添加 chat_rooms 的 RLS (room_members 已存在)
-- ============================================

ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view accessible chat rooms" ON chat_rooms FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM room_members
        WHERE room_members.room_id = chat_rooms.id
        AND room_members.user_id = auth.uid()
    )
    OR type = 'direct'
);

CREATE POLICY "Users can create chat rooms" ON chat_rooms
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Room creator can update" ON chat_rooms
    FOR UPDATE USING (auth.uid() = created_by);

-- ============================================
-- 第五部分：消息
-- ============================================

CREATE TABLE IF NOT EXISTS messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    content TEXT,
    message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'system')),
    file_url TEXT,
    file_name TEXT,
    file_size BIGINT,
    image_width INT,
    image_height INT,
    reply_to_id UUID REFERENCES messages(id) ON DELETE SET NULL,
    mentioned_users UUID[] DEFAULT '{}',
    is_edited BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_room ON messages(room_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_reply_to ON messages(reply_to_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

DROP TRIGGER IF EXISTS update_messages_updated_at ON messages;
CREATE TRIGGER update_messages_updated_at
    BEFORE UPDATE ON messages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages in accessible rooms" ON messages FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM room_members
        WHERE room_members.room_id = messages.room_id
        AND room_members.user_id = auth.uid()
        AND room_members.left_at IS NULL
    )
);

CREATE POLICY "Users can send messages to joined rooms" ON messages FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM room_members
        WHERE room_members.room_id = messages.room_id
        AND room_members.user_id = auth.uid()
        AND room_members.left_at IS NULL
    )
    AND is_deleted = false
);

CREATE POLICY "Senders can update own messages" ON messages
    FOR UPDATE USING (sender_id = auth.uid() OR sender_id IS NULL)
    WITH CHECK (sender_id = auth.uid() OR sender_id IS NULL);

CREATE POLICY "Senders can delete own messages" ON messages
    FOR DELETE USING (sender_id = auth.uid() OR sender_id IS NULL);

-- ============================================
-- 第六部分：消息已读状态
-- ============================================

CREATE TABLE IF NOT EXISTS message_reads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    message_id UUID REFERENCES messages(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(message_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_message_reads_user ON message_reads(user_id);
CREATE INDEX IF NOT EXISTS idx_message_reads_message ON message_reads(message_id);

ALTER TABLE message_reads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own read status" ON message_reads FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- 第七部分：好友关系
-- ============================================

CREATE TABLE IF NOT EXISTS friend_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(sender_id, receiver_id)
);

CREATE TABLE IF NOT EXISTS friends (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    friend_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, friend_id)
);

CREATE INDEX IF NOT EXISTS idx_friend_requests_sender ON friend_requests(sender_id);
CREATE INDEX IF NOT EXISTS idx_friend_requests_receiver ON friend_requests(receiver_id);
CREATE INDEX IF NOT EXISTS idx_friends_user ON friends(user_id);

ALTER TABLE friend_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE friends ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sent requests" ON friend_requests
    FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can create friend requests" ON friend_requests
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update own requests" ON friend_requests
    FOR UPDATE USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can view own friends" ON friends
    FOR SELECT USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "Users can manage own friends" ON friends
    FOR ALL USING (auth.uid() = user_id);

DROP TRIGGER IF EXISTS update_friend_requests_updated_at ON friend_requests;
CREATE TRIGGER update_friend_requests_updated_at
    BEFORE UPDATE ON friend_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 第八部分：实时订阅
-- ============================================

ALTER PUBLICATION supabase_realtime ADD TABLE user_profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE chat_rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE room_members;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE message_reads;
ALTER PUBLICATION supabase_realtime ADD TABLE friends;
ALTER PUBLICATION supabase_realtime ADD TABLE friend_requests;

-- ============================================
-- 第九部分：辅助函数
-- ============================================

-- 1. 创建私聊房间
CREATE OR REPLACE FUNCTION public.create_direct_room(
    user1_id UUID,
    user2_id UUID
) RETURNS UUID AS $$
DECLARE
    existing_room_id UUID;
    new_room_id UUID;
BEGIN
    SELECT r.id INTO existing_room_id
    FROM chat_rooms r
    WHERE r.type = 'direct'
    AND EXISTS (SELECT 1 FROM room_members m WHERE m.room_id = r.id AND m.user_id = user1_id)
    AND EXISTS (SELECT 1 FROM room_members m WHERE m.room_id = r.id AND m.user_id = user2_id)
    AND (SELECT COUNT(*) FROM room_members WHERE room_id = r.id) = 2
    LIMIT 1;

    IF existing_room_id IS NOT NULL THEN
        RETURN existing_room_id;
    END IF;

    INSERT INTO chat_rooms (name, type, created_by)
    VALUES ('Direct Chat', 'direct', user1_id)
    RETURNING id INTO new_room_id;

    INSERT INTO room_members (room_id, user_id, role)
    VALUES (new_room_id, user1_id, 'owner'),
           (new_room_id, user2_id, 'member');

    RETURN new_room_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. 创建群组房间
CREATE OR REPLACE FUNCTION public.create_group_room(
    room_name TEXT,
    creator_id UUID,
    member_ids UUID[]
) RETURNS UUID AS $$
DECLARE
    new_room_id UUID;
BEGIN
    INSERT INTO chat_rooms (name, type, created_by)
    VALUES (room_name, 'group', creator_id)
    RETURNING id INTO new_room_id;

    INSERT INTO room_members (room_id, user_id, role)
    VALUES (new_room_id, creator_id, 'owner');

    INSERT INTO room_members (room_id, user_id, role)
    SELECT new_room_id, unnest(member_ids), 'member'
    WHERE unnest(member_ids) != creator_id;

    RETURN new_room_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. 离开房间
CREATE OR REPLACE FUNCTION public.leave_room(
    room_uuid UUID,
    user_uuid UUID
) RETURNS void AS $$
BEGIN
    UPDATE room_members
    SET left_at = NOW()
    WHERE room_id = room_uuid AND user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. 更新最后消息时间触发器
CREATE OR REPLACE FUNCTION update_room_last_message()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE chat_rooms
    SET last_message_at = NEW.created_at, updated_at = NOW()
    WHERE id = NEW.room_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_room_last_message ON messages;
CREATE TRIGGER trigger_update_room_last_message
    AFTER INSERT ON messages
    FOR EACH ROW EXECUTE FUNCTION update_room_last_message();

-- ============================================
-- 第十部分：Storage 配置（用户头像上传）
-- ============================================

-- 创建 user-uploads 存储桶
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'user-uploads',
  'user-uploads',
  true, -- 公开访问
  2097152, -- 2MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- 允许所有人查看头像（公开读取）
CREATE POLICY "Public Access - Anyone can view avatars"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'user-uploads' 
  AND name LIKE 'avatars/%'
);

-- 允许用户上传自己的头像
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'user-uploads' 
  AND name LIKE 'avatars/%'
  AND name LIKE 'avatars/' || auth.uid()::text || '%'
);

-- 允许用户更新自己的头像
CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'user-uploads' 
  AND name LIKE 'avatars/%'
  AND name LIKE 'avatars/' || auth.uid()::text || '%'
)
WITH CHECK (
  bucket_id = 'user-uploads' 
  AND name LIKE 'avatars/%'
  AND name LIKE 'avatars/' || auth.uid()::text || '%'
);

-- 允许用户删除自己的头像
CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'user-uploads' 
  AND name LIKE 'avatars/%'
  AND name LIKE 'avatars/' || auth.uid()::text || '%'
);

-- ============================================
-- 验证安装
-- ============================================

SELECT '✅ Schema 安装完成！' AS status;

SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name NOT LIKE 'pg_%'
ORDER BY table_name;
