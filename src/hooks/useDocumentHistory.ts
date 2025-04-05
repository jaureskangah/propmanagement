
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";

export interface DocumentHistoryEntry {
  user_id: string;
  name: string;
  content: string;
  file_url: string;
  document_type?: string;
  category?: string;
}

export function useDocumentHistory() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const saveToHistory = async (document: Omit<DocumentHistoryEntry, 'user_id'>) => {
    if (!user) return null;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('document_history')
        .insert({
          ...document,
          user_id: user.id,
        })
        .select()
        .single();
        
      if (error) throw error;
      
      return data;
    } catch (error: any) {
      console.error('Error saving to document history:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder l'historique du document",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    isLoading,
    saveToHistory
  };
}
