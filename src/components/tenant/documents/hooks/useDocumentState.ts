
import { useCallback, useEffect, useState } from "react";
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
  const [isInitialized, setIsInitialized] = useState(false);
  const { tenant, isLoading: tenantLoading, fetchTenantData } = useTenantData(user?.id, toast);
  const { documents, isLoading: documentsLoading, fetchDocuments, setDocuments } = useTenantDocuments(tenant?.id || null, toast);
  const { filteredDocuments, searchQuery, setSearchQuery, selectedDocType, setSelectedDocType, sortBy, setSortBy, sortOrder, setSortOrder } = useDocumentFilters(documents);
  
  // Combine loading states
  const isLoading = tenantLoading || documentsLoading;

  // Initial fetch of tenant data when component mounts and user is available
  useEffect(() => {
    console.log("useDocumentState - User ID:", user?.id);
    if (user?.id && !isInitialized) {
      console.log("Fetching tenant data for user:", user.id);
      fetchTenantData().then(() => {
        setIsInitialized(true);
      });
    }
  }, [user, fetchTenantData, isInitialized]);

  // Fetch documents when tenant ID is available
  useEffect(() => {
    console.log("useDocumentState - Tenant ID:", tenant?.id, "Initialized:", isInitialized);
    if (tenant?.id && isInitialized) {
      console.log("Fetching documents for tenant:", tenant.id);
      fetchDocuments(tenant.id);
    } else if (isInitialized && !tenant?.id) {
      console.log("No tenant ID available to fetch documents");
    }
  }, [tenant?.id, fetchDocuments, isInitialized]);

  const handleDocumentUpdate = useCallback(() => {
    console.log("Document update requested");
    if (tenant?.id) {
      console.log("Refreshing documents for tenant:", tenant.id);
      fetchDocuments(tenant.id);
    } else {
      console.log("Cannot refresh documents - no tenant ID");
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
    handleDeleteDocument: (documentId: string, filename: string) => handleDeleteDocument(documentId, toast)
  };
};
