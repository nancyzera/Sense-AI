import { useState, useEffect } from "react";
import { Volume2, VolumeX, Play, Pause, RotateCcw, Download, Upload } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Alert, AlertDescription } from "./ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Slider } from "./ui/slider";
import { useSubscription } from "../contexts/SubscriptionContext";
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { textToSpeechService } from '../utils/aiServices';
import { toast } from "sonner";

interface TextToSpeechProps {
  onRestrictedAccess?: () => void;
}

export function TextToSpeech({ onRestrictedAccess }: TextToSpeechProps) {
  const [text, setText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [conversionsUsed, setConversionsUsed] = useState(12);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { limits, hasReachedLimit } = useSubscription();
  const monthlyLimit = limits.textToSpeechConversions;
  const isLimitReached = monthlyLimit !== -1 && hasReachedLimit('textToSpeechConversions', conversionsUsed);

  useEffect(() => {
    setIsSupported(textToSpeechService.isAvailable());
    if (!textToSpeechService.isAvailable()) {
      setError('Text-to-speech is not supported in your browser.');
      return;
    }

    // Load voices
    const loadVoices = () => {
      const availableVoices = textToSpeechService.getVoices();
      setVoices(availableVoices);
      
      // Set default voice (prefer English voices)
      const englishVoice = availableVoices.find(voice => 
        voice.lang.startsWith('en') && voice.localService
      ) || availableVoices[0];
      
      if (englishVoice) {
        setSelectedVoice(englishVoice.name);
      }
    };

    loadVoices();
    
    // Some browsers load voices asynchronously
    if (voices.length === 0) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      textToSpeechService.stop();
    };
  }, []);

  const handleSpeak = async () => {
    if (!text.trim()) {
      toast.error('Please enter some text to speak');
      return;
    }

    if (isLimitReached) {
      onRestrictedAccess?.();
      return;
    }

    if (!isSupported) {
      toast.error('Text-to-speech not supported in this browser');
      return;
    }

    setError(null);
    
    const success = textToSpeechService.speak(
      text,
      {
        voice: selectedVoice,
        rate: rate,
        pitch: pitch,
        volume: volume
      },
      () => {
        setIsSpeaking(true);
        setIsPaused(false);
        toast.success('Speech started');
      },
      () => {
        setIsSpeaking(false);
        setIsPaused(false);
        
        // Track usage
        setConversionsUsed(prev => prev + 1);
        trackUsage('text_to_speech', 1);
        
        toast.success('Speech completed');
      },
      (error: string) => {
        setError(error);
        setIsSpeaking(false);
        setIsPaused(false);
        toast.error(`Speech error: ${error}`);
      }
    );

    if (!success) {
      setIsSpeaking(false);
      setIsPaused(false);
    }
  };

  const handleStop = () => {
    textToSpeechService.stop();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  const handlePause = () => {
    if (isPaused) {
      textToSpeechService.resume();
      setIsPaused(false);
      toast.success('Speech resumed');
    } else {
      textToSpeechService.pause();
      setIsPaused(true);
      toast.success('Speech paused');
    }
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

  const handleLoadSample = () => {
    setText("Welcome to Baho AI's text-to-speech feature. This technology converts written text into natural-sounding speech, helping break communication barriers for individuals who are mute or have speech difficulties. You can adjust voice settings, speed, and pitch to customize your experience.");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/plain') {
      toast.error('Please select a text file (.txt)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setText(content);
      toast.success('Text file loaded');
    };
    reader.onerror = () => {
      toast.error('Failed to read file');
    };
    reader.readAsText(file);
  };

  const handleExportAudio = () => {
    toast.info('Audio export feature would be implemented with additional Web Audio API integration');
  };

  const voiceCategories = {
    'English': voices.filter(v => v.lang.startsWith('en')),
    'Spanish': voices.filter(v => v.lang.startsWith('es')),
    'French': voices.filter(v => v.lang.startsWith('fr')),
    'German': voices.filter(v => v.lang.startsWith('de')),
    'Other': voices.filter(v => !['en', 'es', 'fr', 'de'].some(lang => v.lang.startsWith(lang)))
  };

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
            You've reached your monthly limit of {monthlyLimit} conversions. Upgrade to Pro for unlimited access.
          </AlertDescription>
        </Alert>
      )}

      {/* Voice Settings */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-white">Voice Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white mb-2">Voice</label>
              <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                <SelectTrigger className="bg-input border-border text-white">
                  <SelectValue placeholder="Select a voice" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border max-h-60">
                  {Object.entries(voiceCategories).map(([category, categoryVoices]) => (
                    categoryVoices.length > 0 && (
                      <div key={category}>
                        <div className="px-2 py-1 text-xs text-muted-foreground font-semibold">
                          {category}
                        </div>
                        {categoryVoices.map((voice) => (
                          <SelectItem 
                            key={voice.name} 
                            value={voice.name} 
                            className="text-white hover:bg-secondary"
                          >
                            {voice.name} ({voice.lang})
                          </SelectItem>
                        ))}
                      </div>
                    )
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white mb-2">
                  Speed: {rate.toFixed(1)}x
                </label>
                <Slider
                  value={[rate]}
                  onValueChange={(value) => setRate(value[0])}
                  min={0.1}
                  max={2}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm text-white mb-2">
                  Pitch: {pitch.toFixed(1)}
                </label>
                <Slider
                  value={[pitch]}
                  onValueChange={(value) => setPitch(value[0])}
                  min={0}
                  max={2}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm text-white mb-2">
                  Volume: {Math.round(volume * 100)}%
                </label>
                <Slider
                  value={[volume]}
                  onValueChange={(value) => setVolume(value[0])}
                  min={0}
                  max={1}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Statistics */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            Text-to-Speech Usage
            {isSpeaking && <Badge className="bg-green-600">Speaking</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {monthlyLimit === -1 ? (
            <div className="text-center">
              <div className="text-2xl text-white">{conversionsUsed}</div>
              <div className="text-sm text-muted-foreground">Conversions Used (Unlimited)</div>
            </div>
          ) : (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Monthly Usage</span>
                <span className="text-white">{conversionsUsed} / {monthlyLimit} conversions</span>
              </div>
              <Progress value={(conversionsUsed / monthlyLimit) * 100} className="h-2" />
            </>
          )}
        </CardContent>
      </Card>

      {/* Text Input */}
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Text to Convert</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-border text-white hover:bg-secondary"
              onClick={handleLoadSample}
            >
              Load Sample
            </Button>
            <label>
              <input
                type="file"
                accept=".txt"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                size="sm"
                className="border-border text-white hover:bg-secondary"
                asChild
              >
                <span>
                  <Upload className="h-4 w-4 mr-1" />
                  Upload
                </span>
              </Button>
            </label>
          </div>
        </CardHeader>
        <CardContent>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter the text you want to convert to speech..."
            className="min-h-32 bg-input border-border text-white placeholder:text-muted-foreground resize-none"
            maxLength={5000}
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>Character count: {text.length} / 5000</span>
            <span>Estimated duration: ~{Math.ceil(text.length / 180)} seconds</span>
          </div>
        </CardContent>
      </Card>

      {/* Playback Controls */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-white">Playback Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-4">
            <Button
              onClick={handleSpeak}
              disabled={!text.trim() || isSpeaking || isLimitReached || !isSupported}
              size="lg"
              className="bg-primary hover:bg-primary/90"
            >
              <Play className="h-5 w-5 mr-2" />
              {isSpeaking ? 'Speaking...' : 'Speak'}
            </Button>

            {isSpeaking && (
              <Button
                onClick={handlePause}
                variant="outline"
                size="lg"
                className="border-border text-white hover:bg-secondary"
              >
                {isPaused ? <Play className="h-5 w-5 mr-2" /> : <Pause className="h-5 w-5 mr-2" />}
                {isPaused ? 'Resume' : 'Pause'}
              </Button>
            )}

            <Button
              onClick={handleStop}
              disabled={!isSpeaking}
              variant="outline"
              size="lg"
              className="border-border text-white hover:bg-secondary"
            >
              <VolumeX className="h-5 w-5 mr-2" />
              Stop
            </Button>

            <Button
              onClick={() => {
                setRate(1);
                setPitch(1);
                setVolume(1);
                toast.success('Voice settings reset to default');
              }}
              variant="outline"
              size="lg"
              className="border-border text-white hover:bg-secondary"
            >
              <RotateCcw className="h-5 w-5 mr-2" />
              Reset
            </Button>
          </div>

          {isSpeaking && (
            <div className="mt-4 text-center">
              <div className="flex items-center justify-center gap-2 text-green-400">
                <Volume2 className="h-4 w-4 animate-pulse" />
                <span className="text-sm">
                  {isPaused ? 'Paused' : 'Now speaking...'}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button
          variant="outline"
          className="border-border text-white hover:bg-secondary"
          onClick={() => setText("")}
          disabled={!text}
        >
          Clear Text
        </Button>
        <Button
          variant="outline"
          className="border-border text-white hover:bg-secondary"
          onClick={() => {
            navigator.clipboard.writeText(text);
            toast.success('Text copied to clipboard');
          }}
          disabled={!text}
        >
          Copy Text
        </Button>
        <Button
          variant="outline"
          className="border-border text-white hover:bg-secondary"
          onClick={handleExportAudio}
          disabled={!text || !isSupported}
        >
          <Download className="h-4 w-4 mr-2" />
          Export Audio
        </Button>
        <Button
          variant="outline"
          className="border-border text-white hover:bg-secondary"
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: 'Text for Speech',
                text: text
              });
            } else {
              navigator.clipboard.writeText(text);
              toast.success('Text copied to clipboard');
            }
          }}
          disabled={!text}
        >
          Share Text
        </Button>
      </div>
    </div>
  );
}