import { useState, useEffect } from "react";
import { Watch, Smartphone, Wifi, Battery, Vibrate, Eye, Volume2, Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Switch } from "./ui/switch";
import { Slider } from "./ui/slider";
import { Alert, AlertDescription } from "./ui/alert";
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface WearableDevice {
  id: string;
  name: string;
  type: 'smartwatch' | 'haptic_band' | 'smart_glasses' | 'hearing_aid';
  connected: boolean;
  battery: number;
  capabilities: {
    haptic: boolean;
    visual: boolean;
    audio: boolean;
    sensors: string[];
  };
  status: 'active' | 'standby' | 'low_battery' | 'disconnected';
  lastSync: Date;
}

interface NotificationSettings {
  hapticIntensity: number;
  visualBrightness: number;
  audioVolume: number;
  enableEmergencyAlerts: boolean;
  enableNavigationCues: boolean;
  enableSocialNotifications: boolean;
}

export function WearableDevices() {
  const [devices, setDevices] = useState<WearableDevice[]>([
    {
      id: 'watch_001',
      name: 'Apple Watch Series 9',
      type: 'smartwatch',
      connected: true,
      battery: 78,
      capabilities: {
        haptic: true,
        visual: true,
        audio: false,
        sensors: ['accelerometer', 'gyroscope', 'heart_rate']
      },
      status: 'active',
      lastSync: new Date(Date.now() - 5 * 60 * 1000) // 5 minutes ago
    },
    {
      id: 'band_002',
      name: 'Neosensory Buzz',
      type: 'haptic_band',
      connected: true,
      battery: 92,
      capabilities: {
        haptic: true,
        visual: false,
        audio: false,
        sensors: ['touch', 'pressure']
      },
      status: 'active',
      lastSync: new Date(Date.now() - 2 * 60 * 1000) // 2 minutes ago
    },
    {
      id: 'glasses_003',
      name: 'Envision Glasses',
      type: 'smart_glasses',
      connected: false,
      battery: 45,
      capabilities: {
        haptic: false,
        visual: true,
        audio: true,
        sensors: ['camera', 'microphone']
      },
      status: 'disconnected',
      lastSync: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
    }
  ]);

  const [settings, setSettings] = useState<NotificationSettings>({
    hapticIntensity: 70,
    visualBrightness: 80,
    audioVolume: 60,
    enableEmergencyAlerts: true,
    enableNavigationCues: true,
    enableSocialNotifications: false
  });

  const [isScanning, setIsScanning] = useState(false);

  const connectDevice = async (deviceId: string) => {
    try {
      const device = devices.find(d => d.id === deviceId);
      if (!device) return;

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-f8c4b683/devices/connect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          device_info: {
            id: device.id,
            name: device.name,
            type: device.type
          },
          capabilities: device.capabilities
        })
      });

      if (response.ok) {
        setDevices(prev => prev.map(d => 
          d.id === deviceId 
            ? { ...d, connected: true, status: 'active', lastSync: new Date() }
            : d
        ));
      }
    } catch (error) {
      console.error('Error connecting device:', error);
    }
  };

  const disconnectDevice = (deviceId: string) => {
    setDevices(prev => prev.map(d => 
      d.id === deviceId 
        ? { ...d, connected: false, status: 'disconnected' }
        : d
    ));
  };

  const sendNotification = async (deviceId: string, type: string, message: string) => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-f8c4b683/devices/notify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          device_id: deviceId,
          notification_type: type,
          payload: {
            message,
            intensity: settings.hapticIntensity,
            brightness: settings.visualBrightness,
            volume: settings.audioVolume
          }
        })
      });

      if (response.ok) {
        console.log('Notification sent successfully');
      }
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  const scanForDevices = async () => {
    setIsScanning(true);
    
    // Simulate device scanning
    setTimeout(() => {
      const newDevice: WearableDevice = {
        id: `device_${Date.now()}`,
        name: 'New Haptic Device',
        type: 'haptic_band',
        connected: false,
        battery: 100,
        capabilities: {
          haptic: true,
          visual: false,
          audio: false,
          sensors: ['vibration']
        },
        status: 'disconnected',
        lastSync: new Date()
      };
      
      // Only add if not already exists
      setDevices(prev => {
        const exists = prev.some(d => d.name === newDevice.name);
        return exists ? prev : [...prev, newDevice];
      });
      
      setIsScanning(false);
    }, 3000);
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'smartwatch': return <Watch className="h-5 w-5" />;
      case 'smart_glasses': return <Eye className="h-5 w-5" />;
      case 'hearing_aid': return <Volume2 className="h-5 w-5" />;
      default: return <Vibrate className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-600';
      case 'standby': return 'bg-yellow-600';
      case 'low_battery': return 'bg-orange-600';
      case 'disconnected': return 'bg-gray-600';
      default: return 'bg-gray-600';
    }
  };

  const formatLastSync = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    return `${Math.floor(diffMins / 60)}h ago`;
  };

  return (
    <div className="space-y-6">
      {/* Device Scanner */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Wifi className="h-5 w-5 text-primary" />
            Device Discovery
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="bg-secondary/20 border-border">
            <Bell className="h-4 w-4" />
            <AlertDescription className="text-muted-foreground">
              Make sure your wearable devices are in pairing mode and nearby.
            </AlertDescription>
          </Alert>
          
          <Button 
            onClick={scanForDevices}
            disabled={isScanning}
            className="w-full bg-primary hover:bg-primary/90"
          >
            <Wifi className="h-4 w-4 mr-2" />
            {isScanning ? 'Scanning for devices...' : 'Scan for Devices'}
          </Button>
        </CardContent>
      </Card>

      {/* Connected Devices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {devices.map((device) => (
          <Card key={device.id} className="bg-card border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getDeviceIcon(device.type)}
                  <CardTitle className="text-white text-lg">{device.name}</CardTitle>
                </div>
                <Badge className={getStatusColor(device.status)}>
                  {device.status.replace('_', ' ')}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Battery Status */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Battery className="h-3 w-3" />
                    Battery
                  </span>
                  <span className="text-white">{device.battery}%</span>
                </div>
                <Progress value={device.battery} className="h-2" />
              </div>

              {/* Capabilities */}
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Capabilities:</p>
                <div className="flex flex-wrap gap-2">
                  {device.capabilities.haptic && (
                    <Badge variant="outline" className="border-border text-white">
                      <Vibrate className="h-3 w-3 mr-1" />
                      Haptic
                    </Badge>
                  )}
                  {device.capabilities.visual && (
                    <Badge variant="outline" className="border-border text-white">
                      <Eye className="h-3 w-3 mr-1" />
                      Visual
                    </Badge>
                  )}
                  {device.capabilities.audio && (
                    <Badge variant="outline" className="border-border text-white">
                      <Volume2 className="h-3 w-3 mr-1" />
                      Audio
                    </Badge>
                  )}
                </div>
              </div>

              {/* Last Sync */}
              <div className="text-xs text-muted-foreground">
                Last sync: {formatLastSync(device.lastSync)}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {device.connected ? (
                  <>
                    <Button
                      onClick={() => disconnectDevice(device.id)}
                      variant="destructive"
                      size="sm"
                      className="flex-1"
                    >
                      Disconnect
                    </Button>
                    <Button
                      onClick={() => sendNotification(device.id, 'test', 'Test notification')}
                      size="sm"
                      className="flex-1 bg-primary hover:bg-primary/90"
                    >
                      Test
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => connectDevice(device.id)}
                    size="sm"
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    Connect
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Notification Settings */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-white">Notification Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Intensity Controls */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-white">Haptic Intensity: {settings.hapticIntensity}%</label>
              <Slider
                value={[settings.hapticIntensity]}
                onValueChange={([value]) => setSettings(prev => ({ ...prev, hapticIntensity: value }))}
                max={100}
                min={0}
                step={5}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-white">Visual Brightness: {settings.visualBrightness}%</label>
              <Slider
                value={[settings.visualBrightness]}
                onValueChange={([value]) => setSettings(prev => ({ ...prev, visualBrightness: value }))}
                max={100}
                min={0}
                step={5}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-white">Audio Volume: {settings.audioVolume}%</label>
              <Slider
                value={[settings.audioVolume]}
                onValueChange={([value]) => setSettings(prev => ({ ...prev, audioVolume: value }))}
                max={100}
                min={0}
                step={5}
                className="w-full"
              />
            </div>
          </div>

          {/* Notification Types */}
          <div className="space-y-4">
            <h4 className="text-white">Notification Types</h4>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-white">Emergency Alerts</label>
                <p className="text-sm text-muted-foreground">High-priority safety notifications</p>
              </div>
              <Switch 
                checked={settings.enableEmergencyAlerts} 
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableEmergencyAlerts: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-white">Navigation Cues</label>
                <p className="text-sm text-muted-foreground">Directional guidance and obstacles</p>
              </div>
              <Switch 
                checked={settings.enableNavigationCues} 
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableNavigationCues: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-white">Social Notifications</label>
                <p className="text-sm text-muted-foreground">Messages and social updates</p>
              </div>
              <Switch 
                checked={settings.enableSocialNotifications} 
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableSocialNotifications: checked }))}
              />
            </div>
          </div>

          {/* Quick Test */}
          <div className="space-y-4">
            <h4 className="text-white">Quick Test</h4>
            <div className="grid grid-cols-3 gap-2">
              <Button 
                onClick={() => devices.filter(d => d.connected && d.capabilities.haptic).forEach(d => 
                  sendNotification(d.id, 'haptic', 'Haptic test')
                )}
                size="sm"
                variant="outline"
                className="border-border text-white hover:bg-secondary"
              >
                <Vibrate className="h-3 w-3 mr-1" />
                Haptic
              </Button>
              <Button 
                onClick={() => devices.filter(d => d.connected && d.capabilities.visual).forEach(d => 
                  sendNotification(d.id, 'visual', 'Visual test')
                )}
                size="sm"
                variant="outline"
                className="border-border text-white hover:bg-secondary"
              >
                <Eye className="h-3 w-3 mr-1" />
                Visual
              </Button>
              <Button 
                onClick={() => devices.filter(d => d.connected && d.capabilities.audio).forEach(d => 
                  sendNotification(d.id, 'audio', 'Audio test')
                )}
                size="sm"
                variant="outline"
                className="border-border text-white hover:bg-secondary"
              >
                <Volume2 className="h-3 w-3 mr-1" />
                Audio
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}