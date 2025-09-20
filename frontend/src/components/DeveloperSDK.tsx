import { useState } from "react";
import { Code, Book, Download, Key, Settings, Copy, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Alert, AlertDescription } from "./ui/alert";

const codeExamples = {
  javascript: `// Sense AI SDK - JavaScript Example
import { BahoAI } from '@baho/ai-sdk';

const client = new BahoAI({
  apiKey: 'your-api-key',
  environment: 'production' // or 'sandbox'
});

// Voice-to-Text
const transcription = await client.voiceToText({
  audioBlob: audioFile,
  language: 'en-US',
  enablePunctuation: true
});

// Text-to-Speech
const audioUrl = await client.textToSpeech({
  text: 'Hello, this is Sense AI speaking',
  voice: 'female',
  speed: 1.0,
  format: 'mp3'
});

// Vision Support
const analysis = await client.analyzeImage({
  imageUrl: 'https://example.com/image.jpg',
  features: ['objects', 'text', 'description']
});

console.log('Results:', { transcription, audioUrl, analysis });`,

  python: `# Sense AI SDK - Python Example
from baho_ai import BahoClient

client = BahoClient(
    api_key="your-api-key",
    environment="production"
)

# Voice-to-Text
transcription = client.voice_to_text(
    audio_file="path/to/audio.wav",
    language="en-US",
    enable_punctuation=True
)

# Text-to-Speech
audio_url = client.text_to_speech(
    text="Hello, this is Sense AI speaking",
    voice="female",
    speed=1.0,
    format="mp3"
)

# Vision Support
analysis = client.analyze_image(
    image_url="https://example.com/image.jpg",
    features=["objects", "text", "description"]
)

print(f"Results: {transcription}, {audio_url}, {analysis}")`,

  react: `// React Integration Example
import React, { useState } from 'react';
import { useBahoAI } from '@baho/react-sdk';

function AccessibilityComponent() {
  const { 
    voiceToText, 
    textToSpeech, 
    analyzeImage,
    isLoading 
  } = useBahoAI({
    apiKey: process.env.REACT_APP_BAHO_API_KEY
  });
  
  const [transcription, setTranscription] = useState('');

  const handleVoiceInput = async (audioBlob) => {
    const result = await voiceToText(audioBlob);
    setTranscription(result.text);
  };

  const handleSpeak = async (text) => {
    const audioUrl = await textToSpeech(text);
    const audio = new Audio(audioUrl);
    audio.play();
  };

  return (
    <div>
      <button onClick={() => handleVoiceInput()}>
        Start Voice Input
      </button>
      <textarea value={transcription} readOnly />
      <button onClick={() => handleSpeak(transcription)}>
        Speak Text
      </button>
    </div>
  );
}`,

  webhook: `// Webhook Integration Example
app.post('/baho-webhook', (req, res) => {
  const { event, data } = req.body;
  
  switch (event) {
    case 'transcription.completed':
      console.log('Transcription completed:', data.text);
      // Handle completed transcription
      break;
      
    case 'synthesis.completed':
      console.log('Speech synthesis completed:', data.audioUrl);
      // Handle completed speech synthesis
      break;
      
    case 'analysis.completed':
      console.log('Image analysis completed:', data.results);
      // Handle completed image analysis
      break;
      
    default:
      console.log('Unknown event:', event);
  }
  
  res.status(200).json({ received: true });
});`
};

