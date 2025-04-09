
import React from "react";
import { TenantDocument } from "@/types/tenant";
import { DocumentListItem } from "./list/DocumentListItem";
import { EmptyDocumentsState } from "./EmptyDocumentsState";

interface DocumentListProps {
  documents: TenantDocument[];
  onDocumentUpdate: () => void;
  onDelete: (documentId: string, filename: string) => void;
}

export const DocumentList = ({ 
  documents, 
  onDocumentUpdate,
  onDelete 
}: DocumentListProps) => {
  if (documents.length === 0) {
    return <EmptyDocumentsState />;
  }
  
  return (
    <div className="space-y-4">
      {documents.map((doc) => (
        <DocumentListItem 
          key={doc.id}
          document={doc}
          onDocumentUpdate={onDocumentUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
