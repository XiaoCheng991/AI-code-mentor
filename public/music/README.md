# 🎵 任慕瑶页面 - 《失眠》音乐文件说明

## 📁 目录结构

```
public/
└── music/
    └── insomnia.mp3    # 《失眠》音乐文件（需要您添加）
```

## 🎶 如何添加音乐文件

### 方法一：手动复制文件

1. 找到您想使用的《失眠》音乐文件
   - 可以是 MP3 格式
   - 建议文件大小不超过 10MB

2. 将文件复制到以下目录：
   ```
   ai-code-mentor/public/music/insomnia.mp3
   ```

3. 文件名必须为：`insomnia.mp3`

### 方法二：使用命令行（Mac）

```bash
# 假设您的音乐文件在 Downloads 文件夹
cp ~/Downloads/你的失眠音乐文件.mp3 ai-code-mentor/public/music/insomnia.mp3
```

### 方法三：使用命令行（Windows PowerShell）

```powershell
# 假设您的音乐文件在 Downloads 文件夹
Copy-Item "C:\Users\你的用户名\Downloads\失眠.mp3" "ai-code-mentor\public\music\insomnia.mp3"
```

## 🎵 音乐要求

| 要求 | 说明 |
|-----|------|
| **格式** | MP3 (推荐)、M4A、WAV |
| **大小** | 建议 < 10MB |
| **时长** | 任意（会自动循环播放） |
| **音质** | 128kbps 以上即可 |

## ⚠️ 注意事项

1. **版权问题**：请确保您有权使用该音乐文件
2. **文件格式**：必须是有效的音频文件
3. **文件名**：必须完全匹配 `insomnia.mp3`

## ✅ 添加完成后

1. 重新运行开发服务器：
   ```bash
   npm run dev
   ```

2. 访问页面测试：
   ```
   http://localhost:3000/moya
   ```

3. 点击「🎶 点击播放《失眠》」按钮测试播放功能

---

**祝任慕瑶喜欢这个有音乐的小惊喜！** 🎵💜
