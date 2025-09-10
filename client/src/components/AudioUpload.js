import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Link, FileAudio, AlertCircle, Settings } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import ConfigCheck from './ConfigCheck';

const AudioUpload = ({ onSubmit, error }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('file'); // 'file' or 'url'
  const [url, setUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [showConfigCheck, setShowConfigCheck] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.m4a', '.aac', '.ogg', '.flac']
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024 // 50MB
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (activeTab === 'file' && selectedFile) {
      onSubmit({ type: 'file', file: selectedFile });
    } else if (activeTab === 'url' && url.trim()) {
      onSubmit({ type: 'url', url: url.trim() });
    }
  };

  const isValid = (activeTab === 'file' && selectedFile) || (activeTab === 'url' && url.trim());

  return (
    <div className="card max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('upload.title')}
        </h2>
        <p className="text-gray-600">
          {t('upload.supportedFormats')}
        </p>
      </div>

      {/* Tab切换 */}
      <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
        <button
          type="button"
          onClick={() => setActiveTab('file')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'file'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Upload className="w-4 h-4 inline mr-2" />
          {t('upload.fileTab')}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('url')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'url'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Link className="w-4 h-4 inline mr-2" />
          {t('upload.linkTab')}
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {activeTab === 'file' && (
          <div className="mb-6">
            <div
              {...getRootProps()}
              className={`upload-zone ${
                isDragActive ? 'active' : ''
              } ${selectedFile ? 'border-green-300 bg-green-50' : ''}`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center">
                {selectedFile ? (
                  <>
                    <FileAudio className="w-12 h-12 text-green-500 mb-4" />
                    <p className="text-lg font-medium text-green-700 mb-2">
                      {selectedFile.name}
                    </p>
                    <p className="text-sm text-green-600">
                      文件大小: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-gray-400 mb-4" />
                    <p className="text-lg font-medium text-gray-700 mb-2">
                      {isDragActive ? t('upload.dropFile') : t('upload.dragDrop')}
                    </p>
                    <p className="text-sm text-gray-500">
                      {t('upload.clickToSelect')}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'url' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('upload.linkLabel')}
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={t('upload.linkPlaceholder')}
              className="input-field"
            />
            <p className="text-xs text-gray-500 mt-2">
              {t('upload.linkExample')}
            </p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start mb-2">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800">处理失败</p>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
            </div>
            {(error.includes('API密钥') || error.includes('配额') || error.includes('转录失败')) && (
              <button
                onClick={() => setShowConfigCheck(true)}
                className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 flex items-center"
              >
                <Settings className="w-4 h-4 mr-1" />
                检查配置
              </button>
            )}
          </div>
        )}
        
        {showConfigCheck && (
          <ConfigCheck onClose={() => setShowConfigCheck(false)} />
        )}

        <button
          type="submit"
          disabled={!isValid}
          className="btn-primary w-full py-3 text-lg"
        >
          {t('upload.submit')}
        </button>
      </form>
    </div>
  );
};

export default AudioUpload;