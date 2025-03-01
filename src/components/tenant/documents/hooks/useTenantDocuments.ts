
import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { TenantDocument } from "@/types/tenant";

export const useTenantDocuments = (tenantId: string | null, toast: any) => {
  const [documents, setDocuments] = useState<TenantDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDocuments = useCallback(async (id: string) => {
    if (!id) {
      console.log("No tenant ID provided for fetching documents");
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      console.log("Fetching documents for tenant:", id);
      
      // Vérifier d'abord si le bucket existe
      const { data: buckets, error: bucketsError } = await supabase
        .storage
        .listBuckets();
      
      if (bucketsError) {
        console.error("Error checking buckets:", bucketsError);
        throw bucketsError;
      }
      
      const bucketExists = buckets?.some(b => b.name === 'tenant_documents');
      console.log("Storage buckets:", buckets?.map(b => b.name), "tenant_documents exists:", bucketExists);
      
      if (!bucketExists) {
        console.warn("Tenant documents bucket does not exist!");
      }
      
      // Récupérer les documents
      const { data, error } = await supabase
        .from('tenant_documents')
        .select('*')
        .eq('tenant_id', id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching tenant documents:", error);
        throw error;
      }
      
      console.log("Raw documents received:", data?.length || 0, "documents");
      
      if (!data || data.length === 0) {
        console.log("No documents found for tenant:", id);
        setDocuments([]);
        setIsLoading(false);
        return;
      }
      
      // S'assurer que chaque document a un document_type
      const processedData = data.map(doc => {
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
              else console.log("Successfully updated document type");
            });
          
          return { ...doc, document_type };
        }
        return doc;
      });
      
      console.log("Processed documents:", processedData);
      setDocuments(processedData);
    } catch (error: any) {
      console.error('Error fetching documents:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos documents: " + (error.message || error),
        variant: "destructive",
      });
      setDocuments([]);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Exécuter fetchDocuments lorsque tenantId change
  useEffect(() => {
    if (tenantId) {
      console.log("TenantId changed, fetching documents for:", tenantId);
      fetchDocuments(tenantId);
    } else {
      console.log("No tenant ID available");
      setDocuments([]);
      setIsLoading(false);
    }
  }, [tenantId, fetchDocuments]);

  return {
    documents,
    isLoading,
    fetchDocuments,
    setDocuments
  };
};
