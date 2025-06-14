
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Loader2 } from "lucide-react";

interface DeleteTenantDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export const DeleteTenantDialog = ({
  isOpen,
  onClose,
  onConfirm,
  isDeleting = false,
}: DeleteTenantDialogProps) => {
  const { t } = useLocale();
  
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('confirmDelete')}</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est irréversible. Le locataire et toutes ses données associées seront supprimés définitivement.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            {t('cancel')}
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Suppression...
              </>
            ) : (
              'Supprimer'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
