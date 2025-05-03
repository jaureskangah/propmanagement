
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
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/components/providers/LocaleProvider";
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
  const { toast } = useToast();
  const { t } = useLocale();

  const handleDelete = async () => {
    const { error } = await supabase
      .from("maintenance_requests")
      .delete()
      .eq("id", request.id);

    if (error) {
      console.error("Error deleting maintenance request:", error);
      toast({
        title: t('error'),
        description: t('errorDeletingRequest'),
        variant: "destructive",
      });
      return;
    }

    toast({
      title: t('success'),
      description: t('maintenanceRequestDeleted'),
    });
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
