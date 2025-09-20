import { useAuth } from "../contexts/AuthContext";
import { useSubscription } from "../contexts/SubscriptionContext";
import { useApp } from "../contexts/AppContext";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { Dashboard } from "../components/Dashboard";
import { Chat } from "../components/Chat";
import { Tools } from "../components/Tools";
import { Settings } from "../components/Settings";
import { CoralAgent } from "../components/CoralAgent";
import { PaymentSystem } from "../components/PaymentSystem";
import { WearableDevices } from "../components/WearableDevices";
import { DeveloperSDK } from "../components/DeveloperSDK";
import { AILearningSystem } from "../components/AILearningSystem";
import { UpgradeModal } from "../components/UpgradeModal";
import { Toaster } from "../components/ui/sonner";
import { useState } from "react";

export function AppPage() {
  const { user } = useAuth();
  const { canAccess } = useSubscription();
  const { activeTab, setActiveTab, selectedFeature, setSelectedFeature } = useApp();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleFeatureSelect = (feature: string) => {
    setSelectedFeature(feature);
    setActiveTab("tools");
  };

  const handleRestrictedAccess = (feature: string) => {
    setShowUpgradeModal(true);
  };

  const renderContent = () => {
    // Check access for premium features
    const premiumFeatures = ['coral-agents', 'ai-learning', 'developer'];
    const isPremiumFeature = premiumFeatures.includes(activeTab);
    
    if (isPremiumFeature && !canAccess('aiInsights')) {
      return (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H8m13-9a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl text-white mb-2">Premium Feature</h3>
              <p className="text-muted-foreground mb-6">
                This feature is available with our Pro or Enterprise plans.
              </p>
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Upgrade to Access
              </button>
            </div>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case "dashboard":
        return <Dashboard onFeatureSelect={handleFeatureSelect} />;
      case "chat":
        return <Chat />;
      case "tools":
        return <Tools selectedFeature={selectedFeature} onRestrictedAccess={handleRestrictedAccess} />;
      case "coral-agents":
        return <CoralAgent />;
      case "wearables":
        return <WearableDevices />;
      case "payments":
        return <PaymentSystem />;
      case "developer":
        return <DeveloperSDK />;
      case "ai-learning":
        return <AILearningSystem />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard onFeatureSelect={handleFeatureSelect} />;
    }
  };

  if (!user) {
    return null; // This shouldn't happen with proper routing
  }

  return (
    <div className="h-screen bg-background flex flex-col">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
      <Toaster />
      
      {showUpgradeModal && (
        <UpgradeModal 
          isOpen={showUpgradeModal} 
          onClose={() => setShowUpgradeModal(false)} 
        />
      )}
    </div>
  );
}