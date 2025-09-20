import { Crown, Zap, User, LogIn } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { useAuth } from "../contexts/AuthContext";
import { useApp } from "../contexts/AppContext";

const demoAccounts = [
  {
    id: 'demo-free',
    name: 'Sarah Wilson',
    email: 'demo.free@bahoai.com',
    subscription: {
      plan: 'free' as const,
      status: 'active' as const,
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    },
    usage: {
      voice_to_text_minutes: 23,
      text_to_speech_conversions: 12,
      device_connections: 1
    },
    icon: User,
    color: "text-blue-400",
    description: "Free tier user exploring basic features"
  },
  {
    id: 'demo-pro',
    name: 'Michael Chen',
    email: 'demo.pro@bahoai.com',
    subscription: {
      plan: 'pro' as const,
      status: 'active' as const,
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    },
    usage: {
      voice_to_text_minutes: 340,
      text_to_speech_conversions: 89,
      device_connections: 3
    },
    icon: Zap,
    color: "text-green-400",
    description: "Pro user with unlimited access and AI features"
  },
  {
    id: 'demo-enterprise',
    name: 'Dr. Emma Rodriguez',
    email: 'demo.enterprise@bahoai.com',
    subscription: {
      plan: 'enterprise' as const,
      status: 'active' as const,
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    },
    usage: {
      voice_to_text_minutes: 1250,
      text_to_speech_conversions: 456,
      device_connections: 8
    },
    icon: Crown,
    color: "text-purple-400",
    description: "Enterprise user with full platform access and custom integrations"
  }
];

export function DemoAccounts() {
  const { setCurrentPage } = useApp();

  const handleDemoLogin = async (account: typeof demoAccounts[0]) => {
    // Store demo account data in localStorage for demo purposes
    localStorage.setItem('baho_demo_user', JSON.stringify({
      id: account.id,
      email: account.email,
      name: account.name,
      subscription: account.subscription,
      usage: account.usage,
      isDemoUser: true
    }));

    // Trigger a page refresh to load the demo user
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl text-white mb-2">Try Baho AI Demo</h2>
        <p className="text-muted-foreground">
          Experience the full platform with pre-configured demo accounts
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {demoAccounts.map((account) => (
          <Card key={account.id} className="bg-card border-border hover:border-primary/50 transition-colors">
            <CardHeader className="text-center pb-3">
              <div className="flex items-center justify-center mb-3">
                <div className="p-3 bg-secondary/20 rounded-full">
                  <account.icon className={`h-6 w-6 ${account.color}`} />
                </div>
              </div>
              <CardTitle className="text-white flex items-center justify-center gap-2">
                {account.name}
                <Badge className={`${
                  account.subscription.plan === 'free' ? 'bg-blue-600' :
                  account.subscription.plan === 'pro' ? 'bg-green-600' :
                  'bg-purple-600'
                }`}>
                  {account.subscription.plan.toUpperCase()}
                </Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground">{account.description}</p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Voice-to-Text</span>
                  <span className="text-white">
                    {account.usage.voice_to_text_minutes} min
                    {account.subscription.plan === 'free' ? ' / 100' : ' (unlimited)'}
                  </span>
                </div>
                
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Text-to-Speech</span>
                  <span className="text-white">
                    {account.usage.text_to_speech_conversions}
                    {account.subscription.plan === 'free' ? ' / 50' : ' (unlimited)'}
                  </span>
                </div>
                
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Devices</span>
                  <span className="text-white">
                    {account.usage.device_connections}
                    {account.subscription.plan === 'free' ? ' / 1' : 
                     account.subscription.plan === 'pro' ? ' / 5' : ' (unlimited)'}
                  </span>
                </div>
              </div>

              <Button
                onClick={() => handleDemoLogin(account)}
                className="w-full bg-primary hover:bg-primary/90"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Try {account.subscription.plan.toUpperCase()} Demo
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-secondary/20 rounded-lg p-4 border border-border">
        <h4 className="text-white mb-2 flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" />
          Demo Features
        </h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• <strong>Free Account:</strong> Experience basic features with usage limits</li>
          <li>• <strong>Pro Account:</strong> Test unlimited access and AI-powered features</li>
          <li>• <strong>Enterprise Account:</strong> Explore custom integrations and advanced tools</li>
          <li>• All demo data is simulated and resets on page refresh</li>
        </ul>
      </div>

      <div className="text-center">
        <Button
          variant="outline"
          onClick={() => setCurrentPage('signup')}
          className="border-border text-white hover:bg-secondary"
        >
          Create Real Account Instead
        </Button>
      </div>
    </div>
  );
}