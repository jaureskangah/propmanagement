
import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { TenantDocument } from "@/types/tenant";

export const useTenantDocuments = (tenantId: string | null, toast: any) => {
  const [documents, setDocuments] = useState<TenantDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDocuments = useCallback(async (id: string) => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      console.log("Fetching documents for tenant:", id);
      
      const { data, error } = await supabase
        .from('tenant_documents')
        .select('*')
        .eq('tenant_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      console.log("Raw documents received:", data);
      
      // S'assurer que chaque document a un document_type
      const processedData = data?.map(doc => {
        if (!doc.document_type || doc.document_type === '') {
          // Déterminer le type de document s'il n'est pas spécifié
          const name = (doc.name || '').toLowerCase();
          let document_type: 'lease' | 'receipt' | 'other' = 'other';
          
          if (name.includes('lease') || name.includes('bail')) {
            document_type = 'lease';
          } else if (name.includes('receipt') || name.includes('reçu') || name.includes('payment')) {
            document_type = 'receipt';
          }
          
          // Mettre à jour le type de document dans la base de données
          console.log("Updating document type for doc:", doc.id, "to:", document_type);
          supabase
            .from('tenant_documents')
            .update({ document_type })
            .eq('id', doc.id)
            .then(({ error }) => {
              if (error) console.error('Error updating document type:', error);
            });
          
          return { ...doc, document_type };
        }
        return doc;
      }) || [];
      
      setDocuments(processedData);
      console.log("Processed documents:", processedData);
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

  // Polling pour vérifier si de nouveaux documents ont été ajoutés
  useEffect(() => {
    if (tenantId) {
      fetchDocuments(tenantId);
    }
  }, [tenantId, fetchDocuments]);

  return {
    documents,
    isLoading,
    fetchDocuments,
    setDocuments
  };
};
