import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, VolumeX, Play, Pause, Settings, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Alert, AlertDescription } from "./ui/alert";
import { Slider } from "./ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { useSubscription } from "../contexts/SubscriptionContext";
import { voiceChatService, ChatMessage } from '../utils/aiServices';
import { toast } from "sonner";

interface VoiceChatProps {
  onRestrictedAccess?: () => void;
}

export function VoiceChat({ onRestrictedAccess }: VoiceChatProps) {
  const [isActive, setIsActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>([]);
  const [sessionsUsed, setSessionsUsed] = useState(5);
  const [error, setError] = useState<string | null>(null);
  
  // Voice settings
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [speechRate, setSpeechRate] = useState(1);
  const [speechVolume, setSpeechVolume] = useState(1);
  const [language, setLanguage] = useState('en-US');
  const [showSettings, setShowSettings] = useState(false);
  
  const { limits, hasReachedLimit } = useSubscription();
  const monthlyLimit = limits.voiceToTextMinutes;
  const isLimitReached = monthlyLimit !== -1 && hasReachedLimit('voiceToTextMinutes', sessionsUsed * 2); // Estimate 2 minutes per session

  useEffect(() => {
    return () => {
      if (isActive) {
        voiceChatService.stopVoiceConversation();
      }
    };
  }, [isActive]);

  const startVoiceChat = async () => {
    if (isLimitReached) {
      onRestrictedAccess?.();
      return;
    }

    if (!voiceChatService.isAvailable()) {
      toast.error('Voice chat is not supported in your browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    setError(null);
    setIsActive(true);
    setIsListening(true);
    setCurrentTranscript("");
    
    toast.success('Voice chat started - speak now!');

    const success = await voiceChatService.startVoiceConversation(
      (transcript: string, isFinal: boolean) => {
        setCurrentTranscript(transcript);
        
        if (isFinal && transcript.trim()) {
          // Add user message to history
          const userMessage: ChatMessage = {
            role: 'user',
            content: transcript,
            timestamp: Date.now()
          };
          setConversationHistory(prev => [...prev, userMessage]);
          setCurrentTranscript("");
        }
      },
      (response: string) => {
        // Add AI response to history
        const aiMessage: ChatMessage = {
          role: 'assistant',
          content: response,
          timestamp: Date.now()
        };
        setConversationHistory(prev => [...prev, aiMessage]);
        setIsSpeaking(true);
        
        setTimeout(() => {
          setIsSpeaking(false);
          setIsListening(true);
        }, response.length * 50); // Estimate speaking duration
      },
      (error: string) => {
        setError(error);
        setIsActive(false);
        setIsListening(false);
        setIsSpeaking(false);
        toast.error(`Voice chat error: ${error}`);
      },
      conversationHistory
    );

    if (!success) {
      setIsActive(false);
      setIsListening(false);
    }
  };

  const stopVoiceChat = () => {
    voiceChatService.stopVoiceConversation();
    setIsActive(false);
    setIsListening(false);
    setIsSpeaking(false);
    setCurrentTranscript("");
    
    // Update usage tracking
    setSessionsUsed(prev => prev + 1);
    
    toast.success('Voice chat stopped');
  };

  const pauseListening = () => {
    setIsListening(false);
    // Note: We can't actually pause Web Speech API, so this is more of a UI state
    toast.info('Listening paused - click resume to continue');
  };

  const resumeListening = () => {
    if (isActive) {
      setIsListening(true);
      toast.success('Listening resumed');
    }
  };

  const clearConversation = () => {
    setConversationHistory([]);
    setCurrentTranscript("");
    toast.success('Conversation history cleared');
  };

  const languages = [
    { code: 'en-US', name: 'English (US)' },
    { code: 'en-GB', name: 'English (UK)' },
    { code: 'es-ES', name: 'Spanish' },
    { code: 'fr-FR', name: 'French' },
    { code: 'de-DE', name: 'German' },
    { code: 'it-IT', name: 'Italian' },
    { code: 'pt-BR', name: 'Portuguese' },
    { code: 'ja-JP', name: 'Japanese' },
    { code: 'ko-KR', name: 'Korean' },
    { code: 'zh-CN', name: 'Chinese (Simplified)' }
  ];

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <Alert className="bg-destructive/10 border-destructive/20">
          <AlertDescription className="text-destructive">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Usage Alert */}
      {isLimitReached && (
        <Alert className="bg-destructive/10 border-destructive/20">
          <AlertDescription className="text-destructive">
            You've reached your usage limit for voice features. Upgrade to Pro for unlimited access.
          </AlertDescription>
        </Alert>
      )}

      {/* Voice Chat Status */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            Voice Chat Session
            <div className="flex items-center gap-2">
              {isActive && (
                <Badge className={`${
                  isListening ? 'bg-green-600' : 
                  isSpeaking ? 'bg-blue-600' : 'bg-yellow-600'
                }`}>
                  {isListening ? 'Listening' : 
                   isSpeaking ? 'Speaking' : 'Processing'}
                </Badge>
              )}
              <Button
                variant="outline"
                size="sm"
                className="border-border text-white hover:bg-secondary"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Voice Chat Controls */}
          <div className="flex items-center justify-center">
            {!isActive ? (
              <Button
                onClick={startVoiceChat}
                disabled={isLimitReached}
                size="lg"
                className="w-32 h-32 rounded-full bg-primary hover:bg-primary/90 text-lg"
              >
                <div className="flex flex-col items-center gap-2">
                  <Mic className="h-8 w-8" />
                  <span>Start</span>
                </div>
              </Button>
            ) : (
              <div className="flex items-center gap-4">
                <Button
                  onClick={isListening ? pauseListening : resumeListening}
                  size="lg"
                  className={`w-20 h-20 rounded-full ${
                    isListening ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'
                  }`}
                  disabled={isSpeaking}
                >
                  {isListening ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                </Button>
                
                <Button
                  onClick={stopVoiceChat}
                  size="lg"
                  className="w-20 h-20 rounded-full bg-red-600 hover:bg-red-700"
                >
                  <MicOff className="h-6 w-6" />
                </Button>
              </div>
            )}
          </div>

          {/* Status Display */}
          <div className="text-center">
            {isActive ? (
              <div className="space-y-2">
                <div className="text-white">
                  {isListening ? '🎤 Listening... Speak now' :
                   isSpeaking ? '🔊 AI is responding...' :
                   '⏸️ Paused - Click resume to continue'}
                </div>
                {isListening && (
                  <div className="flex justify-center">
                    <div className="animate-pulse bg-green-500 h-2 w-2 rounded-full mx-1"></div>
                    <div className="animate-pulse bg-green-500 h-2 w-2 rounded-full mx-1" style={{animationDelay: '0.2s'}}></div>
                    <div className="animate-pulse bg-green-500 h-2 w-2 rounded-full mx-1" style={{animationDelay: '0.4s'}}></div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-muted-foreground">
                {isLimitReached ? 'Upgrade to start voice chat' : 'Click to start hands-free conversation'}
              </div>
            )}
          </div>

          {/* Current Transcript */}
          {currentTranscript && (
            <Card className="bg-secondary/20 border-border">
              <CardContent className="pt-4">
                <div className="text-white">
                  <span className="text-muted-foreground text-sm">You're saying: </span>
                  {currentTranscript}
                  <span className="animate-pulse">|</span>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Voice Settings */}
      {showSettings && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-white">Voice Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white mb-2">Language</label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="bg-input border-border text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code} className="text-white hover:bg-secondary">
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm text-white">Auto-speak responses</label>
                <Switch checked={autoSpeak} onCheckedChange={setAutoSpeak} />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white mb-2">
                  Speech Rate: {speechRate.toFixed(1)}x
                </label>
                <Slider
                  value={[speechRate]}
                  onValueChange={(value) => setSpeechRate(value[0])}
                  min={0.1}
                  max={2}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm text-white mb-2">
                  Speech Volume: {Math.round(speechVolume * 100)}%
                </label>
                <Slider
                  value={[speechVolume]}
                  onValueChange={(value) => setSpeechVolume(value[0])}
                  min={0}
                  max={1}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Usage Statistics */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-white">Voice Chat Usage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl text-white">{sessionsUsed}</div>
              <div className="text-sm text-muted-foreground">Sessions Today</div>
            </div>
            <div className="text-center">
              <div className="text-2xl text-white">{conversationHistory.length}</div>
              <div className="text-sm text-muted-foreground">Messages Exchanged</div>
            </div>
          </div>
          
          {monthlyLimit !== -1 && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Estimated Usage</span>
                <span className="text-white">{sessionsUsed * 2} / {monthlyLimit} minutes</span>
              </div>
              <Progress value={(sessionsUsed * 2 / monthlyLimit) * 100} className="h-2" />
            </>
          )}
        </CardContent>
      </Card>

      {/* Conversation History */}
      {conversationHistory.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Conversation History</CardTitle>
            <Button
              variant="outline"
              size="sm"
              className="border-border text-white hover:bg-secondary"
              onClick={clearConversation}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Clear
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {conversationHistory.slice(-10).map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-2 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-2 text-sm ${
                      message.role === 'user'
                        ? 'bg-primary text-white'
                        : 'bg-secondary text-white'
                    }`}
                  >
                    <div className="flex items-center gap-1 mb-1">
                      {message.role === 'user' ? (
                        <Mic className="h-3 w-3" />
                      ) : (
                        <Volume2 className="h-3 w-3" />
                      )}
                      <span className="text-xs opacity-70">
                        {message.role === 'user' ? 'You' : 'AI'}
                      </span>
                    </div>
                    <div>{message.content}</div>
                    <div className="text-xs opacity-50 mt-1">
                      {new Date(message.timestamp || Date.now()).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {conversationHistory.length > 10 && (
              <div className="text-center text-sm text-muted-foreground mt-3">
                Showing last 10 messages
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button
          variant="outline"
          className="border-border text-white hover:bg-secondary"
          onClick={() => setShowSettings(!showSettings)}
        >
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
        <Button
          variant="outline"
          className="border-border text-white hover:bg-secondary"
          onClick={clearConversation}
          disabled={conversationHistory.length === 0}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear History
        </Button>
        <Button
          variant="outline"
          className="border-border text-white hover:bg-secondary"
          onClick={() => {
            toast.info('Test voice output');
            voiceChatService.speakText('This is a test of the voice output system. Can you hear me clearly?');
          }}
          disabled={!voiceChatService.isAvailable()}
        >
          <Volume2 className="h-4 w-4 mr-2" />
          Test Voice
        </Button>
        <Button
          variant="outline"
          className="border-border text-white hover:bg-secondary"
          onClick={() => {
            const exportText = conversationHistory.map(msg => 
              `${msg.role === 'user' ? 'You' : 'AI'}: ${msg.content}`
            ).join('\n\n');
            
            navigator.clipboard.writeText(exportText);
            toast.success('Conversation copied to clipboard');
          }}
          disabled={conversationHistory.length === 0}
        >
          Export Chat
        </Button>
      </div>
    </div>
  );
}