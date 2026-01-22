-- ============================================
-- 自动创建用户记录触发器
-- ============================================

-- 1. 删除旧的函数和触发器（如果存在）
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 2. 创建函数：处理新用户注册
CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS TRIGGER AS $$
BEGIN
    -- 检查 users 表是否已存在该用户记录
    IF NOT EXISTS (
        SELECT 1 FROM public.users
        WHERE id = NEW.id
    ) THEN
        -- 插入用户记录，映射 auth.users 的字段到 public.users
        INSERT INTO public.users (
            id, email, name, avatar_url,
            current_skill_level, weekly_learning_hours,
            learning_goals, created_at, updated_at
        )
        VALUES (
                   NEW.id,
                   NEW.email,
                   COALESCE(
                           NEW.raw_user_meta_data->>'full_name',
                           NEW.raw_user_meta_data->>'name',
                           NEW.email
                   ),
                   NEW.raw_user_meta_data->>'avatar_url',
                   'beginner',
                   5,
                   '[]'::jsonb,
                   NOW(),
                   NOW()
               );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. 创建触发器
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. 验证结果
SELECT '✅ 触发器创建成功！' AS status;