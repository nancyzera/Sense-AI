import { Bell, Settings, User, Crown, LogOut, Play } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useAuth } from "../contexts/AuthContext";

export function Header() {
  const { user, signOut } = useAuth();

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'pro': return 'bg-green-600';
      case 'enterprise': return 'bg-purple-600';
      default: return 'bg-blue-600';
    }
  };

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'pro': return <Crown className="h-3 w-3" />;
      case 'enterprise': return <Crown className="h-3 w-3" />;
      default: return <User className="h-3 w-3" />;
    }
  };

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-xl text-white">Baho AI</h1>
        {user?.isDemoUser && (
          <Badge className="bg-orange-600 text-white">
            <Play className="h-3 w-3 mr-1" />
            Demo Mode
          </Badge>
        )}
      </div>
      
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-white relative"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 h-2 w-2 bg-primary rounded-full"></span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-white text-sm">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <span className="text-sm text-white">{user?.name || 'User'}</span>
                <Badge className={`text-xs ${getPlanColor(user?.subscription?.plan || 'free')}`}>
                  {getPlanIcon(user?.subscription?.plan || 'free')}
                  <span className="ml-1">{user?.subscription?.plan?.toUpperCase() || 'FREE'}</span>
                </Badge>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-card border-border">
            <DropdownMenuLabel className="text-white">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.name || 'User'}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
                {user?.isDemoUser && (
                  <Badge className="bg-orange-600 text-white text-xs w-fit">
                    Demo Account
                  </Badge>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem className="text-white hover:bg-secondary cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-white hover:bg-secondary cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            {(user?.subscription?.plan === 'free' || user?.isDemoUser) && (
              <DropdownMenuItem className="text-white hover:bg-secondary cursor-pointer">
                <Crown className="mr-2 h-4 w-4" />
                <span>Upgrade Plan</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem 
              className="text-white hover:bg-secondary cursor-pointer"
              onClick={signOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>{user?.isDemoUser ? 'Exit Demo' : 'Sign Out'}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}