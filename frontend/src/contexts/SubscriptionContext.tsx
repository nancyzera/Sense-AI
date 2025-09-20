import { createContext, useContext, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface SubscriptionLimits {
  voiceToTextMinutes: number;
  textToSpeechConversions: number;
  deviceConnections: number;
  aiInsights: boolean;
  coralAgents: boolean;
  prioritySupport: boolean;
  customIntegrations: boolean;
  advancedAnalytics: boolean;
}

const SUBSCRIPTION_LIMITS: Record<string, SubscriptionLimits> = {
  free: {
    voiceToTextMinutes: 100,
    textToSpeechConversions: 50,
    deviceConnections: 1,
    aiInsights: false,
    coralAgents: false,
    prioritySupport: false,
    customIntegrations: false,
    advancedAnalytics: false
  },
  pro: {
    voiceToTextMinutes: -1, // unlimited
    textToSpeechConversions: -1, // unlimited
    deviceConnections: 5,
    aiInsights: true,
    coralAgents: true,
    prioritySupport: true,
    customIntegrations: false,
    advancedAnalytics: true
  },
  enterprise: {
    voiceToTextMinutes: -1, // unlimited
    textToSpeechConversions: -1, // unlimited
    deviceConnections: -1, // unlimited
    aiInsights: true,
    coralAgents: true,
    prioritySupport: true,
    customIntegrations: true,
    advancedAnalytics: true
  }
};

interface SubscriptionContextType {
  limits: SubscriptionLimits;
  canAccess: (feature: keyof SubscriptionLimits) => boolean;
  hasReachedLimit: (feature: 'voiceToTextMinutes' | 'textToSpeechConversions' | 'deviceConnections', currentUsage: number) => boolean;
  isFeatureAvailable: (feature: keyof SubscriptionLimits) => boolean;
  upgradePath: string[];
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  
  const currentPlan = user?.subscription?.plan || 'free';
  const limits = SUBSCRIPTION_LIMITS[currentPlan];

  const canAccess = (feature: keyof SubscriptionLimits): boolean => {
    if (typeof limits[feature] === 'boolean') {
      return limits[feature] as boolean;
    }
    return true; // For numeric limits, access is allowed (usage limits are checked separately)
  };

  const hasReachedLimit = (
    feature: 'voiceToTextMinutes' | 'textToSpeechConversions' | 'deviceConnections',
    currentUsage: number
  ): boolean => {
    const limit = limits[feature];
    if (limit === -1) return false; // unlimited
    return currentUsage >= limit;
  };

  const isFeatureAvailable = (feature: keyof SubscriptionLimits): boolean => {
    return canAccess(feature);
  };

  const getUpgradePath = (): string[] => {
    switch (currentPlan) {
      case 'free':
        return ['pro', 'enterprise'];
      case 'pro':
        return ['enterprise'];
      case 'enterprise':
        return [];
      default:
        return ['pro', 'enterprise'];
    }
  };

  const value = {
    limits,
    canAccess,
    hasReachedLimit,
    isFeatureAvailable,
    upgradePath: getUpgradePath()
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}