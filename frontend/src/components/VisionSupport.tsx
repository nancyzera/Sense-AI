import { useState, useRef } from "react";
import { Eye, Camera, Upload, Scan } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Alert, AlertDescription } from "./ui/alert";

export function VisionSupport() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setAnalysis("");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      setAnalysis("I can see a person standing in front of a building. There appears to be text on a sign that reads 'Welcome'. The environment looks like a modern office building entrance with glass doors. There are also some trees and landscaping visible in the background. The lighting suggests it's daytime with natural sunlight.");
      setIsAnalyzing(false);
    }, 3000);
  };

  const handleCameraCapture = () => {
    // Simulate camera capture
    alert("Camera feature would open device camera in a real implementation");
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Eye className="h-5 w-5 text-primary" />
          Vision Support
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="bg-secondary/20 border-border">
          <AlertDescription className="text-muted-foreground">
            Upload an image or take a photo to get AI-powered object and text recognition.
          </AlertDescription>
        </Alert>

        <div className="flex gap-2">
          <Button 
            onClick={triggerFileInput}
            className="bg-primary hover:bg-primary/90"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Image
          </Button>
          
          <Button 
            onClick={handleCameraCapture}
            variant="outline"
            className="border-border text-white hover:bg-secondary"
          >
            <Camera className="h-4 w-4 mr-2" />
            Take Photo
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />

        {selectedImage && (
          <div className="space-y-4">
            <div className="border border-border rounded-lg overflow-hidden">
              <img 
                src={selectedImage} 
                alt="Selected for analysis" 
                className="w-full h-48 object-cover"
              />
            </div>
            
            <Button 
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full bg-primary hover:bg-primary/90"
            >
              <Scan className="h-4 w-4 mr-2" />
              {isAnalyzing ? "Analyzing..." : "Analyze Image"}
            </Button>
          </div>
        )}

        {(analysis || isAnalyzing) && (
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Analysis Results:</label>
            <Textarea
              value={isAnalyzing ? "Analyzing image content..." : analysis}
              readOnly
              placeholder="Analysis results will appear here..."
              className="min-h-32 bg-input border-border text-white placeholder:text-muted-foreground resize-none"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}