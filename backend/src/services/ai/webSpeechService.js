/**
 * Web Speech API Service
 * Provides browser-based speech recognition and synthesis
 * Completely FREE - No API keys or external services required
 */

class WebSpeechService {
  constructor() {
    this.supportedBrowsers = {
      chrome: { minVersion: 25, speechRecognition: true, speechSynthesis: true },
      firefox: { minVersion: 44, speechRecognition: false, speechSynthesis: true },
      safari: { minVersion: 14, speechRecognition: false, speechSynthesis: true },
      edge: { minVersion: 79, speechRecognition: true, speechSynthesis: true }
    };
    
    this.supportedLanguages = [
      { code: 'en-US', name: 'English (US)' },
      { code: 'en-GB', name: 'English (UK)' },
      { code: 'es-ES', name: 'Spanish (Spain)' },
      { code: 'fr-FR', name: 'French (France)' },
      { code: 'de-DE', name: 'German (Germany)' },
      { code: 'it-IT', name: 'Italian (Italy)' },
      { code: 'pt-BR', name: 'Portuguese (Brazil)' },
      { code: 'ru-RU', name: 'Russian (Russia)' },
      { code: 'ja-JP', name: 'Japanese (Japan)' },
      { code: 'ko-KR', name: 'Korean (Korea)' },
      { code: 'zh-CN', name: 'Chinese (Simplified)' },
      { code: 'zh-TW', name: 'Chinese (Traditional)' },
      { code: 'ar-SA', name: 'Arabic (Saudi Arabia)' },
      { code: 'hi-IN', name: 'Hindi (India)' }
    ];

    this.defaultOptions = {
      speechRecognition: {
        continuous: false,
        interimResults: true,
        language: 'en-US',
        maxAlternatives: 1
      },
      speechSynthesis: {
        voice: null,
        rate: 1.0,
        pitch: 1.0,
        volume: 1.0,
        language: 'en-US'
      }
    };
  }

