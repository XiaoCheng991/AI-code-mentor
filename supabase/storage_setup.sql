-- ============================================
-- Supabase Storage 配置 - 用户头像上传
-- 在 Supabase Dashboard → Storage 或 SQL Editor 中执行
-- ============================================

-- 1. 创建存储桶 (如果不存在)
-- 注意：这通常在 Supabase Dashboard → Storage UI 中创建
-- 但也可以通过 SQL 创建

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'user-uploads',
  'user-uploads',
  true, -- 公开访问
  2097152, -- 2MB = 2 * 1024 * 1024 bytes
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 2. 配置存储桶的 RLS 策略
-- ============================================

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
-- 验证配置
-- ============================================

SELECT '✅ Storage 配置完成！' AS status;

-- 查看存储桶信息
SELECT id, name, public, file_size_limit 
FROM storage.buckets 
WHERE id = 'user-uploads';

-- 查看 RLS 策略
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'objects' 
AND policyname LIKE '%avatar%';
