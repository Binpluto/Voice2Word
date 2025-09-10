# Voice2Word

一个将播客音频转换成文本并生成简约小卡片的网站。

## 功能特性

- 🎵 支持播客链接输入和音频文件上传
- 📝 自动将音频转换为文本
- 🎨 生成200字左右的内容摘要小卡片
- 📱 小卡片可作为图片下载
- 🌐 现代化的Web界面

## 技术栈

- **前端**: React + Tailwind CSS
- **后端**: Node.js + Express
- **语音转文本**: OpenAI Whisper API
- **图片生成**: Canvas API
- **音频处理**: FFmpeg

## 快速开始

### 安装依赖

```bash
npm run install-all
```

### 环境配置

在 `server` 目录下创建 `.env` 文件：

```env
OPENAI_API_KEY=your_openai_api_key_here
PORT=5000
```

### 启动开发服务器

```bash
npm run dev
```

这将同时启动前端（http://localhost:3000）和后端（http://localhost:5000）服务器。

## 使用方法

1. 访问网站首页
2. 输入播客链接或上传音频文件
3. 等待系统处理音频并生成文本
4. 查看生成的摘要小卡片
5. 下载小卡片图片

## 项目结构

```
voice2word/
├── client/          # React前端应用
├── server/          # Express后端服务
├── package.json     # 根目录配置
└── README.md        # 项目说明
```