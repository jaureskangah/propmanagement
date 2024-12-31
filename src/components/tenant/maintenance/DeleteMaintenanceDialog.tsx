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

  const handleDelete = async () => {
    const { error } = await supabase
      .from("maintenance_requests")
      .delete()
      .eq("id", request.id);

    if (error) {
      console.error("Error deleting maintenance request:", error);
      toast({
        title: "Error",
        description: "Failed to delete maintenance request",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Maintenance request deleted successfully",
    });
    onSuccess();
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Maintenance Request</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this maintenance request? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};