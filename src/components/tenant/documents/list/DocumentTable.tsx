
import { TenantDocument } from "@/types/tenant";
import { DocumentRow } from "./DocumentRow";
import { motion } from "framer-motion";
import { useLocale } from "@/components/providers/LocaleProvider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DocumentTableProps {
  documents: TenantDocument[];
  onViewDocument: (document: TenantDocument) => void;
  onDeleteDocument: (documentId: string, filename: string) => void;
  isMobile?: boolean;
}

export const DocumentTable = ({ 
  documents,
  onViewDocument,
  onDeleteDocument,
  isMobile = false
}: DocumentTableProps) => {
  const { t } = useLocale();
  
  return (
    <div className="overflow-hidden rounded-lg border bg-background/70 backdrop-blur-sm shadow-sm border-purple-100 dark:border-purple-800/30">
      <Table>
        <TableHeader>
          <TableRow className="border-b bg-purple-50/50 dark:bg-purple-900/20">
            <TableHead className="w-[70%]">{t("document")}</TableHead>
            <TableHead className="w-[30%] hidden md:table-cell text-right">{t("dateUploaded")}</TableHead>
            <TableHead className="text-right">{t("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((document, index) => (
            <motion.tr
              key={document.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="border-b hover:bg-purple-50/30 dark:hover:bg-purple-900/10 transition-colors"
            >
              <DocumentRow 
                document={document} 
                onViewDocument={onViewDocument}
                onDeleteDocument={onDeleteDocument}
                isMobile={isMobile}
              />
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
