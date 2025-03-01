
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { TenantDocument, Tenant } from "@/types/tenant";
import { ToastAction } from "@/components/ui/toast";
import { useLocale } from "@/components/providers/LocaleProvider";

// For the document generator
export const useGenerationDocumentState = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPdfUrl, setGeneratedPdfUrl] = useState<string | null>(null);
  
  const cleanup = () => {
    if (generatedPdfUrl) {
      URL.revokeObjectURL(generatedPdfUrl);
      setGeneratedPdfUrl(null);
    }
    setSelectedTemplate("");
  };

  return {
    selectedTemplate,
    setSelectedTemplate,
    isGenerating,
    setIsGenerating,
    generatedPdfUrl,
    setGeneratedPdfUrl,
    cleanup,
  };
};

// For the documents page
export const useDocumentState = (
  user: any, 
  toast: any
) => {
  const { t } = useLocale();
  const [documents, setDocuments] = useState<TenantDocument[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<TenantDocument[]>([]);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDocType, setSelectedDocType] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"date" | "name">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const fetchTenantData = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data: tenantData, error: tenantError } = await supabase
        .from('tenants')
        .select('*')
        .eq('tenant_profile_id', user?.id)
        .single();

      if (tenantError) throw tenantError;
      
      if (tenantData) {
        setTenant(tenantData);
        await fetchDocuments(tenantData.id);
      } else {
        toast({
          title: "Non lié",
          description: "Votre compte n'est pas lié à un profil locataire",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching tenant data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos données de locataire",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  }, [user, toast]);

  const fetchDocuments = async (tenantId: string) => {
    try {
      const { data, error } = await supabase
        .from('tenant_documents')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setDocuments(data || []);
      setFilteredDocuments(data || []);
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
  };

  useEffect(() => {
    if (documents.length > 0) {
      applyFilters();
    }
  }, [documents, searchQuery, selectedDocType, sortBy, sortOrder]);

  const applyFilters = () => {
    let filtered = [...documents];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(doc => 
        doc.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply document type filter
    if (selectedDocType) {
      filtered = filtered.filter(doc => {
        const lowerName = doc.name.toLowerCase();
        if (selectedDocType === "lease") {
          return lowerName.includes("lease") || lowerName.includes("bail");
        } else if (selectedDocType === "receipt") {
          return lowerName.includes("receipt") || lowerName.includes("reçu") || lowerName.includes("payment");
        } else {
          return !lowerName.includes("lease") && !lowerName.includes("bail") && 
                 !lowerName.includes("receipt") && !lowerName.includes("reçu") && 
                 !lowerName.includes("payment");
        }
      });
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === "date") {
        return sortOrder === "asc" 
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else {
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
    });
    
    setFilteredDocuments(filtered);
  };

  const handleDocumentUpdate = useCallback(() => {
    if (tenant) {
      fetchDocuments(tenant.id);
    }
  }, [tenant]);

  const handleDeleteDocument = async (documentId: string) => {
    try {
      const { error } = await supabase
        .from('tenant_documents')
        .delete()
        .eq('id', documentId);

      if (error) throw error;
      
      toast({
        title: "Succès",
        description: t("docDeleteSuccess"),
      });
      
      handleDocumentUpdate();
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le document",
        variant: "destructive",
      });
    }
  };

  return {
    documents,
    filteredDocuments,
    tenant,
    isLoading,
    searchQuery,
    setSearchQuery,
    selectedDocType,
    setSelectedDocType,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    fetchTenantData,
    handleDocumentUpdate,
    handleDeleteDocument
  };
};
