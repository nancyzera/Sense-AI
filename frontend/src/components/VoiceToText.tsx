import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, Download, Share, Copy } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Alert, AlertDescription } from "./ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useSubscription } from "../contexts/SubscriptionContext";
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { voiceToTextService, SpeechRecognitionResult } from '../utils/aiServices';
import { toast } from "sonner";

interface VoiceToTextProps {
  onRestrictedAccess?: () => void;
}

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

export function VoiceToText({ onRestrictedAccess }: VoiceToTextProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [accuracy, setAccuracy] = useState(0);
  const [minutesUsed, setMinutesUsed] = useState(23);
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const recordingStartTime = useRef<number>(0);
  const { limits, hasReachedLimit } = useSubscription();
  const monthlyLimit = limits.voiceToTextMinutes;
  const isLimitReached = monthlyLimit !== -1 && hasReachedLimit('voiceToTextMinutes', minutesUsed);

  useEffect(() => {
    setIsSupported(voiceToTextService.isAvailable());
    if (!voiceToTextService.isAvailable()) {
      setError('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
    }
  }, []);

  const startRecording = async () => {
    if (isLimitReached) {
      onRestrictedAccess?.();
      return;
    }

    if (!isSupported) {
      toast.error('Speech recognition not supported in this browser');
      return;
    }

    setError(null);
    setIsRecording(true);
    setIsProcessing(true);
    setInterimTranscript("");
    recordingStartTime.current = Date.now();

    // Set language
    voiceToTextService.setLanguage(selectedLanguage);

    const success = voiceToTextService.startRecording(
      (result: SpeechRecognitionResult) => {
        setAccuracy(Math.round(result.confidence * 100));
        
        if (result.isFinal) {
          setTranscription(prev => {
            const newText = prev + (prev ? " " : "") + result.transcript;
            return newText;
          });
          setInterimTranscript("");
        } else {
          setInterimTranscript(result.transcript);
        }
      },
      (error: string) => {
        setError(error);
        setIsRecording(false);
        setIsProcessing(false);
        toast.error(`Recording error: ${error}`);
      },
      () => {
        // Recording ended
        setIsRecording(false);
        setIsProcessing(false);
        
        // Calculate minutes used
        const duration = (Date.now() - recordingStartTime.current) / 60000; // Convert to minutes
        setMinutesUsed(prev => prev + duration);
        
        // Track usage
        trackUsage('voice_to_text', duration);
        
        toast.success('Recording completed');
      }
    );

    if (success) {
      setIsProcessing(false);
      toast.success('Recording started - speak now');
    } else {
      setIsRecording(false);
      setIsProcessing(false);
    }
  };

  const stopRecording = () => {
    voiceToTextService.stopRecording();
    setIsRecording(false);
    setIsProcessing(false);
  };

  const trackUsage = async (feature: string, amount: number) => {
    try {
      await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-f8c4b683/usage/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ feature, amount })
      });
    } catch (error) {
      console.error('Error tracking usage:', error);
    }
  };

  const handleClear = () => {
    setTranscription("");
    setInterimTranscript("");
    setAccuracy(0);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(transcription);
      toast.success('Transcription copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleDownload = () => {
    if (!transcription) {
      toast.error('No transcription to download');
      return;
    }

    const blob = new Blob([transcription], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcription-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Transcription downloaded');
  };

  const handleShare = async () => {
    if (!transcription) {
      toast.error('No transcription to share');
      return;
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Voice Transcription',
          text: transcription
        });
        toast.success('Transcription shared');
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to copy
      handleCopy();
    }
  };

  const displayText = transcription + (interimTranscript ? ` ${interimTranscript}` : "");

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
            You've reached your monthly limit of {monthlyLimit} minutes. Upgrade to Pro for unlimited access.
          </AlertDescription>
        </Alert>
      )}

      {/* Language Selection */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-white">Language & Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm text-white mb-2">Recognition Language</label>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
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
        </CardContent>
      </Card>

      {/* Usage Statistics */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            Voice-to-Text Usage
            {accuracy > 0 && <Badge className="bg-primary">{accuracy}% Accuracy</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {monthlyLimit === -1 ? (
            <div className="text-center">
              <div className="text-2xl text-white">{minutesUsed.toFixed(1)}</div>
              <div className="text-sm text-muted-foreground">Minutes Used (Unlimited)</div>
            </div>
          ) : (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Monthly Usage</span>
                <span className="text-white">{minutesUsed.toFixed(1)} / {monthlyLimit} minutes</span>
              </div>
              <Progress value={(minutesUsed / monthlyLimit) * 100} className="h-2" />
            </>
          )}
        </CardContent>
      </Card>

      {/* Recording Interface */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-white">Voice Recording</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center">
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isProcessing || isLimitReached || !isSupported}
              size="lg"
              className={`w-24 h-24 rounded-full transition-all duration-200 ${
                isRecording 
                  ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
                  : 'bg-primary hover:bg-primary/90'
              }`}
            >
              {isRecording ? (
                <MicOff className="h-8 w-8" />
              ) : (
                <Mic className="h-8 w-8" />
              )}
            </Button>
          </div>
          
          <div className="text-center">
            {isRecording ? (
              <div className="space-y-2">
                <div className="text-white">Recording... Speak now</div>
                <div className="flex justify-center">
                  <div className="animate-pulse bg-red-500 h-2 w-2 rounded-full mx-1"></div>
                  <div className="animate-pulse bg-red-500 h-2 w-2 rounded-full mx-1" style={{animationDelay: '0.2s'}}></div>
                  <div className="animate-pulse bg-red-500 h-2 w-2 rounded-full mx-1" style={{animationDelay: '0.4s'}}></div>
                </div>
                {selectedLanguage !== 'en-US' && (
                  <div className="text-sm text-muted-foreground">
                    Speaking in {languages.find(l => l.code === selectedLanguage)?.name}
                  </div>
                )}
              </div>
            ) : isProcessing ? (
              <div className="text-muted-foreground">Processing audio...</div>
            ) : (
              <div className="text-muted-foreground">
                {isLimitReached ? 'Upgrade to continue recording' : 
                 !isSupported ? 'Speech recognition not supported' :
                 'Click to start recording'}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Transcription Output */}
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Transcription</CardTitle>
          <div className="flex gap-2">
            {transcription && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-border text-white hover:bg-secondary"
                  onClick={handleCopy}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-border text-white hover:bg-secondary"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Textarea
            value={displayText}
            onChange={(e) => setTranscription(e.target.value)}
            placeholder="Your transcribed text will appear here as you speak..."
            className="min-h-32 bg-input border-border text-white placeholder:text-muted-foreground resize-none"
            readOnly={isRecording}
          />
          {interimTranscript && (
            <p className="text-xs text-muted-foreground mt-2">
              Gray text is interim results - keep speaking for final transcription
            </p>
          )}
        </CardContent>
      </Card>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button
          variant="outline"
          className="border-border text-white hover:bg-secondary"
          onClick={handleClear}
          disabled={!transcription}
        >
          Clear
        </Button>
        <Button
          variant="outline"
          className="border-border text-white hover:bg-secondary"
          onClick={handleDownload}
          disabled={!transcription}
        >
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
        <Button
          variant="outline"
          className="border-border text-white hover:bg-secondary"
          onClick={() => {
            // This would integrate with TextToSpeech component
            if (transcription) {
              import('../utils/aiServices').then(({ textToSpeechService }) => {
                textToSpeechService.speak(transcription);
              });
            }
          }}
          disabled={!transcription}
        >
          <Volume2 className="h-4 w-4 mr-2" />
          Speak
        </Button>
        <Button
          variant="outline"
          className="border-border text-white hover:bg-secondary"
          onClick={handleShare}
          disabled={!transcription}
        >
          <Share className="h-4 w-4 mr-2" />
          Share
        </Button>
      </div>
    </div>
  );
}