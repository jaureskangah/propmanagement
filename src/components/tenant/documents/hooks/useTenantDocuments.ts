
import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { TenantDocument } from "@/types/tenant";

export const useTenantDocuments = (tenantId: string | null, toast: any) => {
  const [documents, setDocuments] = useState<TenantDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDocuments = useCallback(async (id: string) => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('tenant_documents')
        .select('*')
        .eq('tenant_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Handle documents that don't have document_type field yet
      const processedData = data?.map(doc => {
        if (!doc.document_type) {
          // Determine document type if not specified
          const name = doc.name.toLowerCase();
          let document_type: 'lease' | 'receipt' | 'other' = 'other';
          
          if (name.includes('lease') || name.includes('bail')) {
            document_type = 'lease';
          } else if (name.includes('receipt') || name.includes('reçu') || name.includes('payment')) {
            document_type = 'receipt';
          }
          
          return { ...doc, document_type };
        }
        return doc;
      }) || [];
      
      setDocuments(processedData);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos documents",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    documents,
    isLoading,
    fetchDocuments,
    setDocuments
  };
};
