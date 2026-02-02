# NebulaHub 项目重构提示词文档

> 本文档用于指导 NebulaHub 项目重构，每次开发前请重新阅读本文档，保持设计一致性和功能完整性。

---

## 项目身份

**项目名称**: NebulaHub 橙光
**中文 tagline**: 实用型云协作平台 - 云端真实共享，价值共创
**英文 tagline**: RealShare, ValuableShare
**定位**: 供朋友实际使用的实用小站，核心能力覆盖 IM、网盘与大文件传输

**Logo 位置**: `/public/logo_icon.svg` (星云图形)
**水平Logo**: `branding/logo/nebulahub/logo_horizontal.svg`
**暗色版**: `branding/logo/nebulahub/logo_horizontal_dark.svg`

---

## 核心技术栈

| 类别 | 技术 |
|------|------|
| 前端框架 | Next.js 14 (App Router) |
| UI组件库 | Radix UI + Tailwind CSS + tailwindcss-animate |
| 样式方案 | CSS Variables + Tailwind |
| 认证 | Supabase Authentication (GitHub OAuth + 邮箱) |
| 数据库 | Supabase PostgreSQL |
| 存储 | Supabase Storage (桶: avatars, chat-files) |
| 实时 | Supabase Realtime |
| 开发语言 | TypeScript |
| 包管理器 | npm |
| 状态管理 | Zustand |
| 表单验证 | Zod |

---

## 设计规范

### 设计风格

本项目采用以下设计风格，**所有修改必须严格遵守**：

1. **苹果公司设计风格**
   - 极简、精致
   - 大量留白
   - 层次分明
   - 精致的动画过渡

2. **液态玻璃 (Glassmorphism)**
   - 半透明背景
   - 背景模糊效果
   - 层次叠加
   - 发光效果

3. **圆角**
   - 全局 `--radius: 2rem`
   - 卡片和按钮使用大圆角
   - 消息气泡圆角

### 品牌颜色

```css
/* 主渐变色 */
/*--primary-gradient: #1e3a8a → #3b82f6 → #14b8a6*/

/*!* 标准色板 (globals.css) *!*/
/*--background: 0 0% 100% / 222.2 84% 4.9%*/
/*--foreground: 222.2 84% 4.9% / 210 40% 98%*/
/*--primary: 221.2 83.2% 53.3%*/
/*--secondary: 210 40% 96.1%*/
/*--muted: 210 40% 96.1%*/
/*--accent: 210 40% 96.1%*/
/*--border: 214.3 31.8% 91.4%*/
/*--radius: 2rem*/
```

### 品牌字体

- **英文**: Inter (Next.js Google Fonts)
- **中文**: Noto Sans SC / PingFang SC
- **代码**: Monaco / monospace

### 常用工具类 (globals.css)

```css
/*.glass              !* 液态玻璃效果 *!*/
/*.bento-grid         !* Bento网格布局 *!*/
/*.card-hover         !* 卡片悬停动效 *!*/
/*.gradient-text      !* 渐变文字 *!*/
/*.chat-message-user  !* 用户消息气泡 *!*/
/*.chat-message-assistant !* 助手消息气泡 *!*/
```

### CSS 类名示例

```tsx
// 毛玻璃卡片
<div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50" />

// 渐变按钮
<button className="bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg hover:shadow-xl" />

// 大圆角输入框
<input className="rounded-2xl border border-gray-200 focus:ring-2 focus:ring-purple-500/20" />

// 导航栏
<header className="sticky top-0 z-50 glass border-b border-white/40" />
```

---

## 现有目录结构

```
NebulaHub/
├── src/
│   ├── app/                    # Next.js App Router 页面
│   │   ├── (auth)/             # 认证相关页面
│   │   │   ├── login/          # 登录页
│   │   │   └── register/       # 注册页
│   │   ├── (chat)/             # 聊天相关页面
│   │   │   └── chat/
│   │   │       ├── layout.tsx
│   │   │       └── page.tsx    # 现有简单聊天页（需重构）
│   │   ├── (dashboard)/        # 仪表板页面
│   │   │   └── dashboard/
│   │   ├── auth/               # 认证回调处理
│   │   │   └── callback/route.ts
│   │   ├── api/                # API路由
│   │   ├── layout.tsx          # 根布局 (含 GlobalHeader)
│   │   ├── page.tsx            # 主页
│   │   └── globals.css         # 全局样式
│   ├── components/             # React 组件
│   │   ├── branding/           # 品牌组件
│   │   │   └── GlobalHeader.tsx
│   │   ├── chat/               # 聊天组件
│   │   │   ├── MessageItem.tsx
│   │   │   └── MessageInput.tsx
│   │   └── ui/                 # 基础 UI 组件
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── card.tsx
│   │       ├── avatar.tsx
│   │       ├── dialog.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── tabs.tsx
│   │       ├── badge.tsx
│   │       ├── textarea.tsx
│   │       ├── label.tsx
│   │       ├── toast.tsx
│   │       └── ...
│   ├── lib/                    # 工具函数和配置
│   │   ├── supabase/
│   │   │   ├── client.ts       # 客户端 (浏览器)
│   │   │   └── server.ts       # 服务端 (SSR/Cookie)
│   │   └── supabase-chat.ts    # 聊天相关工具
│   ├── hooks/                  # 自定义 Hooks
│   └── types/                  # TypeScript 类型定义
│       └── database.types.ts   # Supabase 类型
├── branding/                   # 品牌资产
│   └── logo/nebulahub/         # Logo 变体
├── public/                     # 静态资源
│   └── logo_icon.svg           # 主 Logo
├── supabase/                   # Supabase 配置
│   └── triggers/               # 数据库触发器
├── docs/                       # 文档
│   ├── IM_requirements.md      # IM 功能需求
│   └── branding/               # 品牌文档
├── .env.local                  # 环境变量
├── package.json
├── tailwind.config.ts
└── next.config.ts
```

