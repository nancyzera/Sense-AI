import { useState } from "react";
import { Brain, Eye, EyeOff, ArrowLeft, Play } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useAuth } from "../contexts/AuthContext";
import { useApp } from "../contexts/AppContext";
import { DemoAccounts } from "../components/DemoAccounts";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { signIn } = useAuth();
  const { setCurrentPage } = useApp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const { error } = await signIn(email, password);
    
    if (error) {
      setError(error);
      setIsLoading(false);
    } else {
      setCurrentPage('app');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
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
            Sign in to your accessibility dashboard or try our demo
          </p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login" className="text-white">Sign In</TabsTrigger>
            <TabsTrigger value="demo" className="text-white">
              <Play className="h-4 w-4 mr-2" />
              Try Demo
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white text-center">Sign In to Your Account</CardTitle>
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
                    <label htmlFor="email" className="block text-sm text-white mb-2">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
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

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="rounded border-border bg-input"
                      />
                      <span className="text-sm text-muted-foreground">Remember me</span>
                    </label>
                    <Button
                      variant="link"
                      className="text-primary hover:text-primary/80 p-0"
                    >
                      Forgot password?
                    </Button>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <span className="text-muted-foreground">Don't have an account? </span>
                  <Button
                    variant="link"
                    onClick={() => setCurrentPage('signup')}
                    className="text-primary hover:text-primary/80 p-0"
                  >
                    Sign up
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
                        // Google OAuth would go here
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
                        // GitHub OAuth would go here
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
          </TabsContent>

          <TabsContent value="demo">
            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <DemoAccounts />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            By signing in, you agree to our{" "}
            <a href="#" className="text-primary hover:underline">Terms of Service</a>{" "}
            and{" "}
            <a href="#" className="text-primary hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}