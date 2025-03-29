
import { Button } from "@/components/ui/button";
import { WorkOrder } from "@/types/workOrder";
import { Edit, Trash2, CheckCircle, ArrowRightCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { supabase } from "@/lib/supabase";

interface WorkOrderActionsProps {
  order: WorkOrder;
  onStatusChange: () => void;
  onDelete: () => void;
  onUpdate: () => void;
}

export const WorkOrderActions = ({ order, onStatusChange, onDelete, onUpdate }: WorkOrderActionsProps) => {
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleStatusUpdate = async (newStatus: string) => {
    setIsUpdateLoading(true);
    try {
      const { error } = await supabase
        .from('vendor_interventions')
        .update({ status: newStatus })
        .eq('id', order.id);

      if (error) throw error;

      toast({
        title: "Statut mis à jour",
        description: `Le statut a été changé à "${newStatus}"`,
      });
      onStatusChange();
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
    } finally {
      setIsUpdateLoading(false);
    }
  };

  const getNextStatusAction = () => {
    if (order.status === "Scheduled" || order.status === "Planifié") {
      return (
        <Button 
          variant="outline" 
          size="sm" 
          className="border-blue-200 text-blue-700 hover:bg-blue-50" 
          onClick={() => handleStatusUpdate("In Progress")}
          disabled={isUpdateLoading}
        >
          <ArrowRightCircle className="h-3.5 w-3.5 mr-1" />
          Commencer
        </Button>
      );
    }
    
    if (order.status === "In Progress" || order.status === "En cours") {
      return (
        <Button 
          variant="outline" 
          size="sm" 
          className="border-green-200 text-green-700 hover:bg-green-50" 
          onClick={() => handleStatusUpdate("Completed")}
          disabled={isUpdateLoading}
        >
          <CheckCircle className="h-3.5 w-3.5 mr-1" />
          Terminer
        </Button>
      );
    }
    
    return null;
  };

  const confirmDelete = async () => {
    try {
      const { error } = await supabase
        .from('vendor_interventions')
        .delete()
        .eq('id', order.id);

      if (error) throw error;

      toast({
        title: "Supprimé",
        description: "Le bon de travail a été supprimé",
      });
      onDelete();
    } catch (error) {
      console.error("Error deleting work order:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le bon de travail",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className="flex items-center justify-between pt-2 mt-2 border-t border-gray-100">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 hover:bg-blue-50">
          <Edit className="h-3.5 w-3.5 mr-1" />
          Modifier
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-red-600 hover:text-red-800 hover:bg-red-50"
          onClick={() => setIsDeleteDialogOpen(true)}
        >
          <Trash2 className="h-3.5 w-3.5 mr-1" />
          Supprimer
        </Button>
      </div>
      
      {getNextStatusAction()}
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce bon de travail ? Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
