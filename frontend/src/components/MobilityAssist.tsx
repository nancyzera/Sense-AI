import { useState } from "react";
import { Accessibility, Bluetooth, Wifi, Battery, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Progress } from "./ui/progress";

interface Device {
  id: string;
  name: string;
  type: string;
  connected: boolean;
  battery?: number;
  status: string;
}

export function MobilityAssist() {
  const [devices, setDevices] = useState<Device[]>([
    {
      id: "1",
      name: "Smart Wheelchair",
      type: "wheelchair",
      connected: true,
      battery: 85,
      status: "Active"
    },
    {
      id: "2",
      name: "Navigation Belt",
      type: "navigation",
      connected: true,
      battery: 72,
      status: "Standby"
    },
    {
      id: "3",
      name: "Smart Cane",
      type: "cane",
      connected: false,
      battery: 45,
      status: "Disconnected"
    }
  ]);

  const [bluetoothEnabled, setBluetoothEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);

  const toggleDeviceConnection = (deviceId: string) => {
    setDevices(devices.map(device => 
      device.id === deviceId 
        ? { ...device, connected: !device.connected, status: device.connected ? "Disconnected" : "Active" }
        : device
    ));
  };

  const scanForDevices = () => {
    // Simulate device scanning
    alert("Scanning for nearby accessibility devices...");
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Accessibility className="h-5 w-5 text-primary" />
          Mobility Assist
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Settings */}
        <div className="space-y-4">
          <h4 className="text-white">Settings</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bluetooth className="h-4 w-4 text-primary" />
                <span className="text-sm text-white">Bluetooth</span>
              </div>
              <Switch 
                checked={bluetoothEnabled} 
                onCheckedChange={setBluetoothEnabled}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm text-white">Location Services</span>
              </div>
              <Switch 
                checked={locationEnabled} 
                onCheckedChange={setLocationEnabled}
              />
            </div>
          </div>
        </div>

        {/* Connected Devices */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-white">Connected Devices</h4>
            <Button 
              onClick={scanForDevices}
              size="sm"
              variant="outline"
              className="border-border text-white hover:bg-secondary"
            >
              <Wifi className="h-4 w-4 mr-2" />
              Scan
            </Button>
          </div>
          
          <div className="space-y-3">
            {devices.map((device) => (
              <div key={device.id} className="bg-secondary/20 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-white">{device.name}</h5>
                    <p className="text-sm text-muted-foreground capitalize">{device.type}</p>
                  </div>
                  <Badge 
                    variant={device.connected ? "default" : "secondary"}
                    className={device.connected ? "bg-green-600" : "bg-gray-600"}
                  >
                    {device.status}
                  </Badge>
                </div>
                
                {device.battery && (
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
                )}
                
                <Button 
                  onClick={() => toggleDeviceConnection(device.id)}
                  size="sm"
                  variant={device.connected ? "destructive" : "default"}
                  className="w-full"
                >
                  {device.connected ? "Disconnect" : "Connect"}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h4 className="text-white">Quick Actions</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="border-border text-white hover:bg-secondary">
              Emergency Alert
            </Button>
            <Button variant="outline" className="border-border text-white hover:bg-secondary">
              Find My Device
            </Button>
            <Button variant="outline" className="border-border text-white hover:bg-secondary">
              Voice Commands
            </Button>
            <Button variant="outline" className="border-border text-white hover:bg-secondary">
              Navigation Help
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}