# CodeWisdom 品牌设计规范

## 📛 品牌名称

**CodeWisdom** - 编程智慧

### 品牌含义
- **Code**：编程、技术、数字化
- **Wisdom**：智慧、思想、深度

### Slogan
> 「以智慧编程，以编程启智」

---

## 🎨 LOGO设计

### 设计理念
1. **AI与编程的融合**：将编程符号（< > { }）与大脑/智慧元素结合
2. **苹果风格**：大圆角、液态玻璃效果、渐变色
3. **科技感**：蓝紫色渐变，体现AI和现代技术
4. **简洁有力**：易于识别，适合多种场景

### LOGO组成

#### 1. 主LOGO（完整版）
- **用途**：品牌宣传、官网hero区域、PPT演示
- **尺寸**：建议 200x200 到 400x400
- **文件**：`/public/logo-main.svg`

#### 2. 图标版
- **用途**：网站favicon、移动APP图标、社交媒体头像
- **尺寸**：建议 64x64 到 128x128
- **文件**：`/public/logo-icon.svg`

#### 3. 横版LOGO
- **用途**：网站header、文档封面、名片
- **尺寸**：建议 300x75 到 400x100
- **文件**：`/public/logo-horizontal.svg`

---

## 🎨 色彩系统

### 主色调

| 颜色名称 | 色值 | 用途 |
|---------|------|------|
| Primary Blue | `#667eea` | 主色 |
| Deep Purple | `#764ba2` | 深紫色 |
| Light Pink | `#f093fb` | 浅粉色 |
| White | `#ffffff` | 白色 |

### 渐变组合
```
蓝色 → 紫色 → 粉色
#667eea → #764ba2 → #f093fb
```

### 文字颜色
```
主标题：深灰 #1f2937
副标题：中灰 #6b7280
浅色背景文字：白色 #ffffff
```

---

## 📐 设计规范

### 圆角系统
```
主卡片：80px (大圆角，类似Squircle)
内边框：70px
图标背景：20px
```

### 间距规范
```
LOGO周围留白：≥ 40px
图标与文字间距：15px
```

### 最小尺寸
```
主LOGO：120x120px
图标版：32x32px
横版LOGO：200x50px
```

---

## 🔧 使用指南

### 在Next.js项目中使用

```tsx
import Image from 'next/image';

// 主LOGO
<Image 
  src="/logo-main.svg" 
  alt="CodeWisdom" 
  width={200} 
  height={200} 
/>

// 图标版
<Image 
  src="/logo-icon.svg" 
  alt="CodeWisdom Icon" 
  width={64} 
  height={64} 
/>

// 横版LOGO
<Image 
  src="/logo-horizontal.svg" 
  alt="CodeWisdom" 
  width={320} 
  height={80} 
/>
```


### 在Figma中使用
1. 导入SVG文件
2. 右键 → "Unembed" 或直接拖入
3. 保持矢量属性，可自由缩放

---

## 📱 场景应用

### 网站
- **Favicon**：`logo-icon.svg` (32x32)
- **Header**：`logo-horizontal.svg`
- **Hero区域**：`logo-main.svg` + 背景渐变

### 社交媒体
- **头像**：`logo-icon.svg` (最小200x200)
- **分享图片**：1200x630px，包含品牌元素

### 文档
- **PPT模板**：横版LOGO + 渐变背景
- **Readme**：主LOGO居中

### 打印
- **名片**：横版LOGO，尺寸 85x55mm
- **海报**：主LOGO，300x300px

---

## ⚠️ 使用禁忌

### 不要
- ❌ 拉伸或压缩LOGO
- ❌ 改变LOGO颜色
- ❌ 添加阴影或效果
- ❌ 在复杂背景上使用
- ❌ 旋转或倾斜LOGO
- ❌ 使用低于最小尺寸

### 要
- ✅ 保持宽高比
- ✅ 使用官方色彩
- ✅ 保持足够留白
- ✅ 在单色背景上使用图标版

---

## 📁 文件清单

```
public/
├── logo-main.svg      # 主LOGO (400x400)
├── logo-icon.svg      # 图标版 (128x128)
├── logo-horizontal.svg # 横版 (400x100)
└── logo-favicon.svg   # Favicon (32x32)
```

---

## 📅 版本信息

**版本**：1.0  
**创建日期**：2026-01-22  
**设计师**：Matrix Agent  
**风格**：苹果风格 + 液态玻璃 + 渐变色
