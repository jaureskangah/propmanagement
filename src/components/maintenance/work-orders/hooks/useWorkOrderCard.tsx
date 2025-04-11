
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
    deleteWorkOrder(order.id);
  };

  const handleStatusUpdate = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsEditDialogOpen(true);
  };

  const handleEditSuccess = () => {
    // Fermer le dialogue d'édition
    setIsEditDialogOpen(false);
    
    // Notifier le composant parent que des modifications ont été effectuées
    if (onUpdate) {
      onUpdate();
    }
    
    // Afficher un toast de confirmation
    toast({
      title: "Modifications enregistrées",
      description: "Les modifications ont été appliquées avec succès",
    });
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
    handleStatusUpdate,
    handleEditSuccess,
  };
};
