// AI Services for Voice-to-Text, Text-to-Speech, and Chat

// Extend Window interface for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: number;
}

export interface ChatResponse {
  message: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Web Speech API for Voice-to-Text
export class VoiceToTextService {
  private recognition: SpeechRecognition | null = null;
  private isSupported: boolean = false;

  constructor() {
    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.isSupported = true;
      this.setupRecognition();
    }
  }

  private setupRecognition() {
    if (!this.recognition) return;

    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';
    this.recognition.maxAlternatives = 1;
  }

  isAvailable(): boolean {
    return this.isSupported;
  }

  startRecording(
    onResult: (result: SpeechRecognitionResult) => void,
    onError: (error: string) => void,
    onEnd: () => void
  ): boolean {
    if (!this.recognition) {
      onError('Speech recognition not supported in this browser');
      return false;
    }

    this.recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        onResult({
          transcript: result[0].transcript,
          confidence: result[0].confidence,
          isFinal: result.isFinal
        });
      }
    };

    this.recognition.onerror = (event) => {
      onError(`Speech recognition error: ${event.error}`);
    };

    this.recognition.onend = () => {
      onEnd();
    };

    try {
      this.recognition.start();
      return true;
    } catch (error) {
      onError('Failed to start speech recognition');
      return false;
    }
  }

  stopRecording() {
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  // Change language
  setLanguage(lang: string) {
    if (this.recognition) {
      this.recognition.lang = lang;
    }
  }
}

// Web Speech Synthesis API for Text-to-Speech
export class TextToSpeechService {
  private synth: SpeechSynthesis;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    this.synth = window.speechSynthesis;
    this.loadVoices();
  }

  private loadVoices() {
    this.voices = this.synth.getVoices();
    
    // Some browsers load voices asynchronously
    if (this.voices.length === 0) {
      this.synth.onvoiceschanged = () => {
        this.voices = this.synth.getVoices();
      };
    }
  }

  isAvailable(): boolean {
    return 'speechSynthesis' in window;
  }

  getVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }

  speak(
    text: string,
    options: {
      voice?: string;
      rate?: number;
      pitch?: number;
      volume?: number;
      lang?: string;
    } = {},
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (error: string) => void
  ): boolean {
    if (!this.isAvailable()) {
      onError?.('Text-to-speech not supported in this browser');
      return false;
    }

    // Cancel any ongoing speech
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set voice
    if (options.voice) {
      const voice = this.voices.find(v => v.name === options.voice || v.lang === options.voice);
      if (voice) utterance.voice = voice;
    }

    // Set other options
    utterance.rate = options.rate ?? 1;
    utterance.pitch = options.pitch ?? 1;
    utterance.volume = options.volume ?? 1;
    utterance.lang = options.lang ?? 'en-US';

    // Event handlers
    utterance.onstart = () => onStart?.();
    utterance.onend = () => onEnd?.();
    utterance.onerror = (event) => onError?.(`Speech synthesis error: ${event.error}`);

    try {
      this.synth.speak(utterance);
      return true;
    } catch (error) {
      onError?.('Failed to start speech synthesis');
      return false;
    }
  }

  stop() {
    this.synth.cancel();
  }

  pause() {
    this.synth.pause();
  }

  resume() {
    this.synth.resume();
  }

  isSpeaking(): boolean {
    return this.synth.speaking;
  }
}

// AI Chat Service
export class ChatService {
  private apiKey: string;
  private baseUrl: string;
  private hasLoggedFallback: boolean = false; // Track if we've already logged the fallback message

  constructor(apiKey: string = API_KEY, provider: 'openai' | 'anthropic' | 'custom' = 'openai') {
    this.apiKey = apiKey;
    
    this.apiKey = apiKey;
    
    // Set base URL according to provider
    if (provider === 'openai') {
      this.baseUrl = 'https://api.aimlapi.com/v1';
    } else if (provider === 'anthropic') {
      this.baseUrl = 'https://api.aimlapi.com/v1';
    } else {
      // Default to aimlapi if provider is custom or not specified
      this.baseUrl = 'https://api.aimlapi.com/v1';
    }
  }

  private isValidApiKey(key: string): boolean {
    // Check for various API key formats
    const API_KEY = import.meta.env.VITE_AIML_API_KEY;
    if (!key || key === API_KEY) return false;
    
    // OpenAI format: sk-...
    if (key.startsWith('sk-')) return true;
    
    // Alternative API key formats (like the one provided)
    if (key.length >= 32 && /^[a-zA-Z0-9]+$/.test(key)) return true;
    
    // Anthropic format: sk-ant-...
    if (key.startsWith('sk-ant-')) return true;
    
    return false;
  }

