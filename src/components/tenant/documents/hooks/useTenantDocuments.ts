
import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { TenantDocument } from "@/types/tenant";
import { encodeCorrectly, getStorageUrl } from "../utils/documentUtils";

// Fonction pour générer une URL directe vers le fichier
const generateDirectUrl = (tenantId: string, filename: string): string => {
  // Encoder le nom de fichier pour éviter les problèmes avec les caractères spéciaux
  const encodedFilename = encodeURIComponent(filename);
  const url = `https://jhjhzwbvmkurwfohjxlu.supabase.co/storage/v1/object/public/tenant_documents/${tenantId}/${encodedFilename}`;
  console.log(`Generated direct URL: ${url}`);
  return url;
};

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
      
      // Traiter chaque document pour garantir qu'il a une URL valide
      const processedDocs = data.map(doc => {
        // Ajouter tenant_id s'il manque pour faciliter la génération d'URL plus tard
        if (!doc.tenant_id) {
          doc.tenant_id = id;
        }
        
        // Si le document n'a pas d'URL ou a une URL invalide, générer une URL directe
        if (!doc.file_url || doc.file_url === "undefined" || doc.file_url === "null") {
          doc.file_url = generateDirectUrl(id, doc.name);
          console.log(`Generated URL for document ${doc.id}: ${doc.file_url}`);
        } else {
          console.log(`Document ${doc.id} already has URL: ${doc.file_url}`);
        }
        return doc;
      });
      
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
