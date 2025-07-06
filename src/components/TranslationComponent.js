import React, { useState } from 'react';
import translationService from '../services/translationService';
import './TranslationComponent.css';

const TranslationComponent = ({ message, onTranslationUpdate }) => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [error, setError] = useState('');

  const supportedLanguages = translationService.getSupportedLanguages();

  const handleTranslate = async () => {
    if (!message.message || message.message.trim() === '') return;

    setIsTranslating(true);
    setError('');
    
    try {
      const result = await translationService.translateText(
        message.message,
        targetLanguage,
        'auto'
      );
      
      setTranslatedText(result.translatedText);
      setSourceLanguage(result.sourceLanguage);
      setShowTranslation(true);
      
      // Notify parent component about translation
      if (onTranslationUpdate) {
        onTranslationUpdate(message.id, {
          translatedText: result.translatedText,
          sourceLanguage: result.sourceLanguage,
          targetLanguage: result.targetLanguage
        });
      }
    } catch (err) {
      setError('Translation failed. Please try again.');
      console.error('Translation error:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleLanguageChange = (e) => {
    setTargetLanguage(e.target.value);
    if (showTranslation) {
      // Re-translate with new language
      setShowTranslation(false);
      setTimeout(() => {
        handleTranslate();
      }, 100);
    }
  };

  const toggleTranslation = () => {
    if (showTranslation) {
      setShowTranslation(false);
    } else if (translatedText) {
      setShowTranslation(true);
    } else {
      handleTranslate();
    }
  };

  const getLanguageName = (code) => {
    const lang = supportedLanguages.find(l => l.code === code);
    return lang ? lang.name : code;
  };

  return (
    <div className="translation-component">
      <div className="translation-controls">
        <select 
          value={targetLanguage} 
          onChange={handleLanguageChange}
          className="language-select"
          disabled={isTranslating}
        >
          {supportedLanguages.filter(lang => lang.code !== 'auto').map(lang => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
        
        <button
          onClick={toggleTranslation}
          disabled={isTranslating}
          className="translate-button"
        >
          {isTranslating ? '⏳' : showTranslation ? '🔄' : '🌐'}
        </button>
      </div>

      {showTranslation && (
        <div className="translation-result">
          <div className="translation-header">
            <span className="translation-info">
              {getLanguageName(sourceLanguage)} → {getLanguageName(targetLanguage)}
            </span>
            <button 
              onClick={() => setShowTranslation(false)}
              className="close-translation"
            >
              ✕
            </button>
          </div>
          
          <div className="original-text">
            <strong>Original:</strong> {message.message}
          </div>
          
          <div className="translated-text">
            <strong>Translation:</strong> {translatedText}
          </div>
        </div>
      )}

      {error && (
        <div className="translation-error">
          {error}
        </div>
      )}
    </div>
  );
};

export default TranslationComponent;
