import React, { createContext, useContext, useState } from 'react';
import { getTranslation } from '../i18n/translations';

// 创建语言上下文
const LanguageContext = createContext();

// 语言提供者组件
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // 从localStorage获取保存的语言设置，默认为中文
    const savedLanguage = localStorage.getItem('voice2word-language');
    return savedLanguage || 'zh';
  });

  // 切换语言函数
  const switchLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem('voice2word-language', newLanguage);
  };

  // 获取翻译文本的函数
  const t = (key) => {
    return getTranslation(language, key);
  };

  const value = {
    language,
    switchLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// 使用语言上下文的Hook
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};