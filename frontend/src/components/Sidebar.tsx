import { LayoutDashboard, MessageCircle, Wrench, Settings, Network, CreditCard, Watch, Code, Brain } from "lucide-react";
import { cn } from "./ui/utils";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "chat", label: "Chat", icon: MessageCircle },
  { id: "tools", label: "Tools", icon: Wrench },
  { id: "coral-agents", label: "Coral Agents", icon: Network },
  { id: "wearables", label: "Wearables", icon: Watch },
  { id: "ai-learning", label: "AI Learning", icon: Brain },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "developer", label: "Developer", icon: Code },
  { id: "settings", label: "Settings", icon: Settings },
];

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border p-4">
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                activeTab === item.id
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}