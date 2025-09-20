import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';

const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

interface User {
  id: string;
  email: string;
  name?: string;
  subscription?: {
    plan: 'free' | 'pro' | 'enterprise';
    status: 'active' | 'cancelled' | 'past_due';
    current_period_end?: string;
  };
  isDemoUser?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  updateSubscription: (plan: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for demo user first
    const checkDemoUser = () => {
      const demoUser = localStorage.getItem('baho_demo_user');
      if (demoUser) {
        try {
          const parsedUser = JSON.parse(demoUser);
          setUser(parsedUser);
          setLoading(false);
          return true;
        } catch (error) {
          localStorage.removeItem('baho_demo_user');
        }
      }
      return false;
    };

    if (checkDemoUser()) {
      return;
    }

    // Get initial session for real users
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (session?.user && !error) {
        await loadUserProfile(session.user.id, session.user.email!);
      }
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await loadUserProfile(session.user.id, session.user.email!);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        localStorage.removeItem('baho_demo_user'); // Clear demo user on signout
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string, email: string) => {
    try {
      // Get user subscription info from backend
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-f8c4b683/user/profile`, {
        headers: {
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      });

      let subscription = { plan: 'free' as const, status: 'active' as const };
      
      if (response.ok) {
        const profile = await response.json();
        subscription = profile.subscription || subscription;
      }

      setUser({
        id: userId,
        email,
        name: email.split('@')[0], // Simple name extraction
        subscription,
        isDemoUser: false
      });
    } catch (error) {
      console.error('Error loading user profile:', error);
      setUser({
        id: userId,
        email,
        name: email.split('@')[0],
        subscription: { plan: 'free', status: 'active' },
        isDemoUser: false
      });
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { error: error.message };
      }

      // Clear any demo user data
      localStorage.removeItem('baho_demo_user');

      return { error: null };
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      // Create user via backend to handle profile setup
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-f8c4b683/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ email, password, name })
      });

      const result = await response.json();

      if (!response.ok) {
        return { error: result.error || 'Failed to create account' };
      }

      // Clear any demo user data
      localStorage.removeItem('baho_demo_user');

      // Sign in the newly created user
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        return { error: signInError.message };
      }

      return { error: null };
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('baho_demo_user'); // Clear demo user
    await supabase.auth.signOut();
    setUser(null);
  };

  const updateSubscription = async (plan: string) => {
    if (!user) return;

    // If demo user, just update locally
    if (user.isDemoUser) {
      const updatedUser = {
        ...user,
        subscription: {
          ...user.subscription!,
          plan: plan as 'free' | 'pro' | 'enterprise'
        }
      };
      setUser(updatedUser);
      localStorage.setItem('baho_demo_user', JSON.stringify(updatedUser));
      return;
    }

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-f8c4b683/subscription/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({ plan })
      });

      if (response.ok) {
        // Reload user profile to get updated subscription
        await loadUserProfile(user.id, user.email);
      }
    } catch (error) {
      console.error('Error updating subscription:', error);
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateSubscription
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}