---

## 当前功能状态

| 功能 | 状态 | 说明 |
|------|------|------|
| 用户认证 (GitHub + 邮箱) | ✅ 已完成 | Supabase Auth |
| 主页 | ✅ 已完成 | 基础首页 |
| 登录/注册页 | ✅ 已完成 | Radix UI Card 样式 |
| 全局 Header | ✅ 已完成 | Glassmorphism + Logo |
| 简单聊天 | ✅ 已完成 | 所有人一起聊，无区分 |
| 群聊/私聊 | ❌ 待开发 | **核心重构目标** |
| 文件上传 (Supabase Storage) | ❌ 待开发 | 图片、文档存储 |
| 头像设置 | ❌ 待开发 | OSS 存储 |
| @提及功能 | ❌ 待开发 | 消息通知 |
| 消息已读状态 | ❌ 待开发 | 未读计数 |
| 好友关系 | ❌ 待开发 | 用户关注 |

---

## 重构目标

基于 `docs/IM_requirements.md`，按优先级实现以下功能：

### 1. 用户身份记忆 (高优先级)

**目标**: 进入 IM 界面时无需重复注册/输入即可继续上次的会话身份

**验收标准**:
- [ ] 首次进入后若检测到历史身份，展示"继续使用历史身份/新身份进入"选项
- [ ] 用户选择后将身份写入会话级状态并持久化
- [ ] 未登录态隐藏身份记忆流程，进入时需走认证流程

### 2. 单聊和群组功能 (高优先级)

**目标**: 从全体同聊的单一聊天窗口，切换为可选的"单聊"和"群组"模式，类似微信的联系人设计

**设计要点**:
- 联系人/群组概念
- 加入/离开群组
- 群组头像、群组成员显示
- 群组消息分离
- 按对话对象筛选并进入相应的聊天页

**验收标准**:
- [ ] 可创建群组
- [ ] 可发起/加入单聊会话
- [ ] 可在不同对话之间切换且消息不会混乱
- [ ] 用户界面友好且在手机端可自适应

### 3. 图片和文件上传功能 (高优先级)

**目标**: 实现图片和文件的上传、预览和发送，使用 Supabase OSS 存储

**验收标准**:
- [ ] 支持图片 (jpg/png/gif/webp 等) 和常见文档/二进制文件上传
- [ ] 上传进度、错误处理、以及失败回退策略
- [ ] 上传成功后消息携带可访问的 URL，消息类型标识为 image/file
- [ ] 能在消息输入区域附带图片/文件，发送后能在聊天列表中正常展示缩略图或可下载链接

### 4. 头像设置功能 (中优先级)

**目标**: 允许用户上传自定义头像，或选择默认头像

**验收标准**:
- [ ] 支持上传头像到 OSS，更新用户档案中的 avatar_url
- [ ] 提供默认头像选项，清晰回退处理
- [ ] 更新头像后在 UI 侧即时生效，消息气泡中的头像也应同步更新

### 5. @提及功能 (中优先级)

**目标**: 在消息中对特定用户进行 @ 提及，触发对方提示与引用

**验收标准**:
- [ ] 支持自动补全用户列表（基于当前对话的成员）
- [ ] 在消息数据中保存被提及用户的 id 集合
- [ ] 在消息中正确插入被提及用户的标记，发送后对方能够看到高亮/通知
- [ ] 被提及的用户在对话列表中有相应提示

---

## 数据库设计 (待扩展)

需新增以下表：

```sql
-- 用户档案表
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username VARCHAR(100) NOT NULL,
  avatar_url TEXT,
  status VARCHAR(50) DEFAULT 'offline',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 聊天室表
CREATE TABLE chat_rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(200),
  type VARCHAR(20) NOT NULL CHECK (type IN ('direct', 'group')),
  avatar_url TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 聊天室成员表
CREATE TABLE room_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(20) DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(room_id, user_id)
);

-- 消息表 (扩展)
ALTER TABLE messages ADD COLUMN room_id UUID REFERENCES chat_rooms(id);
ALTER TABLE messages ADD COLUMN message_type VARCHAR(20) DEFAULT 'text';
ALTER TABLE messages ADD COLUMN file_url TEXT;
ALTER TABLE messages ADD COLUMN mentioned_users UUID[];

-- 消息已读表
CREATE TABLE message_reads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID REFERENCES messages(id),
  user_id UUID REFERENCES auth.users(id),
  read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(message_id, user_id)
);

-- 用户关系表 (好友)
CREATE TABLE user_relationships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  friend_id UUID REFERENCES auth.users(id),
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, friend_id)
);
```

