# 🚀 Spaceship 域名配置 Vercel 完整指南

本指南将帮助您在 Spaceship 平台上配置 DNS，将 `xiaocheng991.site` 指向 Vercel 部署的项目。

## 📋 目录

1. [在 Vercel 添加域名](#1-在-vercel-添加域名)
2. [在 Spaceship 配置 DNS](#2-在-spaceship-配置-dns)
3. [等待生效](#3-等待生效)
4. [访问页面](#4-访问页面)

---

## 1. 在 Vercel 添加域名

### 步骤 1：进入 Vercel 项目设置

1. 打开 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击您的项目 **ai-code-mentor**
3. 点击 **Settings** 标签

### 步骤 2：找到 Domains 设置

在左侧菜单中，点击 **Domains**

### 步骤 3：添加您的域名

1. 在输入框中输入：`xiaocheng991.site`
2. 点击 **Add**

### 步骤 4：记录 DNS 配置

Vercel 会显示需要配置的 DNS 记录，您会看到类似这样的信息：

```
配置以下 DNS 记录：

类型：CNAME
主机：@（或 www）
值：cname.vercel-dns.com
```

**请截图或复制这些信息**，下一步需要用到！

---

## 2. 在 Spaceship 配置 DNS

### 步骤 1：登录 Spaceship

1. 打开浏览器，访问：https://spaceship.com
2. 登录您的账户
3. 点击 **Sign In** 或 **Log In**

### 步骤 2：找到您的域名

1. 登录后，您会看到 **Domains** 或 **My Domains**
2. 找到 `xiaocheng991.site`
3. 点击域名旁边的 **Manage** 按钮

### 步骤 3：进入 DNS 设置

在域名管理页面，找到 **DNS** 或 **DNS Records** 选项卡，点击进入

### 步骤 4：添加 CNAME 记录

现在您需要添加两条 CNAME 记录：

#### 第一条记录（主域名）

| 字段 | 值 | 说明 |
|-----|-----|------|
| **Type** | CNAME | 选择记录类型 |
| **Host/Name** | @ | 表示主域名 |
| **Target/Value** | cname.vercel-dns.com | Vercel 提供的值 |
| **TTL** | Auto 或 3600 | 默认即可 |

#### 第二条记录（www 子域名）

| 字段 | 值 | 说明 |
|-----|-----|------|
| **Type** | CNAME | 选择记录类型 |
| **Host/Name** | www | 表示 www 子域名 |
| **Target/Value** | cname.vercel-dns.com | Vercel 提供的值 |
| **TTL** | Auto 或 3600 | 默认即可 |

### 步骤 5：保存配置

1. 点击 **Save**、**Add** 或 **Apply Changes**
2. 等待保存成功

---

## 3. 等待生效

### 状态检查

1. 回到 Vercel 的 Domains 页面
2. 查看 `xiaocheng991.site` 的状态

### 可能的状态

- ⏳ **Pending**：等待配置（继续等待）
- ✅ **Verified**：已生效 ✅

### 等待时间

- **通常**：10-30 分钟
- **最慢**：24 小时（很少见）

### 验证是否生效

在终端或命令提示符中运行：

```bash
# Windows
ping xiaocheng991.site

# Mac/Linux
ping xiaocheng991.site

# 或者使用 nslookup
nslookup xiaocheng991.site
```

如果能看到类似 `76.76.21.21` 的 IP 地址，说明已生效！

---

## 4. 访问页面

### ✅ 配置成功后

**闫雨彤专属页面：**
```
https://xiaocheng991.site/praise
```

**主页：**
```
https://xiaocheng991.site
```

---

## 📱 可以发给闫雨彤的话

```
🌸 闫雨彤专属页面 🌸

给你准备了一个小惊喜！

👉 访问地址：
https://xiaocheng991.site/praise

💡 直接复制到浏览器打开就行
不需要翻墙，正常网络就能访问~

希望你喜欢这份心意！💖
```

---

## ❓ 常见问题

### Q1: 在 Spaceship 中找不到 DNS 设置？

**解决**：
1. 点击域名进入详情页
2. 寻找 **DNS**、**DNS Records**、**Nameservers** 或 **Advanced** 选项
3. 如果实在找不到，联系 Spaceship 客服

### Q2: CNAME 记录添加失败？

**解决**：
1. 确保 **Target/Value** 填写正确：`cname.vercel-dns.com`
2. 不要添加 `http://` 或 `https://` 前缀
3. 尝试删除重复的记录后再添加

### Q3: 域名状态一直是 Pending？

**可能原因**：
1. DNS 记录还没配置
2. DNS 记录配置有误
3. 还没等待足够时间

**解决**：
1. 检查 Spaceship 中的 DNS 记录是否正确
2. 等待 10-30 分钟后再检查
3. 尝试清除浏览器缓存

### Q4: 可以使用 A 记录吗？

**可以**，如果 Spaceship 不支持 CNAME，可以使用 A 记录：

| 字段 | 值 |
|-----|-----|
| **Type** | A |
| **Host** | @ |
| **Value** | 76.76.21.21 |

---

## 🔗 快速链接

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Spaceship 官网](https://spaceship.com)
- [DNS 传播检查](https://dnschecker.org/)
- [Spaceship 客服支持](https://spaceship.com/support/)

---

## 💡 专业提示

1. **.site 域名**：国内可直接访问，无需备案
2. **Vercel 免费版**：完全支持自定义域名
3. **HTTPS**：Vercel 会自动配置 SSL 证书
4. **国内访问**：通过 `xiaocheng991.site` 无需翻墙

---

## ✅ 配置检查清单

- [ ] 在 Vercel 添加了 `xiaocheng991.site` 域名
- [ ] 在 Spaceship 添加了 CNAME 记录（@）
- [ ] 在 Spaceship 添加了 CNAME 记录（www）
- [ ] 等待了 10-30 分钟
- [ ] 在 Vercel 中看到状态变为 "Verified"
- [ ] 测试访问 `https://xiaocheng991.site/praise`

---

**配置完成后，闫雨彤就可以通过 https://xiaocheng991.site/praise 访问专属页面啦！** 🎉

加油！💪 如果遇到问题，随时问我！ 😊
