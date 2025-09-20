import { useState } from "react";
import { Settings as SettingsIcon, User, Bell, Shield, Palette, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Slider } from "./ui/slider";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [voiceAlerts, setVoiceAlerts] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [language, setLanguage] = useState("en");
  const [theme, setTheme] = useState("dark");
  const [fontSize, setFontSize] = useState([16]);
  const [contrastLevel, setContrastLevel] = useState([50]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <SettingsIcon className="h-6 w-6 text-primary" />
        <h1 className="text-2xl text-white">Settings</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Profile Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white">Display Name</Label>
              <Input 
                placeholder="Enter your name"
                className="bg-input border-border text-white placeholder:text-muted-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Email</Label>
              <Input 
                type="email"
                placeholder="Enter your email"
                className="bg-input border-border text-white placeholder:text-muted-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="bg-input border-border text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="en" className="text-white">English</SelectItem>
                  <SelectItem value="es" className="text-white">Spanish</SelectItem>
                  <SelectItem value="fr" className="text-white">French</SelectItem>
                  <SelectItem value="de" className="text-white">German</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive app notifications</p>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white">Voice Alerts</Label>
                <p className="text-sm text-muted-foreground">Audio notification alerts</p>
              </div>
              <Switch checked={voiceAlerts} onCheckedChange={setVoiceAlerts} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white">Auto-save Transcriptions</Label>
                <p className="text-sm text-muted-foreground">Automatically save transcripts</p>
              </div>
              <Switch checked={autoSave} onCheckedChange={setAutoSave} />
            </div>
          </CardContent>
        </Card>

        {/* Accessibility Settings */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              Accessibility
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white">Theme</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger className="bg-input border-border text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="dark" className="text-white">Dark</SelectItem>
                  <SelectItem value="light" className="text-white">Light</SelectItem>
                  <SelectItem value="high-contrast" className="text-white">High Contrast</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-white">Font Size: {fontSize[0]}px</Label>
              <Slider
                value={fontSize}
                onValueChange={setFontSize}
                max={24}
                min={12}
                step={1}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Contrast Level: {contrastLevel[0]}%</Label>
              <Slider
                value={contrastLevel}
                onValueChange={setContrastLevel}
                max={100}
                min={0}
                step={5}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Privacy & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white">Data Storage</Label>
              <p className="text-sm text-muted-foreground">
                Your data is encrypted and stored securely. You can export or delete your data at any time.
              </p>
            </div>
            <div className="space-y-2">
              <Button variant="outline" className="w-full border-border text-white hover:bg-secondary">
                Export My Data
              </Button>
              <Button variant="destructive" className="w-full">
                Delete All Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="bg-primary hover:bg-primary/90">
          Save Settings
        </Button>
      </div>
    </div>
  );
}