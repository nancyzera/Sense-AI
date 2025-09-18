# 🎤 Web Speech API Implementation Guide

## Overview

The Web Speech API implementation provides **completely free** speech-to-text and text-to-speech functionality using browser-native capabilities. No API keys, no external services, and no credit card required!

## 🚀 Quick Start

### 1. Get the JavaScript Implementation

```javascript
// Get complete Web Speech API implementation
fetch('/speech/script/complete')
  .then(response => response.text())
  .then(script => {
    // Inject script into your page
    const scriptElement = document.createElement('script');
    scriptElement.textContent = script;
    document.head.appendChild(scriptElement);
    
    // Now you can use WebSpeechManager
    const speechManager = new WebSpeechManager();
  });
```

### 2. Basic Usage

```javascript
// Initialize speech manager
const speechManager = new WebSpeechManager({
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

// Speech Recognition
speechManager.onSpeechResult((results) => {
  results.forEach(result => {
    console.log(`${result.isFinal ? 'Final' : 'Interim'}: ${result.transcript}`);
  });
});

speechManager.startListening();

// Text-to-Speech
speechManager.speak("Hello, this is a test of text to speech");
```

## 📋 API Endpoints

### Service Information
- `GET /speech/info` - Get service information and capabilities
- `GET /speech/browser-support` - Get browser compatibility information
- `GET /speech/languages` - Get supported languages
- `GET /speech/voices` - Get available voices for TTS

### JavaScript Scripts
- `GET /speech/script/recognition` - Speech recognition only
- `GET /speech/script/synthesis` - Text-to-speech only
- `GET /speech/script/complete` - Complete implementation
- `GET /speech/demo` - Interactive demo page

### Usage Tracking (Authenticated)
- `POST /speech/usage-track` - Track usage for billing
- `GET /speech/usage` - Get current usage statistics

## 🎯 Frontend Integration Examples

### Example 1: Simple Voice Input

```html
<!DOCTYPE html>
<html>
<head>
    <title>Voice Input Demo</title>
</head>
<body>
    <button id="startBtn">Start Listening</button>
    <button id="stopBtn" disabled>Stop Listening</button>
    <div id="result"></div>

    <script>
        // Load Web Speech API
        fetch('/speech/script/complete')
            .then(response => response.text())
            .then(script => {
                eval(script); // In production, use proper script injection
                
                const speechManager = new WebSpeechManager();
                const startBtn = document.getElementById('startBtn');
                const stopBtn = document.getElementById('stopBtn');
                const resultDiv = document.getElementById('result');
                
                speechManager.onSpeechResult((results) => {
                    let html = '';
                    results.forEach(result => {
                        const confidence = Math.round(result.confidence * 100);
                        html += `<div style="background: ${result.isFinal ? '#d4edda' : '#fff3cd'}; padding: 5px; margin: 2px;">
                            <strong>${result.isFinal ? 'Final' : 'Interim'}:</strong> ${result.transcript}
                            <small>(${confidence}% confidence)</small>
                        </div>`;
                    });
                    resultDiv.innerHTML = html;
                });
                
                startBtn.addEventListener('click', () => {
                    speechManager.startListening();
                    startBtn.disabled = true;
                    stopBtn.disabled = false;
                });
                
                stopBtn.addEventListener('click', () => {
                    speechManager.stopListening();
                    startBtn.disabled = false;
                    stopBtn.disabled = true;
                });
            });
    </script>
</body>
</html>
```

### Example 2: Text-to-Speech with Voice Selection

```html
<!DOCTYPE html>
<html>
<head>
    <title>TTS Demo</title>
</head>
<body>
    <textarea id="textInput" placeholder="Enter text to speak..."></textarea>
    <select id="voiceSelect">
        <option value="">Default Voice</option>
    </select>
    <button id="speakBtn">Speak</button>
    <button id="stopBtn">Stop</button>

    <script>
        fetch('/speech/script/complete')
            .then(response => response.text())
            .then(script => {
                eval(script);
                
                const speechManager = new WebSpeechManager();
                const textInput = document.getElementById('textInput');
                const voiceSelect = document.getElementById('voiceSelect');
                const speakBtn = document.getElementById('speakBtn');
                const stopBtn = document.getElementById('stopBtn');
                
                // Load available voices
                fetch('/speech/voices')
                    .then(response => response.json())
                    .then(data => {
                        data.data.voices.forEach(voice => {
                            const option = document.createElement('option');
                            option.value = voice.name;
                            option.textContent = `${voice.name} (${voice.lang})`;
                            voiceSelect.appendChild(option);
                        });
                    });
                
                speakBtn.addEventListener('click', () => {
                    const text = textInput.value;
                    const selectedVoice = voiceSelect.value;
                    
                    if (text.trim()) {
                        speechManager.speak(text, selectedVoice ? { voice: selectedVoice } : {});
                    }
                });
                
                stopBtn.addEventListener('click', () => {
                    speechManager.stopSpeaking();
                });
            });
    </script>
</body>
</html>
```

