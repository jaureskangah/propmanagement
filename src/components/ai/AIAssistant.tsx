import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Send, Bot, User, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Bonjour ! Je suis votre assistant IA pour la gestion immobilière. Comment puis-je vous aider aujourd'hui ?",
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-assistant', {
        body: {
          message: inputMessage,
          userId: user?.id
        }
      });

      if (error) throw error;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.message,
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="h-[600px] bg-gradient-to-br from-background via-background to-muted/30 rounded-xl overflow-hidden shadow-2xl border border-primary/20 backdrop-blur-sm">
      {/* Header */}
      <div className="bg-primary/10 backdrop-blur-sm p-4 border-b border-primary/20 flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 border border-primary/30">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-foreground font-semibold">Assistant IA</h2>
      </div>
      
      {/* Messages container */}
      <div className="p-4 h-[calc(100%-132px)] overflow-y-auto">
        {messages.length === 1 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="p-4 rounded-full bg-primary/10 mb-4 border border-primary/20">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-foreground text-lg mb-2 font-medium">Comment puis-je vous aider ?</h3>
            <p className="text-muted-foreground text-sm max-w-xs">
              Posez-moi vos questions sur la gestion immobilière !
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.slice(1).map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl transition-all duration-300 animate-fade-in ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-tr-none shadow-lg'
                      : 'bg-card/80 text-card-foreground rounded-tl-none border border-border/50 backdrop-blur-sm shadow-sm'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                  <div className="text-xs opacity-70 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] p-3 rounded-2xl bg-card/80 text-card-foreground rounded-tl-none border border-border/50 backdrop-blur-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-75"></div>
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-150"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      {/* Input form */}
      <div 
        className={`p-4 border-t transition-all duration-200 ${
          isFocused 
            ? 'border-primary/50 bg-card/80 backdrop-blur-sm' 
            : 'border-border/30 bg-card/50'
        }`}
      >
        <div className="relative flex items-center">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Posez votre question sur la gestion immobilière..."
            disabled={isLoading}
            className="pr-12 rounded-full border-border/50 bg-background/80 backdrop-blur-sm focus:ring-2 focus:ring-primary/30 transition-all duration-200"
          />
          <Button
            onClick={sendMessage}
            disabled={isLoading || !inputMessage.trim()}
            size="icon"
            className={`absolute right-1 rounded-full h-9 w-9 transition-all duration-200 ${
              inputMessage.trim() === ""
                ? "text-muted-foreground bg-muted/50 cursor-not-allowed"
                : "text-primary-foreground bg-primary hover:bg-primary/90 shadow-lg hover:shadow-primary/25"
            }`}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}