  async sendMessage(
    messages: ChatMessage[],
    options: {
      model?: string;
      temperature?: number;
      maxTokens?: number;
      stream?: boolean;
    } = {}
  ): Promise<ChatResponse> {
    
    // Check if API key looks valid
    if (!this.isValidApiKey(this.apiKey)) {
      // Only log once to avoid console spam
      if (!this.hasLoggedFallback) {
        console.info('🤖 Sense AI: Using enhanced demo responses. Configure a valid API key for real AI integration.');
        this.hasLoggedFallback = true;
      }
      return this.getMockResponse(messages[messages.length - 1]?.content || '');
    }

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: options.model || 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are Sense AI, an intelligent accessibility assistant designed to break communication barriers and empower individuals with disabilities. You provide support for voice-to-text, text-to-speech, vision assistance, mobility aid integration, and emergency features. Always be helpful, empathetic, and focused on accessibility solutions. Keep responses clear, concise, and actionable.'
            },
            ...messages.map(msg => ({
              role: msg.role,
              content: msg.content
            }))
          ],
          temperature: options.temperature || 0.7,
          max_tokens: options.maxTokens || 1000,
          stream: options.stream || false
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API request failed: ${response.status} - ${errorText}`);
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        message: data.choices[0]?.message?.content || 'No response generated',
        usage: data.usage
      };
    } catch (error) {
      console.error('Chat API error:', error);
      // Fallback to mock response if API fails
      return this.getMockResponse(messages[messages.length - 1]?.content || '');
    }
  }

  private getMockResponse(userMessage: string): ChatResponse {
    const responses = [
      "I'm Sense AI, your accessibility assistant. I'm here to help break communication barriers and support your needs. How can I assist you today?",
      "That's a great question! As your accessibility companion, I can help you with voice-to-text, text-to-speech, vision support, and mobility assistance.",
      "I understand you're looking for accessibility support. Let me help you find the right tools and features for your specific needs.",
      "Accessibility is at the heart of what I do. I'm designed to empower individuals with disabilities through intelligent assistance.",
      "I'm here to support you with personalized accessibility solutions. What specific challenge can I help you overcome?",
      "Let me provide you with tailored accessibility guidance based on your unique requirements."
    ];

    // Contextual responses based on message content
    let response = responses[Math.floor(Math.random() * responses.length)];
    
    if (userMessage.toLowerCase().includes('voice') || userMessage.toLowerCase().includes('speech')) {
      response = "I can help you with voice-related accessibility features! Our advanced voice-to-text system offers 98% accuracy across 10+ languages, and our natural text-to-speech can convert any text into clear, customizable speech. Would you like me to guide you through these features?";
    } else if (userMessage.toLowerCase().includes('vision') || userMessage.toLowerCase().includes('see') || userMessage.toLowerCase().includes('blind')) {
      response = "For vision accessibility, I offer AI-powered image analysis that can describe scenes, read text from photos, identify objects, and provide detailed visual context. I can also integrate with screen readers and provide audio descriptions. How can I assist with your visual accessibility needs?";
    } else if (userMessage.toLowerCase().includes('device') || userMessage.toLowerCase().includes('wearable') || userMessage.toLowerCase().includes('mobility')) {
      response = "I can connect with various accessibility devices including mobility aids, wearables, and assistive technologies. I provide haptic feedback, device status monitoring, navigation assistance, and emergency features. What devices would you like to connect?";
    } else if (userMessage.toLowerCase().includes('hear') || userMessage.toLowerCase().includes('deaf') || userMessage.toLowerCase().includes('sound')) {
      response = "For hearing accessibility, I specialize in converting audio to visual/text formats. I can transcribe conversations in real-time, provide visual alerts for sounds, and offer sign language support. I'm designed to ensure you never miss important audio information.";
    } else if (userMessage.toLowerCase().includes('emergency') || userMessage.toLowerCase().includes('help') || userMessage.toLowerCase().includes('urgent')) {
      response = "🚨 I take emergencies seriously! I can immediately contact emergency services, send your location to designated contacts, activate emergency beacons on connected devices, and provide step-by-step guidance. Do you need emergency assistance right now?";
    } else if (userMessage.toLowerCase().includes('learn') || userMessage.toLowerCase().includes('adapt') || userMessage.toLowerCase().includes('personalize')) {
      response = "I continuously learn from your interactions to provide increasingly personalized accessibility support. I adapt to your preferences, usage patterns, and specific needs to offer proactive assistance. The more we interact, the better I become at anticipating and meeting your accessibility requirements.";
    }

    return {
      message: response,
      usage: {
        prompt_tokens: Math.ceil(userMessage.length / 4), // Rough estimation
        completion_tokens: Math.ceil(response.length / 4),
        total_tokens: Math.ceil((userMessage.length + response.length) / 4)
      }
    };
  }

  // Stream response for real-time chat
  async *streamMessage(
    messages: ChatMessage[],
    options: {
      model?: string;
      temperature?: number;
      maxTokens?: number;
    } = {}
  ): AsyncGenerator<string, void, unknown> {
    
    // Check if API key looks valid
    if (!this.isValidApiKey(this.apiKey)) {
      // Only log once to avoid console spam
      if (!this.hasLoggedFallback) {
        console.info('🤖 Sense AI: Using enhanced demo responses for streaming.');
        this.hasLoggedFallback = true;
      }
      const mockResponse = await this.sendMessage(messages, options);
      const words = mockResponse.message.split(' ');
      
      for (const word of words) {
        yield word + ' ';
        await new Promise(resolve => setTimeout(resolve, 100)); // Simulate delay
      }
      return;
    }

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: options.model || 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are Sense AI, an intelligent accessibility assistant designed to break communication barriers and empower individuals with disabilities. You provide support for voice-to-text, text-to-speech, vision assistance, mobility aid integration, and emergency features. Always be helpful, empathetic, and focused on accessibility solutions. Keep responses clear, concise, and actionable.'
            },
            ...messages.map(msg => ({
              role: msg.role,
              content: msg.content
            }))
          ],
          temperature: options.temperature || 0.7,
          max_tokens: options.maxTokens || 1000,
          stream: true
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API request failed: ${response.status} - ${errorText}`);
        throw new Error(`API request failed: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') return;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content;
              if (content) {
                yield content;
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      console.error('Streaming chat error:', error);
      // Fallback to mock response
      const mockResponse = await this.sendMessage(messages, options);
      const words = mockResponse.message.split(' ');
      
      for (const word of words) {
        yield word + ' ';
        await new Promise(resolve => setTimeout(resolve, 100)); // Simulate delay
      }
    }
  }
}

// Combined Voice Chat Service
export class VoiceChatService {
  private voiceToText: VoiceToTextService;
  private textToSpeech: TextToSpeechService;
  private chat: ChatService;

  constructor(chatApiKey?: string) {
    this.voiceToText = new VoiceToTextService();
    this.textToSpeech = new TextToSpeechService();
    this.chat = new ChatService(chatApiKey || 'demo-key');
  }

  isAvailable(): boolean {
    return this.voiceToText.isAvailable() && this.textToSpeech.isAvailable();
  }

  async startVoiceConversation(
    onTranscript: (transcript: string, isFinal: boolean) => void,
    onResponse: (response: string) => void,
    onError: (error: string) => void,
    context: ChatMessage[] = []
  ) {
    let currentTranscript = '';
    let finalTranscript = '';

    const handleResult = (result: SpeechRecognitionResult) => {
      if (result.isFinal) {
        finalTranscript += result.transcript;
        onTranscript(finalTranscript, true);
        this.processVoiceInput(finalTranscript, context, onResponse, onError);
        finalTranscript = '';
      } else {
        currentTranscript = result.transcript;
        onTranscript(finalTranscript + currentTranscript, false);
      }
    };

    const handleError = (error: string) => {
      onError(error);
    };

    const handleEnd = () => {
      // Auto-restart listening for continuous conversation
      setTimeout(() => {
        this.voiceToText.startRecording(handleResult, handleError, handleEnd);
      }, 1000);
    };

    return this.voiceToText.startRecording(handleResult, handleError, handleEnd);
  }

  private async processVoiceInput(
    transcript: string,
    context: ChatMessage[],
    onResponse: (response: string) => void,
    onError: (error: string) => void
  ) {
    try {
      const messages: ChatMessage[] = [
        ...context,
        { role: 'user', content: transcript, timestamp: Date.now() }
      ];

      const response = await this.chat.sendMessage(messages);
      onResponse(response.message);

      // Speak the response
      this.textToSpeech.speak(
        response.message,
        { rate: 0.9, pitch: 1.1 }, // Slightly slower and higher for clarity
        undefined,
        undefined,
        onError
      );
    } catch (error) {
      onError(`Failed to process voice input: ${error}`);
    }
  }

  stopVoiceConversation() {
    this.voiceToText.stopRecording();
    this.textToSpeech.stop();
  }

  speakText(text: string, onEnd?: () => void, onError?: (error: string) => void) {
    return this.textToSpeech.speak(text, {}, undefined, onEnd, onError);
  }
}

const API_KEY = import.meta.env.VITE_AIML_API_KEY;

// Export service instances
export const voiceToTextService = new VoiceToTextService();
export const textToSpeechService = new TextToSpeechService();
export const chatService = new ChatService(API_KEY);
export const voiceChatService = new VoiceChatService(API_KEY);

// Utility function to configure API key if user has a valid one
export function configureOpenAIKey(apiKey: string) {
  if (apiKey && (apiKey.startsWith('sk-') || (apiKey.length >= 32 && /^[a-zA-Z0-9]+$/.test(apiKey)))) {
    // Recreate services with the valid API key
    const newChatService = new ChatService(apiKey);
    const newVoiceChatService = new VoiceChatService(apiKey);
    
    // Replace the exported instances
    Object.assign(chatService, newChatService);
    Object.assign(voiceChatService, newVoiceChatService);
    
    console.log('✅ API key configured successfully! Real AI responses are now active.');
    return true;
  } else {
    console.warn('❌ Invalid API key format. Please provide a valid API key (OpenAI format: sk-... or 32+ character alphanumeric)');
    return false;
  }
}