### Example 3: React Component

```jsx
import React, { useState, useEffect, useRef } from 'react';

const SpeechComponent = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const speechManagerRef = useRef(null);

  useEffect(() => {
    // Load Web Speech API
    fetch('/speech/script/complete')
      .then(response => response.text())
      .then(script => {
        // In a real app, you'd use a proper script loader
        eval(script);
        
        speechManagerRef.current = new WebSpeechManager({
          speechRecognition: {
            language: 'en-US',
            continuous: false,
            interimResults: true
          }
        });

        // Set up event handlers
        speechManagerRef.current.onSpeechResult((results) => {
          const finalResults = results.filter(r => r.isFinal);
          if (finalResults.length > 0) {
            setTranscript(finalResults[0].transcript);
          }
        });

        speechManagerRef.current.onSpeechError((error) => {
          console.error('Speech recognition error:', error);
          setIsListening(false);
        });
      });

    // Load voices
    fetch('/speech/voices')
      .then(response => response.json())
      .then(data => setVoices(data.data.voices));
  }, []);

  const startListening = () => {
    speechManagerRef.current?.startListening();
    setIsListening(true);
  };

  const stopListening = () => {
    speechManagerRef.current?.stopListening();
    setIsListening(false);
  };

  const speakText = (text) => {
    speechManagerRef.current?.speak(text, selectedVoice ? { voice: selectedVoice } : {});
  };

  return (
    <div>
      <h2>Speech Recognition</h2>
      <button onClick={startListening} disabled={isListening}>
        Start Listening
      </button>
      <button onClick={stopListening} disabled={!isListening}>
        Stop Listening
      </button>
      <div>Transcript: {transcript}</div>

      <h2>Text-to-Speech</h2>
      <select value={selectedVoice} onChange={(e) => setSelectedVoice(e.target.value)}>
        <option value="">Default Voice</option>
        {voices.map(voice => (
          <option key={voice.name} value={voice.name}>
            {voice.name} ({voice.lang})
          </option>
        ))}
      </select>
      <button onClick={() => speakText('Hello, this is a test')}>
        Speak Test
      </button>
    </div>
  );
};

export default SpeechComponent;
```

### Example 4: Vue.js Component

```vue
<template>
  <div class="speech-component">
    <h2>Speech Recognition</h2>
    <button @click="startListening" :disabled="isListening">
      Start Listening
    </button>
    <button @click="stopListening" :disabled="!isListening">
      Stop Listening
    </button>
    <div>Transcript: {{ transcript }}</div>

    <h2>Text-to-Speech</h2>
    <select v-model="selectedVoice">
      <option value="">Default Voice</option>
      <option v-for="voice in voices" :key="voice.name" :value="voice.name">
        {{ voice.name }} ({{ voice.lang }})
      </option>
    </select>
    <button @click="speakText('Hello, this is a test')">
      Speak Test
    </button>
  </div>
</template>

<script>
export default {
  name: 'SpeechComponent',
  data() {
    return {
      isListening: false,
      transcript: '',
      voices: [],
      selectedVoice: '',
      speechManager: null
    };
  },
  async mounted() {
    // Load Web Speech API
    const response = await fetch('/speech/script/complete');
    const script = await response.text();
    eval(script); // In production, use proper script loading

    this.speechManager = new WebSpeechManager({
      speechRecognition: {
        language: 'en-US',
        continuous: false,
        interimResults: true
      }
    });

    // Set up event handlers
    this.speechManager.onSpeechResult((results) => {
      const finalResults = results.filter(r => r.isFinal);
      if (finalResults.length > 0) {
        this.transcript = finalResults[0].transcript;
      }
    });

    this.speechManager.onSpeechError((error) => {
      console.error('Speech recognition error:', error);
      this.isListening = false;
    });

    // Load voices
    const voicesResponse = await fetch('/speech/voices');
    const voicesData = await voicesResponse.json();
    this.voices = voicesData.data.voices;
  },
  methods: {
    startListening() {
      this.speechManager?.startListening();
      this.isListening = true;
    },
    stopListening() {
      this.speechManager?.stopListening();
      this.isListening = false;
    },
    speakText(text) {
      this.speechManager?.speak(text, this.selectedVoice ? { voice: this.selectedVoice } : {});
    }
  }
};
</script>
```

