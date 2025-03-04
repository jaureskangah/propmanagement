
import { Download, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/components/providers/LocaleProvider";
import { TenantDocument } from "@/types/tenant";
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

interface DocumentActionsProps {
  document: TenantDocument;
  onView: (document: TenantDocument) => void;
  onDelete: (documentId: string) => void;
}

export const DocumentActions = ({ document, onView, onDelete }: DocumentActionsProps) => {
  const { t } = useLocale();

  return (
    <div className="flex justify-end gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onView(document)}
        title={t("openDocument") || "Ouvrir le document"}
      >
        <Eye className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          if (document.file_url) {
            console.log("Opening document URL:", document.file_url);
            window.open(document.file_url, '_blank');
          } else {
            console.error("No file_url available for document:", document.id);
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
              onClick={() => onDelete(document.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              {t("confirmDeleteDocument") || "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
