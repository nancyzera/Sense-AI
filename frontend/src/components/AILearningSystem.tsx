import { useState, useEffect } from "react";
import { Brain, TrendingUp, Target, Lightbulb, BarChart3, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, RadialBarChart, RadialBar } from "recharts";
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface UserPreferences {
  voice_speed: number;
  speech_volume: number;
  haptic_intensity: number;
  preferred_language: string;
  interaction_patterns: string[];
  accessibility_needs: string[];
}

interface LearningInsight {
  id: string;
  category: 'performance' | 'preference' | 'behavior' | 'improvement';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
}

const performanceData = [
  { name: 'Mon', accuracy: 85, speed: 72 },
  { name: 'Tue', accuracy: 88, speed: 75 },
  { name: 'Wed', accuracy: 92, speed: 78 },
  { name: 'Thu', accuracy: 89, speed: 82 },
  { name: 'Fri', accuracy: 94, speed: 85 },
  { name: 'Sat', accuracy: 96, speed: 88 },
  { name: 'Sun', accuracy: 98, speed: 90 },
];

const adaptationData = [
  { name: 'Voice Recognition', value: 92, fill: '#4f89ff' },
  { name: 'Speech Synthesis', value: 88, fill: '#10b981' },
  { name: 'Vision Analysis', value: 85, fill: '#f59e0b' },
  { name: 'Device Integration', value: 96, fill: '#8b5cf6' },
];

