
import { TenantDocument } from "@/types/tenant";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { DocumentIcon } from "./DocumentIcon";
import { DocumentActions } from "./DocumentActions";

interface DocumentRowProps {
  document: TenantDocument;
  onView: (document: TenantDocument) => void;
  onDelete: (documentId: string) => void;
}

export const DocumentRow = ({ document, onView, onDelete }: DocumentRowProps) => {
  return (
    <TableRow key={document.id} className="hover:bg-muted/50">
      <TableCell className="flex items-center gap-2 font-medium">
        <DocumentIcon document={document} />
        <span className="truncate max-w-[300px]" title={document.name}>
          {document.name}
        </span>
      </TableCell>
      <TableCell>
        {formatDate(document.created_at)}
      </TableCell>
      <TableCell className="text-right">
        <DocumentActions 
          document={document} 
          onView={onView} 
          onDelete={onDelete} 
        />
      </TableCell>
    </TableRow>
  );
};
