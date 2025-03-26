
import { useState } from "react";
import { MaintenanceRequest } from "@/components/maintenance/types";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";

interface MaintenanceDetailsTabProps {
  request: MaintenanceRequest;
  onUpdate: () => void;
}

export const MaintenanceDetailsTab = ({ request, onUpdate }: MaintenanceDetailsTabProps) => {
  const [status, setStatus] = useState(request.status);
  const [priority, setPriority] = useState(request.priority);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleUpdateRequest = async () => {
    setIsUpdating(true);
    
    try {
      const { error } = await supabase
        .from('maintenance_requests')
        .update({
          status,
          priority,
          updated_at: new Date().toISOString()
        })
        .eq('id', request.id);
        
      if (error) throw error;
      
      toast({
        title: "Request updated",
        description: "The maintenance request has been updated successfully."
      });
      
      onUpdate();
    } catch (error) {
      console.error("Error updating maintenance request:", error);
      toast({
        title: "Error",
        description: "Failed to update maintenance request.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Priority</Label>
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-4 bg-gray-50 p-4 rounded-md">
        <div>
          <span className="font-medium text-sm text-gray-500">Issue:</span>
          <p className="mt-1">{request.issue}</p>
        </div>
        
        <div>
          <span className="font-medium text-sm text-gray-500">Description:</span>
          <p className="mt-1">{request.description || "No description provided."}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="font-medium text-sm text-gray-500">Created:</span>
            <p className="mt-1">{formatDate(request.created_at)}</p>
          </div>
          
          <div>
            <span className="font-medium text-sm text-gray-500">Tenant Notified:</span>
            <p className="mt-1">{request.tenant_notified ? "Yes" : "No"}</p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={handleUpdateRequest} disabled={isUpdating}>
          {isUpdating ? "Updating..." : "Update Request"}
        </Button>
      </div>
    </div>
  );
};
