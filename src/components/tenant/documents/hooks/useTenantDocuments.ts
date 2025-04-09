
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
      
      // Process each document to ensure it has a URL
      const processedDocs = await Promise.all(data.map(async (doc) => {
        console.log("Processing document:", doc.id, doc.name);
        
        // Set tenant_id if not present, needed for URL generation
        if (!doc.tenant_id) {
          doc.tenant_id = id;
        }
        
        // Ensure document has a valid URL
        const docWithUrl = await ensureDocumentUrl(doc);
        console.log("Document after URL processing:", docWithUrl?.id, docWithUrl?.name, "URL:", docWithUrl?.file_url);
        return docWithUrl;
      }));
      
      console.log("Processed documents with URLs:", processedDocs.length);
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
