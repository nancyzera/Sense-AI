/**
 * AI Services Manager
 * Central hub for all AI services with fallback support
 */
import chatService from './chatService.js';
import speechToTextService from './speechToTextService.js';
import textToSpeechService from './textToSpeechService.js';
import { aiConfig } from './aiConfig.js';

/**
 * AI Services Manager Class
 * Provides a unified interface for all AI services
 */
class AIServicesManager {
  constructor() {
    this.chat = chatService;
    this.speechToText = speechToTextService;
    this.textToSpeech = textToSpeechService;
    this.config = aiConfig;
  }

  /**
   * Get overall AI services status
   */
  getStatus() {
    return {
      chat: {
        available: this.chat.isAvailable(),
        status: this.chat.getServiceStatus()
      },
      speechToText: {
        available: this.speechToText.isAvailable(),
        status: this.speechToText.getServiceStatus()
      },
      textToSpeech: {
        available: this.textToSpeech.isAvailable(),
        status: this.textToSpeech.getServiceStatus()
      },
      configuration: {
        hasApiKeys: this.hasAnyApiKeys(),
        servicesConfigured: this.getConfiguredServices()
      }
    };
  }

  /**
   * Check if any API keys are configured
   */
  hasAnyApiKeys() {
    return !!(
      this.config.groq.apiKey ||
      this.config.huggingFace.apiKey ||
      this.config.googleSpeech.apiKey ||
      this.config.googleTTS.apiKey ||
      this.config.azureSpeech.subscriptionKey
    );
  }

  /**
   * Get list of configured services
   */
  getConfiguredServices() {
    const services = [];
    
    if (this.config.groq.apiKey) services.push('Groq Chat');
    if (this.config.huggingFace.apiKey) services.push('Hugging Face Chat');
    if (this.config.googleSpeech.apiKey) services.push('Google Speech-to-Text');
    if (this.config.googleTTS.apiKey) services.push('Google Text-to-Speech');
    if (this.config.azureSpeech.subscriptionKey) services.push('Azure Speech Services');
    
    if (services.length === 0) {
      services.push('Local Fallback Services');
    }
    
    return services;
  }

  /**
   * Get service recommendations for setup
   */
  getSetupRecommendations() {
    const recommendations = [];
    
    if (!this.config.groq.apiKey) {
      recommendations.push({
        service: 'Groq',
        description: 'Free tier with 14,400 requests/day',
        url: 'https://console.groq.com/',
        priority: 'high',
        reason: 'Fastest and most generous free tier for chat'
      });
    }
    
    if (!this.config.huggingFace.apiKey) {
      recommendations.push({
        service: 'Hugging Face',
        description: 'Free tier with 1,000 requests/month',
        url: 'https://huggingface.co/settings/tokens',
        priority: 'medium',
        reason: 'Good fallback for chat services'
      });
    }
    
    if (!this.config.googleSpeech.apiKey) {
      recommendations.push({
        service: 'Google Cloud Speech',
        description: 'Free tier with 60 minutes/month',
        url: 'https://console.cloud.google.com/',
        priority: 'high',
        reason: 'Best free speech-to-text service'
      });
    }
    
    if (!this.config.googleTTS.apiKey) {
      recommendations.push({
        service: 'Google Cloud TTS',
        description: 'Free tier with 1M characters/month',
        url: 'https://console.cloud.google.com/',
        priority: 'high',
        reason: 'Best free text-to-speech service'
      });
    }
    
    if (!this.config.azureSpeech.subscriptionKey) {
      recommendations.push({
        service: 'Azure Speech Services',
        description: 'Free tier with 5 hours/month',
        url: 'https://azure.microsoft.com/en-us/free/',
        priority: 'medium',
        reason: 'Alternative speech services'
      });
    }
    
    return recommendations;
  }

  /**
   * Test all services
   */
  async testServices() {
    const results = {
      chat: { success: false, error: null },
      speechToText: { success: false, error: null },
      textToSpeech: { success: false, error: null }
    };

    // Test chat service
    try {
      const chatResponse = await this.chat.generateResponse('Hello, this is a test message.');
      results.chat.success = true;
      results.chat.response = chatResponse.response;
      results.chat.service = chatResponse.service;
    } catch (error) {
      results.chat.error = error.message;
    }

    // Test speech-to-text service (with dummy audio)
    try {
      const dummyAudio = Buffer.from('dummy audio data');
      const sttResponse = await this.speechToText.convertAudioToText(dummyAudio);
      results.speechToText.success = true;
      results.speechToText.service = sttResponse.service;
    } catch (error) {
      results.speechToText.error = error.message;
    }

    // Test text-to-speech service
    try {
      const ttsResponse = await this.textToSpeech.convertTextToSpeech('Hello, this is a test.');
      results.textToSpeech.success = true;
      results.textToSpeech.service = ttsResponse.service;
    } catch (error) {
      results.textToSpeech.error = error.message;
    }

    return results;
  }

  /**
   * Get usage statistics (if available)
   */
  getUsageStats() {
    // This would typically track usage across services
    // For now, return placeholder data
    return {
      chat: {
        requestsToday: 0,
        requestsThisMonth: 0,
        remainingRequests: 'unlimited'
      },
      speechToText: {
        minutesUsed: 0,
        minutesRemaining: 'unlimited'
      },
      textToSpeech: {
        charactersUsed: 0,
        charactersRemaining: 'unlimited'
      }
    };
  }
}

// Export singleton instance
export const aiServicesManager = new AIServicesManager();
export default aiServicesManager;

// Export individual services for direct access
export { chatService, speechToTextService, textToSpeechService };
