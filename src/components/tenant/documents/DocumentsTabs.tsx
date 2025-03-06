
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TenantDocument } from "@/types/tenant";
import { Tenant } from "@/types/tenant";
import { useState, useEffect } from "react";
import { TabHeader } from "./tabs/TabHeader";
import { DocumentsMainContent } from "./tabs/DocumentsMainContent";
import { UploadTab } from "./tabs/UploadTab";

interface DocumentsTabsProps {
  documents: TenantDocument[] | undefined;
  filteredDocuments: TenantDocument[] | undefined;
  isLoading: boolean;
  tenant: Tenant | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedDocType: string;
  setSelectedDocType: (type: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (order: "asc" | "desc") => void;
  onViewDocument: (document: TenantDocument) => void;
  onDeleteDocument: (documentId: string, filename: string) => void;
  onDocumentUpdate: () => void;
  error?: Error;
}

export const DocumentsTabs = ({
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
  onViewDocument,
  onDeleteDocument,
  onDocumentUpdate,
  error
}: DocumentsTabsProps) => {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Set a timeout to prevent infinite loading state
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setLoadingTimeout(true);
      }, 10000); // 10 seconds timeout
      
      return () => clearTimeout(timer);
    } else {
      setLoadingTimeout(false);
    }
  }, [isLoading]);

  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return (
    <Tabs defaultValue="all" className="mt-6">
      <TabHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedDocType={selectedDocType}
        setSelectedDocType={setSelectedDocType}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        filtersOpen={filtersOpen}
        setFiltersOpen={setFiltersOpen}
        isMobile={isMobile}
      />

      <TabsContent value="all" className="mt-0">
        <DocumentsMainContent
          documents={documents}
          filteredDocuments={filteredDocuments}
          isLoading={isLoading && !loadingTimeout}
          error={error}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          onViewDocument={onViewDocument}
          onDeleteDocument={onDeleteDocument}
          isMobile={isMobile}
        />
      </TabsContent>

      <TabsContent value="upload" className="mt-0">
        <UploadTab 
          tenant={tenant} 
          onDocumentUpdate={onDocumentUpdate} 
        />
      </TabsContent>
    </Tabs>
  );
}