## 🔧 Configuration Options

### Speech Recognition Options
```javascript
const options = {
  speechRecognition: {
    continuous: false,        // Keep listening after first result
    interimResults: true,     // Get partial results
    language: 'en-US',        // Language code
    maxAlternatives: 1        // Number of alternative results
  }
};
```

### Text-to-Speech Options
```javascript
const options = {
  speechSynthesis: {
    voice: 'en-US-AriaNeural', // Specific voice name
    rate: 1.0,                 // Speaking rate (0.1 - 10)
    pitch: 1.0,                // Voice pitch (0 - 2)
    volume: 1.0,               // Volume (0 - 1)
    language: 'en-US'          // Language code
  }
};
```

## 🌐 Browser Support

### Speech Recognition
- ✅ Chrome 25+
- ✅ Edge 79+
- ❌ Firefox (not supported)
- ❌ Safari (not supported)

### Text-to-Speech
- ✅ Chrome (all versions)
- ✅ Firefox 44+
- ✅ Safari 14+
- ✅ Edge (all versions)

## 📊 Usage Tracking

For authenticated users, you can track usage:

```javascript
// Track speech recognition usage
fetch('/speech/usage-track', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    feature: 'speechRecognition',
    duration: 30 // seconds
  })
});

// Track text-to-speech usage
fetch('/speech/usage-track', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    feature: 'speechSynthesis',
    characters: 150 // characters spoken
  })
});
```

## 🚨 Important Notes

1. **HTTPS Required**: Speech recognition requires HTTPS in production
2. **User Permission**: Browser will ask for microphone permission
3. **Browser Limitations**: Speech recognition has limited browser support
4. **No External Dependencies**: All processing happens in the browser
5. **Real-time Processing**: No server round-trips for speech processing

## 🎯 Best Practices

1. **Check Browser Support**: Always verify browser compatibility
2. **Handle Errors Gracefully**: Speech recognition can fail
3. **Provide Fallbacks**: Offer alternative input methods
4. **User Feedback**: Show listening status and results
5. **Privacy**: Be transparent about microphone usage

## 🔍 Testing

Visit `/speech/demo` for an interactive demo page that tests all functionality.

## 🆘 Troubleshooting

### Common Issues

1. **"Speech recognition not supported"**
   - Use Chrome or Edge browser
   - Ensure HTTPS in production

2. **"Microphone permission denied"**
   - Check browser permissions
   - Request permission programmatically

3. **"No speech detected"**
   - Check microphone input levels
   - Ensure quiet environment
   - Try different language settings

4. **Poor recognition accuracy**
   - Speak clearly and slowly
   - Use supported languages
   - Check microphone quality

### Debug Mode

Enable debug logging:

```javascript
const speechManager = new WebSpeechManager();
speechManager.recognition.on('onError', (error) => {
  console.log('Speech recognition error:', error);
});
```

## 📈 Performance Tips

1. **Use interim results** for real-time feedback
2. **Stop recognition** when not needed to save battery
3. **Cache voice lists** to avoid repeated API calls
4. **Debounce speech results** to avoid rapid updates
5. **Use appropriate languages** for better accuracy

## 🔒 Security Considerations

1. **No data leaves browser** - all processing is local
2. **HTTPS required** for production speech recognition
3. **User consent** required for microphone access
4. **No persistent storage** of speech data (unless you implement it)

## 📚 Additional Resources

- [Web Speech API MDN Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [Browser Support Table](https://caniuse.com/speech-recognition)
- [Voice List API](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis/getVoices)

---

**Need help?** Check the demo page at `/api/speech/demo` or contact support!
