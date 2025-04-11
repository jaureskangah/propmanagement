
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { WorkOrder } from "@/types/workOrder";
import { useSupabaseUpdate } from "@/hooks/supabase/useSupabaseUpdate";
import { BasicInfoFields } from "./form/BasicInfoFields";
import { StatusPriorityFields } from "./form/StatusPriorityFields";
import { CostField } from "./form/CostField";
import { DialogActions } from "./form/DialogActions";

interface EditWorkOrderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  workOrder: WorkOrder;
}

export const EditWorkOrderDialog = ({
  isOpen,
  onClose,
  onSuccess,
  workOrder,
}: EditWorkOrderDialogProps) => {
  const [title, setTitle] = useState(workOrder.title);
  const [description, setDescription] = useState(workOrder.description || "");
  const [status, setStatus] = useState(workOrder.status);
  const [priority, setPriority] = useState(workOrder.priority);
  const [cost, setCost] = useState(workOrder.cost.toString());
  const { toast } = useToast();

  // Réinitialiser les valeurs lorsque le workOrder change
  useEffect(() => {
    if (isOpen) {
      setTitle(workOrder.title);
      setDescription(workOrder.description || "");
      setStatus(workOrder.status);
      setPriority(workOrder.priority);
      setCost(workOrder.cost.toString());
    }
  }, [workOrder, isOpen]);

  const { mutate: updateWorkOrder, isPending } = useSupabaseUpdate('vendor_interventions', {
    successMessage: "Le bon de travail a été mis à jour avec succès",
    onSuccess: () => {
      onSuccess();
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    updateWorkOrder({
      id: workOrder.id,
      data: {
        title,
        description,
        status,
        priority,
        cost: parseFloat(cost)
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Modifier le bon de travail</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4" onClick={(e) => e.stopPropagation()}>
          <BasicInfoFields 
            title={title} 
            setTitle={setTitle} 
            description={description} 
            setDescription={setDescription} 
          />

          <StatusPriorityFields 
            status={status} 
            setStatus={setStatus} 
            priority={priority} 
            setPriority={setPriority} 
          />

          <CostField cost={cost} setCost={setCost} />

          <DialogActions onClose={onClose} isPending={isPending} />
        </form>
      </DialogContent>
    </Dialog>
  );
};
