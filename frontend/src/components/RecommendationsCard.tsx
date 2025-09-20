import { Star, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

export function RecommendationsCard() {
  return (
    <div className="space-y-4">
      {/* Recommendations */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            Recommendation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-2">
            <div className="text-3xl text-white">15</div>
            <div className="text-sm text-muted-foreground">suggestions</div>
          </div>
        </CardContent>
      </Card>

      {/* Anomaly Detection */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            Anomaly Detection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-2">
            <div className="text-xl text-white">2</div>
            <div className="text-sm text-muted-foreground">new alerts</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function SmartRecommendations() {
  const recommendations = [
    {
      id: 1,
      title: "Increase budget by 20%",
      description: "Based on your recent performance",
      priority: "high"
    },
    {
      id: 2,
      title: "Optimize voice settings",
      description: "Adjust speed for better comprehension",
      priority: "medium"
    },
    {
      id: 3,
      title: "Update device firmware",
      description: "New accessibility features available",
      priority: "low"
    }
  ];

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-white">Smart Recommendations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((rec) => (
          <div key={rec.id} className="space-y-2">
            <div className="flex items-start justify-between">
              <h5 className="text-white text-sm">{rec.title}</h5>
              <Badge 
                variant={rec.priority === "high" ? "destructive" : rec.priority === "medium" ? "default" : "secondary"}
                className="text-xs"
              >
                {rec.priority}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{rec.description}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}