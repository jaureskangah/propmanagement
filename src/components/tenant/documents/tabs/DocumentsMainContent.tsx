
import { DocumentsList } from "../list/DocumentsList";
import { DocumentCategories } from "../list/DocumentCategories";
import { TenantDocument } from "@/types/tenant";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";

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
  const isMobileDevice = useIsMobile();
  const [isVerySmallScreen, setIsVerySmallScreen] = useState(false);
  
  useEffect(() => {
    const checkScreenSize = () => {
      setIsVerySmallScreen(window.innerWidth < 480);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-4 mt-6"
    >
      {/* Categories shown as horizontal scroll on smaller screens */}
      <DocumentCategories
        documents={documents}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        isCompact={isMobileDevice || isMobile}
      />
      
      {/* Main content */}
      <div className="flex-1 bg-gradient-to-br from-background to-muted/20 backdrop-blur-sm rounded-lg p-2 sm:p-4 border border-purple-100 dark:border-purple-800/30">
        <DocumentsList
          documents={documents}
          filteredDocuments={filteredDocuments}
          isLoading={isLoading}
          error={error}
          onViewDocument={onViewDocument}
          onDeleteDocument={onDeleteDocument}
          isMobile={isMobileDevice || isMobile}
        />
      </div>
    </motion.div>
  );
}
