import { Crown, X, Check, Zap } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { useAuth } from "../contexts/AuthContext";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const proFeatures = [
  'Unlimited voice-to-text',
  'Unlimited text-to-speech',
  'AI-powered vision support',
  'Up to 5 device connections',
  'Coral Protocol agents',
  'AI learning system',
  'Priority support',
  'Advanced analytics'
];

const enterpriseFeatures = [
  'Everything in Pro',
  'Unlimited device connections',
  'Custom integrations',
  'White-label solutions',
  'Dedicated support manager',
  'Developer SDK access',
  'Custom Coral agents'
];

export function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  const { user, updateSubscription } = useAuth();

  const handleUpgrade = async (plan: string) => {
    if (plan === 'pro') {
      // In a real implementation, this would redirect to payment processor
      alert('Pro plan upgrade - payment integration would happen here');
      await updateSubscription('pro');
    } else {
      alert('Enterprise plan - contact sales would happen here');
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-card border-border">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-white flex items-center gap-2">
              <Crown className="h-5 w-5 text-primary" />
              Upgrade Your Plan
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-muted-foreground hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-center">
            <p className="text-muted-foreground">
              Unlock the full potential of Baho AI with advanced features and unlimited access
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pro Plan */}
            <Card className="bg-secondary/20 border-border hover:border-primary/50 transition-colors">
              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <CardTitle className="text-white">Pro</CardTitle>
                  <Badge className="bg-primary text-white">Popular</Badge>
                </div>
                <div className="text-3xl text-white">
                  $19.99
                  <span className="text-sm text-muted-foreground">/month</span>
                </div>
                <p className="text-muted-foreground">Advanced features with AI learning</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {proFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-white text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button
                  onClick={() => handleUpgrade('pro')}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  Upgrade to Pro
                </Button>
                
                <p className="text-xs text-muted-foreground text-center">
                  14-day free trial • Cancel anytime
                </p>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="bg-secondary/20 border-border hover:border-primary/50 transition-colors">
              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Crown className="h-5 w-5 text-primary" />
                  <CardTitle className="text-white">Enterprise</CardTitle>
                </div>
                <div className="text-3xl text-white">
                  $99.99
                  <span className="text-sm text-muted-foreground">/month</span>
                </div>
                <p className="text-muted-foreground">Full platform with custom solutions</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {enterpriseFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-white text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button
                  onClick={() => handleUpgrade('enterprise')}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  Contact Sales
                </Button>
                
                <p className="text-xs text-muted-foreground text-center">
                  Custom pricing • Dedicated support
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
            <div className="flex items-start gap-3">
              <Crown className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="text-white mb-1">Current Plan: {user?.subscription?.plan?.toUpperCase() || 'FREE'}</h4>
                <p className="text-muted-foreground text-sm">
                  You're currently on the {user?.subscription?.plan || 'free'} plan. 
                  Upgrade to unlock advanced accessibility features and AI-powered tools.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-muted-foreground text-sm">
              Need help choosing? <button className="text-primary hover:underline">Contact our team</button>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}