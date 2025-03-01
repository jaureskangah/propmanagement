
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DocumentsFilters } from "./DocumentsFilters";
import { DocumentsList } from "./DocumentsList";
import { TenantDocument, Tenant } from "@/types/tenant";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useEffect } from "react";

interface DocumentsTabsProps {
  documents: TenantDocument[];
  filteredDocuments: TenantDocument[];
  isLoading: boolean;
  tenant: Tenant | null;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedDocType: string | null;
  setSelectedDocType: (value: string | null) => void;
  sortBy: "date" | "name";
  setSortBy: (value: "date" | "name") => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (value: "asc" | "desc") => void;
  onViewDocument: (document: TenantDocument) => void;
  onDeleteDocument: (documentId: string) => void;
  onDocumentUpdate: () => void;
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
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  onViewDocument,
  onDeleteDocument,
  onDocumentUpdate
}: DocumentsTabsProps) => {
  const { t } = useLocale();
  
  // Debug logs
  useEffect(() => {
    console.log("DocumentsTabs - Documents available:", documents?.length || 0);
    console.log("DocumentsTabs - Documents filtered:", filteredDocuments?.length || 0);
    console.log("DocumentsTabs - Documents sample:", documents?.slice(0, 2));
    
    if (documents?.length === 0) {
      console.log("No documents available");
    }
    
    if (documents?.length > 0 && filteredDocuments?.length === 0) {
      console.log("Documents available but no filtered documents");
      console.log("Current filters - Search:", searchQuery, "Type:", selectedDocType, "Sort:", sortBy, sortOrder);
    }
  }, [documents, filteredDocuments, searchQuery, selectedDocType, sortBy, sortOrder]);

  // Recent: the 5 most recent documents
  const recentDocuments = documents?.length 
    ? [...documents].sort((a, b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }).slice(0, 5)
    : [];
  
  console.log("Recent documents:", recentDocuments?.length || 0);

  return (
    <Tabs defaultValue="all" className="mt-6">
      <TabsList className="mb-4">
        <TabsTrigger value="all">{t("allDocuments") || "Tous les documents"}</TabsTrigger>
        <TabsTrigger value="recent">{t("recentlyUploaded") || "Récemment ajoutés"}</TabsTrigger>
      </TabsList>
      
      <TabsContent value="all" className="space-y-4">
        <DocumentsFilters 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedDocType={selectedDocType}
          setSelectedDocType={setSelectedDocType}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />
        
        <DocumentsList 
          documents={filteredDocuments || []}
          isLoading={isLoading}
          onViewDocument={onViewDocument}
          onDeleteDocument={onDeleteDocument}
        />
      </TabsContent>
      
      <TabsContent value="recent">
        <DocumentsList 
          documents={recentDocuments}
          isLoading={isLoading}
          onViewDocument={onViewDocument}
          onDeleteDocument={onDeleteDocument}
        />
      </TabsContent>
    </Tabs>
  );
};
