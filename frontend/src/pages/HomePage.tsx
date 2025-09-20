import { Brain, Mic, Volume2, Eye, Watch, Zap, Star, Check, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { useApp } from "../contexts/AppContext";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const features = [
  {
    icon: Mic,
    title: "Voice-to-Text",
    description: "Convert spoken words into readable text in real-time with 98% accuracy",
    color: "text-blue-400"
  },
  {
    icon: Volume2,
    title: "Text-to-Speech",
    description: "Transform text into natural-sounding voice with multiple language support",
    color: "text-green-400"
  },
  {
    icon: Eye,
    title: "Vision Support",
    description: "AI-powered image analysis and scene description for visual assistance",
    color: "text-purple-400"
  },
  {
    icon: Watch,
    title: "Wearable Integration",
    description: "Connect smartwatches and haptic devices for seamless notifications",
    color: "text-orange-400"
  }
];

const stats = [
  { number: "10M+", label: "Users Helped" },
  { number: "98%", label: "Accuracy Rate" },
  { number: "50+", label: "Languages" },
  { number: "24/7", label: "Availability" }
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Accessibility Advocate",
    content: "Baho AI has completely transformed how I interact with technology. The voice recognition is incredibly accurate.",
    rating: 5
  },
  {
    name: "Michael Chen",
    role: "Developer",
    content: "The API integration was seamless. We had our accessibility features up and running in just a few hours.",
    rating: 5
  },
  {
    name: "Emma Rodriguez",
    role: "Teacher",
    content: "This platform has made our classroom so much more inclusive. Students love the real-time transcription.",
    rating: 5
  }
];

export function HomePage() {
  const { setCurrentPage } = useApp();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Brain className="h-8 w-8 text-primary" />
              <span className="text-xl text-white">Baho AI</span>
            </div>
            
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-muted-foreground hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="text-muted-foreground hover:text-white transition-colors">Pricing</a>
              <a href="#testimonials" className="text-muted-foreground hover:text-white transition-colors">Testimonials</a>
              <Button 
                variant="ghost" 
                onClick={() => setCurrentPage('login')}
                className="text-white hover:bg-secondary"
              >
                Sign In
              </Button>
              <Button 
                onClick={() => setCurrentPage('signup')}
                className="bg-primary hover:bg-primary/90"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
            <Zap className="h-3 w-3 mr-1" />
            Breaking Communication Barriers
          </Badge>
          
          <h1 className="text-4xl md:text-6xl text-white mb-6 max-w-4xl mx-auto leading-tight">
            AI-Powered Accessibility for
            <span className="text-primary"> Everyone</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Empower individuals with disabilities through intelligent voice-to-text, text-to-speech, 
            vision support, and seamless wearable device integration.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              onClick={() => setCurrentPage('signup')}
              className="bg-primary hover:bg-primary/90 px-8 py-3"
            >
              Start Free Trial
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-border text-white hover:bg-secondary px-8 py-3"
            >
              Watch Demo
            </Button>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <ImageWithFallback 
              src="/api/placeholder/800/450"
              alt="Baho AI Dashboard"
              className="w-full rounded-lg border border-border shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl text-white mb-2">{stat.number}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl text-white mb-4">
              Comprehensive Accessibility Solutions
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our AI-powered platform provides a complete suite of tools designed to break down 
              communication barriers and enhance accessibility.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-card border-border hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-secondary/20 rounded-lg">
                      <feature.icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-white">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl text-white mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-muted-foreground">
              Start free and upgrade as you grow
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <Card className="bg-card border-border relative">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-white">Free</CardTitle>
                <div className="text-3xl text-white">$0<span className="text-sm text-muted-foreground">/month</span></div>
                <p className="text-muted-foreground">Perfect for trying out our platform</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-400" />
                    <span className="text-white">100 minutes voice-to-text</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-400" />
                    <span className="text-white">50 text-to-speech conversions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-400" />
                    <span className="text-white">Basic vision support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-400" />
                    <span className="text-white">1 device connection</span>
                  </li>
                </ul>
                <Button 
                  className="w-full bg-secondary hover:bg-secondary/90"
                  onClick={() => setCurrentPage('signup')}
                >
                  Get Started Free
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="bg-card border-border relative ring-2 ring-primary">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-white">Most Popular</Badge>
              </div>
              <CardHeader className="text-center pb-4 pt-6">
                <CardTitle className="text-white">Pro</CardTitle>
                <div className="text-3xl text-white">$19.99<span className="text-sm text-muted-foreground">/month</span></div>
                <p className="text-muted-foreground">Advanced features with AI learning</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-400" />
                    <span className="text-white">Unlimited voice-to-text</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-400" />
                    <span className="text-white">Unlimited text-to-speech</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-400" />
                    <span className="text-white">AI-powered vision support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-400" />
                    <span className="text-white">Up to 5 device connections</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-400" />
                    <span className="text-white">Coral Protocol agents</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-400" />
                    <span className="text-white">Priority support</span>
                  </li>
                </ul>
                <Button 
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={() => setCurrentPage('signup')}
                >
                  Start Pro Trial
                </Button>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="bg-card border-border relative">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-white">Enterprise</CardTitle>
                <div className="text-3xl text-white">$99.99<span className="text-sm text-muted-foreground">/month</span></div>
                <p className="text-muted-foreground">Full platform with custom integrations</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-400" />
                    <span className="text-white">Everything in Pro</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-400" />
                    <span className="text-white">Unlimited device connections</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-400" />
                    <span className="text-white">Custom integrations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-400" />
                    <span className="text-white">White-label solutions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-400" />
                    <span className="text-white">Dedicated support manager</span>
                  </li>
                </ul>
                <Button 
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={() => setCurrentPage('signup')}
                >
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl text-white mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-xl text-muted-foreground">
              See what our users say about Baho AI
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">"{testimonial.content}"</p>
                  <div>
                    <div className="text-white">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl text-white mb-4">
            Ready to Break Communication Barriers?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of users who are already experiencing the power of AI-driven accessibility.
          </p>
          <Button 
            size="lg" 
            onClick={() => setCurrentPage('signup')}
            className="bg-primary hover:bg-primary/90 px-8 py-3"
          >
            Start Your Free Trial Today
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Brain className="h-6 w-6 text-primary" />
                <span className="text-white">Baho AI</span>
              </div>
              <p className="text-muted-foreground">
                Breaking communication barriers through AI-powered accessibility solutions.
              </p>
            </div>
            
            <div>
              <h4 className="text-white mb-4">Product</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-12 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Baho AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}