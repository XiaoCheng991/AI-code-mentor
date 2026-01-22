# 💎 液态玻璃（Glassmorphism）设计示例

这是一个展示液态玻璃设计风格的示例页面。

## 🔗 访问地址

**本地开发环境**：
```
http://localhost:3000/glass
```

## ✨ 设计特点

### 1. 液态玻璃效果
- **半透明背景**：`background: rgba(255, 255, 255, 0.1)`
- **毛玻璃模糊**：`backdrop-filter: blur(20px)`
- **细微边框**：`border: 1px solid rgba(255, 255, 255, 0.2)`
- **内发光**：`inset 0 1px 0 rgba(255, 255, 255, 0.2)`

### 2. 渐变背景
- 深色渐变背景（深蓝 → 紫色 → 粉色）
- 装饰性模糊圆点
- 网格纹理

### 3. 交互效果
- 悬浮时卡片透明度增加
- 轻微上移和阴影加深
- 图标缩放动画

## 🎨 核心CSS类

### 液态玻璃卡片
```css
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}
```

### 导航栏
```css
.glass-nav {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}
```

## 📱 页面结构

1. **导航栏** - 液态玻璃效果，固定顶部
2. **欢迎区** - 用户问候语
3. **统计卡片** - 4列网格，学习数据展示
4. **今日学习** - 课程进度卡片
5. **AI推荐** - 智能推荐区域
6. **最近成就** - 成就徽章展示
7. **快捷操作** - 常用功能入口

## 🔧 技术要点

- 使用 `backdrop-filter` 实现毛玻璃效果
- 渐变背景提供足够的对比度
- 白色边框和阴影增加层次感
- 响应式布局适配不同屏幕

## 💡 使用建议

1. **背景选择**：深色或鲜艳的背景更能突显液态玻璃效果
2. **透明度控制**：建议10%-20%透明度，避免过于透明
3. **模糊程度**：20-24px的模糊效果最佳
4. **边框**：1-2px的白色边框增加玻璃质感
5. **阴影**：柔和的外阴影增加深度感

## ⚠️ 浏览器兼容性

- Chrome 76+
- Edge 79+
- Safari 9+（需要 `-webkit-backdrop-filter`）
- Firefox 103+（部分支持）

## 📂 文件结构

```
src/app/(glass-demo)/
├── glass/
│   ├── layout.tsx      # 布局文件
│   ├── page.tsx        # 主页面
│   └── README.md       # 本文档
└── README.md           # 总文档
```
