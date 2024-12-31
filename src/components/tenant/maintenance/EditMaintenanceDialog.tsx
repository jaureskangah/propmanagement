import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import type { MaintenanceRequest } from "@/types/tenant";

interface EditMaintenanceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  request: MaintenanceRequest;
  onSuccess: () => void;
}

export const EditMaintenanceDialog = ({
  isOpen,
  onClose,
  request,
  onSuccess,
}: EditMaintenanceDialogProps) => {
  const [issue, setIssue] = useState(request.issue);
  const [status, setStatus] = useState(request.status);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!issue.trim()) {
      toast({
        title: "Error",
        description: "Please describe the maintenance issue",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase
      .from("maintenance_requests")
      .update({
        issue: issue.trim(),
        status,
      })
      .eq("id", request.id);

    setIsSubmitting(false);

    if (error) {
      console.error("Error updating maintenance request:", error);
      toast({
        title: "Error",
        description: "Failed to update maintenance request",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Maintenance request updated successfully",
    });
    onSuccess();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Maintenance Request</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="issue">Issue Description</Label>
            <Textarea
              id="issue"
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              placeholder="Describe the maintenance issue..."
              className="min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#ea384c] hover:bg-[#ea384c]/90"
            >
              {isSubmitting ? "Updating..." : "Update Request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};