export function DeveloperSDK() {
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [apiKey, setApiKey] = useState('');
  const [copied, setCopied] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);

  const generateApiKey = () => {
    const key = `08b94ae73e25493497d8c7c7bcbdc16b`;
    setApiKey(key);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const testApiConnection = async () => {
    if (!apiKey) {
      alert('Please generate an API key first');
      return;
    }

    // Simulate API test
    setTestResults({
      status: 'success',
      latency: '45ms',
      features: {
        voiceToText: 'available',
        textToSpeech: 'available',
        visionSupport: 'available',
        coralAgents: 'available'
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* API Key Management */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            API Key Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Your API key will appear here"
              className="bg-input border-border text-white placeholder:text-muted-foreground"
              readOnly
            />
            <Button onClick={generateApiKey} className="bg-primary hover:bg-primary/90">
              Generate Key
            </Button>
            {apiKey && (
              <Button
                onClick={() => copyToClipboard(apiKey)}
                variant="outline"
                className="border-border text-white hover:bg-secondary"
              >
                {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            )}
          </div>
          
          <Alert className="bg-secondary/20 border-border">
            <Settings className="h-4 w-4" />
            <AlertDescription className="text-muted-foreground">
              Keep your API key secure. Don't expose it in client-side code or public repositories.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* SDK Installation */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            SDK Installation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="javascript">JavaScript</TabsTrigger>
              <TabsTrigger value="python">Python</TabsTrigger>
              <TabsTrigger value="react">React</TabsTrigger>
              <TabsTrigger value="webhook">Webhooks</TabsTrigger>
            </TabsList>
            
            <TabsContent value="javascript" className="space-y-4">
              <div className="bg-secondary/20 rounded-lg p-4">
                <code className="text-sm text-white">npm install @baho/ai-sdk</code>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard('npm install @baho/ai-sdk')}
                  className="ml-2"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="python" className="space-y-4">
              <div className="bg-secondary/20 rounded-lg p-4">
                <code className="text-sm text-white">pip install baho-ai</code>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard('pip install baho-ai')}
                  className="ml-2"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="react" className="space-y-4">
              <div className="bg-secondary/20 rounded-lg p-4">
                <code className="text-sm text-white">npm install @baho/react-sdk</code>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard('npm install @baho/react-sdk')}
                  className="ml-2"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="webhook" className="space-y-4">
              <div className="bg-secondary/20 rounded-lg p-4">
                <code className="text-sm text-white">Configure webhook endpoint: https://your-app.com/baho-webhook</code>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Code Examples */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Code className="h-5 w-5 text-primary" />
            Code Examples
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="border-border text-white">
                {selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1)}
              </Badge>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(codeExamples[selectedLanguage as keyof typeof codeExamples])}
                className="text-white hover:bg-secondary"
              >
                <Copy className="h-3 w-3 mr-1" />
                Copy Code
              </Button>
            </div>
            
            <Textarea
              value={codeExamples[selectedLanguage as keyof typeof codeExamples]}
              readOnly
              className="min-h-64 bg-secondary/20 border-border text-white font-mono text-sm resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* API Testing */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-white">API Testing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={testApiConnection}
            disabled={!apiKey}
            className="w-full bg-primary hover:bg-primary/90"
          >
            Test API Connection
          </Button>
          
          {testResults && (
            <div className="bg-secondary/20 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-white">Connection Successful</span>
                <Badge className="bg-green-600">
                  {testResults.latency}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-white text-sm">Available Features:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(testResults.features).map(([feature, status]) => (
                    <div key={feature} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-3 w-3 text-green-400" />
                      <span className="text-white">{feature}</span>
                      <Badge variant="outline" className="border-border text-white text-xs">
                        {status as string}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Documentation Links */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Book className="h-5 w-5 text-primary" />
            Documentation & Resources
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="text-white">API Reference</h4>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start border-border text-white hover:bg-secondary">
                  Voice-to-Text API
                </Button>
                <Button variant="outline" className="w-full justify-start border-border text-white hover:bg-secondary">
                  Text-to-Speech API
                </Button>
                <Button variant="outline" className="w-full justify-start border-border text-white hover:bg-secondary">
                  Vision Support API
                </Button>
                <Button variant="outline" className="w-full justify-start border-border text-white hover:bg-secondary">
                  Coral Protocol API
                </Button>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-white">Guides & Tutorials</h4>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start border-border text-white hover:bg-secondary">
                  Quick Start Guide
                </Button>
                <Button variant="outline" className="w-full justify-start border-border text-white hover:bg-secondary">
                  Integration Examples
                </Button>
                <Button variant="outline" className="w-full justify-start border-border text-white hover:bg-secondary">
                  Best Practices
                </Button>
                <Button variant="outline" className="w-full justify-start border-border text-white hover:bg-secondary">
                  Troubleshooting
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rate Limits & Pricing */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-white">Rate Limits & Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 text-white">Plan</th>
                  <th className="text-center py-3 text-white">Requests/Min</th>
                  <th className="text-center py-3 text-white">Requests/Day</th>
                  <th className="text-center py-3 text-white">Price</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border/50">
                  <td className="py-3">Free</td>
                  <td className="text-center py-3">10</td>
                  <td className="text-center py-3">1,000</td>
                  <td className="text-center py-3">$0</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3">Pro</td>
                  <td className="text-center py-3">100</td>
                  <td className="text-center py-3">50,000</td>
                  <td className="text-center py-3">$19.99/mo</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3">Enterprise</td>
                  <td className="text-center py-3">1000</td>
                  <td className="text-center py-3">Unlimited</td>
                  <td className="text-center py-3">Custom</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}