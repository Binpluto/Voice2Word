import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, ExternalLink, RefreshCw } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const ConfigCheck = ({ onClose }) => {
  const { t } = useLanguage();
  const [configStatus, setConfigStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkConfig = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5000/api/config-check');
      if (!response.ok) {
        throw new Error('无法连接到后端服务器');
      }
      const data = await response.json();
      setConfigStatus(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkConfig();
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex items-center justify-center">
            <RefreshCw className="w-6 h-6 animate-spin text-blue-500 mr-2" />
            <span>{t('config.checking')}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center">
            {error ? (
              <AlertTriangle className="w-6 h-6 text-red-500 mr-2" />
            ) : configStatus?.status === 'healthy' ? (
              <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-yellow-500 mr-2" />
            )}
            {t('config.title')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold"
          >
            ×
          </button>
        </div>

        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-red-800 mb-2">{t('config.connectionError')}</h3>
            <p className="text-red-700 mb-3">{error}</p>
            <div className="text-sm text-red-600">
              <p>{t('config.possibleCauses')}</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>{t('config.serverNotRunning')}</li>
                <li>{t('config.portOccupied')}</li>
                <li>{t('config.networkIssue')}</li>
              </ul>
            </div>
            <button
              onClick={checkConfig}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              {t('config.recheck')}
            </button>
          </div>
        ) : configStatus ? (
          <div>
            <div className={`border rounded-lg p-4 mb-4 ${
              configStatus.status === 'healthy' 
                ? 'bg-green-50 border-green-200' 
                : 'bg-yellow-50 border-yellow-200'
            }`}>
              <h3 className={`font-semibold mb-2 ${
                configStatus.status === 'healthy' ? 'text-green-800' : 'text-yellow-800'
              }`}>
                {configStatus.message}
              </h3>
              
              {configStatus.issues.length > 0 && (
                <div className="mb-3">
                  <h4 className="font-medium text-yellow-800 mb-1">{t('config.foundIssues')}</h4>
                  <ul className="list-disc list-inside text-yellow-700 space-y-1">
                    {configStatus.issues.map((issue, index) => (
                      <li key={index}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {configStatus.suggestions.length > 0 && (
                <div>
                  <h4 className="font-medium text-yellow-800 mb-1">{t('config.suggestions')}</h4>
                  <ul className="list-disc list-inside text-yellow-700 space-y-1">
                    {configStatus.suggestions.map((suggestion, index) => (
                      <li key={index}>
                        {suggestion.includes('https://') ? (
                          <>
                            {suggestion.split('https://')[0]}
                            <a 
                              href={`https://${suggestion.split('https://')[1]}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 inline-flex items-center"
                            >
                              https://{suggestion.split('https://')[1]}
                              <ExternalLink className="w-3 h-3 ml-1" />
                            </a>
                          </>
                        ) : (
                          suggestion
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-gray-800 mb-2">{t('config.configDetails')}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('config.apiKey')}</span>
                  <span className={configStatus.config.openai_api_key ? 'text-green-600' : 'text-red-600'}>
                    {configStatus.config.openai_api_key ? t('config.configured') : t('config.notConfigured')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('config.uploadDir')}</span>
                  <span className={configStatus.config.upload_dir_exists ? 'text-green-600' : 'text-red-600'}>
                    {configStatus.config.upload_dir_exists ? t('config.normal') : t('config.abnormal')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('config.environment')}</span>
                  <span className="text-gray-800">{configStatus.config.node_env}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={checkConfig}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                {t('config.recheck')}
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                {t('config.close')}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ConfigCheck;