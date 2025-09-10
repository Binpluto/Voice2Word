import React from 'react';
import { Heart, Github, Twitter } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-white border-t border-gray-100 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600 text-sm flex items-center">
              {t('footer.madeWith')} <Heart className="w-4 h-4 text-red-500 mx-1" /> {t('footer.team')}
            </p>
          </div>
          
          <div className="flex items-center space-x-6">
            <a
              href="https://github.com"
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://twitter.com"
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="text-center text-xs text-gray-500">
            <p className="mb-2">
              {t('footer.copyright')}
            </p>
            <p>
              {t('footer.formats')} | {t('footer.maxSize')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;