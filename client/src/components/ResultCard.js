import React, { useRef } from 'react';
import { Download, RefreshCw, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const ResultCard = ({ result, onReset }) => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const cardRef = useRef(null);

  const handleDownload = async () => {
    try {
      const response = await fetch('/api/generate-card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: result.title,
          summary: result.summary,
          duration: result.duration,
          timestamp: new Date().toLocaleDateString('zh-CN')
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${result.title || '播客摘要'}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('下载失败:', error);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('复制失败:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 操作按钮 */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">{t('result.title')}</h2>
        <button
          onClick={onReset}
          className="btn-secondary flex items-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>{t('result.restart')}</span>
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* 文本内容 */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('result.conversionResult')}</h3>
          
          {result.title && (
            <div className="mb-4">
              <h4 className="font-medium text-gray-700 mb-2">{t('result.title')}</h4>
              <p className="text-gray-900 font-medium">{result.title}</p>
            </div>
          )}

          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-700">{t('result.summary')}</h4>
              <button
                onClick={handleCopy}
                className="text-sm text-primary-600 hover:text-primary-700 flex items-center space-x-1"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{t('result.copied')}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>{t('result.copyText')}</span>
                  </>
                )}
              </button>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-800 leading-relaxed">{result.summary}</p>
            </div>
          </div>

          {result.duration && (
            <div className="text-sm text-gray-500">
{t('result.duration')}: {result.duration}
            </div>
          )}
        </div>

        {/* 预览卡片 */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{t('result.summaryCard')}</h3>
            <button
              onClick={handleDownload}
              className="btn-primary flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>{t('result.downloadCard')}</span>
            </button>
          </div>
          
          {/* 卡片预览 */}
          <div 
            ref={cardRef}
            className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white shadow-lg"
          >
            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-sm opacity-90">Voice2Word</span>
              </div>
              {result.title && (
                <h4 className="text-lg font-bold mb-3 line-clamp-2">
                  {result.title}
                </h4>
              )}
            </div>
            
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-sm leading-relaxed line-clamp-6">
                {result.summary}
              </p>
            </div>
            
            <div className="flex justify-between items-center mt-4 text-xs opacity-75">
              <span>{new Date().toLocaleDateString('zh-CN')}</span>
              {result.duration && <span>{result.duration}</span>}
            </div>
          </div>
          
          <p className="text-xs text-gray-500 mt-3 text-center">
{t('result.downloadHint')}
          </p>
        </div>
      </div>

      {/* 完整转录文本 */}
      {result.fullText && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('result.fullTranscription')}</h3>
          <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
              {result.fullText}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultCard;