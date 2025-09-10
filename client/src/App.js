import React, { useState } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import Header from './components/Header';
import AudioUpload from './components/AudioUpload';
import ProcessingStatus from './components/ProcessingStatus';
import ResultCard from './components/ResultCard';
import Footer from './components/Footer';
import LikeSupport from './components/LikeSupport';

function App() {
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleAudioSubmit = async (audioData) => {
    setProcessing(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      
      if (audioData.type === 'file') {
        formData.append('audio', audioData.file);
      } else if (audioData.type === 'url') {
        formData.append('url', audioData.url);
      }

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('转换失败，请稍后重试');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setProcessing(false);
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Header />
        
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          {!result && !processing && (
            <div className="animate-fade-in">
              <AudioUpload onSubmit={handleAudioSubmit} error={error} />
            </div>
          )}
          
          {processing && (
            <div className="animate-slide-up">
              <ProcessingStatus />
            </div>
          )}
          
          {result && (
            <div className="animate-slide-up">
              <ResultCard result={result} onReset={handleReset} />
            </div>
          )}
          
          {/* 只在有结果时显示点赞支持模块 */}
          {result && <LikeSupport />}
        </main>
        
        <Footer />
      </div>
    </LanguageProvider>
  );
}

export default App;