import React, { useState, useEffect } from 'react';
import { Loader2, Headphones, FileText, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const ProcessingStatus = () => {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: Headphones,
      title: t('processing.steps.audio'),
      description: '解析音频文件格式并准备转换'
    },
    {
      icon: FileText,
      title: t('processing.steps.transcribe'),
      description: '使用AI技术将语音转换为文字'
    },
    {
      icon: Sparkles,
      title: t('processing.steps.summary'),
      description: '智能提取关键内容并制作精美卡片'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="card max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
          <Loader2 className="w-8 h-8 text-primary-600 loading-spinner" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('processing.title')}
        </h2>
        <p className="text-gray-600">
          请稍候，这可能需要几分钟时间
        </p>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          
          return (
            <div
              key={index}
              className={`flex items-center p-4 rounded-lg transition-all duration-300 ${
                isActive
                  ? 'bg-primary-50 border-2 border-primary-200'
                  : isCompleted
                  ? 'bg-green-50 border-2 border-green-200'
                  : 'bg-gray-50 border-2 border-gray-200'
              }`}
            >
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full mr-4 ${
                  isActive
                    ? 'bg-primary-500 text-white'
                    : isCompleted
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {isActive ? (
                  <Loader2 className="w-5 h-5 loading-spinner" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              <div className="text-left">
                <h3
                  className={`font-medium ${
                    isActive
                      ? 'text-primary-900'
                      : isCompleted
                      ? 'text-green-900'
                      : 'text-gray-700'
                  }`}
                >
                  {step.title}
                </h3>
                <p
                  className={`text-sm ${
                    isActive
                      ? 'text-primary-600'
                      : isCompleted
                      ? 'text-green-600'
                      : 'text-gray-500'
                  }`}
                >
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700">
          💡 <strong>{t('processing.tips.title')}：</strong>{t('processing.tips.tip1')}
        </p>
      </div>
    </div>
  );
};

export default ProcessingStatus;