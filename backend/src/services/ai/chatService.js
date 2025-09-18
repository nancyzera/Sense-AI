import axios from 'axios';
import { Groq } from 'groq-sdk';
import { HfInference } from '@huggingface/inference';
import { aiConfig, getBestAIService, isServiceAvailable } from './aiConfig.js';

/**
 * AI Chat Service - Using FREE APIs
 * Supports multiple free AI providers with fallback
 */
class ChatService {
  constructor() {
    this.groq = null;
    this.huggingFace = null;
    this.initializeServices();
  }

  /**
   * Initialize AI services based on available API keys
   */
  initializeServices() {
    // Initialize Groq (Free tier - 14,400 requests/day)
    if (aiConfig.groq.apiKey) {
      this.groq = new Groq({
        apiKey: aiConfig.groq.apiKey,
      });
    }

    // Initialize Hugging Face (Free tier - 1000 requests/month)
    if (aiConfig.huggingFace.apiKey) {
      this.huggingFace = new HfInference(aiConfig.huggingFace.apiKey);
    }
  }

  /**
   * Generate AI response using the best available service
   */
  async generateResponse(userMessage, conversationHistory = [], options = {}) {
    try {
      const service = getBestAIService('chat');
      
      switch (service) {
        case 'groq':
          return await this.generateWithGroq(userMessage, conversationHistory, options);
        case 'huggingface':
          return await this.generateWithHuggingFace(userMessage, conversationHistory, options);
        default:
          return await this.generateWithLocalFallback(userMessage, conversationHistory, options);
      }
    } catch (error) {
      console.error('Chat service error:', error);
      throw new Error('AI service temporarily unavailable. Please try again.');
    }
  }

  /**
   * Generate response using Groq (Fastest and Free)
   */
  async generateWithGroq(userMessage, conversationHistory, options) {
    if (!this.groq) {
      throw new Error('Groq service not available');
    }

    try {
      // Build conversation context
      const messages = this.buildConversationContext(conversationHistory, userMessage);
      
      const completion = await this.groq.chat.completions.create({
        messages: messages,
        model: aiConfig.groq.models.chat,
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 1000,
        top_p: 1,
        stream: false,
      });

      return {
        response: completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.',
        service: 'groq',
        usage: {
          promptTokens: completion.usage?.prompt_tokens || 0,
          completionTokens: completion.usage?.completion_tokens || 0,
          totalTokens: completion.usage?.total_tokens || 0
        }
      };
    } catch (error) {
      console.error('Groq API error:', error);
      throw new Error('Groq service error. Falling back to alternative service.');
    }
  }

  /**
   * Generate response using Hugging Face (Free tier)
   */
  async generateWithHuggingFace(userMessage, conversationHistory, options) {
    if (!this.huggingFace) {
      throw new Error('Hugging Face service not available');
    }

    try {
      // Build context from conversation history
      const context = this.buildTextContext(conversationHistory, userMessage);
      
      const response = await this.huggingFace.textGeneration({
        model: aiConfig.huggingFace.models.chat,
        inputs: context,
        parameters: {
          max_new_tokens: options.maxTokens || 100,
          temperature: options.temperature || 0.7,
          return_full_text: false,
        }
      });

      return {
        response: response[0]?.generated_text || 'Sorry, I could not generate a response.',
        service: 'huggingface',
        usage: {
          promptTokens: context.length,
          completionTokens: response[0]?.generated_text?.length || 0,
          totalTokens: context.length + (response[0]?.generated_text?.length || 0)
        }
      };
    } catch (error) {
      console.error('Hugging Face API error:', error);
      throw new Error('Hugging Face service error. Falling back to local service.');
    }
  }

  /**
   * Local fallback response (Simple rule-based responses)
   */
  async generateWithLocalFallback(userMessage, conversationHistory, options) {
    // Simple keyword-based responses for fallback
    const responses = {
      greeting: [
        "Hello! I'm Sense AI, your accessible AI assistant. How can I help you today?",
        "Hi there! I'm here to assist you. What would you like to know?",
        "Greetings! I'm Sense AI, ready to help with your questions."
      ],
      help: [
        "I can help you with various tasks including voice-to-text, text-to-speech, and general questions. What specific help do you need?",
        "I'm designed to be an accessible AI assistant. I can help with accessibility features, answer questions, and assist with daily tasks.",
        "I'm here to help! I can assist with accessibility features, answer questions, and provide support. What do you need help with?"
      ],
      accessibility: [
        "I'm designed with accessibility in mind. I can help with voice features, text processing, and making technology more accessible for everyone.",
        "Accessibility is my core focus. I can assist with voice-to-text, text-to-speech, and other accessibility features.",
        "I'm built to be accessible and inclusive. How can I help make technology more accessible for you?"
      ],
      default: [
        "I understand you're asking about that. While I'm in fallback mode, I can still help with basic questions and accessibility features.",
        "That's an interesting question. I'm currently using a simplified response system, but I'm still here to help!",
        "I'm processing your request. In fallback mode, I can provide basic assistance and information."
      ]
    };

    const message = userMessage.toLowerCase();
    let responseType = 'default';

    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      responseType = 'greeting';
    } else if (message.includes('help') || message.includes('assist')) {
      responseType = 'help';
    } else if (message.includes('accessibility') || message.includes('accessible')) {
      responseType = 'accessibility';
    }

    const responseArray = responses[responseType];
    const randomResponse = responseArray[Math.floor(Math.random() * responseArray.length)];

    return {
      response: randomResponse,
      service: 'local-fallback',
      usage: {
        promptTokens: userMessage.length,
        completionTokens: randomResponse.length,
        totalTokens: userMessage.length + randomResponse.length
      }
    };
  }

  /**
   * Build conversation context for API calls
   */
  buildConversationContext(conversationHistory, userMessage) {
    const messages = [
      {
        role: 'system',
        content: 'You are Sense AI, an accessible AI assistant designed to help users with accessibility features, voice-to-text, text-to-speech, and general assistance. Be helpful, inclusive, and focus on accessibility.'
      }
    ];

    // Add conversation history (last 10 messages to stay within token limits)
    const recentHistory = conversationHistory.slice(-10);
    recentHistory.forEach(msg => {
      messages.push({
        role: msg.role || 'user',
        content: msg.content
      });
    });

    // Add current user message
    messages.push({
      role: 'user',
      content: userMessage
    });

    return messages;
  }

  /**
   * Build text context for Hugging Face API
   */
  buildTextContext(conversationHistory, userMessage) {
    let context = "You are Sense AI, an accessible AI assistant. ";
    
    // Add recent conversation context
    const recentHistory = conversationHistory.slice(-5);
    recentHistory.forEach(msg => {
      context += `${msg.role || 'User'}: ${msg.content} `;
    });
    
    context += `User: ${userMessage} Assistant:`;
    return context;
  }

  /**
   * Check if chat service is available
   */
  isAvailable() {
    return isServiceAvailable('chat');
  }

  /**
   * Get service status and limits
   */
  getServiceStatus() {
    const groqAvailable = !!aiConfig.groq.apiKey;
    const huggingFaceAvailable = !!aiConfig.huggingFace.apiKey;
    
    return {
      groq: {
        available: groqAvailable,
        limits: groqAvailable ? aiConfig.groq.rateLimit : null
      },
      huggingFace: {
        available: huggingFaceAvailable,
        limits: huggingFaceAvailable ? aiConfig.huggingFace.rateLimit : null
      },
      localFallback: {
        available: true,
        limits: null
      }
    };
  }
}

// Export singleton instance
export const chatService = new ChatService();
export default chatService;
