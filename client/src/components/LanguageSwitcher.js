import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSwitcher = () => {
  const { language, switchLanguage, t } = useLanguage();

  return (
    <div className="relative inline-block">
      <div className="flex items-center space-x-2 bg-white rounded-lg shadow-sm border border-gray-200 px-3 py-2">
        <Globe className="w-4 h-4 text-gray-500" />
        <select
          value={language}
          onChange={(e) => switchLanguage(e.target.value)}
          className="bg-transparent border-none outline-none text-sm font-medium text-gray-700 cursor-pointer"
          title={t('language.switch')}
        >
          <option value="zh">{t('language.chinese')}</option>
          <option value="en">{t('language.english')}</option>
        </select>
      </div>
    </div>
  );
};

export default LanguageSwitcher;