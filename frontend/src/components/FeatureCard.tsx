import { Card, CardContent } from "./ui/card";
import { Progress } from "./ui/progress";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick?: () => void;
  className?: string;
  color?: string;
  bgColor?: string;
  borderColor?: string;
  usageText?: string;
  progress?: number;
}

export function FeatureCard({ 
  title, 
  description, 
  icon: Icon, 
  onClick, 
  className,
  color = "text-primary",
  bgColor = "bg-primary/10",
  borderColor = "border-primary/20",
  usageText,
  progress = 0
}: FeatureCardProps) {
  return (
    <Card 
      className={`bg-card border-border hover:${borderColor} transition-all cursor-pointer ${className}`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className={`p-3 ${bgColor} rounded-lg`}>
            <Icon className={`h-8 w-8 ${color}`} />
          </div>
          <div className="w-full">
            <h3 className="text-white mb-2">{title}</h3>
            <p className="text-muted-foreground text-sm mb-3">{description}</p>
            
            {usageText && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">{usageText}</p>
                {progress > 0 && (
                  <Progress value={progress} className="h-1" />
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}