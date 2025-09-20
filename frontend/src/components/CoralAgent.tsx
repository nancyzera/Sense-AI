import { useState, useEffect } from "react";
import { Network, Cpu, Zap, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Textarea } from "./ui/textarea";
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface Agent {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'idle' | 'processing';
  capabilities: string[];
  performance: number;
}

interface Task {
  id: string;
  type: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  result?: any;
  timestamp: Date;
}

export function CoralAgent() {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: 'agent_voice',
      name: 'Voice Recognition Agent',
      type: 'voice_processing',
      status: 'active',
      capabilities: ['speech-to-text', 'voice-analysis', 'accent-detection'],
      performance: 94
    },
    {
      id: 'agent_vision',
      name: 'Vision Analysis Agent',
      type: 'image_processing',
      status: 'active',
      capabilities: ['object-detection', 'text-extraction', 'scene-description'],
      performance: 89
    },
    {
      id: 'agent_mobility',
      name: 'Mobility Assistant Agent',
      type: 'device_management',
      status: 'idle',
      capabilities: ['device-sync', 'navigation', 'emergency-alerts'],
      performance: 97
    }
  ]);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isRegistering, setIsRegistering] = useState(false);
  const [taskInput, setTaskInput] = useState('');

  const registerAgent = async (agentConfig: any) => {
    setIsRegistering(true);
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-f8c4b683/coral/agent/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          agent_config: agentConfig,
          capabilities: agentConfig.capabilities
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Agent registered:', result);
      }
    } catch (error) {
      console.error('Error registering agent:', error);
    } finally {
      setIsRegistering(false);
    }
  };

  const executeTask = async (agentId: string, taskType: string, context: any = {}) => {
    const newTask: Task = {
      id: `task_${Date.now()}`,
      type: taskType,
      status: 'pending',
      timestamp: new Date()
    };

    setTasks(prev => [...prev, newTask]);

    // Update agent status
    setAgents(prev => prev.map(agent => 
      agent.id === agentId 
        ? { ...agent, status: 'processing' as const }
        : agent
    ));

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-f8c4b683/coral/agent/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          agent_id: agentId,
          task: taskType,
          context
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        // Update task status
        setTasks(prev => prev.map(task =>
          task.id === newTask.id
            ? { ...task, status: 'completed', result: result.result }
            : task
        ));
      } else {
        setTasks(prev => prev.map(task =>
          task.id === newTask.id
            ? { ...task, status: 'error' }
            : task
        ));
      }
    } catch (error) {
      console.error('Error executing task:', error);
      setTasks(prev => prev.map(task =>
        task.id === newTask.id
          ? { ...task, status: 'error' }
          : task
      ));
    } finally {
      // Reset agent status
      setAgents(prev => prev.map(agent => 
        agent.id === agentId 
          ? { ...agent, status: 'active' as const }
          : agent
      ));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-600';
      case 'processing': return 'bg-blue-600';
      case 'idle': return 'bg-gray-600';
      case 'completed': return 'bg-green-600';
      case 'error': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'error': return <AlertCircle className="h-4 w-4" />;
      case 'processing': return <Zap className="h-4 w-4 animate-pulse" />;
      default: return <Cpu className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Agent Overview */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Network className="h-5 w-5 text-primary" />
            Coral Protocol Agents
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {agents.map((agent) => (
              <div key={agent.id} className="bg-secondary/20 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-white">{agent.name}</h4>
                  <Badge className={getStatusColor(agent.status)}>
                    {agent.status}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Performance</span>
                    <span className="text-white">{agent.performance}%</span>
                  </div>
                  <Progress value={agent.performance} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Capabilities:</p>
                  <div className="flex flex-wrap gap-1">
                    {agent.capabilities.map((cap, index) => (
                      <Badge key={index} variant="outline" className="text-xs border-border text-white">
                        {cap}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => executeTask(agent.id, agent.type.split('_')[0] + '_recognition', { input: taskInput })}
                    disabled={agent.status === 'processing'}
                    className="flex-1 bg-primary hover:bg-primary/90"
                  >
                    {getStatusIcon(agent.status)}
                    Execute
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Task Input */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-white">Task Execution</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Task Context (optional):</label>
            <Textarea
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              placeholder="Enter context or parameters for the task..."
              className="bg-input border-border text-white placeholder:text-muted-foreground"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={() => executeTask('agent_voice', 'voice_recognition', { text: taskInput })}
              className="bg-primary hover:bg-primary/90"
            >
              Test Voice Agent
            </Button>
            <Button
              onClick={() => executeTask('agent_vision', 'image_analysis', { description: taskInput })}
              className="bg-primary hover:bg-primary/90"
            >
              Test Vision Agent
            </Button>
            <Button
              onClick={() => executeTask('agent_mobility', 'device_sync', { action: taskInput })}
              className="bg-primary hover:bg-primary/90"
            >
              Test Mobility Agent
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Task History */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-white">Recent Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {tasks.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No tasks executed yet</p>
            ) : (
              tasks.slice(-10).reverse().map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(task.status)}
                    <div>
                      <p className="text-white text-sm">{task.type.replace('_', ' ').toUpperCase()}</p>
                      <p className="text-muted-foreground text-xs">
                        {task.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(task.status)}>
                    {task.status}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Integration Info */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-white">Developer Integration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-secondary/20 rounded-lg p-4">
            <h4 className="text-white mb-2">Agent API Endpoints</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-border text-white">POST</Badge>
                <code className="text-primary">/coral/agent/register</code>
                <span className="text-muted-foreground">- Register new agent</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-border text-white">POST</Badge>
                <code className="text-primary">/coral/agent/execute</code>
                <span className="text-muted-foreground">- Execute agent task</span>
              </div>
            </div>
          </div>
          
          <Button
            onClick={() => registerAgent({
              name: 'Custom Agent',
              type: 'custom_processing',
              capabilities: ['custom-task-1', 'custom-task-2']
            })}
            disabled={isRegistering}
            className="w-full bg-primary hover:bg-primary/90"
          >
            {isRegistering ? 'Registering...' : 'Register Custom Agent'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}