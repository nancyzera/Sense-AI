import { TrendingUp, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

const data = [
  { name: "Mon", usage: 20 },
  { name: "Tue", usage: 35 },
  { name: "Wed", usage: 45 },
  { name: "Thu", usage: 30 },
  { name: "Fri", usage: 55 },
  { name: "Sat", usage: 40 },
  { name: "Sun", usage: 60 },
];

export function AIInsights() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="name" 
                stroke="#9ca3af"
                fontSize={12}
              />
              <YAxis 
                stroke="#9ca3af"
                fontSize={12}
              />
              <Line 
                type="monotone" 
                dataKey="usage" 
                stroke="#4f89ff" 
                strokeWidth={3}
                dot={{ fill: "#4f89ff", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#4f89ff", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <p className="text-2xl text-white">156</p>
            <p className="text-xs text-muted-foreground">Total Sessions</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl text-white">94%</p>
            <p className="text-xs text-muted-foreground">Success Rate</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl text-white">2.3h</p>
            <p className="text-xs text-muted-foreground">Daily Usage</p>
          </div>
        </div>

        <div className="space-y-2">
          <h5 className="text-white">Recent Insights</h5>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-3 w-3 text-green-400" />
              <span className="text-muted-foreground">Voice recognition accuracy improved by 15%</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-3 w-3 text-blue-400" />
              <span className="text-muted-foreground">Peak usage time: 2-4 PM</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-3 w-3 text-yellow-400" />
              <span className="text-muted-foreground">Most used feature: Text-to-Speech</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}