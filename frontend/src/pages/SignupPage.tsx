import { useState } from "react";
import { Brain, Eye, EyeOff, ArrowLeft, Check } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Badge } from "../components/ui/badge";
import { useAuth } from "../contexts/AuthContext";
import { useApp } from "../contexts/AppContext";

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    description: 'Perfect for trying out our platform',
    features: [
      '100 minutes voice-to-text',
      '50 text-to-speech conversions',
      'Basic vision support',
      '1 device connection',
      'Community support'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 19.99,
    description: 'Advanced features with AI learning',
    popular: true,
    features: [
      'Unlimited voice-to-text',
      'Unlimited text-to-speech',
      'AI-powered vision support',
      'Up to 5 device connections',
      'Coral Protocol agents',
      'Priority support',
      'Advanced analytics'
    ]
  }
];

export function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [selectedPlan, setSelectedPlan] = useState('free');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  const { signUp } = useAuth();
  const { setCurrentPage } = useApp();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!acceptTerms) {
      setError("Please accept the terms and conditions");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    const { error } = await signUp(formData.email, formData.password, formData.name);
    
    if (error) {
      setError(error);
      setIsLoading(false);
    } else {
      // If Pro plan selected, redirect to payment
      if (selectedPlan === 'pro') {
        setCurrentPage('app'); // In real app, would handle payment flow
        alert('Pro plan selected - payment integration would happen here');
      } else {
        setCurrentPage('app');
      }
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setCurrentPage('home')}
            className="text-muted-foreground hover:text-white mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="flex items-center justify-center gap-2 mb-2">
            <Brain className="h-8 w-8 text-primary" />
            <span className="text-2xl text-white">Baho AI</span>
          </div>
          <p className="text-center text-muted-foreground">
            Create your account and start breaking communication barriers
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sign Up Form */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-white text-center">Create Account</CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert className="mb-6 bg-destructive/10 border-destructive/20">
                  <AlertDescription className="text-destructive">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm text-white mb-2">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your full name"
                    className="bg-input border-border text-white placeholder:text-muted-foreground"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm text-white mb-2">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email"
                    className="bg-input border-border text-white placeholder:text-muted-foreground"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm text-white mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="Create a strong password"
                      className="bg-input border-border text-white placeholder:text-muted-foreground pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm text-white mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      placeholder="Confirm your password"
                      className="bg-input border-border text-white placeholder:text-muted-foreground pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mt-1 rounded border-border bg-input"
                  />
                  <label htmlFor="terms" className="text-sm text-muted-foreground">
                    I agree to the{" "}
                    <a href="#" className="text-primary hover:underline">Terms of Service</a>{" "}
                    and{" "}
                    <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                  </label>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !acceptTerms}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <span className="text-muted-foreground">Already have an account? </span>
                <Button
                  variant="link"
                  onClick={() => setCurrentPage('login')}
                  className="text-primary hover:text-primary/80 p-0"
                >
                  Sign in
                </Button>
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <div className="text-center mb-4">
                  <span className="text-muted-foreground text-sm">Or continue with</span>
                </div>
                
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full border-border text-white hover:bg-secondary"
                    onClick={() => {
                      alert("Google OAuth integration would be implemented here");
                    }}
                  >
                    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full border-border text-white hover:bg-secondary"
                    onClick={() => {
                      alert("GitHub OAuth integration would be implemented here");
                    }}
                  >
                    <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    Continue with GitHub
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Plan Selection */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl text-white mb-2">Choose Your Plan</h3>
              <p className="text-muted-foreground">You can upgrade or downgrade at any time</p>
            </div>

            <div className="space-y-4">
              {plans.map((plan) => (
                <Card 
                  key={plan.id}
                  className={`bg-card border-border cursor-pointer transition-colors ${
                    selectedPlan === plan.id ? 'ring-2 ring-primary' : ''
                  } ${plan.popular ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-white">{plan.name}</CardTitle>
                          {plan.popular && (
                            <Badge className="bg-primary text-white">Popular</Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground text-sm">{plan.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl text-white">
                          ${plan.price}
                          {plan.price > 0 && (
                            <span className="text-sm text-muted-foreground">/month</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <Check className="h-3 w-3 text-green-400 flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="bg-secondary/20 rounded-lg p-4">
              <h4 className="text-white mb-2">Selected Plan: {plans.find(p => p.id === selectedPlan)?.name}</h4>
              <p className="text-muted-foreground text-sm">
                {selectedPlan === 'free' 
                  ? 'Start with our free plan and upgrade when you need more features.'
                  : 'Start with a 14-day free trial, then $19.99/month. Cancel anytime.'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}