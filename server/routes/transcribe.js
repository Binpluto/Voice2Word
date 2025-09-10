const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { OpenAI } = require('openai');
const axios = require('axios');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');

const router = express.Router();

// 配置OpenAI
if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
  console.error('❌ 错误: 请在.env文件中配置有效的OPENAI_API_KEY');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 配置文件上传
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'audio-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /\.(mp3|wav|m4a|aac|ogg|flac)$/i;
    if (allowedTypes.test(file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error('不支持的音频格式'));
    }
  }
});

// 辅助函数：获取音频时长
const getAudioDuration = (filePath) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        reject(err);
      } else {
        const duration = metadata.format.duration;
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        resolve(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      }
    });
  });
};

// 辅助函数：转换音频格式
const convertAudio = (inputPath, outputPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .toFormat('mp3')
      .audioCodec('libmp3lame')
      .audioBitrate(128)
      .on('end', () => resolve(outputPath))
      .on('error', reject)
      .save(outputPath);
  });
};

// 辅助函数：从URL下载音频
const downloadAudioFromUrl = async (url, outputPath) => {
  try {
    // 检查是否为YouTube链接
    if (ytdl.validateURL(url)) {
      return new Promise((resolve, reject) => {
        ytdl(url, { 
          filter: 'audioonly',
          quality: 'highestaudio'
        })
        .pipe(fs.createWriteStream(outputPath))
        .on('finish', () => resolve(outputPath))
        .on('error', reject);
      });
    } else {
      // 普通HTTP链接下载
      const response = await axios({
        method: 'GET',
        url: url,
        responseType: 'stream'
      });
      
      return new Promise((resolve, reject) => {
        response.data
          .pipe(fs.createWriteStream(outputPath))
          .on('finish', () => resolve(outputPath))
          .on('error', reject);
      });
    }
  } catch (error) {
    throw new Error('无法下载音频文件');
  }
};

// 辅助函数：使用OpenAI Whisper转录音频
const transcribeAudio = async (filePath) => {
  try {
    // 检查API密钥
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      throw new Error('OpenAI API密钥未配置，请在.env文件中设置有效的OPENAI_API_KEY');
    }
    
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: 'whisper-1',
      language: 'zh', // 指定中文
      response_format: 'text'
    });
    
    return transcription;
  } catch (error) {
    console.error('Whisper转录错误:', error);
    
    // 提供更详细的错误信息
    if (error.message.includes('API密钥')) {
      throw error;
    } else if (error.code === 'insufficient_quota') {
      throw new Error('OpenAI API配额不足，请检查您的账户余额');
    } else if (error.code === 'invalid_api_key') {
      throw new Error('OpenAI API密钥无效，请检查.env文件中的配置');
    } else if (error.code === 'model_not_found') {
      throw new Error('Whisper模型不可用，请稍后重试');
    } else {
      throw new Error(`音频转录失败: ${error.message || '未知错误'}`);
    }
  }
};

// 辅助函数：生成摘要
const generateSummary = async (text) => {
  try {
    // 检查API密钥
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      throw new Error('OpenAI API密钥未配置，请在.env文件中设置有效的OPENAI_API_KEY');
    }
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: '你是一个专业的内容摘要助手。请将用户提供的播客或音频内容总结成200字左右的精炼摘要，突出主要观点和核心内容。摘要应该简洁明了，适合制作成分享卡片。'
        },
        {
          role: 'user',
          content: `请为以下内容生成一个200字左右的摘要：\n\n${text}`
        }
      ],
      max_tokens: 300,
      temperature: 0.7
    });
    
    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error('摘要生成错误:', error);
    
    // 提供更详细的错误信息
    if (error.message.includes('API密钥')) {
      throw error;
    } else if (error.code === 'insufficient_quota') {
      throw new Error('OpenAI API配额不足，请检查您的账户余额');
    } else if (error.code === 'invalid_api_key') {
      throw new Error('OpenAI API密钥无效，请检查.env文件中的配置');
    } else {
      throw new Error(`摘要生成失败: ${error.message || '未知错误'}`);
    }
  }
};

// 辅助函数：提取标题
const extractTitle = async (text) => {
  try {
    // 检查API密钥
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      console.warn('API密钥未配置，跳过标题生成');
      return '音频转录结果';
    }
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: '你是一个专业的标题提取助手。请为用户提供的播客或音频内容生成一个简洁有吸引力的标题，不超过30个字。'
        },
        {
          role: 'user',
          content: `请为以下内容生成一个标题：\n\n${text.substring(0, 1000)}...`
        }
      ],
      max_tokens: 50,
      temperature: 0.7
    });
    
    return completion.choices[0].message.content.trim().replace(/[""]/g, '');
  } catch (error) {
    console.error('标题提取错误:', error);
    // 标题生成失败时返回默认标题，不影响主要功能
    return '音频转录结果';
  }
};

// 主要转录接口
router.post('/transcribe', upload.single('audio'), async (req, res) => {
  let tempFiles = [];
  
  try {
    let audioFilePath;
    
    // 处理文件上传
    if (req.file) {
      audioFilePath = req.file.path;
      tempFiles.push(audioFilePath);
    } 
    // 处理URL输入
    else if (req.body.url) {
      const url = req.body.url.trim();
      const tempFileName = `temp-${Date.now()}.mp3`;
      audioFilePath = path.join(__dirname, '../uploads', tempFileName);
      tempFiles.push(audioFilePath);
      
      await downloadAudioFromUrl(url, audioFilePath);
    } else {
      return res.status(400).json({ error: '请提供音频文件或URL' });
    }
    
    // 检查文件是否存在
    if (!fs.existsSync(audioFilePath)) {
      throw new Error('音频文件不存在');
    }
    
    // 获取音频时长
    let duration;
    try {
      duration = await getAudioDuration(audioFilePath);
    } catch (error) {
      console.warn('无法获取音频时长:', error.message);
      duration = null;
    }
    
    // 转换音频格式（如果需要）
    let processedAudioPath = audioFilePath;
    if (!audioFilePath.toLowerCase().endsWith('.mp3')) {
      const convertedFileName = `converted-${Date.now()}.mp3`;
      processedAudioPath = path.join(__dirname, '../uploads', convertedFileName);
      tempFiles.push(processedAudioPath);
      
      await convertAudio(audioFilePath, processedAudioPath);
    }
    
    // 转录音频
    const fullText = await transcribeAudio(processedAudioPath);
    
    if (!fullText || fullText.trim().length === 0) {
      throw new Error('音频转录结果为空，请检查音频质量');
    }
    
    // 生成摘要和标题
    const [summary, title] = await Promise.all([
      generateSummary(fullText),
      extractTitle(fullText)
    ]);
    
    // 返回结果
    res.json({
      success: true,
      title: title,
      summary: summary,
      fullText: fullText,
      duration: duration,
      wordCount: fullText.length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('转录处理错误:', error);
    res.status(500).json({ 
      error: error.message || '音频处理失败，请稍后重试' 
    });
  } finally {
    // 清理临时文件
    tempFiles.forEach(filePath => {
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (error) {
          console.warn('清理临时文件失败:', filePath, error.message);
        }
      }
    });
  }
});

module.exports = router;