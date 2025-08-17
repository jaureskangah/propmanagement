import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChatInput } from '@/components/ui/chat-input';
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from '@/components/ui/chat-bubble';
import { ChatMessageList } from '@/components/ui/chat-message-list';
import { Loader2, Send, Bot, User, Sparkles, CornerDownLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import { useLocale } from '@/components/providers/LocaleProvider';

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
  const { toast } = useToast();
  const { user } = useAuth();
  const { t } = useLocale();


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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };


  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1">
        <ChatMessageList smooth>
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <div className="p-4 rounded-full bg-primary/10 mb-4">
                <Sparkles className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {t('aiAssistantWelcome') || 'Comment puis-je vous aider aujourd\'hui ?'}
              </h3>
              <p className="text-muted-foreground text-sm max-w-xs">
                {t('aiAssistantDescription') || 'Posez-moi vos questions sur la gestion immobilière et je ferai de mon mieux pour vous aider !'}
              </p>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <ChatBubble
                  key={message.id}
                  variant={message.role === "user" ? "sent" : "received"}
                >
                  <ChatBubbleAvatar
                    className="h-8 w-8 shrink-0"
                    src={message.role === "assistant" ? "/lovable-uploads/6592be3d-5e57-4efb-b135-4ced796c0ea4.png" : undefined}
                    fallback={message.role === "user" ? "US" : "IA"}
                  />
                  <ChatBubbleMessage
                    variant={message.role === "user" ? "sent" : "received"}
                  >
                    <div className="text-sm whitespace-pre-wrap break-words">
                      {message.content}
                    </div>
                    <div className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </ChatBubbleMessage>
                </ChatBubble>
              ))}

              {isLoading && (
                <ChatBubble variant="received">
                  <ChatBubbleAvatar
                    className="h-8 w-8 shrink-0"
                    src="/lovable-uploads/6592be3d-5e57-4efb-b135-4ced796c0ea4.png"
                    fallback="IA"
                  />
                  <ChatBubbleMessage isLoading />
                </ChatBubble>
              )}
            </>
          )}
        </ChatMessageList>
      </div>

      {/* Input Form */}
      <div className="p-4 border-t bg-background/50 backdrop-blur-sm">
        <form
          onSubmit={handleSubmit}
          className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring p-1"
        >
          <ChatInput
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={t('aiAssistantPlaceholder') || 'Posez votre question sur la gestion immobilière...'}
            className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
            disabled={isLoading}
          />
          <div className="flex items-center p-3 pt-0 justify-end">
            <Button 
              type="submit" 
              size="sm" 
              className="ml-auto gap-1.5"
              disabled={isLoading || !inputMessage.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  {t('aiAssistantThinking') || 'Réflexion...'}
                </>
              ) : (
                <>
                  {t('sendMessage') || 'Envoyer'}
                  <CornerDownLeft className="size-3.5" />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}