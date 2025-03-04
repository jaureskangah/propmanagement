
import { TenantDocument } from "@/types/tenant";
import { DocumentsLoader } from "./DocumentsLoader";
import { ErrorState } from "./ErrorState";
import { DocumentEmptyState } from "./DocumentEmptyState";
import { DocumentTable } from "./DocumentTable";
import { useDebugLogging } from "./useDebugLogging";
import { motion } from "framer-motion";

interface DocumentsListProps {
  documents: TenantDocument[] | undefined;
  filteredDocuments: TenantDocument[] | undefined;
  isLoading: boolean;
  error?: Error | null;
  onViewDocument: (document: TenantDocument) => void;
  onDeleteDocument: (documentId: string, filename: string) => void;
}

export const DocumentsList = ({
  documents,
  filteredDocuments,
  isLoading,
  error,
  onViewDocument,
  onDeleteDocument
}: DocumentsListProps) => {
  // Hook to log document-related debug information
  useDebugLogging(documents, isLoading);

  // Show loading state
  if (isLoading) {
    return <DocumentsLoader />;
  }

  // Show error state
  if (error) {
    console.error("Error loading documents:", error);
    return <ErrorState />;
  }

  // Show empty state if no documents available
  if (!documents || documents.length === 0) {
    return <DocumentEmptyState />;
  }

  // Show empty search results
  if (filteredDocuments && filteredDocuments.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-lg"
      >
        <p className="text-muted-foreground">Aucun document ne correspond à votre recherche</p>
      </motion.div>
    );
  }

  // Show document table with filtered or all documents
  return (
    <DocumentTable 
      documents={filteredDocuments || documents} 
      onViewDocument={onViewDocument}
      onDeleteDocument={onDeleteDocument}
    />
  );
};
