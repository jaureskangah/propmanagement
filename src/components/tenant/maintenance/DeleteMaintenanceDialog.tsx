
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
import { supabase } from "@/lib/supabase";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useNotification } from "@/hooks/useNotification";
import type { MaintenanceRequest } from "@/types/tenant";

interface DeleteMaintenanceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  request: MaintenanceRequest;
  onSuccess: () => void;
}

export const DeleteMaintenanceDialog = ({
  isOpen,
  onClose,
  request,
  onSuccess,
}: DeleteMaintenanceDialogProps) => {
  const { t } = useLocale();
  const notification = useNotification();

  const handleDelete = async () => {
    const { error } = await supabase
      .from("maintenance_requests")
      .delete()
      .eq("id", request.id);

    if (error) {
      console.error("Error deleting maintenance request:", error);
      notification.error(t('errorDeletingRequest'));
      return;
    }

    notification.success(t('maintenanceRequestDeleted'));
    onSuccess();
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('deleteMaintenanceRequest')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('confirmDelete')} {t('thisCantBeUndone')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600"
          >
            {t('delete', { fallback: 'Delete' })}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
