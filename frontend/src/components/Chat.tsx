import { useState, useRef, useEffect } from "react";
import { Send, Mic, MicOff, Volume2, VolumeX, User, Bot, Trash2, Download, Copy } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { APIKeyNotice } from "./APIKeyNotice";
import { useSubscription } from "../contexts/SubscriptionContext";
import { voiceChatService, ChatMessage } from '../utils/aiServices';
import { toast } from "sonner";

const BASE_URL = import.meta.env.VITE_AIML_API_BASE_URL;
const API_KEY = import.meta.env.VITE_AIML_API_KEY;

export function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI accessibility assistant. I can help you with voice-to-text, text-to-speech, vision support, and mobility assistance. How can I help you today?',
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAPINotice, setShowAPINotice] = useState(() => {
    const dismissed = localStorage.getItem('baho-ai-notice-dismissed');
    return !dismissed;
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { canAccess } = useSubscription();

  const handleDismissNotice = () => {
    setShowAPINotice(false);
    localStorage.setItem('baho-ai-notice-dismissed', 'true');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
  
    const userMessage: ChatMessage = {
      role: 'user',
      content: content.trim(),
      timestamp: Date.now()
    };
  
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);
  
    try {
      const response = await fetch(`${BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo-1106",
          messages: [...messages, userMessage].map(msg => ({
            role: "user",
            content: msg.content,
          })),
        }),
      });
      
  
      // Log the raw response for debugging
      console.log("Response status:", response.status);
      console.log("Response headers:", [...response.headers.entries()]);
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error response:", errorText);
        throw new Error(`API request failed with status ${response.status}: ${errorText}`);
      }
  
      const data = await response.json();
      console.log("API response data:", data); // Log the response data
  
      // Adjust this line based on the actual API response structure
      const assistantMessageContent = data.choices?.[0]?.message?.content;
      if (!assistantMessageContent) {
        throw new Error("Unexpected API response format: 'choices[0].message.content' not found.");
      }
  
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: assistantMessageContent,
        timestamp: Date.now()
      };
  
      setMessages(prev => [...prev, assistantMessage]);
  
      if (autoSpeak && voiceChatService.isAvailable()) {
        voiceChatService.speakText(assistantMessage.content);
      }
    } catch (error) {
      console.error("Detailed error:", error);
      setError(`Failed to get AI response: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  

  const startVoiceChat = async () => {
    if (!voiceChatService.isAvailable()) {
      toast.error('Voice chat is not supported in your browser');
      return;
    }
    setIsVoiceMode(true);
    setIsListening(true);
    setError(null);
    const success = await voiceChatService.startVoiceConversation(
      (transcript: string, isFinal: boolean) => {
        setCurrentTranscript(transcript);

        if (isFinal && transcript.trim()) {
          sendMessage(transcript);
          setCurrentTranscript("");
        }
      },
      (response: string) => {
        toast.success('Voice response complete');
      },
      (error: string) => {
        setError(error);
        setIsVoiceMode(false);
        setIsListening(false);
        toast.error(`Voice chat error: ${error}`);
      },
      messages
    );
    if (!success) {
      setIsVoiceMode(false);
      setIsListening(false);
    }
  };

  const stopVoiceChat = () => {
    voiceChatService.stopVoiceConversation();
    setIsVoiceMode(false);
    setIsListening(false);
    setCurrentTranscript("");
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: 'Hello! I\'m your AI accessibility assistant. How can I help you today?',
        timestamp: Date.now()
      }
    ]);
    setError(null);
    toast.success('Chat cleared');
  };

  const exportChat = () => {
    const chatText = messages.map(msg => {
      const timestamp = new Date(msg.timestamp || Date.now()).toLocaleString();
      const role = msg.role === 'user' ? 'You' : 'AI Assistant';
      return `[${timestamp}] ${role}: ${msg.content}`;
    }).join('\n\n');
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `baho-ai-chat-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Chat exported');
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Message copied to clipboard');
  };

  const speakMessage = (content: string) => {
    if (voiceChatService.isAvailable()) {
      voiceChatService.speakText(content);
    } else {
      toast.error('Text-to-speech not available');
    }
  };

  const formatTime = (timestamp?: number) => {
    return new Date(timestamp || Date.now()).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="h-full flex flex-col p-6 max-w-4xl mx-auto">
      {/* Header */}
      <Card className="bg-card border-border mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              AI Assistant Chat
              {isVoiceMode && <Badge className="bg-green-600">Voice Mode</Badge>}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-border text-white hover:bg-secondary"
                onClick={() => setAutoSpeak(!autoSpeak)}
              >
                {autoSpeak ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-border text-white hover:bg-secondary"
                onClick={exportChat}
                disabled={messages.length <= 1}
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-border text-white hover:bg-secondary"
                onClick={clearChat}
                disabled={messages.length <= 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert className="bg-destructive/10 border-destructive/20 mb-4">
          <AlertDescription className="text-destructive">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* API Key Notice */}
      {showAPINotice && (
        <div className="mb-4">
          <APIKeyNotice onDismiss={handleDismissNotice} />
        </div>
      )}

      {/* Chat Messages */}
      <Card className="bg-card border-border flex-1 flex flex-col">
        <CardContent className="p-0 flex-1 flex flex-col">
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarFallback className="bg-primary text-white">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-white'
                        : 'bg-secondary text-white'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs opacity-70">
                        {formatTime(message.timestamp)}
                      </span>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 hover:bg-white/20"
                          onClick={() => copyMessage(message.content)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        {message.role === 'assistant' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover:bg-white/20"
                            onClick={() => speakMessage(message.content)}
                          >
                            <Volume2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  {message.role === 'user' && (
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarFallback className="bg-secondary text-white">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback className="bg-primary text-white">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-secondary text-white rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <div className="animate-pulse bg-white/60 h-2 w-2 rounded-full"></div>
                      <div className="animate-pulse bg-white/60 h-2 w-2 rounded-full" style={{animationDelay: '0.2s'}}></div>
                      <div className="animate-pulse bg-white/60 h-2 w-2 rounded-full" style={{animationDelay: '0.4s'}}></div>
                      <span className="text-sm">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Voice transcription indicator */}
              {currentTranscript && (
                <div className="flex gap-3 justify-end">
                  <div className="bg-primary/60 text-white rounded-lg p-3 border-2 border-primary border-dashed">
                    <div className="whitespace-pre-wrap">{currentTranscript}</div>
                    <div className="text-xs opacity-70 mt-1">Speaking...</div>
                  </div>
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback className="bg-secondary text-white">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-border p-4">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={isVoiceMode ? "Voice mode active - speak or type..." : "Type your message..."}
                  className="bg-input border-border text-white placeholder:text-muted-foreground pr-12"
                  disabled={isLoading}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                  {autoSpeak && (
                    <Badge className="bg-green-600 text-xs px-1 py-0">
                      Auto-speak
                    </Badge>
                  )}
                </div>
              </div>
              <Button
                onClick={isVoiceMode ? stopVoiceChat : startVoiceChat}
                variant="outline"
                className={`border-border text-white hover:bg-secondary ${
                  isVoiceMode ? 'bg-red-600 hover:bg-red-700' : ''
                }`}
                disabled={isLoading}
              >
                {isVoiceMode ? (
                  <>
                    <MicOff className="h-4 w-4" />
                    {isListening && <span className="ml-1 animate-pulse">●</span>}
                  </>
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </Button>
              <Button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isLoading}
                className="bg-primary hover:bg-primary/90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            {isVoiceMode && (
              <div className="text-center text-sm text-muted-foreground mt-2">
                {isListening ? (
                  <span className="text-green-400">🎤 Listening... Speak now or type your message</span>
                ) : (
                  <span>Voice mode active - Click the microphone to start listening</span>
                )}
              </div>
            )}
            {!canAccess('aiInsights') && (
              <div className="text-center text-xs text-muted-foreground mt-2">
                Upgrade to Pro for advanced AI features and unlimited conversations
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}