# 即时通讯聊天页面部署指南

## 项目概述

这是一个免登录的即时通讯聊天页面，支持：
- 免登录设置昵称即可聊天
- 实时消息推送
- 引用回复功能
- 消息撤回功能
- 自动生成头像（昵称首字）
- 精美的 UI 设计

## 前置条件

1. **Supabase 账户**：用于存储实时消息
2. **Vercel 账户**：用于部署前端

## 部署步骤

### 1. 配置 Supabase

#### 1.1 创建 Supabase 项目
1. 访问 [Supabase Dashboard](https://supabase.com/dashboard)
2. 点击 "New Project"
3. 填写项目名称（如：`ai-code-mentor-chat`）
4. 设置数据库密码
5. 等待项目创建完成

#### 1.2 创建消息表
1. 在 Supabase Dashboard 中，点击左侧菜单的 **SQL Editor**
2. 复制 `supabase/chat-schema.sql` 文件中的内容
3. 粘贴到 SQL Editor 中并点击 "Run"

或者直接在 SQL Editor 中执行：

```sql
-- 创建消息表
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  sender_name VARCHAR(100) NOT NULL,
  sender_id VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_deleted BOOLEAN DEFAULT FALSE,
  reply_to_id UUID REFERENCES messages(id) ON DELETE SET NULL,
  quoted_content TEXT,
  quoted_sender_name VARCHAR(100)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);

-- 启用实时订阅
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- 禁用 RSL（为了支持匿名用户）
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;

-- 允许所有人操作
GRANT ALL ON messages TO anon, authenticated;
```

#### 1.3 获取 API 密钥
1. 在 Supabase Dashboard 中，点击左侧菜单的 **Project Settings** → **API**
2. 复制以下信息：
   - `Project URL`（NEXT_PUBLIC_SUPABASE_URL）
   - `anon public` 密钥（NEXT_PUBLIC_SUPABASE_ANON_KEY）

### 2. 配置环境变量

编辑 `.env.local` 文件，更新 Supabase 配置：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. 部署到 Vercel

#### 3.1 使用 Vercel CLI
```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署（进入项目目录）
cd ai-code-mentor
vercel --prod
```

#### 3.2 使用 Vercel Dashboard
1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 "Add New Project"
3. 选择你的 GitHub 仓库
4. 配置环境变量：
   - `NEXT_PUBLIC_SUPABASE_URL`: 你的 Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: 你的 Supabase anon 密钥
5. 点击 "Deploy"

### 4. 测试聊天功能

1. 访问部署后的 URL
2. 输入昵称并点击 "开始聊天"
3. 在另一个浏览器或设备打开同一页面
4. 输入不同昵称
5. 发送消息测试实时通信

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000/chat

## 功能说明

### 发送消息
- 在输入框中输入消息
- 按 `Enter` 发送
- 按 `Shift+Enter` 换行

### 引用回复
1. 将鼠标悬停在任意消息上
2. 点击出现的 "引用回复" 按钮
3. 输入回复内容
4. 发送后消息会显示引用内容

### 撤回消息
1. 将鼠标悬停在自己发送的消息上
2. 点击出现的 "撤回" 按钮
3. 消息会被软删除，显示 "此消息已撤回"

### 复制消息
1. 将鼠标悬停在任意消息上
2. 点击出现的 "复制" 按钮
3. 消息内容会被复制到剪贴板

## 技术栈

- **前端**: Next.js 14, React 18, TypeScript
- **样式**: Tailwind CSS
- **后端**: Supabase (PostgreSQL + Realtime)
- **部署**: Vercel

## 文件结构

```
src/
├── app/(chat)/
│   └── chat/
│       ├── page.tsx          # 主聊天页面
│       └── layout.tsx        # 布局文件
├── components/
│   └── chat/
│       ├── MessageItem.tsx   # 消息列表项组件
│       └── MessageInput.tsx  # 消息输入组件
└── lib/
    └── supabase-chat.ts      # Supabase 客户端配置
supabase/
    └── chat-schema.sql       # 数据库 schema
```

## 常见问题

### Q: 消息发送失败
A: 检查 Supabase 连接是否正常，确保 RSL 策略已禁用

### Q: 实时消息没有更新
A: 确保 Supabase Realtime 已启用，检查浏览器控制台是否有错误

### Q: 撤回功能不工作
A: 撤回只能撤回自己发送的消息，且有时间限制（建议 24 小时内）

## 后续优化

- [ ] 添加消息已读状态
- [ ] 支持图片/文件发送
- [ ] 添加表情包选择器
- [ ] 支持私聊功能
- [ ] 添加消息搜索
- [ ] 消息提醒音

---

**创建时间**: 2024-01-24
**作者**: Matrix Agent
