
import { useCallback, useEffect } from "react";
import { useTenantData } from "./useTenantData";
import { useTenantDocuments } from "./useTenantDocuments";
import { useDocumentFilters } from "./useDocumentFilters";
import { useDocumentActions } from "./useDocumentActions";
import { useGenerationDocumentState } from "./useGenerationDocumentState";

// Export the useGenerationDocumentState hook for direct usage elsewhere
export { useGenerationDocumentState };

// For the documents page
export const useDocumentState = (
  user: any, 
  toast: any
) => {
  const { tenant, isLoading: tenantLoading, fetchTenantData } = useTenantData(user?.id, toast);
  const { documents, isLoading: documentsLoading, fetchDocuments } = useTenantDocuments(tenant?.id || null, toast);
  const { filteredDocuments, searchQuery, setSearchQuery, selectedDocType, setSelectedDocType, sortBy, setSortBy, sortOrder, setSortOrder } = useDocumentFilters(documents);
  
  // Combine loading states
  const isLoading = tenantLoading || documentsLoading;

  useEffect(() => {
    if (user) {
      fetchTenantData();
    }
  }, [user, fetchTenantData]);

  useEffect(() => {
    if (tenant?.id) {
      fetchDocuments(tenant.id);
    }
  }, [tenant, fetchDocuments]);

  const handleDocumentUpdate = useCallback(() => {
    if (tenant) {
      fetchDocuments(tenant.id);
    }
  }, [tenant, fetchDocuments]);

  const { handleDeleteDocument } = useDocumentActions(handleDocumentUpdate);

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
    handleDeleteDocument: (documentId: string) => handleDeleteDocument(documentId, toast)
  };
};
