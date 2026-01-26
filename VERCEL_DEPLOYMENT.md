# 🚀 Vercel 部署配置指南

本指南将帮助您配置 Vercel 环境变量，确保 Supabase 和其他服务正常运行。

## 📋 目录

1. [获取 Supabase 配置](#1-获取-supabase-配置)
2. [配置 Vercel 环境变量](#2-配置-vercel-环境变量)
3. [常见问题排查](#3-常见问题排查)
4. [验证部署](#4-验证部署)

---

## 1. 获取 Supabase 配置

### 步骤 1：登录 Supabase Dashboard

1. 打开 [Supabase Dashboard](https://supabase.com/dashboard)
 2. 选择您的项目 NebulaHub 橙光 (或 `ai-code-mentor`)

### 步骤 2：获取 API URL

1. 在左侧菜单中，点击 **Settings** (齿轮图标)
2. 点击 **API**
3. 找到 **Project URL**，复制类似这样的地址：

```
https://adqanlyleccoohgqgmne.supabase.co
```

### 步骤 3：获取 Anon Key

在同一页面 (Settings → API)：
1. 找到 **anon public** 密钥
2. 点击 **复制** 按钮

```
sb_publishable_8Qerh6bWbqtNgyZCvgv2iw_dv-9_tTC
```

---

## 2. 配置 Vercel 环境变量

### 步骤 1：进入 Vercel 项目

1. 打开 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择您的项目 **ai-code-mentor**
3. 点击 **Settings** 标签

### 步骤 2：进入环境变量配置

1. 在左侧菜单中，点击 **Environment Variables**
2. 您将看到环境变量列表

### 步骤 3：添加必需的环境变量

按照以下表格添加环境变量：

#### 必需变量（Production, Preview, Development）

| 变量名 | 值 | 备注 |
|--------|-----|------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://adqanlyleccoohgqgmne.supabase.co` | 从 Supabase Dashboard 获取 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_8Qerh6bWbqtNgyZCvgv2iw_dv-9_tTC` | 从 Supabase Dashboard 获取 |

### 步骤 4：设置环境

对于每个环境变量，设置其应用的环境：

- ✅ **Production**：生产环境
- ✅ **Preview**：预览环境（PR合并前）
- ✅ **Development**：开发环境

### 步骤 5：保存并重新部署

1. 点击 **Add** 或 **Save** 按钮
2. 回到 **Deployments** 标签
3. 点击最新的部署旁边的 **Redeploy**
4. 等待重新部署完成

---

## 3. 常见问题排查

### ❌ 错误：@supabase/ssr: Your project's URL and API key are required

**原因**：环境变量未配置或配置错误

**解决方案**：
1. 检查 Vercel 中的环境变量是否正确
2. 确保变量名拼写正确（注意大小写）
3. 重新部署项目

### ❌ 错误：Invalid API key

**原因**：Supabase API key 错误或已过期

**解决方案**：
1. 前往 [Supabase Dashboard](https://supabase.com/dashboard)
2. Settings → API
3. 重新复制 anon key
4. 更新 Vercel 中的环境变量

### ❌ 错误：CORS policy blocked

**原因**：Supabase 项目未配置正确的 CORS

**解决方案**：
1. 前往 Supabase Dashboard → Settings → API
2. 在 **CORS** 部分添加 Vercel 域名：
   ```
   https://your-project.vercel.app
   http://localhost:3000
   ```

---

## 4. 验证部署

### ✅ 成功标志

1. **部署状态**：在 Vercel 中显示 "Ready" ✓
2. **访问网站**：打开 `https://your-project.vercel.app`
3. **首页加载**：看到登录页面
4. **注册功能**：可以正常注册新用户
5. **登录功能**：可以正常登录

### 🧪 测试步骤

1. 访问首页
2. 点击 "开始学习"
3. 填写注册表单
4. 提交后应该自动登录
5. 进入仪表盘，应该看到欢迎页面和学习统计数据

---

## 📝 快速配置

直接在 Vercel Dashboard → Settings → Environment Variables 中添加：

```
NEXT_PUBLIC_SUPABASE_URL=https://adqanlyleccoohgqgmne.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_8Qerh6bWbqtNgyZCvgv2iw_dv-9_tTC
```

然后 Redeploy 即可！

---

## 🔗 快速链接

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Supabase Dashboard](https://supabase.com/dashboard)
- [Supabase API 文档](https://supabase.com/docs/guides/api)
- [Vercel 环境变量文档](https://vercel.com/docs/concepts/projects/environment-variables)

---

**祝您部署成功！** 🎉
