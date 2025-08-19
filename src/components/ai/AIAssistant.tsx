import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Send, Bot, User, Sparkles, Plus, MessageSquare, Trash2, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import { useAIConversations } from '@/hooks/ai/useAIConversations';
import { useLocale } from '@/components/providers/LocaleProvider';
import { useNavigate } from 'react-router-dom';
import { useAIUsageLimits } from '@/hooks/useAIUsageLimits';
import { AIUsageIndicator } from './AIUsageIndicator';
import { GuestAuthPrompt } from './GuestAuthPrompt';
import { formatLocalDateForStorage, parseDateSafe } from '@/lib/date';
import { useIsMobile } from '@/hooks/use-mobile';
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
  const [tooltipsEnabled, setTooltipsEnabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const aiUsage = useAIUsageLimits();
  const { user } = useAuth();
  const { t } = useLocale();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
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
      content: user ? t('welcomeConversationMessage') : t('welcomeConversationMessageGuest'),
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

  // Activer les tooltips après un délai pour éviter l'affichage automatique
  useEffect(() => {
    const timer = setTimeout(() => {
      setTooltipsEnabled(true);
    }, 1000); // Délai de 1 seconde

    return () => clearTimeout(timer);
  }, []);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !user?.id) return;
    
    // Vérifier les limites d'utilisation
    if (!aiUsage.canSendMessage) {
      toast({
        title: "Limite atteinte",
        description: "Vous avez atteint votre limite quotidienne de messages IA. Passez au Premium pour un accès illimité.",
        variant: "destructive",
      });
      return;
    }

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
          userId: user.id,
          language: t('__locale__') // Transmettre la langue actuelle
        }
      });

      if (error) throw error;

      // Sauvegarder la réponse de l'assistant
      await saveMessage(conversationId, data.message, 'assistant');
      
      // Rafraîchir les limites d'utilisation après une réponse réussie
      await aiUsage.refreshUsage();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: t('errorTitle'),
        description: t('sendMessageError'),
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
    <Card className={`${isMobile ? 'h-full' : 'h-[600px]'} flex flex-col border-none shadow-none bg-transparent`}>
      <CardHeader className={`${isMobile ? 'pb-2 px-4' : 'pb-3'}`}>
        <CardTitle className="flex items-center justify-end">
          {user && (tooltipsEnabled ? (
            <TooltipProvider delayDuration={800}>
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size={isMobile ? "default" : "sm"}
                      onClick={() => setShowConversations(!showConversations)}
                      className={isMobile ? "h-10 w-10" : ""}
                    >
                      <MessageSquare className={isMobile ? "w-5 h-5" : "w-4 h-4"} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    {t('showHideConversations')}
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size={isMobile ? "default" : "sm"}
                      onClick={() => createConversation()}
                      className={isMobile ? "h-10 w-10" : ""}
                    >
                      <Plus className={isMobile ? "w-5 h-5" : "w-4 h-4"} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    {t('newConversation')}
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size={isMobile ? "default" : "sm"}
                onClick={() => setShowConversations(!showConversations)}
                className={isMobile ? "h-10 w-10" : ""}
              >
                <MessageSquare className={isMobile ? "w-5 h-5" : "w-4 h-4"} />
              </Button>
              <Button
                variant="ghost"
                size={isMobile ? "default" : "sm"}
                onClick={() => createConversation()}
                className={isMobile ? "h-10 w-10" : ""}
              >
                <Plus className={isMobile ? "w-5 h-5" : "w-4 h-4"} />
              </Button>
            </div>
          ))}
        </CardTitle>
        
        {user && showConversations && (
          <div className="mt-3 max-h-40 overflow-y-auto space-y-1">
            {conversationsLoading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="ml-2 text-sm text-muted-foreground">{t('loadingConversations') || 'Chargement...'}</span>
              </div>
            ) : conversations.length > 0 ? (
              conversations.map((conversation) => (
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
                  {conversation.title || t('conversationFromDate', { 
                    date: formatLocalDateForStorage(parseDateSafe(conversation.created_at)).split('-').reverse().join('/')
                  })}
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
              ))
            ) : (
              <div className="text-center p-4 text-sm text-muted-foreground">
                {t('noConversations') || 'Aucune conversation'}
              </div>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <div ref={scrollAreaRef} className={`${isMobile ? 'ai-assistant-mobile-scroll ai-assistant-messages flex-1 px-3' : 'flex-1 overflow-y-auto scroll-smooth px-4 pb-4 max-h-[400px]'}`} style={{ WebkitOverflowScrolling: 'touch' }}>
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
                  className={`${isMobile ? 'max-w-[85%]' : 'max-w-[80%]'} rounded-lg ${isMobile ? 'p-2.5' : 'p-3'} ${
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
                    <span className="text-sm">{t('aiThinking')}</span>
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

        <div className={`${isMobile ? 'ai-assistant-input-area p-3' : 'p-4 border-t'} space-y-3`}>
          {user ? (
            <>
              {/* Indicateur d'utilisation IA */}
              <AIUsageIndicator usage={aiUsage} />
              
              {aiUsage.canSendMessage ? (
                <div className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={t('messageInputPlaceholder')}
                    className={`flex-1 ${isMobile ? 'h-12 text-base touch-manipulation' : ''}`}
                    disabled={isLoading}
                  />
                  <Button 
                    onClick={sendMessage} 
                    disabled={isLoading || !inputMessage.trim()}
                    size={isMobile ? "default" : "icon"}
                    className={isMobile ? "h-12 w-12 touch-manipulation" : ""}
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              ) : (
                <div className="w-full relative">
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="flex-1 text-sm">
                      <div className="font-medium text-amber-800">Messages quotidiens épuisés</div>
                      <div className="text-amber-700 text-xs mt-0.5">
                        Renouvellement à minuit ou passez au Premium pour un accès illimité
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => navigate('/#pricing')}
                      className="text-xs bg-amber-100 text-amber-700 hover:bg-amber-200 hover:text-amber-800 transition-colors flex-shrink-0"
                    >
                      Premium →
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <GuestAuthPrompt />
          )}
        </div>
      </CardContent>
    </Card>
  );
}