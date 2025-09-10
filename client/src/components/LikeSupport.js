import React, { useState } from 'react';
import { Heart, Share2, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const LikeSupport = () => {
  const { t } = useLanguage();
  const [liked, setLiked] = useState(false);
  const [shared, setShared] = useState(false);
  const [likeCount, setLikeCount] = useState(1024); // 模拟点赞数

  const handleLike = () => {
    if (!liked) {
      setLiked(true);
      setLikeCount(prev => prev + 1);
      // 这里可以添加实际的点赞API调用
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        // 使用原生分享API
        await navigator.share({
          title: 'Voice2Word - 播客转文字神器',
          text: '发现了一个超好用的播客转文字工具！',
          url: window.location.href
        });
      } else {
        // 复制链接到剪贴板
        await navigator.clipboard.writeText(window.location.href);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      }
    } catch (error) {
      console.log('分享失败:', error);
    }
  };

  return (
    <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-xl p-6 mb-8">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {t('likeSupport.title')}
        </h3>
        <p className="text-gray-600 mb-4">
          {t('likeSupport.description')}
        </p>
        
        <div className="flex justify-center space-x-4">
          {/* 点赞按钮 */}
          <button
            onClick={handleLike}
            disabled={liked}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              liked
                ? 'bg-pink-500 text-white cursor-default'
                : 'bg-white text-pink-600 border-2 border-pink-500 hover:bg-pink-500 hover:text-white'
            }`}
          >
            {liked ? (
              <Check className="w-5 h-5" />
            ) : (
              <Heart className="w-5 h-5" />
            )}
            <span>
              {liked ? t('likeSupport.liked') : t('likeSupport.likeButton')}
            </span>
            <span className="bg-pink-100 text-pink-600 px-2 py-1 rounded-full text-sm">
              {likeCount}
            </span>
          </button>

          {/* 分享按钮 */}
          <button
            onClick={handleShare}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200"
          >
            <Share2 className="w-5 h-5" />
            <span>
              {shared ? t('likeSupport.shared') : t('likeSupport.shareButton')}
            </span>
          </button>
        </div>

        {/* 感谢消息 */}
        {liked && (
          <div className="mt-4 p-3 bg-pink-100 rounded-lg">
            <p className="text-pink-700 font-medium">
              🎉 {t('likeSupport.liked')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LikeSupport;