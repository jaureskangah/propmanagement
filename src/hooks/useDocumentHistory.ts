
import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";
import { DocumentHistoryEntry } from "@/types/documentHistory";

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
  const [history, setHistory] = useState<DocumentHistoryEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchDocumentHistory = useCallback(async () => {
    if (!user?.id) {
      setHistory([]);
      return [];
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('document_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (fetchError) throw fetchError;
      
      const formattedData = data.map(item => ({
        id: item.id,
        name: item.name,
        category: item.category || 'miscDocuments',
        documentType: item.document_type,
        fileUrl: item.file_url,
        content: item.content,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      }));
      
      setHistory(formattedData);
      return formattedData;
    } catch (err) {
      console.error("Error fetching document history:", err);
      setError("Failed to load document history");
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchDocumentHistory();
  }, [fetchDocumentHistory]);

  const addToHistory = useCallback(async (entry: HistoryEntry) => {
    if (!user?.id) return false;
    
    try {
      const { error: insertError } = await supabase
        .from('document_history')
        .insert({
          user_id: user.id,
          name: entry.name,
          category: entry.category,
          document_type: entry.documentType,
          file_url: entry.fileUrl,
          content: entry.content
        });
        
      if (insertError) throw insertError;
      
      fetchDocumentHistory(); // Refresh history after adding
      return true;
    } catch (error) {
      console.error("Error adding to document history:", error);
      return false;
    }
  }, [user, fetchDocumentHistory]);

  const deleteFromHistory = useCallback(async (documentId: string) => {
    if (!user?.id) return false;
    
    try {
      const { error: deleteError } = await supabase
        .from('document_history')
        .delete()
        .eq('id', documentId)
        .eq('user_id', user.id);
        
      if (deleteError) throw deleteError;
      
      fetchDocumentHistory(); // Refresh history after deletion
      return true;
    } catch (error) {
      console.error("Error deleting document:", error);
      return false;
    }
  }, [user, fetchDocumentHistory]);

  return {
    history,
    isLoading,
    error,
    fetchHistory: fetchDocumentHistory,
    fetchDocumentHistory,
    addToHistory,
    deleteFromHistory
  };
};
