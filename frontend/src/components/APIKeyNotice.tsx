import { useState } from "react";
import { Key, AlertCircle, CheckCircle, X, Eye, EyeOff, Info } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { configureOpenAIKey } from "../utils/aiServices";
import { toast } from "sonner";

interface APIKeyNoticeProps {
  onDismiss?: () => void;
}

export function APIKeyNotice({ onDismiss }: APIKeyNoticeProps) {
  const [apiKey, setApiKey] = useState("");
  const [isConfigured, setIsConfigured] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfigureKey = async () => {
    if (!apiKey.trim()) {
      toast.error('Please enter an API key');
      return;
    }

    setIsLoading(true);
    
    try {
      const success = configureOpenAIKey(apiKey);
      if (success) {
        setIsConfigured(true);
        setApiKey(""); // Clear the input for security
        toast.success('🎉 OpenAI integration activated! You now have access to real AI responses.');
        
        // Auto-dismiss after successful configuration
        setTimeout(() => {
          onDismiss?.();
        }, 3000);
      } else {
        toast.error('Invalid API key format. Please provide a valid API key (32+ characters)');
      }
    } catch (error) {
      toast.error('Failed to configure API key. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    toast.info('💡 No problem! Sense AI works great with demo responses. You can always configure your API key later.');
    onDismiss?.();
  };

  if (isConfigured) {
    return (
      <Alert className="bg-green-500/10 border-green-500/20">
        <CheckCircle className="h-4 w-4 text-green-500" />
        <AlertDescription className="text-green-300">
          <div className="flex items-center justify-between">
            <span>🎉 OpenAI integration active! Real AI responses are now available.</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="text-green-300 hover:text-green-200"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center gap-2">
          <Key className="h-5 w-5 text-blue-400" />
          AI Enhancement Available
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="ml-auto text-white hover:text-gray-300"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="bg-blue-500/5 border-blue-500/10">
          <Info className="h-4 w-4 text-blue-400" />
          <AlertDescription className="text-blue-200">
            <strong>Demo Mode Active:</strong> Currently using enhanced accessibility-focused responses. 
            Connect your AI API key for unlimited real AI conversations.
          </AlertDescription>
        </Alert>

        {!showInput ? (
          <div className="flex gap-2">
            <Button 
              onClick={() => setShowInput(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Enable Real AI
            </Button>
            <Button 
              variant="outline" 
              onClick={handleSkip}
              className="border-border text-white hover:bg-secondary"
            >
              Continue with Demo
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="space-y-2">
              <label className="text-sm text-white flex items-center gap-2">
                <Key className="h-4 w-4" />
                AI API Key
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your API key..."
                  className="bg-input border-border text-white placeholder:text-muted-foreground pr-12"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-white/10"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Your API key is processed securely and not stored permanently.
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleConfigureKey}
                disabled={!apiKey.trim() || isLoading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Configuring...
                  </div>
                ) : (
                  '✨ Activate AI'
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowInput(false)}
                className="border-border text-white hover:bg-secondary"
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <p className="mb-2 text-white">Benefits of real AI integration:</p>
          <p className="mt-2 text-xs opacity-75">
            💡 Supports aimlapi (sk-...) and other AI service API keys. Visit{" "}
            <a 
              href="https://aimlapi.com/app/keys/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              aimlapi.com/app/keys
            </a> for aimlapi keys.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}