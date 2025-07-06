// Translation service using Google Cloud Translate API
// Note: In production, this should be handled by a backend service for API key security

class TranslationService {
  constructor() {
    // For demo purposes, we'll use a mock translation service
    // In production, you should use Google Cloud Translate API from your backend
    this.mockTranslations = {
      'hello': { 'es': 'hola', 'fr': 'bonjour', 'de': 'hallo', 'it': 'ciao', 'pt': 'olá', 'zh': '你好', 'ja': 'こんにちは', 'ko': '안녕하세요', 'ru': 'привет', 'ar': 'مرحبا' },
      'how are you': { 'es': 'cómo estás', 'fr': 'comment allez-vous', 'de': 'wie geht es dir', 'it': 'come stai', 'pt': 'como está', 'zh': '你好吗', 'ja': 'お元気ですか', 'ko': '어떻게 지내세요', 'ru': 'как дела', 'ar': 'كيف حالك' },
      'good morning': { 'es': 'buenos días', 'fr': 'bonjour', 'de': 'guten morgen', 'it': 'buongiorno', 'pt': 'bom dia', 'zh': '早上好', 'ja': 'おはようございます', 'ko': '좋은 아침', 'ru': 'доброе утро', 'ar': 'صباح الخير' },
      'thank you': { 'es': 'gracias', 'fr': 'merci', 'de': 'danke', 'it': 'grazie', 'pt': 'obrigado', 'zh': '谢谢', 'ja': 'ありがとう', 'ko': '고맙습니다', 'ru': 'спасибо', 'ar': 'شكرا' },
      'goodbye': { 'es': 'adiós', 'fr': 'au revoir', 'de': 'auf wiedersehen', 'it': 'arrivederci', 'pt': 'tchau', 'zh': '再见', 'ja': 'さようなら', 'ko': '안녕', 'ru': 'до свидания', 'ar': 'وداعا' }
    };
  }

  // Get list of supported languages
  getSupportedLanguages() {
    return [
      { code: 'auto', name: 'Auto-detect' },
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Spanish' },
      { code: 'fr', name: 'French' },
      { code: 'de', name: 'German' },
      { code: 'it', name: 'Italian' },
      { code: 'pt', name: 'Portuguese' },
      { code: 'zh', name: 'Chinese' },
      { code: 'ja', name: 'Japanese' },
      { code: 'ko', name: 'Korean' },
      { code: 'ru', name: 'Russian' },
      { code: 'ar', name: 'Arabic' },
      { code: 'hi', name: 'Hindi' },
      { code: 'nl', name: 'Dutch' },
      { code: 'sv', name: 'Swedish' },
      { code: 'da', name: 'Danish' },
      { code: 'no', name: 'Norwegian' },
      { code: 'fi', name: 'Finnish' },
      { code: 'tr', name: 'Turkish' },
      { code: 'pl', name: 'Polish' }
    ];
  }

  // Detect language of text
  async detectLanguage(text) {
    try {
      // Mock language detection based on common patterns
      const lowerText = text.toLowerCase();
      
      // Simple pattern matching for demo
      if (/^[a-zA-Z\s.,!?]+$/.test(text)) {
        if (lowerText.includes('hola') || lowerText.includes('gracias') || lowerText.includes('buenos')) {
          return 'es';
        }
        if (lowerText.includes('bonjour') || lowerText.includes('merci') || lowerText.includes('comment')) {
          return 'fr';
        }
        if (lowerText.includes('guten') || lowerText.includes('danke') || lowerText.includes('wie')) {
          return 'de';
        }
        return 'en'; // Default to English for Latin characters
      }
      
      // Check for Chinese characters
      if (/[\u4e00-\u9fff]/.test(text)) {
        return 'zh';
      }
      
      // Check for Japanese characters
      if (/[\u3040-\u309f\u30a0-\u30ff]/.test(text)) {
        return 'ja';
      }
      
      // Check for Korean characters
      if (/[\u1100-\u11ff\u3130-\u318f\uac00-\ud7af]/.test(text)) {
        return 'ko';
      }
      
      // Check for Arabic characters
      if (/[\u0600-\u06ff]/.test(text)) {
        return 'ar';
      }
      
      // Check for Russian characters
      if (/[\u0400-\u04ff]/.test(text)) {
        return 'ru';
      }
      
      return 'en'; // Default fallback
    } catch (error) {
      console.error('Language detection failed:', error);
      return 'en';
    }
  }

  // Translate text
  async translateText(text, targetLanguage, sourceLanguage = 'auto') {
    try {
      // If source language is auto, detect it first
      if (sourceLanguage === 'auto') {
        sourceLanguage = await this.detectLanguage(text);
      }

      // If target language is same as source, return original text
      if (sourceLanguage === targetLanguage) {
        return {
          translatedText: text,
          sourceLanguage: sourceLanguage,
          targetLanguage: targetLanguage
        };
      }

      // For demo purposes, use mock translations
      const translatedText = this.getMockTranslation(text, targetLanguage);
      
      // In production, you would use Google Cloud Translate API here:
      /*
      const [translation] = await this.translateClient.translate(text, {
        from: sourceLanguage,
        to: targetLanguage
      });
      */

      return {
        translatedText: translatedText,
        sourceLanguage: sourceLanguage,
        targetLanguage: targetLanguage
      };
    } catch (error) {
      console.error('Translation failed:', error);
      throw new Error('Translation service unavailable');
    }
  }

  // Mock translation for demo
  getMockTranslation(text, targetLanguage) {
    const lowerText = text.toLowerCase().trim();
    
    // Check if we have a mock translation
    for (const [key, translations] of Object.entries(this.mockTranslations)) {
      if (lowerText.includes(key)) {
        if (translations[targetLanguage]) {
          return text.replace(new RegExp(key, 'gi'), translations[targetLanguage]);
        }
      }
    }
    
    // Fallback translations for common words
    const fallbacks = {
      'es': `[ES] ${text}`,
      'fr': `[FR] ${text}`,
      'de': `[DE] ${text}`,
      'it': `[IT] ${text}`,
      'pt': `[PT] ${text}`,
      'zh': `[中文] ${text}`,
      'ja': `[日本語] ${text}`,
      'ko': `[한국어] ${text}`,
      'ru': `[RU] ${text}`,
      'ar': `[AR] ${text}`,
      'hi': `[HI] ${text}`,
      'nl': `[NL] ${text}`,
      'sv': `[SV] ${text}`,
      'da': `[DA] ${text}`,
      'no': `[NO] ${text}`,
      'fi': `[FI] ${text}`,
      'tr': `[TR] ${text}`,
      'pl': `[PL] ${text}`
    };
    
    return fallbacks[targetLanguage] || `[${targetLanguage.toUpperCase()}] ${text}`;
  }
}

export default new TranslationService();
