import { useState } from "react";
import { Send, Bot } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export function ChatInterface() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! How can I assist you today?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      text: message,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setMessage("");

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: "I understand you need assistance. Let me help you with that using our accessibility features.",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <Card className="bg-card border-border h-full">
      <CardContent className="p-6 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <Bot className="h-5 w-5 text-primary" />
          <h3 className="text-white">AI Assistant</h3>
        </div>
        
        <div className="flex-1 space-y-4 mb-4 max-h-64 overflow-y-auto">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isBot ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.isBot
                    ? "bg-secondary text-white"
                    : "bg-primary text-white"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="bg-input border-border text-white placeholder:text-muted-foreground"
          />
          <Button onClick={handleSendMessage} size="icon" className="bg-primary hover:bg-primary/90">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}