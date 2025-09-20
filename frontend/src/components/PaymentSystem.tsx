import { useState } from "react";
import { CreditCard, Crown, Check, Zap, Shield, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: string;
  features: string[];
  popular?: boolean;
  description: string;
}

const pricingPlans: PricingPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 0,
    currency: 'USD',
    interval: 'month',
    description: 'Essential accessibility features',
    features: [
      'Voice-to-Text (100 min/month)',
      'Text-to-Speech (50 conversions/month)',
      'Basic Vision Support',
      'Community Support',
      '1 Device Connection'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 19.99,
    currency: 'USD',
    interval: 'month',
    description: 'Advanced features with AI learning',
    popular: true,
    features: [
      'Unlimited Voice-to-Text',
      'Unlimited Text-to-Speech',
      'Advanced Vision Support with AI',
      'Priority Support',
      'Up to 5 Device Connections',
      'AI Learning & Personalization',
      'Coral Protocol Agent Access',
      'Advanced Analytics'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99.99,
    currency: 'USD',
    interval: 'month',
    description: 'Full platform access with custom integrations',
    features: [
      'Everything in Pro',
      'Unlimited Device Connections',
      'Custom Coral Protocol Agents',
      'White-label Solutions',
      'Dedicated Support Manager',
      'Custom Integrations',
      'Advanced Security Features',
      'Priority Feature Requests'
    ]
  }
];

export function PaymentSystem() {
  const [selectedPlan, setSelectedPlan] = useState<string>('pro');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<'crypto' | 'card'>('crypto');

  const createCheckoutSession = async (planId: string) => {
    setIsProcessing(true);
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-f8c4b683/payments/create-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          plan_type: planId,
          user_id: 'current_user_id' // In real app, get from auth
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        // In a real implementation, redirect to Crossmint checkout
        alert(`Redirecting to Crossmint checkout...\nCheckout URL: ${result.checkout_url}`);
        console.log('Checkout session created:', result);
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Failed to create checkout session. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'basic': return <Zap className="h-5 w-5" />;
      case 'pro': return <Star className="h-5 w-5" />;
      case 'enterprise': return <Crown className="h-5 w-5" />;
      default: return <Shield className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Subscription Status */}
      {currentSubscription && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Crown className="h-5 w-5 text-primary" />
              Current Subscription
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white">{currentSubscription.plan_name}</h3>
                <p className="text-muted-foreground">
                  ${currentSubscription.amount}/{currentSubscription.interval}
                </p>
              </div>
              <Badge className="bg-green-600">Active</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Method Selection */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-white">Payment Method</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              <span className="text-white">Cryptocurrency (Crossmint)</span>
            </div>
            <Switch 
              checked={paymentMethod === 'crypto'} 
              onCheckedChange={(checked) => setPaymentMethod(checked ? 'crypto' : 'card')}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            {paymentMethod === 'crypto' 
              ? 'Pay with Bitcoin, Ethereum, Solana, and other cryptocurrencies via Crossmint'
              : 'Pay with credit/debit cards (coming soon)'
            }
          </p>
        </CardContent>
      </Card>

      {/* Pricing Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pricingPlans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`bg-card border-border relative ${
              plan.popular ? 'ring-2 ring-primary' : ''
            } ${selectedPlan === plan.id ? 'ring-2 ring-blue-500' : ''}`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-white">Most Popular</Badge>
              </div>
            )}
            
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                {getPlanIcon(plan.id)}
                <CardTitle className="text-white">{plan.name}</CardTitle>
              </div>
              <div className="space-y-1">
                <div className="text-3xl text-white">
                  ${plan.price}
                  {plan.price > 0 && (
                    <span className="text-sm text-muted-foreground">/{plan.interval}</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-white">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button
                onClick={() => {
                  setSelectedPlan(plan.id);
                  if (plan.price > 0) {
                    createCheckoutSession(plan.id);
                  }
                }}
                disabled={isProcessing}
                className={`w-full ${
                  plan.popular 
                    ? 'bg-primary hover:bg-primary/90' 
                    : plan.price === 0
                    ? 'bg-secondary hover:bg-secondary/90'
                    : 'bg-primary hover:bg-primary/90'
                }`}
              >
                {isProcessing && selectedPlan === plan.id ? (
                  'Processing...'
                ) : plan.price === 0 ? (
                  'Get Started Free'
                ) : (
                  `Subscribe to ${plan.name}`
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Features Comparison */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-white">Feature Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 text-white">Feature</th>
                  <th className="text-center py-3 text-white">Basic</th>
                  <th className="text-center py-3 text-white">Pro</th>
                  <th className="text-center py-3 text-white">Enterprise</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border/50">
                  <td className="py-3">Voice-to-Text</td>
                  <td className="text-center py-3">100 min/month</td>
                  <td className="text-center py-3">Unlimited</td>
                  <td className="text-center py-3">Unlimited</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3">Text-to-Speech</td>
                  <td className="text-center py-3">50/month</td>
                  <td className="text-center py-3">Unlimited</td>
                  <td className="text-center py-3">Unlimited</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3">AI Learning</td>
                  <td className="text-center py-3">✗</td>
                  <td className="text-center py-3 text-green-400">✓</td>
                  <td className="text-center py-3 text-green-400">✓</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3">Coral Protocol Agents</td>
                  <td className="text-center py-3">✗</td>
                  <td className="text-center py-3 text-green-400">✓</td>
                  <td className="text-center py-3 text-green-400">✓</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3">Custom Integrations</td>
                  <td className="text-center py-3">✗</td>
                  <td className="text-center py-3">✗</td>
                  <td className="text-center py-3 text-green-400">✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Crossmint Integration Info */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-white">Cryptocurrency Payments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h4 className="text-white">Powered by Crossmint</h4>
              <p className="text-sm text-muted-foreground">
                Secure cryptocurrency payments with easy onboarding
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-2">
              <div className="w-8 h-8 bg-orange-500 rounded-full mx-auto"></div>
              <span className="text-xs text-white">Bitcoin</span>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full mx-auto"></div>
              <span className="text-xs text-white">Ethereum</span>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 bg-purple-500 rounded-full mx-auto"></div>
              <span className="text-xs text-white">Solana</span>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 bg-green-500 rounded-full mx-auto"></div>
              <span className="text-xs text-white">USDC</span>
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground">
            * Crossmint handles all compliance, custody, and conversion automatically
          </p>
        </CardContent>
      </Card>
    </div>
  );
}