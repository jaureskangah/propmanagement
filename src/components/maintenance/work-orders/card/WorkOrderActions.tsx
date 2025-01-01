import { Button } from "@/components/ui/button";
import { FileImage, CheckSquare, Trash2, Copy, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface WorkOrderActionsProps {
  orderId: string;
  status: string;
  onStatusChange: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export const WorkOrderActions = ({ 
  orderId, 
  status, 
  onStatusChange,
  onDelete,
  onDuplicate 
}: WorkOrderActionsProps) => {
  const { toast } = useToast();

  const handleStatusChange = async () => {
    const newStatus = status === "En cours" ? "Terminé" : "En cours";
    
    const { error } = await supabase
      .from('vendor_interventions')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Succès",
      description: `Statut mis à jour : ${newStatus}`,
    });
    onStatusChange();
  };

  const handleDelete = async () => {
    const { error } = await supabase
      .from('vendor_interventions')
      .delete()
      .eq('id', orderId);

    if (error) {
      console.error("Error deleting work order:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'ordre de travail",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Succès",
      description: "Ordre de travail supprimé",
    });
    onDelete();
  };

  const handleDuplicate = async () => {
    // Fetch the current work order data
    const { data: currentOrder, error: fetchError } = await supabase
      .from('vendor_interventions')
      .select('*')
      .eq('id', orderId)
      .single();

    if (fetchError) {
      console.error("Error fetching work order:", fetchError);
      toast({
        title: "Erreur",
        description: "Impossible de dupliquer l'ordre de travail",
        variant: "destructive",
      });
      return;
    }

    // Create a new work order with the same data
    const { error: createError } = await supabase
      .from('vendor_interventions')
      .insert({
        ...currentOrder,
        id: undefined, // Let Supabase generate a new ID
        title: `${currentOrder.title} (copie)`,
        status: 'Planifié',
        created_at: undefined, // Let Supabase set the timestamp
      });

    if (createError) {
      console.error("Error duplicating work order:", createError);
      toast({
        title: "Erreur",
        description: "Impossible de dupliquer l'ordre de travail",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Succès",
      description: "Ordre de travail dupliqué",
    });
    onDuplicate();
  };

  return (
    <div className="flex gap-2 mt-4">
      <Button variant="outline" size="sm" onClick={handleStatusChange}>
        <RefreshCw className="h-4 w-4 mr-2" />
        Changer statut
      </Button>
      <Button variant="outline" size="sm" onClick={handleDuplicate}>
        <Copy className="h-4 w-4 mr-2" />
        Dupliquer
      </Button>
      <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700" onClick={handleDelete}>
        <Trash2 className="h-4 w-4 mr-2" />
        Supprimer
      </Button>
    </div>
  );
};