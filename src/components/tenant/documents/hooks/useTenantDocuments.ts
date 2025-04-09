
import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { TenantDocument } from "@/types/tenant";
import { ensureDocumentUrl } from "../utils/documentUtils";

export const useTenantDocuments = (tenantId: string | null, toast: any) => {
  const [documents, setDocuments] = useState<TenantDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDocuments = useCallback(async (id: string) => {
    if (!id) {
      console.log("No tenant ID provided for fetching documents");
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      console.log("Fetching documents for tenant:", id);
      
      // Retrieve the documents metadata from the database
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
      
      // Process the documents and ensure each has a URL, document_type and category
      const processedDocs = await Promise.all(data.map(async (doc) => {
        // Ensure document has a valid URL
        const docWithUrl = await ensureDocumentUrl(doc);
        
        // Process document_type if missing
        if (!docWithUrl.document_type || docWithUrl.document_type === '') {
          // Determine document type if not specified
          const name = (docWithUrl.name || '').toLowerCase();
          let document_type: 'lease' | 'receipt' | 'other' = 'other';
          
          if (name.includes('lease') || name.includes('bail')) {
            document_type = 'lease';
          } else if (name.includes('receipt') || name.includes('reçu') || name.includes('payment')) {
            document_type = 'receipt';
          }
          
          // Update document type in the database
          console.log("Updating document type for doc:", docWithUrl.id, "to:", document_type);
          supabase
            .from('tenant_documents')
            .update({ document_type })
            .eq('id', docWithUrl.id)
            .then(({ error }) => {
              if (error) console.error('Error updating document type:', error);
              else console.log("Successfully updated document type");
            });
          
          docWithUrl.document_type = document_type;
        }
        
        // Ensure category exists
        if (!docWithUrl.category) {
          // Default to using document_type as category if available
          const category = docWithUrl.document_type || 'other';
          
          // Update category in the database
          console.log("Setting default category for doc:", docWithUrl.id, "to:", category);
          supabase
            .from('tenant_documents')
            .update({ category })
            .eq('id', docWithUrl.id)
            .then(({ error }) => {
              if (error) console.error('Error updating category:', error);
              else console.log("Successfully updated category");
            });
          
          docWithUrl.category = category;
        }
        
        return docWithUrl;
      }));
      
      console.log("Processed documents:", processedDocs);
      setDocuments(processedDocs);
    } catch (err: any) {
      console.error('Error fetching documents:', err);
      setError(err instanceof Error ? err : new Error(err.message || 'Unknown error'));
      toast({
        title: "Erreur",
        description: "Impossible de charger vos documents: " + (err.message || err),
        variant: "destructive",
      });
      setDocuments([]);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Execute fetchDocuments when tenantId changes
  useEffect(() => {
    console.log("useTenantDocuments - TenantId changed:", tenantId);
    if (tenantId) {
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
    error,
    fetchDocuments,
    setDocuments
  };
};
