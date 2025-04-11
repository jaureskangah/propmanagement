
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { WorkOrder } from "@/types/workOrder";
import { useSupabaseUpdate } from "@/hooks/supabase/useSupabaseUpdate";

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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier le bon de travail</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title">Titre</label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description">Description</label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="status">Statut</label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Planifié">Planifié</SelectItem>
                <SelectItem value="En cours">En cours</SelectItem>
                <SelectItem value="Terminé">Terminé</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="priority">Priorité</label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Basse">Basse</SelectItem>
                <SelectItem value="Moyenne">Moyenne</SelectItem>
                <SelectItem value="Haute">Haute</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="cost">Coût</label>
            <Input
              id="cost"
              type="number"
              step="0.01"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Enregistrement..." : "Enregistrer les modifications"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
