
import { TenantDocument } from "@/types/tenant";
import { DocumentEmptyState } from "./DocumentEmptyState";
import { DocumentsLoader } from "./DocumentsLoader";
import { DocumentTable } from "./DocumentTable";
import { ErrorState } from "./ErrorState";
import { useDebugLogging } from "./useDebugLogging";

interface DocumentsListProps {
  documents: TenantDocument[];
  isLoading: boolean;
  onViewDocument: (document: TenantDocument) => void;
  onDeleteDocument: (documentId: string) => void;
}

export const DocumentsList = ({
  documents,
  isLoading,
  onViewDocument,
  onDeleteDocument
}: DocumentsListProps) => {
  // Use the debug logging hook
  useDebugLogging(documents, isLoading);
  
  if (isLoading) {
    return <DocumentsLoader />;
  }

  if (!documents || documents.length === 0) {
    return <DocumentEmptyState />;
  }

  // Check all documents have required properties
  const validDocuments = documents.filter(doc => doc && doc.id && doc.name);
  
  if (validDocuments.length === 0) {
    console.error("No valid documents found after filtering");
    return <ErrorState />;
  }

  return (
    <div className="rounded-md border bg-white dark:bg-slate-950">
      <DocumentTable 
        documents={validDocuments}
        onViewDocument={onViewDocument}
        onDeleteDocument={onDeleteDocument}
      />
    </div>
  );
};