  /**
   * Get browser compatibility information
   */
  getBrowserSupport() {
    // Check if running in browser environment
    const isBrowser = typeof window !== 'undefined';
    
    return {
      speechRecognition: {
        supported: isBrowser ? ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) : false,
        browsers: Object.entries(this.supportedBrowsers)
          .filter(([_, info]) => info.speechRecognition)
          .map(([browser, info]) => ({ browser, minVersion: info.minVersion }))
      },
      speechSynthesis: {
        supported: isBrowser ? ('speechSynthesis' in window) : false,
        browsers: Object.entries(this.supportedBrowsers)
          .filter(([_, info]) => info.speechSynthesis)
          .map(([browser, info]) => ({ browser, minVersion: info.minVersion }))
      }
    };
  }

  /**
   * Get available voices for text-to-speech
   */
  getAvailableVoices(language = 'en-US') {
    // Check if running in browser environment
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      // Return mock voices for server-side testing
      return [
        { name: 'en-US-Standard-A', lang: 'en-US', gender: 'female', localService: true, default: false },
        { name: 'en-US-Standard-B', lang: 'en-US', gender: 'male', localService: true, default: true },
        { name: 'en-US-Standard-C', lang: 'en-US', gender: 'female', localService: true, default: false }
      ];
    }

    const voices = speechSynthesis.getVoices();
    return voices
      .filter(voice => voice.lang.startsWith(language.split('-')[0]) || voice.lang === language)
      .map(voice => ({
        name: voice.name,
        lang: voice.lang,
        gender: voice.name.includes('Female') ? 'female' : 'male',
        localService: voice.localService,
        default: voice.default
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Generate client-side JavaScript for speech recognition
   */
  generateSpeechRecognitionScript(options = {}) {
    const config = { ...this.defaultOptions.speechRecognition, ...options };
    
    return `
      // Speech Recognition Implementation
      class SpeechRecognitionManager {
        constructor(options = {}) {
          this.config = {
            continuous: ${config.continuous},
            interimResults: ${config.interimResults},
            language: '${config.language}',
            maxAlternatives: ${config.maxAlternatives},
            ...options
          };
          
          this.recognition = null;
          this.isListening = false;
          this.isSupported = this.checkSupport();
          this.callbacks = {
            onResult: null,
            onError: null,
            onStart: null,
            onEnd: null,
            onNoMatch: null
          };
          
          if (this.isSupported) {
            this.initializeRecognition();
          }
        }

        checkSupport() {
          const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
          return !!SpeechRecognition;
        }

        initializeRecognition() {
          const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
          this.recognition = new SpeechRecognition();
          
          this.recognition.continuous = this.config.continuous;
          this.recognition.interimResults = this.config.interimResults;
          this.recognition.lang = this.config.language;
          this.recognition.maxAlternatives = this.config.maxAlternatives;

          this.recognition.onstart = () => {
            this.isListening = true;
            this.callbacks.onStart?.();
          };

          this.recognition.onresult = (event) => {
            const results = Array.from(event.results).map(result => ({
              transcript: result[0].transcript,
              confidence: result[0].confidence,
              isFinal: result.isFinal
            }));
            
            this.callbacks.onResult?.(results);
          };

          this.recognition.onerror = (event) => {
            this.isListening = false;
            this.callbacks.onError?.(event.error, event);
          };

          this.recognition.onend = () => {
            this.isListening = false;
            this.callbacks.onEnd?.();
          };

          this.recognition.onnomatch = () => {
            this.callbacks.onNoMatch?.();
          };
        }

        start() {
          if (!this.isSupported) {
            throw new Error('Speech recognition not supported in this browser');
          }
          
          if (this.isListening) {
            console.warn('Speech recognition already listening');
            return;
          }
          
          try {
            this.recognition.start();
          } catch (error) {
            console.error('Failed to start speech recognition:', error);
            throw error;
          }
        }

        stop() {
          if (this.recognition && this.isListening) {
            this.recognition.stop();
          }
        }

        abort() {
          if (this.recognition && this.isListening) {
            this.recognition.abort();
          }
        }

        on(event, callback) {
          if (this.callbacks.hasOwnProperty(event)) {
            this.callbacks[event] = callback;
          }
        }

        getStatus() {
          return {
            isSupported: this.isSupported,
            isListening: this.isListening,
            language: this.config.language,
            continuous: this.config.continuous
          };
        }
      }

      // Usage Example:
      // const speechRecognition = new SpeechRecognitionManager({
      //   language: 'en-US',
      //   continuous: false,
      //   interimResults: true
      // });
      //
      // speechRecognition.on('onResult', (results) => {
      //   console.log('Speech result:', results);
      // });
      //
      // speechRecognition.start();
    `;
  }

  /**
   * Generate client-side JavaScript for speech synthesis
   */
  generateSpeechSynthesisScript(options = {}) {
    const config = { ...this.defaultOptions.speechSynthesis, ...options };
    
    return `
      // Speech Synthesis Implementation
      class SpeechSynthesisManager {
        constructor(options = {}) {
          this.config = {
            voice: ${config.voice ? `'${config.voice}'` : 'null'},
            rate: ${config.rate},
            pitch: ${config.pitch},
            volume: ${config.volume},
            language: '${config.language}',
            ...options
          };
          
          this.isSupported = this.checkSupport();
          this.isSpeaking = false;
          this.callbacks = {
            onStart: null,
            onEnd: null,
            onError: null,
            onPause: null,
            onResume: null
          };
          
          if (this.isSupported) {
            this.loadVoices();
          }
        }

        checkSupport() {
          return 'speechSynthesis' in window;
        }

        loadVoices() {
          if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = () => {
              this.voices = speechSynthesis.getVoices();
            };
          } else {
            this.voices = speechSynthesis.getVoices();
          }
        }

        getVoices(language = null) {
          if (!this.voices) {
            this.voices = speechSynthesis.getVoices();
          }
          
          if (language) {
            return this.voices.filter(voice => 
              voice.lang === language || voice.lang.startsWith(language.split('-')[0])
            );
          }
          
          return this.voices;
        }

        speak(text, options = {}) {
          if (!this.isSupported) {
            throw new Error('Speech synthesis not supported in this browser');
          }

          return new Promise((resolve, reject) => {
            const utterance = new SpeechSynthesisUtterance(text);
            
            // Apply configuration
            utterance.rate = options.rate || this.config.rate;
            utterance.pitch = options.pitch || this.config.pitch;
            utterance.volume = options.volume || this.config.volume;
            utterance.lang = options.language || this.config.language;
            
            // Set voice if specified
            if (options.voice || this.config.voice) {
              const voices = this.getVoices();
              const selectedVoice = voices.find(voice => 
                voice.name === (options.voice || this.config.voice)
              );
              if (selectedVoice) {
                utterance.voice = selectedVoice;
              }
            }

            // Event handlers
            utterance.onstart = () => {
              this.isSpeaking = true;
              this.callbacks.onStart?.(utterance);
            };

            utterance.onend = () => {
              this.isSpeaking = false;
              this.callbacks.onEnd?.(utterance);
              resolve(utterance);
            };

            utterance.onerror = (event) => {
              this.isSpeaking = false;
              this.callbacks.onError?.(event.error, utterance);
              reject(new Error(event.error));
            };

            utterance.onpause = () => {
              this.callbacks.onPause?.(utterance);
            };

            utterance.onresume = () => {
              this.callbacks.onResume?.(utterance);
            };

            // Start speaking
            speechSynthesis.speak(utterance);
          });
        }

        pause() {
          if (this.isSpeaking) {
            speechSynthesis.pause();
          }
        }

        resume() {
          speechSynthesis.resume();
        }

        cancel() {
          speechSynthesis.cancel();
          this.isSpeaking = false;
        }

        stop() {
          this.cancel();
        }

        on(event, callback) {
          if (this.callbacks.hasOwnProperty(event)) {
            this.callbacks[event] = callback;
          }
        }

        getStatus() {
          return {
            isSupported: this.isSupported,
            isSpeaking: this.isSpeaking,
            voicesAvailable: this.voices ? this.voices.length : 0,
            currentConfig: this.config
          };
        }
      }

      // Usage Example:
      // const speechSynthesis = new SpeechSynthesisManager({
      //   language: 'en-US',
      //   rate: 1.0,
      //   pitch: 1.0,
      //   volume: 1.0
      // });
      //
      // speechSynthesis.speak('Hello, this is a test of text to speech');
    `;
  }

  /**
   * Generate complete Web Speech API implementation
   */
  generateCompleteScript(options = {}) {
    const speechRecognitionScript = this.generateSpeechRecognitionScript(options.speechRecognition);
    const speechSynthesisScript = this.generateSpeechSynthesisScript(options.speechSynthesis);
    
    return `
      // Web Speech API Complete Implementation
      // Generated by Sense-AI Backend
      
      ${speechRecognitionScript}
      
      ${speechSynthesisScript}
      
      // Combined Speech Manager
      class WebSpeechManager {
        constructor(options = {}) {
          this.recognition = new SpeechRecognitionManager(options.speechRecognition);
          this.synthesis = new SpeechSynthesisManager(options.speechSynthesis);
          this.isInitialized = true;
        }

        // Speech Recognition Methods
        startListening(options = {}) {
          return this.recognition.start();
        }

        stopListening() {
          return this.recognition.stop();
        }

        onSpeechResult(callback) {
          this.recognition.on('onResult', callback);
        }

        onSpeechError(callback) {
          this.recognition.on('onError', callback);
        }

        // Speech Synthesis Methods
        speak(text, options = {}) {
          return this.synthesis.speak(text, options);
        }

        pauseSpeaking() {
          return this.synthesis.pause();
        }

        resumeSpeaking() {
          return this.synthesis.resume();
        }

        stopSpeaking() {
          return this.synthesis.stop();
        }

        onSpeechStart(callback) {
          this.synthesis.on('onStart', callback);
        }

        onSpeechEnd(callback) {
          this.synthesis.on('onEnd', callback);
        }

        // Utility Methods
        getBrowserSupport() {
          return {
            speechRecognition: this.recognition.getStatus(),
            speechSynthesis: this.synthesis.getStatus()
          };
        }

        getAvailableVoices(language = 'en-US') {
          return this.synthesis.getVoices(language);
        }

        isSupported() {
          return this.recognition.getStatus().isSupported || this.synthesis.getStatus().isSupported;
        }
      }

      // Global instance (optional)
      window.SenseAISpeech = WebSpeechManager;
    `;
  }

  /**
   * Create HTML example for testing
   */
  generateHTMLExample() {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sense-AI Web Speech API Demo</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
          }
          .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .button {
            background: #007bff;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            margin: 5px;
            font-size: 16px;
          }
          .button:hover {
            background: #0056b3;
          }
          .button:disabled {
            background: #6c757d;
            cursor: not-allowed;
          }
          .result {
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            padding: 15px;
            border-radius: 5px;
            margin: 10px 0;
            min-height: 100px;
          }
          .status {
            padding: 10px;
            border-radius: 5px;
            margin: 10px 0;
          }
          .success { background: #d4edda; color: #155724; }
          .error { background: #f8d7da; color: #721c24; }
          .warning { background: #fff3cd; color: #856404; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🎤 Sense-AI Web Speech API Demo</h1>
          
          <div id="status" class="status"></div>
          
          <h2>Speech Recognition</h2>
          <button id="startListening" class="button">Start Listening</button>
          <button id="stopListening" class="button" disabled>Stop Listening</button>
          <div id="speechResult" class="result">Click "Start Listening" and speak...</div>
          
          <h2>Text-to-Speech</h2>
          <textarea id="textInput" placeholder="Enter text to speak..." style="width: 100%; height: 100px; padding: 10px; border: 1px solid #ccc; border-radius: 5px;"></textarea>
          <br>
          <button id="speakText" class="button">Speak Text</button>
          <button id="pauseSpeaking" class="button" disabled>Pause</button>
          <button id="stopSpeaking" class="button" disabled>Stop</button>
          
          <h2>Available Voices</h2>
          <select id="voiceSelect" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 5px;">
            <option value="">Default Voice</option>
          </select>
        </div>

        <script>
          // Include the generated Web Speech API script here
          // (The complete script from generateCompleteScript method)
          
          // Demo Implementation
          let speechManager;
          
          document.addEventListener('DOMContentLoaded', function() {
            // Initialize speech manager
            speechManager = new WebSpeechManager({
              speechRecognition: {
                language: 'en-US',
                continuous: false,
                interimResults: true
              },
              speechSynthesis: {
                language: 'en-US',
                rate: 1.0,
                pitch: 1.0,
                volume: 1.0
              }
            });
            
            // Check browser support
            updateStatus();
            loadVoices();
            
            // Speech Recognition Event Listeners
            document.getElementById('startListening').addEventListener('click', function() {
              speechManager.startListening();
              document.getElementById('startListening').disabled = true;
              document.getElementById('stopListening').disabled = false;
            });
            
            document.getElementById('stopListening').addEventListener('click', function() {
              speechManager.stopListening();
              document.getElementById('startListening').disabled = false;
              document.getElementById('stopListening').disabled = true;
            });
            
            speechManager.onSpeechResult(function(results) {
              const resultDiv = document.getElementById('speechResult');
              let html = '';
              
              results.forEach(result => {
                const confidence = Math.round(result.confidence * 100);
                html += \`<div style="margin: 5px 0; padding: 5px; background: \${result.isFinal ? '#d4edda' : '#fff3cd'}; border-radius: 3px;">
                  <strong>\${result.isFinal ? 'Final' : 'Interim'}:</strong> \${result.transcript}
                  <small>(\${confidence}% confidence)</small>
                </div>\`;
              });
              
              resultDiv.innerHTML = html;
            });
            
            speechManager.onSpeechError(function(error) {
              console.error('Speech recognition error:', error);
              document.getElementById('speechResult').innerHTML = \`<div style="color: red;">Error: \${error}</div>\`;
              document.getElementById('startListening').disabled = false;
              document.getElementById('stopListening').disabled = true;
            });
            
            // Speech Synthesis Event Listeners
            document.getElementById('speakText').addEventListener('click', function() {
              const text = document.getElementById('textInput').value;
              if (text.trim()) {
                const selectedVoice = document.getElementById('voiceSelect').value;
                speechManager.speak(text, selectedVoice ? { voice: selectedVoice } : {});
              }
            });
            
            document.getElementById('pauseSpeaking').addEventListener('click', function() {
              speechManager.pauseSpeaking();
            });
            
            document.getElementById('stopSpeaking').addEventListener('click', function() {
              speechManager.stopSpeaking();
            });
            
            speechManager.onSpeechStart(function() {
              document.getElementById('pauseSpeaking').disabled = false;
              document.getElementById('stopSpeaking').disabled = false;
            });
            
            speechManager.onSpeechEnd(function() {
              document.getElementById('pauseSpeaking').disabled = true;
              document.getElementById('stopSpeaking').disabled = true;
            });
          });
          
          function updateStatus() {
            const statusDiv = document.getElementById('status');
            const support = speechManager.getBrowserSupport();
            
            let statusHtml = '';
            
            if (support.speechRecognition.isSupported) {
              statusHtml += '<div class="success">✅ Speech Recognition: Supported</div>';
            } else {
              statusHtml += '<div class="error">❌ Speech Recognition: Not Supported</div>';
            }
            
            if (support.speechSynthesis.isSupported) {
              statusHtml += '<div class="success">✅ Speech Synthesis: Supported</div>';
            } else {
              statusHtml += '<div class="error">❌ Speech Synthesis: Not Supported</div>';
            }
            
            if (!support.speechRecognition.isSupported && !support.speechSynthesis.isSupported) {
              statusHtml += '<div class="warning">⚠️ Web Speech API not supported in this browser. Please use Chrome, Edge, or Safari.</div>';
            }
            
            statusDiv.innerHTML = statusHtml;
          }
          
          function loadVoices() {
            const voiceSelect = document.getElementById('voiceSelect');
            const voices = speechManager.getAvailableVoices();
            
            voices.forEach(voice => {
              const option = document.createElement('option');
              option.value = voice.name;
              option.textContent = \`\${voice.name} (\${voice.lang})\`;
              if (voice.default) option.textContent += ' (Default)';
              voiceSelect.appendChild(option);
            });
          }
        </script>
      </body>
      </html>
    `;
  }

  /**
   * Get service information and capabilities
   */
  getServiceInfo() {
    return {
      name: 'Web Speech API',
      description: 'Browser-based speech recognition and synthesis',
      cost: 'Free',
      limitations: {
        speechRecognition: 'Requires HTTPS in production, limited browser support',
        speechSynthesis: 'Browser-dependent voice quality, limited offline capability'
      },
      advantages: [
        'Completely free - no API keys required',
        'No external service dependencies',
        'Real-time processing',
        'Works offline (browser-dependent)',
        'No usage limits',
        'Built into modern browsers'
      ],
      supportedBrowsers: this.supportedBrowsers,
      supportedLanguages: this.supportedLanguages,
      setupRequired: false,
      apiKeyRequired: false
    };
  }
}

// Export singleton instance
export const webSpeechService = new WebSpeechService();
export default webSpeechService;
