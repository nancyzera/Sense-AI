import axios from 'axios';
import { aiConfig, getBestAIService, isServiceAvailable } from './aiConfig.js';

/**
 * Text-to-Speech Service - Using FREE APIs
 * Supports multiple free TTS providers
 */
class TextToSpeechService {
  constructor() {
    this.initialized = true;
  }

  /**
   * Convert text to speech using the best available service
   */
  async convertTextToSpeech(text, options = {}) {
    try {
      const service = getBestAIService('textToSpeech');
      
      switch (service) {
        case 'google':
          return await this.convertWithGoogle(text, options);
        case 'azure':
          return await this.convertWithAzure(text, options);
        default:
          return await this.convertWithLocalFallback(text, options);
      }
    } catch (error) {
      console.error('Text-to-speech service error:', error);
      throw new Error('Text-to-speech service temporarily unavailable. Please try again.');
    }
  }

  /**
   * Convert text using Google Cloud Text-to-Speech (Free tier - 1M characters/month)
   */
  async convertWithGoogle(text, options = {}) {
    if (!aiConfig.googleTTS.apiKey) {
      throw new Error('Google Cloud TTS API key not configured');
    }

    try {
      const requestBody = {
        input: {
          text: text
        },
        voice: {
          languageCode: options.language || aiConfig.googleTTS.voice.languageCode,
          name: options.voiceName || aiConfig.googleTTS.voice.name,
          ssmlGender: options.gender || aiConfig.googleTTS.voice.ssmlGender
        },
        audioConfig: {
          audioEncoding: options.encoding || 'MP3',
          speakingRate: options.speakingRate || 1.0,
          pitch: options.pitch || 0.0,
          volumeGainDb: options.volume || 0.0
        }
      };

      const response = await axios.post(
        `https://texttospeech.googleapis.com/v1/text:synthesize?key=${aiConfig.googleTTS.apiKey}`,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000
        }
      );

      if (response.data.audioContent) {
        return {
          audioBuffer: Buffer.from(response.data.audioContent, 'base64'),
          format: options.encoding || 'MP3',
          service: 'google',
          language: options.language || aiConfig.googleTTS.voice.languageCode,
          voice: options.voiceName || aiConfig.googleTTS.voice.name,
          duration: this.estimateDuration(text, options.speakingRate || 1.0)
        };
      } else {
        throw new Error('No audio content received from Google TTS');
      }
    } catch (error) {
      console.error('Google TTS API error:', error);
      throw new Error('Google TTS service error. Falling back to alternative service.');
    }
  }

  /**
   * Convert text using Azure Speech Services (Free tier - 5 hours/month)
   */
  async convertWithAzure(text, options = {}) {
    if (!aiConfig.azureSpeech.subscriptionKey) {
      throw new Error('Azure Speech API key not configured');
    }

    try {
      // First, get access token
      const tokenResponse = await axios.post(
        `https://${aiConfig.azureSpeech.region}.api.cognitive.microsoft.com/sts/v1.0/issuetoken`,
        {},
        {
          headers: {
            'Ocp-Apim-Subscription-Key': aiConfig.azureSpeech.subscriptionKey,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      const accessToken = tokenResponse.data;

      // Create SSML for better control
      const ssml = this.createSSML(text, options);

      const response = await axios.post(
        `https://${aiConfig.azureSpeech.region}.tts.speech.microsoft.com/cognitiveservices/v1`,
        ssml,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/ssml+xml',
            'X-Microsoft-OutputFormat': options.encoding || 'audio-16khz-128kbitrate-mono-mp3'
          },
          responseType: 'arraybuffer',
          timeout: 30000
        }
      );

      return {
        audioBuffer: Buffer.from(response.data),
        format: options.encoding || 'MP3',
        service: 'azure',
        language: options.language || aiConfig.azureSpeech.language,
        voice: options.voiceName || 'en-US-AriaNeural',
        duration: this.estimateDuration(text, options.speakingRate || 1.0)
      };
    } catch (error) {
      console.error('Azure TTS API error:', error);
      throw new Error('Azure TTS service error. Falling back to alternative service.');
    }
  }

  /**
   * Local fallback - Simple text-to-speech simulation
   */
  async convertWithLocalFallback(text, options = {}) {
    // This is a placeholder for local TTS processing
    // In a real implementation, you would:
    // 1. Use a local TTS library like espeak, festival, or similar
    // 2. Generate audio from text
    // 3. Return the audio buffer
    
    // For demonstration, we'll return a placeholder response
    const fallbackMessage = "This is a fallback text-to-speech response. For better audio quality, please configure API keys for Google Cloud or Azure Speech services.";
    
    // Create a simple audio buffer (silence) as placeholder
    const sampleRate = 22050;
    const duration = this.estimateDuration(text, options.speakingRate || 1.0);
    const audioBuffer = Buffer.alloc(sampleRate * duration * 2); // 16-bit audio

    return {
      audioBuffer: audioBuffer,
      format: 'WAV',
      service: 'local-fallback',
      language: options.language || 'en-US',
      voice: 'fallback',
      duration: duration,
      note: 'This is a fallback response. For better audio quality, please configure API keys for Google Cloud or Azure Speech services.'
    };
  }

  /**
   * Create SSML for Azure TTS
   */
  createSSML(text, options = {}) {
    const voice = options.voiceName || 'en-US-AriaNeural';
    const rate = options.speakingRate || 1.0;
    const pitch = options.pitch || 0.0;
    const volume = options.volume || 0.0;

    return `
      <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
        <voice name="${voice}">
          <prosody rate="${rate}" pitch="${pitch}%" volume="${volume}">
            ${this.escapeXml(text)}
          </prosody>
        </voice>
      </speak>
    `;
  }

  /**
   * Escape XML special characters
   */
  escapeXml(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * Estimate audio duration based on text length and speaking rate
   */
  estimateDuration(text, speakingRate = 1.0) {
    // Average speaking rate: 150 words per minute
    const wordsPerMinute = 150 * speakingRate;
    const wordCount = text.split(/\s+/).length;
    const durationInMinutes = wordCount / wordsPerMinute;
    return Math.max(durationInMinutes, 0.5); // Minimum 0.5 seconds
  }

  /**
   * Validate text input
   */
  validateText(text, options = {}) {
    const maxLength = options.maxLength || 5000; // 5000 characters default
    const minLength = options.minLength || 1;

    if (!text || typeof text !== 'string') {
      throw new Error('Text input is required and must be a string');
    }

    if (text.length < minLength) {
      throw new Error('Text is too short. Please provide at least 1 character.');
    }

    if (text.length > maxLength) {
      throw new Error(`Text is too long. Please keep under ${maxLength} characters.`);
    }

    return true;
  }

  /**
   * Get available voices for a language
   */
  getAvailableVoices(language = 'en-US') {
    const voices = {
      'en-US': [
        { name: 'en-US-Wavenet-A', gender: 'MALE', description: 'Male voice' },
        { name: 'en-US-Wavenet-B', gender: 'MALE', description: 'Male voice' },
        { name: 'en-US-Wavenet-C', gender: 'FEMALE', description: 'Female voice' },
        { name: 'en-US-Wavenet-D', gender: 'MALE', description: 'Male voice' },
        { name: 'en-US-Wavenet-E', gender: 'FEMALE', description: 'Female voice' },
        { name: 'en-US-Wavenet-F', gender: 'FEMALE', description: 'Female voice' }
      ],
      'en-GB': [
        { name: 'en-GB-Wavenet-A', gender: 'FEMALE', description: 'British female voice' },
        { name: 'en-GB-Wavenet-B', gender: 'MALE', description: 'British male voice' },
        { name: 'en-GB-Wavenet-C', gender: 'FEMALE', description: 'British female voice' },
        { name: 'en-GB-Wavenet-D', gender: 'MALE', description: 'British male voice' }
      ]
    };

    return voices[language] || voices['en-US'];
  }

  /**
   * Check if text-to-speech service is available
   */
  isAvailable() {
    return isServiceAvailable('textToSpeech');
  }

  /**
   * Get service status and limits
   */
  getServiceStatus() {
    const googleAvailable = !!aiConfig.googleTTS.apiKey;
    const azureAvailable = !!aiConfig.azureSpeech.subscriptionKey;
    
    return {
      google: {
        available: googleAvailable,
        limits: googleAvailable ? {
          freeCharactersPerMonth: 1000000,
          description: 'Google Cloud Text-to-Speech free tier'
        } : null
      },
      azure: {
        available: azureAvailable,
        limits: azureAvailable ? {
          freeHoursPerMonth: 5,
          description: 'Azure Speech Services free tier'
        } : null
      },
      localFallback: {
        available: true,
        limits: {
          description: 'Basic fallback - limited quality'
        }
      }
    };
  }
}

// Export singleton instance
export const textToSpeechService = new TextToSpeechService();
export default textToSpeechService;
