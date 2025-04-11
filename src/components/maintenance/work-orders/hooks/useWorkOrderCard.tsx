
import { useState } from "react";
import { WorkOrder } from "@/types/workOrder";
import { useSupabaseDelete } from "@/hooks/supabase/useSupabaseDelete";
import { useToast } from "@/hooks/use-toast";

interface UseWorkOrderCardProps {
  order: WorkOrder;
  onUpdate?: () => void;
  onDelete?: () => void;
}

export const useWorkOrderCard = ({ order, onUpdate, onDelete }: UseWorkOrderCardProps) => {
  const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  
  // Utiliser le hook useSupabaseDelete pour supprimer un ordre de travail
  const { mutate: deleteWorkOrder, isPending: isDeleting } = useSupabaseDelete('vendor_interventions', {
    successMessage: "Ordre de travail supprimé avec succès",
    onSuccess: () => {
      if (onDelete) onDelete();
      setIsDeleteDialogOpen(false);
    }
  });

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    deleteWorkOrder(order.id);
  };

  const handleStatusUpdate = () => {
    setIsEditDialogOpen(true);
  };

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false);
    
    if (onUpdate) {
      onUpdate();
    }
  };

  return {
    isPhotoDialogOpen,
    setIsPhotoDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isDeleting,
    handleDelete,
    confirmDelete,
    handleStatusUpdate,
    handleEditSuccess,
  };
};
