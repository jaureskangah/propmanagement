import { Button } from "@/components/ui/button";
import { FileImage, CheckSquare, Trash2, RefreshCw, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { EditWorkOrderDialog } from "../EditWorkOrderDialog";
import { WorkOrder } from "@/types/workOrder";

interface WorkOrderActionsProps {
  order: WorkOrder;
  onStatusChange: () => void;
  onDelete: () => void;
  onUpdate: () => void;
}

export const WorkOrderActions = ({ 
  order,
  onStatusChange,
  onDelete,
  onUpdate
}: WorkOrderActionsProps) => {
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleStatusChange = async () => {
    const newStatus = order.status === "In Progress" ? "Completed" : "In Progress";
    
    const { error } = await supabase
      .from('vendor_interventions')
      .update({ status: newStatus })
      .eq('id', order.id);

    if (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Unable to update status",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: `Status updated: ${newStatus}`,
    });
    onStatusChange();
  };

  const handleDelete = async () => {
    const { error } = await supabase
      .from('vendor_interventions')
      .delete()
      .eq('id', order.id);

    if (error) {
      console.error("Error deleting work order:", error);
      toast({
        title: "Error",
        description: "Unable to delete work order",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Work order deleted",
    });
    onDelete();
  };

  return (
    <>
      <div className="flex gap-2 mt-4">
        <Button variant="outline" size="sm" onClick={handleStatusChange}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Change Status
        </Button>
        <Button variant="outline" size="sm" onClick={() => setIsEditDialogOpen(true)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700" onClick={handleDelete}>
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </div>

      <EditWorkOrderDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSuccess={onUpdate}
        workOrder={order}
      />
    </>
  );
};