---

## 设计模式

### 页面模板

| 页面 | 设计模式 |
|------|----------|
| 全局 Header | 固定顶部、毛玻璃效果 (`glass border-b`) |
| Auth 页面 | 居中卡片登录注册 (`Card` 组件) |
| Chat Layout | 左侧列表 + 右侧对话 (Sidebar + Main) |
| Dashboard | Bento Grid 卡片布局 (`bento-grid`) |

### 组件开发模式

1. **使用 Radix UI primitives** 作为基础
2. **使用 CVA (class-variance-authority)** 处理组件变体
3. **使用 Zustand** 管理全局状态 (用户、消息、对话列表)
4. **使用 Supabase Realtime** 实时同步消息
5. **使用 Zod** 进行表单验证

### 示例组件结构

```tsx
// 组件命名: PascalCase
// 样式: Tailwind CSS
// 交互: Radix UI

import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// 变体定义
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-xl text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border border-input bg-background hover:bg-accent",
        ghost: "hover:bg-accent",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-lg px-3",
        lg: "h-11 rounded-2xl px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

---

## 设计规则清单

开发时请务必遵守以下规则：

### ✅ 必须做

1. 所有页面使用 **苹果风格 + 液态玻璃 + 圆角**
2. 颜色使用品牌渐变 `#1e3a8a → #3b82f6 → #14b8a6`
3. 圆角使用 `--radius: 2rem`
4. 背景使用 `backdrop-blur-xl` 毛玻璃效果
5. 阴影使用柔和的彩色阴影 (`shadow-purple-500/20`)
6. 按钮和卡片使用悬停动效 (`transition-all duration-300`)
7. 页面滚动使用自定义滚动条样式
8. 图片上传使用 Supabase Storage
9. 实时消息使用 Supabase Realtime

### ❌ 禁止做

1. 不要使用锐角边框 (border-radius < 0.5rem)
2. 不要使用纯色背景卡片 (除非是强调色)
3. 不要使用生硬的黑色阴影
4. 不要忘记添加 loading 状态
5. 不要在消息气泡中使用硬编码颜色

---

## 设计示例

### 登录卡片

```tsx
<Card className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-purple-500/10 border border-white/50">
  <CardHeader className="text-center">
    <CardTitle className="text-2xl">欢迎回来</CardTitle>
    <CardDescription>登录你的账户，继续使用 NebulaHub</CardDescription>
  </CardHeader>
  <CardContent className="space-y-4">
    <Button variant="outline" className="w-full gap-2">
      <Github className="h-4 w-4" />
      GitHub 账号登录
    </Button>
    {/* ... 邮箱登录表单 ... */}
  </CardContent>
</Card>
```

### 聊天消息气泡

```tsx
// 用户消息
<div className="chat-message-user bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl rounded-br-sm p-3" />

// 对方消息
<div className="chat-message-assistant bg-muted text-foreground rounded-2xl rounded-bl-sm p-3" />
```

### 毛玻璃导航栏

```tsx
<header className="sticky top-0 z-50 glass border-b border-white/40 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl">
  <div className="container mx-auto px-4 py-3 flex items-center justify-between">
    {/* Logo */}
    <Link href="/" className="flex items-center gap-2">
      <img src="/logo_icon.svg" alt="NebulaHub Logo" style={{ height: 40 }} />
      <span className="text-xl font-bold">NebulaHub 橙光</span>
    </Link>
    {/* 导航 */}
  </div>
</header>
```

---

## 常用命令

```bash
# 开发
npm run dev

# 构建
npm run build

# 代码检查
npm run lint

# 生成数据库类型
npm run db:generate
```

---

## 环境变量

```env
# Supabase (必需)
NEXT_PUBLIC_SUPABASE_URL=你的Supabase项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase匿名密钥

# Storage 桶名
NEXT_PUBLIC_STORAGE_AVATARS=avatars
NEXT_PUBLIC_STORAGE_CHAT_FILES=chat-files
```

---

## 检查清单

每次提交代码前，请确认：

- [ ] 设计风格符合苹果风格 + 液态玻璃 + 圆角
- [ ] 使用了品牌渐变色
- [ ] 组件有 loading 状态
- [ ] 错误有 Toast 提示
- [ ] 代码通过 `npm run lint`
- [ ] 类型检查通过
- [ ] 无控制台警告

---

## 相关文档链接

| 文档 | 路径 |
|------|------|
| IM 功能需求 | `docs/IM_requirements.md` |
| 品牌手册 | `docs/branding/nebulahub_brand_book_final.md` |
| 全局样式 | `src/app/globals.css` |
| Tailwind 配置 | `tailwind.config.ts` |

---

> **重要提示**: 每次重构修改前，请重新阅读本文档，确保设计风格一致性和功能完整性。
> 如有设计疑问，请参考 `docs/branding/` 下的品牌文档。
