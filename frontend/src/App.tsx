import { useState } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
import { AppProvider, useApp } from "./contexts/AppContext";
import { useAuth } from "./contexts/AuthContext";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { AppPage } from "./pages/AppPage";
import { Toaster } from "./components/ui/sonner";

function AppRouter() {
  const { currentPage } = useApp();
  const { user, loading } = useAuth();

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is authenticated, show app regardless of currentPage
  if (user) {
    return <AppPage />;
  }

  // If not authenticated, show appropriate page
  switch (currentPage) {
    case 'login':
      return <LoginPage />;
    case 'signup':
      return <SignupPage />;
    case 'home':
    default:
      return <HomePage />;
  }
}

export default function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <SubscriptionProvider>
          <div className="min-h-screen bg-background">
            <AppRouter />
            <Toaster />
          </div>
        </SubscriptionProvider>
      </AuthProvider>
    </AppProvider>
  );
}