import { Mic, Volume2, Eye, Accessibility, MessageCircle, Navigation } from "lucide-react";
import { FeatureCard } from "./FeatureCard";
import { ChatInterface } from "./ChatInterface";
import { AIInsights } from "./AIInsights";
import { RecommendationsCard, SmartRecommendations } from "./RecommendationsCard";
import { useSubscription } from "../contexts/SubscriptionContext";

interface DashboardProps {
  onFeatureSelect: (feature: string) => void;
}

export function Dashboard({ onFeatureSelect }: DashboardProps) {
  const { limits, canAccess } = useSubscription();
  
  // Mock usage data - in a real app this would come from usage tracking
  const voiceToTextUsage = 23; // minutes
  const textToSpeechUsage = 12; // conversions
  const monthlyVoiceLimit = limits.voiceToTextMinutes;
  const monthlyTTSLimit = limits.textToSpeechConversions;

  const features = [
    {
      id: "voice-to-text",
      title: "Voice-to-Text",
      description: "Convert speech to text with 98% accuracy",
      icon: Mic,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
      borderColor: "border-blue-400/20",
      usageText: `${voiceToTextUsage} min used this month`,
      progress: monthlyVoiceLimit === -1 ? 0 : (voiceToTextUsage / monthlyVoiceLimit) * 100,
    },
    {
      id: "text-to-speech",
      title: "Text-to-Speech",
      description: "Natural voice synthesis in 50+ languages",
      icon: Volume2,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
      borderColor: "border-green-400/20",
      usageText: `${textToSpeechUsage} conversions this month`,
      progress: monthlyTTSLimit === -1 ? 0 : (textToSpeechUsage / monthlyTTSLimit) * 100,
    },
    {
      id: "voice-chat",
      title: "Voice Chat",
      description: "Hands-free AI conversation",
      icon: MessageCircle,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
      borderColor: "border-purple-400/20",
      usageText: "AI-powered voice assistant",
      progress: 0,
    },
    {
      id: "vision-support",
      title: "Vision Support",
      description: "AI-powered image analysis and scene description",
      icon: Eye,
      color: "text-yellow-400",
      bgColor: "bg-yellow-400/10",
      borderColor: "border-yellow-400/20",
      usageText: "Real-time visual assistance",
      progress: 0,
    },
    {
      id: "mobility-assist",
      title: "Mobility Assist",
      description: "Smart mobility and navigation support",
      icon: Navigation,
      color: "text-orange-400",
      bgColor: "bg-orange-400/10",
      borderColor: "border-orange-400/20",
      usageText: "Connected device assistance",
      progress: 0,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature) => (
          <FeatureCard
            key={feature.id}
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
            onClick={() => onFeatureSelect(feature.id)}
            color={feature.color}
            bgColor={feature.bgColor}
            borderColor={feature.borderColor}
            usageText={feature.usageText}
            progress={feature.progress}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ChatInterface />
          {canAccess('aiInsights') && <AIInsights />}
        </div>
        
        <div className="space-y-6">
          <RecommendationsCard />
          <SmartRecommendations />
        </div>
      </div>
    </div>
  );
}