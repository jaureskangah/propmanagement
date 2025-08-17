import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Send, Bot, User, Sparkles, Plus, MessageSquare, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import { useAIConversations } from '@/hooks/ai/useAIConversations';
import { useLocale } from '@/components/providers/LocaleProvider';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export function AIAssistant() {
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUserNearBottom, setIsUserNearBottom] = useState(true);
  const [showConversations, setShowConversations] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const { t } = useLocale();
  
  const {
    conversations,
    currentConversation,
    messages: aiMessages,
    isLoading: conversationsLoading,
    createConversation,
    saveMessage,
    selectConversation,
    deleteConversation
  } = useAIConversations();

  // Convertir les messages AI au format local
  const messages: Message[] = aiMessages.map(msg => ({
    id: msg.id,
    content: msg.content,
    role: msg.role,
    timestamp: new Date(msg.timestamp)
  }));

  // Ajouter le message de bienvenue si aucune conversation n'est sélectionnée
  const displayMessages = currentConversation && messages.length > 0 ? messages : [
    {
      id: 'welcome',
      content: "Bonjour ! Je suis votre assistant IA pour la gestion immobilière. Comment puis-je vous aider aujourd'hui ?",
      role: 'assistant' as const,
      timestamp: new Date()
    }
  ];

  const checkIfNearBottom = () => {
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea) return;
    
    const { scrollTop, scrollHeight, clientHeight } = scrollArea;
    const threshold = 100; // pixels from bottom
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - threshold;
    setIsUserNearBottom(isNearBottom);
  };

  const scrollToBottom = (force = false) => {
    if (force || isUserNearBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    checkIfNearBottom();
  };

  useEffect(() => {
    // Only auto-scroll if user is near bottom or it's the first message
    if (isUserNearBottom || displayMessages.length === 1) {
      scrollToBottom(true);
    }
  }, [displayMessages]);

  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    if (scrollArea) {
      scrollArea.addEventListener('scroll', handleScroll);
      return () => scrollArea.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !user?.id) return;

    const messageContent = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      // Créer une conversation si aucune n'est sélectionnée
      let conversationId = currentConversation?.id;
      if (!conversationId) {
        const newConversation = await createConversation();
        if (!newConversation) {
          throw new Error('Failed to create conversation');
        }
        conversationId = newConversation.id;
      }

      // Sauvegarder le message utilisateur
      await saveMessage(conversationId, messageContent, 'user');

      // Envoyer le message à l'AI
      const { data, error } = await supabase.functions.invoke('ai-assistant', {
        body: {
          message: messageContent,
          userId: user.id
        }
      });

      if (error) throw error;

      // Sauvegarder la réponse de l'assistant
      await saveMessage(conversationId, data.message, 'assistant');
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

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-end">
          <TooltipProvider>
            <div className="flex items-center gap-2">
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowConversations(!showConversations)}
                  >
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  Afficher/Masquer les conversations
                </TooltipContent>
              </Tooltip>
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => createConversation()}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  Nouvelle conversation
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </CardTitle>
        
        {showConversations && (
          <div className="mt-3 max-h-40 overflow-y-auto space-y-1">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`flex items-center justify-between p-2 rounded-md cursor-pointer text-sm ${
                  currentConversation?.id === conversation.id
                    ? 'bg-primary/10'
                    : 'bg-muted/50 hover:bg-muted'
                }`}
              >
                <div
                  className="flex-1 truncate"
                  onClick={() => selectConversation(conversation)}
                >
                  {conversation.title || `Conversation du ${new Date(conversation.created_at).toLocaleDateString()}`}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteConversation(conversation.id);
                  }}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <div ref={scrollAreaRef} className="flex-1 overflow-y-auto px-4 pb-4 max-h-[400px]">
          <div className="space-y-4">
            {displayMessages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'justify-start' : 'justify-end'
                }`}
              >
                {message.role === 'user' && (
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary flex-shrink-0">
                    <User className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-muted mr-auto'
                      : 'bg-primary text-primary-foreground ml-auto'
                  }`}
                >
                  <div className="text-sm whitespace-pre-wrap break-words overflow-wrap-anywhere">
                    {message.content}
                  </div>
                  <div className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>

                {message.role === 'assistant' && (
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 justify-end">
                <div className="bg-primary rounded-lg p-3 text-primary-foreground">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">L'assistant réfléchit...</span>
                  </div>
                </div>
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Posez votre question sur la gestion immobilière..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button 
              onClick={sendMessage} 
              disabled={isLoading || !inputMessage.trim()}
              size="icon"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}