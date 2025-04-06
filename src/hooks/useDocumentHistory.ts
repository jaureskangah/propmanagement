
import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";

type HistoryEntry = {
  name: string;
  category: string;
  documentType: string;
  fileUrl: string | null;
  content: string;
};

export const useDocumentHistory = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const fetchHistory = useCallback(async () => {
    if (!user?.id) return [];
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('document_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error("Error fetching document history:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const addToHistory = useCallback(async (entry: HistoryEntry) => {
    if (!user?.id) return false;
    
    try {
      const { error } = await supabase
        .from('document_history')
        .insert({
          user_id: user.id,
          name: entry.name,
          category: entry.category,
          document_type: entry.documentType,
          file_url: entry.fileUrl,
          content: entry.content
        });
        
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error("Error adding to document history:", error);
      return false;
    }
  }, [user]);

  return {
    fetchHistory,
    addToHistory,
    isLoading
  };
};
