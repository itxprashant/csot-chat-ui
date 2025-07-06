import React, { useState, useEffect } from 'react';
import translationService from '../services/translationService';
import './TranslationSettings.css';

const TranslationSettings = ({ onSettingsChange, isVisible, onClose }) => {
  const [settings, setSettings] = useState({
    autoTranslate: false,
    preferredLanguage: 'en',
    showOriginalText: true,
    autoDetectLanguage: true
  });

  const supportedLanguages = translationService.getSupportedLanguages();

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('translationSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
      } catch (error) {
        console.error('Error loading translation settings:', error);
      }
    }
  }, []);

  const handleSettingChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    // Save to localStorage
    localStorage.setItem('translationSettings', JSON.stringify(newSettings));
    
    // Notify parent component
    if (onSettingsChange) {
      onSettingsChange(newSettings);
    }
  };

  const resetSettings = () => {
    const defaultSettings = {
      autoTranslate: false,
      preferredLanguage: 'en',
      showOriginalText: true,
      autoDetectLanguage: true
    };
    setSettings(defaultSettings);
    localStorage.setItem('translationSettings', JSON.stringify(defaultSettings));
    if (onSettingsChange) {
      onSettingsChange(defaultSettings);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="translation-settings-overlay">
      <div className="translation-settings-modal">
        <div className="translation-settings-header">
          <h3>Translation Settings</h3>
          <button 
            className="close-settings-btn"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="translation-settings-content">
          <div className="setting-group">
            <label className="setting-label">
              <input
                type="checkbox"
                checked={settings.autoTranslate}
                onChange={(e) => handleSettingChange('autoTranslate', e.target.checked)}
              />
              <span>Auto-translate incoming messages</span>
            </label>
            <p className="setting-description">
              Automatically translate messages to your preferred language
            </p>
          </div>

          <div className="setting-group">
            <label className="setting-label">
              Preferred Language:
              <select
                value={settings.preferredLanguage}
                onChange={(e) => handleSettingChange('preferredLanguage', e.target.value)}
                className="setting-select"
              >
                {supportedLanguages.filter(lang => lang.code !== 'auto').map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </label>
            <p className="setting-description">
              Your preferred language for translations
            </p>
          </div>

          <div className="setting-group">
            <label className="setting-label">
              <input
                type="checkbox"
                checked={settings.showOriginalText}
                onChange={(e) => handleSettingChange('showOriginalText', e.target.checked)}
              />
              <span>Show original text with translations</span>
            </label>
            <p className="setting-description">
              Display both original and translated text
            </p>
          </div>

          <div className="setting-group">
            <label className="setting-label">
              <input
                type="checkbox"
                checked={settings.autoDetectLanguage}
                onChange={(e) => handleSettingChange('autoDetectLanguage', e.target.checked)}
              />
              <span>Auto-detect source language</span>
            </label>
            <p className="setting-description">
              Automatically detect the language of incoming messages
            </p>
          </div>

          <div className="setting-actions">
            <button 
              className="reset-btn"
              onClick={resetSettings}
            >
              Reset to Default
            </button>
            <button 
              className="save-btn"
              onClick={onClose}
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranslationSettings;
