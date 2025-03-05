
import { useState, useEffect } from "react";
import AppSidebar from "@/components/AppSidebar";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { TenantDocument } from "@/types/tenant";
import { DocumentsHeader } from "./DocumentsHeader";
import { DocumentsTabs } from "./DocumentsTabs";
import { DocumentViewerDialog } from "./DocumentViewerDialog";
import { useDocumentState } from "./hooks/useDocumentState";
import { motion } from "framer-motion";

const DocumentsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { 
    documents, 
    filteredDocuments, 
    isLoading, 
    tenant, 
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
  } = useDocumentState(user, toast);

  const [selectedDocument, setSelectedDocument] = useState<TenantDocument | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  // Fetch tenant data only once when user is available
  useEffect(() => {
    if (user?.id) {
      console.log("DocumentsPage - Initial data fetch for user:", user.id);
      fetchTenantData();
    }
  }, [user?.id, fetchTenantData]);

  const handleViewDocument = (document: TenantDocument) => {
    setSelectedDocument(document);
    setViewerOpen(true);
  };

  return (
    <div className="flex">
      <AppSidebar isTenant={true} />
      <div className="flex-1 container mx-auto p-4 md:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <DocumentsHeader 
            tenant={tenant} 
            onDocumentUpdate={handleDocumentUpdate}
          />
          
          <DocumentsTabs
            documents={documents}
            filteredDocuments={filteredDocuments}
            isLoading={isLoading}
            tenant={tenant}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedDocType={selectedDocType}
            setSelectedDocType={setSelectedDocType}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            onViewDocument={handleViewDocument}
            onDeleteDocument={handleDeleteDocument}
            onDocumentUpdate={handleDocumentUpdate}
          />
        </motion.div>
        
        <DocumentViewerDialog 
          document={selectedDocument}
          open={viewerOpen}
          onOpenChange={setViewerOpen}
        />
      </div>
    </div>
  );
};

export default DocumentsPage;
