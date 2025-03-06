
import { Card } from "@/components/ui/card";
import { DocumentTable } from "./DocumentTable";
import { DocumentsLoader } from "./DocumentsLoader";
import { DocumentEmptyState } from "./DocumentEmptyState";
import { ErrorState } from "./ErrorState";
import { TenantDocument } from "@/types/tenant";
import { useEffect } from "react";

interface DocumentsListProps {
  documents: TenantDocument[] | undefined;
  filteredDocuments: TenantDocument[] | undefined;
  isLoading: boolean;
  error?: Error;
  onViewDocument: (document: TenantDocument) => void;
  onDeleteDocument: (documentId: string, filename: string) => void;
  isMobile?: boolean;
}

export function DocumentsList({
  documents,
  filteredDocuments,
  isLoading,
  error,
  onViewDocument,
  onDeleteDocument,
  isMobile = false
}: DocumentsListProps) {
  // Log when documents data changes (for debugging)
  useEffect(() => {
    console.log("DocumentsList - Documents updated:", documents?.length);
    console.log("DocumentsList - Filtered documents:", filteredDocuments?.length);
  }, [documents, filteredDocuments]);

  // Loading state
  if (isLoading) {
    return <DocumentsLoader />;
  }

  // Error state
  if (error) {
    return <ErrorState error={error} />;
  }

  // Empty state
  if (!documents || documents.length === 0) {
    return <DocumentEmptyState />;
  }

  // No matches for filtered documents
  if (filteredDocuments && filteredDocuments.length === 0) {
    return (
      <Card className="p-8 text-center">
        <h3 className="text-lg font-medium mb-2">No matches found</h3>
        <p className="text-muted-foreground">
          Try changing your search terms or filters.
        </p>
      </Card>
    );
  }

  // Content
  return (
    <DocumentTable 
      documents={filteredDocuments || documents} 
      onViewDocument={onViewDocument}
      onDeleteDocument={onDeleteDocument}
      isMobile={isMobile}
    />
  );
}
