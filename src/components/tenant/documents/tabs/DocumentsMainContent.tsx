
import { DocumentsList } from "../list/DocumentsList";
import { DocumentCategories } from "../list/DocumentCategories";
import { TenantDocument } from "@/types/tenant";

interface DocumentsMainContentProps {
  documents: TenantDocument[] | undefined;
  filteredDocuments: TenantDocument[] | undefined;
  isLoading: boolean;
  error?: Error;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  onViewDocument: (document: TenantDocument) => void;
  onDeleteDocument: (documentId: string, filename: string) => void;
  isMobile?: boolean;
}

export function DocumentsMainContent({
  documents,
  filteredDocuments,
  isLoading,
  error,
  selectedCategory,
  setSelectedCategory,
  onViewDocument,
  onDeleteDocument,
  isMobile = false
}: DocumentsMainContentProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mt-6">
      {/* Categories sidebar - hidden on very small mobile screens */}
      {(!isMobile || window.innerWidth > 480) && (
        <DocumentCategories
          documents={documents}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          isCompact={isMobile}
        />
      )}
      
      {/* Main content */}
      <div className="flex-1">
        <DocumentsList
          documents={documents}
          filteredDocuments={filteredDocuments}
          isLoading={isLoading}
          error={error}
          onViewDocument={onViewDocument}
          onDeleteDocument={onDeleteDocument}
          isMobile={isMobile}
        />
      </div>
    </div>
  );
}
