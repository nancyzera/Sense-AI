import { VoiceToText } from "./VoiceToText";
import { TextToSpeech } from "./TextToSpeech";
import { VisionSupport } from "./VisionSupport";
import { MobilityAssist } from "./MobilityAssist";
import { VoiceChat } from "./VoiceChat";

interface ToolsProps {
  selectedFeature?: string;
  onRestrictedAccess?: () => void;
}

export function Tools({ selectedFeature, onRestrictedAccess }: ToolsProps) {
  const renderTool = () => {
    switch (selectedFeature) {
      case "voice-to-text":
        return <VoiceToText onRestrictedAccess={onRestrictedAccess} />;
      case "text-to-speech":
        return <TextToSpeech onRestrictedAccess={onRestrictedAccess} />;
      case "voice-chat":
        return <VoiceChat onRestrictedAccess={onRestrictedAccess} />;
      case "vision-support":
        return <VisionSupport onRestrictedAccess={onRestrictedAccess} />;
      case "mobility-assist":
        return <MobilityAssist onRestrictedAccess={onRestrictedAccess} />;
      default:
        return (
          <div className="text-center py-12">
            <h3 className="text-xl text-white mb-4">Select a Tool</h3>
            <p className="text-muted-foreground">Choose a tool from the dashboard to get started</p>
          </div>
        );
    }
  };

  return (
    <div className="p-6">
      {renderTool()}
    </div>
  );
}