import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { formatLocalDateForStorage } from '@/lib/date';

export interface AIConversation {
  id: string;
  title?: string;
  created_at: string;
  updated_at: string;
}

export interface AIMessage {
  id: string;
  conversation_id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
}

export function useAIConversations() {
  const [conversations, setConversations] = useState<AIConversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<AIConversation | null>(null);
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Charger les conversations de l'utilisateur
  const loadConversations = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('ai_conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      console.error('Error loading conversations:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les conversations",
        variant: "destructive"
      });
    }
  };

  // Charger les messages d'une conversation
  const loadMessages = async (conversationId: string) => {
    try {
      setIsLoading(true);
      console.log('[LOAD_MESSAGES] Loading messages for conversation:', conversationId);
      
      const { data, error } = await supabase
        .from('ai_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('timestamp', { ascending: true });

      if (error) throw error;
      
      console.log('[LOAD_MESSAGES] Messages loaded:', data?.length || 0, 'messages');
      setMessages((data || []) as AIMessage[]);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les messages",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Créer une nouvelle conversation
  const createConversation = async (title?: string): Promise<AIConversation | null> => {
    if (!user?.id) return null;

    try {
      const { data, error } = await supabase
        .from('ai_conversations')
        .insert([
          {
            user_id: user.id,
            title: title || `Conversation du ${formatLocalDateForStorage(new Date()).split('-').reverse().join('/')}`
          }
        ])
        .select()
        .single();

      if (error) throw error;
      
      const newConversation = data as AIConversation;
      setConversations(prev => [newConversation, ...prev]);
      setCurrentConversation(newConversation);
      setMessages([]);
      
      return newConversation;
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer une nouvelle conversation",
        variant: "destructive"
      });
      return null;
    }
  };

  // Sauvegarder un message
  const saveMessage = async (conversationId: string, content: string, role: 'user' | 'assistant'): Promise<AIMessage | null> => {
    try {
      const { data, error } = await supabase
        .from('ai_messages')
        .insert([
          {
            conversation_id: conversationId,
            content,
            role,
            timestamp: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) throw error;
      
      const newMessage = data as AIMessage;
      setMessages(prev => [...prev, newMessage]);
      
      // Mettre à jour la date de modification de la conversation
      await supabase
        .from('ai_conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);
      
      return newMessage;
    } catch (error) {
      console.error('Error saving message:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le message",
        variant: "destructive"
      });
      return null;
    }
  };

  // Sélectionner une conversation
  const selectConversation = async (conversation: AIConversation) => {
    console.log('[SELECT_CONVERSATION] Selecting conversation:', conversation.id, conversation.title);
    setCurrentConversation(conversation);
    await loadMessages(conversation.id);
  };

  // Supprimer une conversation
  const deleteConversation = async (conversationId: string) => {
    try {
      const { error } = await supabase
        .from('ai_conversations')
        .delete()
        .eq('id', conversationId);

      if (error) throw error;
      
      setConversations(prev => prev.filter(c => c.id !== conversationId));
      
      if (currentConversation?.id === conversationId) {
        setCurrentConversation(null);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la conversation",
        variant: "destructive"
      });
    }
  };

  // Charger les conversations au montage
  useEffect(() => {
    if (user?.id) {
      loadConversations();
    }
  }, [user?.id]);

  // Charger automatiquement la conversation la plus récente au premier chargement
  useEffect(() => {
    if (conversations.length > 0 && !currentConversation) {
      selectConversation(conversations[0]);
    }
  }, [conversations]);

  return {
    conversations,
    currentConversation,
    messages,
    isLoading,
    loadConversations,
    loadMessages,
    createConversation,
    saveMessage,
    selectConversation,
    deleteConversation
  };
}