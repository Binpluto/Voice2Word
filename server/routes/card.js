const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// 卡片生成接口
router.post('/generate-card', async (req, res) => {
  try {
    const { title, summary, duration, timestamp } = req.body;
    
    if (!summary) {
      return res.status(400).json({ error: '摘要内容不能为空' });
    }
    
    // 生成SVG卡片
    const width = 800;
    const height = 600;
    
    // 处理文本换行
    const titleLines = title ? wrapText(title, 30) : [];
    const summaryLines = wrapText(summary, 45);
    
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#8B5CF6;stop-opacity:1" />
          </linearGradient>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="rgba(0,0,0,0.1)"/>
          </filter>
        </defs>
        
        <!-- 背景 -->
        <rect width="100%" height="100%" fill="url(#bgGradient)"/>
        
        <!-- 装饰圆形 -->
        <circle cx="700" cy="100" r="150" fill="white" opacity="0.1"/>
        <circle cx="100" cy="500" r="100" fill="white" opacity="0.1"/>
        
        <!-- 品牌标识 -->
        <text x="50" y="60" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="white">Voice2Word</text>
        <circle cx="60" cy="80" r="4" fill="white"/>
        
        <!-- 标题 -->
        ${titleLines.map((line, index) => 
          `<text x="50" y="${140 + index * 40}" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="white">${escapeXml(line)}</text>`
        ).join('')}
        
        <!-- 内容背景 -->
        <rect x="50" y="${titleLines.length > 0 ? 140 + titleLines.length * 40 + 30 : 140}" width="700" height="280" rx="20" fill="white" opacity="0.2" filter="url(#shadow)"/>
        
        <!-- 摘要内容 -->
        ${summaryLines.slice(0, 10).map((line, index) => 
          `<text x="70" y="${(titleLines.length > 0 ? 140 + titleLines.length * 40 + 30 : 140) + 40 + index * 28}" font-family="Arial, sans-serif" font-size="20" fill="white">${escapeXml(line)}</text>`
        ).join('')}
        
        <!-- 底部信息 -->
        ${timestamp ? `<text x="50" y="540" font-family="Arial, sans-serif" font-size="16" fill="white" opacity="0.8">${escapeXml(timestamp)}</text>` : ''}
        ${duration ? `<text x="650" y="540" font-family="Arial, sans-serif" font-size="16" fill="white" opacity="0.8" text-anchor="end">时长: ${escapeXml(duration)}</text>` : ''}
      </svg>
    `;
    
    // 设置响应头
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Content-Disposition', 'attachment; filename="voice2word-card.svg"');
    
    // 输出SVG
    res.send(svg);
    
  } catch (error) {
    console.error('卡片生成错误:', error);
    res.status(500).json({ error: '卡片生成失败' });
  }
});

// 辅助函数：文本换行
function wrapText(text, maxCharsPerLine) {
  const lines = [];
  let currentLine = '';
  
  for (let i = 0; i < text.length; i++) {
    if (currentLine.length >= maxCharsPerLine && text[i] === ' ') {
      lines.push(currentLine.trim());
      currentLine = '';
    } else {
      currentLine += text[i];
    }
  }
  
  if (currentLine.trim()) {
    lines.push(currentLine.trim());
  }
  
  return lines;
}

// 辅助函数：转义XML字符
function escapeXml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

module.exports = router;