
import { TenantDocument } from "@/types/tenant";
import { DocumentRow } from "./DocumentRow";
import { motion } from "framer-motion";

interface DocumentTableProps {
  documents: TenantDocument[];
  onViewDocument: (document: TenantDocument) => void;
  onDeleteDocument: (documentId: string, filename: string) => void;
}

export const DocumentTable = ({ 
  documents,
  onViewDocument,
  onDeleteDocument 
}: DocumentTableProps) => {
  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-sm font-medium text-left">Document</th>
              <th className="px-4 py-3 text-sm font-medium text-left hidden md:table-cell">Type</th>
              <th className="px-4 py-3 text-sm font-medium text-left hidden md:table-cell">Date</th>
              <th className="px-4 py-3 text-sm font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((document, index) => (
              <motion.tr
                key={document.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="border-b hover:bg-muted/50"
              >
                <DocumentRow 
                  document={document} 
                  onViewDocument={onViewDocument}
                  onDeleteDocument={onDeleteDocument}
                />
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
