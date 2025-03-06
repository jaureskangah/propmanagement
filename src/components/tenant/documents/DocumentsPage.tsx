
import { useState, useEffect, useRef } from "react";
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
    selectedCategory,
    setSelectedCategory,
    sortBy, 
    setSortBy, 
    sortOrder, 
    setSortOrder,
    fetchTenantData,
    handleDocumentUpdate,
    handleDeleteDocument,
    error
  } = useDocumentState(user, toast);

  const [selectedDocument, setSelectedDocument] = useState<TenantDocument | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  
  // Pour contrôler le sidebar
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Gestion des swipes
  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      touchEndX = e.touches[0].clientX;
    };
    
    const handleTouchEnd = () => {
      // Détection du swipe vers la droite
      if (touchEndX - touchStartX > 100) {
        // Contraction du sidebar
        setSidebarCollapsed(true);
      }
    };
    
    const container = containerRef.current;
    if (container) {
      container.addEventListener('touchstart', handleTouchStart);
      container.addEventListener('touchmove', handleTouchMove);
      container.addEventListener('touchend', handleTouchEnd);
    }
    
    return () => {
      if (container) {
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchmove', handleTouchMove);
        container.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, []);

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
      <AppSidebar isTenant={true} isCollapsed={sidebarCollapsed} setIsCollapsed={setSidebarCollapsed} />
      <div ref={containerRef} className="flex-1 container mx-auto p-4 md:p-6">
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
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            onViewDocument={handleViewDocument}
            onDeleteDocument={handleDeleteDocument}
            onDocumentUpdate={handleDocumentUpdate}
            error={error}
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
