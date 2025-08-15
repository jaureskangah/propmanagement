import React from "react";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { useLocale } from "@/components/providers/LocaleProvider";
import { User, AlertTriangle } from "lucide-react";

interface UserDeleteConfirmationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isDeleting: boolean;
  userName: string;
  userEmail: string;
}

export const UserDeleteConfirmationDialog = ({
  isOpen,
  onOpenChange,
  onConfirm,
  isDeleting,
  userName,
  userEmail
}: UserDeleteConfirmationDialogProps) => {
  const { t } = useLocale();

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <AlertDialogTitle className="text-lg">
              {t('modal.deleteConfirmation', { fallback: 'Confirmer la suppression' })}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-left space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-primary/70 flex items-center justify-center text-white text-sm font-medium">
                <User className="h-4 w-4" />
              </div>
              <div>
                <div className="font-medium text-foreground">{userName}</div>
                <div className="text-sm text-muted-foreground">{userEmail}</div>
              </div>
            </div>
            <p className="text-sm">
              {t('confirmDeleteUser', { fallback: 'Êtes-vous sûr de vouloir supprimer cet utilisateur ?' })}
            </p>
            <p className="text-sm text-red-600 dark:text-red-400 font-medium">
              {t('modal.deleteWarning', { fallback: 'Cette action ne peut pas être annulée.' })}
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            {t('modal.cancel', { fallback: 'Annuler' })}
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                {t('modal.deleting', { fallback: 'Suppression...' })}
              </>
            ) : (
              t('modal.delete', { fallback: 'Supprimer' })
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};