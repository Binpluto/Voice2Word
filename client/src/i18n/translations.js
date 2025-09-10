// 国际化翻译配置
export const translations = {
  zh: {
    // Header
    title: 'Voice2Word',
    subtitle: '播客转文字神器',
    nav: {
      home: '首页',
      about: '关于',
      contact: '联系'
    },

    // AudioUpload
    upload: {
      title: '上传音频文件或输入播客链接',
      fileTab: '文件上传',
      linkTab: '播客链接',
      dragDrop: '拖拽音频文件到这里，或点击选择文件',
      supportedFormats: '支持 MP3, WAV, M4A 等格式',
      maxSize: '最大文件大小: 50MB',
      linkPlaceholder: '请输入播客链接 (支持各大播客平台)',
      linkExample: '例如: https://example.com/podcast.mp3',
      submit: '开始转换',
      processing: '处理中...',
      dropFile: '放开文件以上传',
      clickToSelect: '或点击选择文件 (支持 MP3, WAV, M4A 等格式，最大 50MB)',
      linkLabel: '播客链接'
    },

    // ProcessingStatus
    processing: {
      title: '正在处理您的音频...',
      steps: {
        audio: '音频处理',
        transcribe: '语音转文字',
        summary: '生成摘要卡片'
      },
      tips: {
        title: '小贴士',
        tip1: '处理时间取决于音频长度',
        tip2: '我们使用先进的AI技术确保准确性',
        tip3: '生成的摘要卡片可直接分享'
      }
    },

    // ResultCard
    result: {
      title: '转换完成！',
      transcription: '转录文本',
      summary: '内容摘要',
      downloadCard: '下载摘要卡片',
      copyText: '复制文本',
      restart: '重新开始',
      copied: '已复制到剪贴板！',
      downloading: '生成中...',
      conversionResult: '转换结果',
      duration: '音频时长',
      summaryCard: '摘要卡片',
      downloadHint: '点击下载按钮获取高清图片版本',
      fullTranscription: '完整转录文本'
    },

    // Footer
    footer: {
      madeWith: '用心制作',
      team: 'Voice2Word 团队',
      copyright: '© 2024 Voice2Word. 保留所有权利。',
      formats: '支持的音频格式: MP3, WAV, M4A, AAC, OGG, FLAC',
      maxSize: '最大文件大小: 50MB'
    },

    // LikeSupport
    likeSupport: {
      title: '觉得好用吗？',
      description: '如果这个工具对您有帮助，请给我们点个赞支持一下！',
      likeButton: '👍 点赞支持',
      shareButton: '📤 分享给朋友',
      liked: '感谢您的支持！',
      shared: '分享链接已复制！'
    },

    // Language
    language: {
      switch: '切换语言',
      chinese: '中文',
      english: 'English'
    }
  },

  en: {
    // Header
    title: 'Voice2Word',
    subtitle: 'Podcast to Text Converter',
    nav: {
      home: 'Home',
      about: 'About',
      contact: 'Contact'
    },

    // AudioUpload
    upload: {
      title: 'Upload Audio File or Enter Podcast Link',
      fileTab: 'File Upload',
      linkTab: 'Podcast Link',
      dragDrop: 'Drag and drop audio files here, or click to select',
      supportedFormats: 'Supports MP3, WAV, M4A and more',
      maxSize: 'Max file size: 50MB',
      linkPlaceholder: 'Enter podcast link (supports major podcast platforms)',
      linkExample: 'e.g., https://example.com/podcast.mp3',
      submit: 'Start Conversion',
      processing: 'Processing...',
      dropFile: 'Drop files to upload',
       clickToSelect: 'or click to select files (Supports MP3, WAV, M4A formats, max 50MB)',
       linkLabel: 'Podcast Link'
     },

     // ProcessingStatus
    processing: {
      title: 'Processing your audio...',
      steps: {
        audio: 'Audio Processing',
        transcribe: 'Speech to Text',
        summary: 'Generate Summary Card'
      },
      tips: {
        title: 'Tips',
        tip1: 'Processing time depends on audio length',
        tip2: 'We use advanced AI technology for accuracy',
        tip3: 'Generated summary cards can be shared directly'
      }
    },

    // ResultCard
    result: {
      title: 'Conversion Complete!',
      transcription: 'Transcription',
      summary: 'Summary',
      downloadCard: 'Download Summary Card',
      copyText: 'Copy Text',
      restart: 'Start Over',
      copied: 'Copied to clipboard!',
      downloading: 'Generating...',
      conversionResult: 'Conversion Result',
      duration: 'Audio Duration',
      summaryCard: 'Summary Card',
      downloadHint: 'Click download button to get high-resolution image',
      fullTranscription: 'Full Transcription'
    },

    // Footer
    footer: {
      madeWith: 'Made with',
      team: 'Voice2Word Team',
      copyright: '© 2024 Voice2Word. All rights reserved.',
      formats: 'Supported formats: MP3, WAV, M4A, AAC, OGG, FLAC',
      maxSize: 'Max file size: 50MB'
    },

    // LikeSupport
    likeSupport: {
      title: 'Find it useful?',
      description: 'If this tool helped you, please give us a like to show your support!',
      likeButton: '👍 Like & Support',
      shareButton: '📤 Share with Friends',
      liked: 'Thank you for your support!',
      shared: 'Share link copied!'
    },

    // Language
    language: {
      switch: 'Switch Language',
      chinese: '中文',
      english: 'English'
    }
  }
};

// 获取翻译文本的辅助函数
export const getTranslation = (language, key) => {
  const keys = key.split('.');
  let result = translations[language];
  
  for (const k of keys) {
    if (result && result[k]) {
      result = result[k];
    } else {
      return key; // 如果找不到翻译，返回原key
    }
  }
  
  return result;
};