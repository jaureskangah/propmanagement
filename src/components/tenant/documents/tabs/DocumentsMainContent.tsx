
import { DocumentsList } from "../list/DocumentsList";
import { DocumentCategories } from "../list/DocumentCategories";
import { TenantDocument } from "@/types/tenant";
import { motion } from "framer-motion";

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
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col md:flex-row gap-4 mt-4 w-full"
    >
      {/* Categories sidebar - hidden on very small mobile screens */}
      {(!isMobile || window.innerWidth > 480) && (
        <div className="md:w-64 flex-shrink-0">
          <DocumentCategories
            documents={documents}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            isCompact={isMobile}
          />
        </div>
      )}
      
      {/* Main content */}
      <div className="flex-1 bg-gradient-to-br from-background to-muted/20 backdrop-blur-sm rounded-lg p-4 border border-purple-100 dark:border-purple-800/30">
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
    </motion.div>
  );
}
