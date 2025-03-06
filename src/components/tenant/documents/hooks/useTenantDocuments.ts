
import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { TenantDocument } from "@/types/tenant";

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
      
      // Skip the bucket check as we've already set it up in the database
      // and focus on fetching the documents
      
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
      
      // Process the documents and ensure each has a document_type and file_url
      const processedDocs = await Promise.all(data.map(async (doc) => {
        // If document doesn't have a file_url, try to generate a signed URL
        if (!doc.file_url && doc.name) {
          try {
            console.log("Generating signed URL for document:", doc.id, doc.name);
            
            // Assume the file path is the document id with the extension from the name
            const fileExt = doc.name.split('.').pop() || '';
            const filePath = `${doc.id}.${fileExt}`;
            
            const { data: urlData, error: urlError } = await supabase
              .storage
              .from('tenant_documents')
              .createSignedUrl(filePath, 60 * 60); // 1 hour expiry
            
            if (urlError) {
              console.error("Error creating signed URL:", urlError);
            } else if (urlData) {
              console.log("Generated signed URL for document:", doc.id);
              doc.file_url = urlData.signedUrl;
              
              // Update the document in the database with the new URL
              await supabase
                .from('tenant_documents')
                .update({ file_url: urlData.signedUrl })
                .eq('id', doc.id);
            }
          } catch (urlGenError) {
            console.error("Failed to generate URL for document:", doc.id, urlGenError);
          }
        }
        
        // Process document_type if missing
        if (!doc.document_type || doc.document_type === '') {
          // Determine document type if not specified
          const name = (doc.name || '').toLowerCase();
          let document_type: 'lease' | 'receipt' | 'other' = 'other';
          
          if (name.includes('lease') || name.includes('bail')) {
            document_type = 'lease';
          } else if (name.includes('receipt') || name.includes('reçu') || name.includes('payment')) {
            document_type = 'receipt';
          }
          
          // Update document type in the database
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
        
        // Ensure category exists
        if (!doc.category) {
          // Default to using document_type as category if available
          const category = doc.document_type || 'other';
          
          // Update category in the database
          console.log("Setting default category for doc:", doc.id, "to:", category);
          supabase
            .from('tenant_documents')
            .update({ category })
            .eq('id', doc.id)
            .then(({ error }) => {
              if (error) console.error('Error updating category:', error);
              else console.log("Successfully updated category");
            });
          
          return { ...doc, category };
        }
        
        return doc;
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
