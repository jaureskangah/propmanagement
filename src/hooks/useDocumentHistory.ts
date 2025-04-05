
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { DocumentHistoryEntry } from "@/types/documentHistory";

export function useDocumentHistory() {
  const [history, setHistory] = useState<DocumentHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchDocumentHistory = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('document_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedHistory = data.map(item => ({
        id: item.id,
        name: item.name,
        category: item.category || 'miscDocuments',
        documentType: item.document_type || 'customDocument',
        fileUrl: item.file_url,
        content: item.content,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      }));

      setHistory(formattedHistory);
    } catch (err: any) {
      console.error("Error fetching document history:", err);
      setError(err?.message || "Failed to load document history");
      toast({
        title: "Error",
        description: "Failed to load document history",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addToHistory = async (document: Omit<DocumentHistoryEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user?.id) return null;

    try {
      const { data, error } = await supabase
        .from('document_history')
        .insert({
          user_id: user.id,
          name: document.name,
          category: document.category,
          document_type: document.documentType,
          file_url: document.fileUrl,
          content: document.content
        })
        .select()
        .single();

      if (error) throw error;

      // Update local state
      await fetchDocumentHistory();
      return data;
    } catch (err: any) {
      console.error("Error adding document to history:", err);
      toast({
        title: "Error",
        description: "Failed to save document to history",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteFromHistory = async (documentId: string) => {
    if (!user?.id) return false;

    try {
      const { error } = await supabase
        .from('document_history')
        .delete()
        .eq('id', documentId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local state
      setHistory(prev => prev.filter(doc => doc.id !== documentId));
      toast({
        title: "Success",
        description: "Document removed from history",
      });
      return true;
    } catch (err: any) {
      console.error("Error deleting document from history:", err);
      toast({
        title: "Error",
        description: "Failed to remove document from history",
        variant: "destructive",
      });
      return false;
    }
  };

  // Initial fetch when user is available
  useEffect(() => {
    if (user?.id) {
      fetchDocumentHistory();
    }
  }, [user?.id]);

  return {
    history,
    isLoading,
    error,
    fetchDocumentHistory,
    addToHistory,
    deleteFromHistory
  };
}
