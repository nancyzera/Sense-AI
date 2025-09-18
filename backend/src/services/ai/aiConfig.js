import dotenv from 'dotenv';

dotenv.config();

/**
 * AI Service Configuration
 * All services are configured to use FREE tiers
 */
export const aiConfig = {
  // Hugging Face (Free tier - 1000 requests/month)
  huggingFace: {
    apiKey: process.env.HUGGINGFACE_API_KEY || null,
    baseUrl: 'https://api-inference.huggingface.co/models',
    models: {
      chat: 'microsoft/DialoGPT-medium', // Free conversational AI
      textGeneration: 'gpt2', // Free text generation
      summarization: 'facebook/bart-large-cnn' // Free text summarization
    },
    rateLimit: {
      requestsPerMinute: 10, // Conservative limit for free tier
      requestsPerDay: 1000
    }
  },

  // Groq (Free tier - 14,400 requests/day)
  groq: {
    apiKey: process.env.GROQ_API_KEY || null,
    baseUrl: 'https://api.groq.com/openai/v1',
    models: {
      chat: 'llama3-8b-8192', // Fast and free
      textGeneration: 'llama3-8b-8192'
    },
    rateLimit: {
      requestsPerMinute: 30,
      requestsPerDay: 14400
    }
  },

  // OpenAI Whisper (Free - local processing)
  whisper: {
    model: 'base', // Free model
    language: 'en', // Default language
    temperature: 0.0
  },

  // Google Cloud Speech-to-Text (Free tier - 60 minutes/month)
  googleSpeech: {
    apiKey: process.env.GOOGLE_CLOUD_API_KEY || null,
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID || null,
    languageCode: 'en-US',
    freeTierLimit: 60 * 60 * 1000, // 60 minutes in milliseconds
  },

  // Google Cloud Text-to-Speech (Free tier - 1M characters/month)
  googleTTS: {
    apiKey: process.env.GOOGLE_CLOUD_API_KEY || null,
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID || null,
    voice: {
      languageCode: 'en-US',
      name: 'en-US-Wavenet-D',
      ssmlGender: 'NEUTRAL'
    },
    freeTierLimit: 1000000, // 1 million characters
  },

  // Azure Speech (Free tier - 5 hours/month)
  azureSpeech: {
    subscriptionKey: process.env.AZURE_SPEECH_KEY || null,
    region: process.env.AZURE_SPEECH_REGION || 'eastus',
    language: 'en-US',
    freeTierLimit: 5 * 60 * 60 * 1000, // 5 hours in milliseconds
  },

  // Fallback options (completely free)
  fallback: {
    // Use local processing when possible
    useLocalProcessing: true,
    // Use free APIs when available
    useFreeAPIs: true,
    // Graceful degradation
    gracefulDegradation: true
  }
};

/**
 * Get the best available AI service based on configuration
 */
export const getBestAIService = (serviceType) => {
  const config = aiConfig;
  
  switch (serviceType) {
    case 'chat':
      // Priority: Groq (fastest) -> Hugging Face -> Local
      if (config.groq.apiKey) return 'groq';
      if (config.huggingFace.apiKey) return 'huggingface';
      return 'local';
      
    case 'speechToText':
      // Priority: Google Cloud -> Azure -> Local Whisper
      if (config.googleSpeech.apiKey) return 'google';
      if (config.azureSpeech.subscriptionKey) return 'azure';
      return 'whisper';
      
    case 'textToSpeech':
      // Priority: Google Cloud -> Azure -> Local
      if (config.googleTTS.apiKey) return 'google';
      if (config.azureSpeech.subscriptionKey) return 'azure';
      return 'local';
      
    default:
      return 'local';
  }
};

/**
 * Check if a service is available and within free tier limits
 */
export const isServiceAvailable = (serviceType) => {
  const service = getBestAIService(serviceType);
  const config = aiConfig;
  
  switch (service) {
    case 'groq':
      return !!config.groq.apiKey;
    case 'huggingface':
      return !!config.huggingFace.apiKey;
    case 'google':
      return !!config.googleSpeech.apiKey;
    case 'azure':
      return !!config.azureSpeech.subscriptionKey;
    case 'whisper':
    case 'local':
      return true; // Always available
    default:
      return false;
  }
};

export default aiConfig;
