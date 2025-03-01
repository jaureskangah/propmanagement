
import { Download, Eye, Trash2, FileText, FilePdf, FileImage } from "lucide-react";
import { TenantDocument } from "@/types/tenant";
import { formatDate } from "@/lib/utils";
import { useLocale } from "@/components/providers/LocaleProvider";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
  const { t } = useLocale();

  const getDocumentIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    
    if (lowerName.endsWith('.pdf')) {
      return <FilePdf className="h-5 w-5 text-red-500" />;
    } else if (lowerName.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
      return <FileImage className="h-5 w-5 text-blue-500" />;
    } else {
      return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-lg"
      >
        <FileText className="h-12 w-12 text-muted-foreground mb-3 opacity-40" />
        <p className="text-muted-foreground">{t("noDocuments")}</p>
      </motion.div>
    );
  }

  return (
    <div className="rounded-md border bg-white dark:bg-slate-950">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("documentName")}</TableHead>
            <TableHead>{t("dateUploaded")}</TableHead>
            <TableHead className="text-right">{t("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc, index) => (
            <TableRow key={doc.id} className="hover:bg-muted/50">
              <TableCell className="flex items-center gap-2 font-medium">
                {getDocumentIcon(doc.name)}
                <span className="truncate max-w-[300px]" title={doc.name}>
                  {doc.name}
                </span>
              </TableCell>
              <TableCell>
                {formatDate(doc.created_at)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onViewDocument(doc)}
                    title={t("openDocument")}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (doc.file_url) {
                        window.open(doc.file_url, '_blank');
                      }
                    }}
                    title={t("downloadDocument")}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                        title={t("confirmDeleteDocument")}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{t("confirmDeleteDocument")}</AlertDialogTitle>
                        <AlertDialogDescription>
                          {t("documentDeleteWarning")}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDeleteDocument(doc.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
