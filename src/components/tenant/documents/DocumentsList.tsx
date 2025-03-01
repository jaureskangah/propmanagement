
import { Download, Eye, Trash2, FileText, File, FileImage } from "lucide-react";
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
import { useEffect } from "react";

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

  // Debug logging
  useEffect(() => {
    console.log("DocumentsList - Documents:", documents?.length);
    console.log("DocumentsList - Loading:", isLoading);
    if (documents?.length > 0) {
      console.log("DocumentsList - First document sample:", documents[0]);
      
      // Check if any document is missing file_url
      const missingUrl = documents.filter(doc => !doc.file_url);
      if (missingUrl.length > 0) {
        console.warn("Documents missing file_url:", missingUrl.length);
        console.warn("First missing URL document:", missingUrl[0]);
      }
    }
  }, [documents, isLoading]);

  const getDocumentIcon = (document: TenantDocument) => {
    const lowerName = (document?.name || '').toLowerCase();
    
    // First check document_type
    if (document?.document_type === 'lease') {
      return <FileText className="h-5 w-5 text-blue-500" />;
    } else if (document?.document_type === 'receipt') {
      return <FileText className="h-5 w-5 text-green-500" />;
    }
    
    // Fallback to file extension
    if (lowerName.endsWith('.pdf')) {
      return <File className="h-5 w-5 text-red-500" />;
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

  if (!documents || documents.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-lg"
      >
        <FileText className="h-12 w-12 text-muted-foreground mb-3 opacity-40" />
        <p className="text-muted-foreground">{t("noDocuments") || "Aucun document disponible"}</p>
      </motion.div>
    );
  }

  // Check all documents have required properties
  const validDocuments = documents.filter(doc => doc && doc.id && doc.name);
  
  if (validDocuments.length === 0) {
    console.error("No valid documents found after filtering");
    return (
      <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-lg">
        <FileText className="h-12 w-12 text-red-500 mb-3 opacity-40" />
        <p className="text-red-500">Erreur de chargement des documents</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-white dark:bg-slate-950">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("documentName") || "Nom du document"}</TableHead>
            <TableHead>{t("dateUploaded") || "Date d'ajout"}</TableHead>
            <TableHead className="text-right">{t("actions") || "Actions"}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {validDocuments.map((doc) => (
            <TableRow key={doc.id} className="hover:bg-muted/50">
              <TableCell className="flex items-center gap-2 font-medium">
                {getDocumentIcon(doc)}
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
                    title={t("openDocument") || "Ouvrir le document"}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (doc.file_url) {
                        console.log("Opening document URL:", doc.file_url);
                        window.open(doc.file_url, '_blank');
                      } else {
                        console.error("No file_url available for document:", doc.id);
                        alert("URL du document non disponible");
                      }
                    }}
                    title={t("downloadDocument") || "Télécharger"}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                        title={t("confirmDeleteDocument") || "Confirmer la suppression"}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{t("confirmDeleteDocument") || "Supprimer le document"}</AlertDialogTitle>
                        <AlertDialogDescription>
                          {t("documentDeleteWarning") || "Êtes-vous sûr de vouloir supprimer ce document ?"}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{t("cancel") || "Annuler"}</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDeleteDocument(doc.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {t("deleteSuccess") || "Supprimer"}
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
