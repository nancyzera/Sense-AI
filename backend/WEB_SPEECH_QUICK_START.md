# 🎤 Web Speech API - Quick Start Guide

## 🚀 Immediate Usage (No Setup Required!)

### 1. Get the Complete Implementation
```javascript
// Fetch the complete Web Speech API implementation
fetch('/speech/script/complete')
  .then(response => response.text())
  .then(script => {
    // Inject into your page
    const scriptElement = document.createElement('script');
    scriptElement.textContent = script;
    document.head.appendChild(scriptElement);
  });
```

### 2. Basic Implementation
```javascript
// Initialize speech manager
const speechManager = new WebSpeechManager();

// Speech Recognition
speechManager.onSpeechResult((results) => {
  results.forEach(result => {
    if (result.isFinal) {
      console.log('You said:', result.transcript);
    }
  });
});

// Start listening
speechManager.startListening();

// Text-to-Speech
speechManager.speak("Hello, this is text to speech!");
```

## 🌐 Browser Compatibility

### ✅ Supported Browsers
- **Chrome 25+** (Speech Recognition + TTS)
- **Edge 79+** (Speech Recognition + TTS)  
- **Firefox 44+** (TTS only)
- **Safari 14+** (TTS only)

### ❌ Not Supported
- Speech Recognition in Firefox/Safari
- Older browser versions

## 📋 Available Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /speech/info` | Service information |
| `GET /speech/demo` | Interactive demo page |
| `GET /speech/script/complete` | Complete JavaScript implementation |
| `GET /speech/voices` | Available TTS voices |
| `GET /speech/languages` | Supported languages |

## 🎯 Key Features

- ✅ **100% Free** - No API keys or external services
- ✅ **Real-time Processing** - No server round-trips
- ✅ **No Setup Required** - Works immediately
- ✅ **Privacy-Focused** - All processing in browser
- ✅ **Usage Tracking** - Built-in analytics for authenticated users

## 🔧 Configuration Options

```javascript
const speechManager = new WebSpeechManager({
  speechRecognition: {
    language: 'en-US',        // Language code
    continuous: false,        // Keep listening
    interimResults: true      // Get partial results
  },
  speechSynthesis: {
    language: 'en-US',        // Language code
    rate: 1.0,               // Speaking speed
    pitch: 1.0,              // Voice pitch
    volume: 1.0              // Volume level
  }
});
```

## 🎨 Frontend Integration

### HTML Example
```html
<button id="startBtn">Start Listening</button>
<div id="result"></div>

<script>
  // Load and use Web Speech API
  fetch('/speech/script/complete')
    .then(response => response.text())
    .then(script => eval(script))
    .then(() => {
      const speechManager = new WebSpeechManager();
      const startBtn = document.getElementById('startBtn');
      const resultDiv = document.getElementById('result');
      
      speechManager.onSpeechResult((results) => {
        const finalResult = results.find(r => r.isFinal);
        if (finalResult) {
          resultDiv.textContent = finalResult.transcript;
        }
      });
      
      startBtn.addEventListener('click', () => {
        speechManager.startListening();
      });
    });
</script>
```

### React Example
```jsx
import { useEffect, useState } from 'react';

const SpeechComponent = () => {
  const [transcript, setTranscript] = useState('');
  const [speechManager, setSpeechManager] = useState(null);

  useEffect(() => {
    fetch('/speech/script/complete')
      .then(response => response.text())
      .then(script => eval(script))
      .then(() => {
        const manager = new WebSpeechManager();
        manager.onSpeechResult((results) => {
          const final = results.find(r => r.isFinal);
          if (final) setTranscript(final.transcript);
        });
        setSpeechManager(manager);
      });
  }, []);

  return (
    <div>
      <button onClick={() => speechManager?.startListening()}>
        Start Listening
      </button>
      <p>You said: {transcript}</p>
    </div>
  );
};
```

## 🚨 Important Notes

1. **HTTPS Required** - Speech recognition needs HTTPS in production
2. **Microphone Permission** - Browser will ask for permission
3. **Browser Support** - Use Chrome/Edge for full functionality
4. **No External APIs** - Everything runs in the browser

## 🎯 Testing

1. **Start your server**: `npm start`
2. **Visit demo**: `http://localhost:5000/speech/demo`
3. **Test functionality** with the interactive demo

## 📚 Full Documentation

For complete documentation, examples, and advanced usage, see:
- `WEB_SPEECH_API_GUIDE.md` - Comprehensive guide
- `/speech/demo` - Interactive demo page

## 🆘 Troubleshooting

### Common Issues:
- **"Not supported"** → Use Chrome/Edge browser
- **"Permission denied"** → Allow microphone access
- **"HTTPS required"** → Use HTTPS in production
- **"No speech detected"** → Check microphone and speak clearly

### Debug Mode:
```javascript
speechManager.recognition.on('onError', (error) => {
  console.log('Speech error:', error);
});
```

---

**Ready to start?** Visit `/speech/demo` and try it out! 🚀
