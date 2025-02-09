
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { WorkOrder } from "@/types/workOrder";

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
  const [cost, setCost] = useState(workOrder.cost.toString());
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Mise à jour du bon de travail...");

    try {
      toast({
        title: "Mise à jour en cours",
        description: "Traitement de vos modifications...",
      });

      const { error } = await supabase
        .from("vendor_interventions")
        .update({
          title,
          description,
          status,
          cost: parseFloat(cost),
        })
        .eq("id", workOrder.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Le bon de travail a été mis à jour avec succès",
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du bon de travail:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le bon de travail",
        variant: "destructive",
      });
    }
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
                <SelectItem value="Scheduled">Planifié</SelectItem>
                <SelectItem value="In Progress">En cours</SelectItem>
                <SelectItem value="Completed">Terminé</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="cost">Coût</label>
            <Input
              id="cost"
              type="number"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">
              Enregistrer les modifications
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
