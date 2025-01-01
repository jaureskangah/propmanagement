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
    const newStatus = status === "In Progress" ? "Completed" : "In Progress";
    
    const { error } = await supabase
      .from('vendor_interventions')
      .update({ status: newStatus })
      .eq('id', orderId);

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
      .eq('id', orderId);

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
        title: "Error",
        description: "Unable to duplicate work order",
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
        title: `${currentOrder.title} (copy)`,
        status: 'Scheduled',
        created_at: undefined, // Let Supabase set the timestamp
      });

    if (createError) {
      console.error("Error duplicating work order:", createError);
      toast({
        title: "Error",
        description: "Unable to duplicate work order",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Work order duplicated",
    });
    onDuplicate();
  };

  return (
    <div className="flex gap-2 mt-4">
      <Button variant="outline" size="sm" onClick={handleStatusChange}>
        <RefreshCw className="h-4 w-4 mr-2" />
        Change Status
      </Button>
      <Button variant="outline" size="sm" onClick={handleDuplicate}>
        <Copy className="h-4 w-4 mr-2" />
        Duplicate
      </Button>
      <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700" onClick={handleDelete}>
        <Trash2 className="h-4 w-4 mr-2" />
        Delete
      </Button>
    </div>
  );
};