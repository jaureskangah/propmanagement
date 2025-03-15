
import { TenantDocument } from "@/types/tenant";
import { DocumentRow } from "./DocumentRow";
import { motion } from "framer-motion";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useIsMobile } from "@/hooks/use-mobile";
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
  const isMobileDevice = useIsMobile();
  const actualIsMobile = isMobile || isMobileDevice;
  
  return (
    <div className="overflow-hidden rounded-lg border bg-background/70 backdrop-blur-sm shadow-sm border-purple-100 dark:border-purple-800/30">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b bg-purple-50/50 dark:bg-purple-900/20">
              <TableHead className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm w-[70%] md:w-[65%]">{t("document")}</TableHead>
              <TableHead className="px-4 py-3 text-sm w-[15%] hidden md:table-cell">{t("dateUploaded")}</TableHead>
              <TableHead className="px-1 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-right w-[30%] md:w-[20%]">{t("actions")}</TableHead>
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
                  isMobile={actualIsMobile}
                />
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
