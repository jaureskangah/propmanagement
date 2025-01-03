import { FileText } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { TenantDocument } from "@/types/tenant";
import { DocumentActions } from "./DocumentActions";

interface DocumentListProps {
  documents: TenantDocument[];
  onDelete: (documentId: string, filename: string) => void;
}

export const DocumentList = ({ documents, onDelete }: DocumentListProps) => {
  console.log("Rendering document list with documents:", documents);

  return (
    <div className="space-y-4">
      {documents.map((doc) => {
        console.log("Document data:", {
          id: doc.id,
          name: doc.name,
          url: doc.file_url
        });

        return (
          <div
            key={doc.id}
            className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 text-blue-700">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">{doc.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(doc.created_at)}
                </p>
              </div>
            </div>
            <DocumentActions
              fileUrl={doc.file_url}
              fileName={doc.name}
              onDelete={() => onDelete(doc.id, doc.name)}
            />
          </div>
        );
      })}
    </div>
  );
};