export function AILearningSystem() {
  const [preferences, setPreferences] = useState<UserPreferences>({
    voice_speed: 1.0,
    speech_volume: 75,
    haptic_intensity: 70,
    preferred_language: 'en-US',
    interaction_patterns: ['voice-first', 'quick-actions'],
    accessibility_needs: ['hearing-impaired', 'mobility-assistance']
  });

  const [insights, setInsights] = useState<LearningInsight[]>([
    {
      id: '1',
      category: 'performance',
      title: 'Voice Recognition Improving',
      description: 'Your voice recognition accuracy has improved by 15% this week',
      confidence: 94,
      actionable: false
    },
    {
      id: '2',
      category: 'preference',
      title: 'Optimal Speech Speed Detected',
      description: 'Based on your usage, 1.2x speed provides the best comprehension',
      confidence: 87,
      actionable: true
    },
    {
      id: '3',
      category: 'behavior',
      title: 'Peak Usage Pattern Identified',
      description: 'You use voice features most effectively between 2-4 PM',
      confidence: 92,
      actionable: true
    },
    {
      id: '4',
      category: 'improvement',
      title: 'Device Sync Optimization',
      description: 'Connecting your smartwatch could improve navigation assistance by 30%',
      confidence: 89,
      actionable: true
    }
  ]);

  const [isOptimizing, setIsOptimizing] = useState(false);
  const [learningProgress, setLearningProgress] = useState(75);

  const updatePreferences = async (newPreferences: Partial<UserPreferences>) => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-f8c4b683/user/preferences`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          preferences: { ...preferences, ...newPreferences },
          action_data: {
            action: 'preference_update',
            changes: newPreferences,
            timestamp: new Date().toISOString()
          }
        })
      });

      if (response.ok) {
        setPreferences(prev => ({ ...prev, ...newPreferences }));
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  };

  const optimizeSettings = async () => {
    setIsOptimizing(true);
    
    // Simulate AI optimization process
    setTimeout(() => {
      const optimizations = {
        voice_speed: 1.2,
        speech_volume: 80,
        haptic_intensity: 75
      };
      
      updatePreferences(optimizations);
      setIsOptimizing(false);
      
      // Add new insight about optimization
      const newInsight: LearningInsight = {
        id: Date.now().toString(),
        category: 'improvement',
        title: 'Settings Optimized',
        description: 'AI has automatically adjusted your settings for better performance',
        confidence: 95,
        actionable: false
      };
      
      setInsights(prev => [newInsight, ...prev.slice(0, 3)]);
    }, 3000);
  };

  const applyInsightRecommendation = (insightId: string) => {
    const insight = insights.find(i => i.id === insightId);
    if (!insight) return;

    switch (insight.id) {
      case '2':
        updatePreferences({ voice_speed: 1.2 });
        break;
      case '3':
        // Could set reminder/notification preferences
        alert('Peak usage reminder set for 2-4 PM');
        break;
      case '4':
        // Could trigger device connection flow
        alert('Opening device connection guide...');
        break;
    }

    // Mark insight as applied
    setInsights(prev => prev.map(i => 
      i.id === insightId 
        ? { ...i, actionable: false, title: i.title + ' (Applied)' }
        : i
    ));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'performance': return <TrendingUp className="h-4 w-4" />;
      case 'preference': return <Target className="h-4 w-4" />;
      case 'behavior': return <BarChart3 className="h-4 w-4" />;
      case 'improvement': return <Lightbulb className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'performance': return 'bg-green-600';
      case 'preference': return 'bg-blue-600';
      case 'behavior': return 'bg-purple-600';
      case 'improvement': return 'bg-yellow-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Learning Progress Overview */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Learning System
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center space-y-2">
              <div className="text-2xl text-white">{learningProgress}%</div>
              <div className="text-sm text-muted-foreground">Learning Progress</div>
              <Progress value={learningProgress} className="h-2" />
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl text-white">247</div>
              <div className="text-sm text-muted-foreground">Interactions Analyzed</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl text-white">12</div>
              <div className="text-sm text-muted-foreground">Optimizations Applied</div>
            </div>
          </div>

          <Button
            onClick={optimizeSettings}
            disabled={isOptimizing}
            className="w-full bg-primary hover:bg-primary/90"
          >
            <Zap className="h-4 w-4 mr-2" />
            {isOptimizing ? 'Optimizing Settings...' : 'Optimize Settings with AI'}
          </Button>
        </CardContent>
      </Card>

      {/* Performance Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-white">Performance Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Line 
                    type="monotone" 
                    dataKey="accuracy" 
                    stroke="#4f89ff" 
                    strokeWidth={2}
                    name="Accuracy %"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="speed" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="Speed %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-white">Feature Adaptation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="80%" data={adaptationData}>
                  <RadialBar dataKey="value" cornerRadius={10} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {adaptationData.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.fill }}
                  ></div>
                  <span className="text-white">{item.name}</span>
                  <span className="text-muted-foreground">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-white">AI Insights & Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.map((insight) => (
              <div key={insight.id} className="bg-secondary/20 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(insight.category)}
                    <h4 className="text-white">{insight.title}</h4>
                    <Badge className={getCategoryColor(insight.category)}>
                      {insight.category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {insight.confidence}% confidence
                    </span>
                    <Progress value={insight.confidence} className="w-16 h-2" />
                  </div>
                </div>
                
                <p className="text-muted-foreground text-sm mb-3">
                  {insight.description}
                </p>
                
                {insight.actionable && (
                  <Button
                    size="sm"
                    onClick={() => applyInsightRecommendation(insight.id)}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Apply Recommendation
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Preferences */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-white">Learned Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-white text-sm">Voice Speed</label>
                <div className="flex items-center gap-2 mt-1">
                  <Progress value={preferences.voice_speed * 50} className="flex-1 h-2" />
                  <span className="text-muted-foreground text-sm">{preferences.voice_speed}x</span>
                </div>
              </div>
              
              <div>
                <label className="text-white text-sm">Speech Volume</label>
                <div className="flex items-center gap-2 mt-1">
                  <Progress value={preferences.speech_volume} className="flex-1 h-2" />
                  <span className="text-muted-foreground text-sm">{preferences.speech_volume}%</span>
                </div>
              </div>
              
              <div>
                <label className="text-white text-sm">Haptic Intensity</label>
                <div className="flex items-center gap-2 mt-1">
                  <Progress value={preferences.haptic_intensity} className="flex-1 h-2" />
                  <span className="text-muted-foreground text-sm">{preferences.haptic_intensity}%</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-white text-sm">Preferred Language</label>
                <p className="text-muted-foreground mt-1">{preferences.preferred_language}</p>
              </div>
              
              <div>
                <label className="text-white text-sm">Interaction Patterns</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {preferences.interaction_patterns.map((pattern, index) => (
                    <Badge key={index} variant="outline" className="border-border text-white">
                      {pattern}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-white text-sm">Accessibility Needs</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {preferences.accessibility_needs.map((need, index) => (
                    <Badge key={index} variant="outline" className="border-border text-white">
                      {need}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}