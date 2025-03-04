
import { TenantDocument } from "@/types/tenant";
import { useLocale } from "@/components/providers/LocaleProvider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DocumentRow } from "./DocumentRow";

interface DocumentTableProps {
  documents: TenantDocument[];
  onViewDocument: (document: TenantDocument) => void;
  onDeleteDocument: (documentId: string) => void;
}

export const DocumentTable = ({ 
  documents, 
  onViewDocument, 
  onDeleteDocument 
}: DocumentTableProps) => {
  const { t } = useLocale();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("documentName") || "Nom du document"}</TableHead>
          <TableHead>{t("dateUploaded") || "Date d'ajout"}</TableHead>
          <TableHead className="text-right">{t("actions") || "Actions"}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {documents.map((doc) => (
          <DocumentRow 
            key={doc.id}
            document={doc} 
            onView={onViewDocument} 
            onDelete={onDeleteDocument} 
          />
        ))}
      </TableBody>
    </Table>
  );
};
