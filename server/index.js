const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const transcribeRoutes = require('./routes/transcribe');
const cardRoutes = require('./routes/card');

const app = express();
const PORT = process.env.PORT || 5000;

// 确保上传目录存在
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 中间件
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 静态文件服务
app.use('/uploads', express.static(uploadDir));

// 路由
app.use('/api', transcribeRoutes);
app.use('/api', cardRoutes);

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Voice2Word API服务运行正常',
    timestamp: new Date().toISOString()
  });
});

// 错误处理中间件
app.use((error, req, res, next) => {
  console.error('服务器错误:', error);
  
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        error: '文件太大，请上传小于50MB的音频文件' 
      });
    }
  }
  
  res.status(500).json({ 
    error: '服务器内部错误，请稍后重试' 
  });
});

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: '接口不存在' 
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 Voice2Word服务器运行在端口 ${PORT}`);
  console.log(`📝 API文档: http://localhost:${PORT}/api/health`);
  console.log(`🌐 前端地址: ${process.env.CLIENT_URL || 'http://localhost:3000'}`);
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('收到SIGTERM信号，正在关闭服务器...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('收到SIGINT信号，正在关闭服务器...');
  process.exit(0);
});