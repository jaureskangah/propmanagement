
import { TenantDocument } from "@/types/tenant";
import { formatDate } from "@/lib/utils";
import { DocumentIcon } from "./DocumentIcon";
import { DocumentActions } from "./DocumentActions";
import { Tag } from "lucide-react";

interface DocumentRowProps {
  document: TenantDocument;
  onViewDocument: (document: TenantDocument) => void;
  onDeleteDocument: (documentId: string, filename: string) => void;
}

export const DocumentRow = ({ 
  document,
  onViewDocument,
  onDeleteDocument 
}: DocumentRowProps) => {
  const handleRowClick = () => {
    onViewDocument(document);
  };

  return (
    <>
      <td 
        className="px-4 py-4 cursor-pointer hover:bg-muted/25 transition-colors" 
        onClick={handleRowClick}
      >
        <div className="flex items-center gap-2">
          <DocumentIcon documentType={document.document_type} />
          <span className="font-medium truncate max-w-[200px]">
            {document.name}
          </span>
        </div>
      </td>
      <td 
        className="px-4 py-4 hidden md:table-cell cursor-pointer hover:bg-muted/25 transition-colors" 
        onClick={handleRowClick}
      >
        {document.category ? (
          <div className="flex items-center gap-1">
            <Tag className="h-3 w-3 text-slate-400" />
            <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
              {document.category.charAt(0).toUpperCase() + document.category.slice(1)}
            </span>
          </div>
        ) : (
          <span className="text-muted-foreground text-sm">—</span>
        )}
      </td>
      <td 
        className="px-4 py-4 hidden md:table-cell text-muted-foreground cursor-pointer hover:bg-muted/25 transition-colors" 
        onClick={handleRowClick}
      >
        {document.document_type || "Autre"}
      </td>
      <td 
        className="px-4 py-4 hidden md:table-cell text-muted-foreground cursor-pointer hover:bg-muted/25 transition-colors" 
        onClick={handleRowClick}
      >
        {formatDate(document.created_at)}
      </td>
      <td className="px-4 py-4 text-right">
        <DocumentActions 
          document={document}
          onViewDocument={onViewDocument}
          onDeleteDocument={onDeleteDocument}
        />
      </td>
    </>
  );
};
