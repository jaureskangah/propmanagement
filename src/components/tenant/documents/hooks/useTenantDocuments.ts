
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
      
      // Check if storage bucket exists
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
        // Try to create the bucket if it doesn't exist
        try {
          console.log("Attempting to create tenant_documents bucket");
          const { error: createBucketError } = await supabase
            .storage
            .createBucket('tenant_documents', { public: true });
          
          if (createBucketError) {
            console.error("Error creating bucket:", createBucketError);
          } else {
            console.log("Successfully created tenant_documents bucket");
          }
        } catch (bucketCreateError) {
          console.error("Failed to create bucket:", bucketCreateError);
        }
      }
      
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
        
        return doc;
      }));
      
      console.log("Processed documents:", processedDocs);
      setDocuments(processedDocs);
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
    fetchDocuments,
    setDocuments
  };
};
