
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/components/providers/LocaleProvider";

interface AddMaintenanceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tenantId: string;
  onSuccess: () => void;
}

export const AddMaintenanceDialog = ({
  isOpen,
  onClose,
  tenantId,
  onSuccess,
}: AddMaintenanceDialogProps) => {
  const [title, setTitle] = useState("");
  const [issue, setIssue] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { t } = useLocale();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!issue.trim()) {
      toast({
        title: t('error', { fallback: 'Error' }),
        description: t('pleaseFillAllFields', { fallback: 'Please fill all required fields' }),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase
      .from("maintenance_requests")
      .insert([
        {
          tenant_id: tenantId,
          title: title.trim() || issue.substring(0, 50) + "...",
          issue: issue.trim(),
          priority,
          status: "Pending"
        }
      ]);

    setIsSubmitting(false);

    if (error) {
      console.error("Error creating maintenance request:", error);
      toast({
        title: t('error', { fallback: 'Error' }),
        description: t('errorSubmittingRequest', { fallback: 'Error submitting maintenance request' }),
        variant: "destructive",
      });
      return;
    }

    toast({
      title: t('success', { fallback: 'Success' }),
      description: t('maintenanceRequestSubmitted', { fallback: 'Maintenance request submitted successfully' }),
    });
    
    setTitle("");
    setIssue("");
    setPriority("Medium");
    onSuccess();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('newMaintenanceRequest', { fallback: 'New Maintenance Request' })}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">{t('title', { fallback: 'Title' })}</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('maintenanceRequestTitlePlaceholder', { fallback: 'e.g., Water leak in bathroom' })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="issue">{t('description', { fallback: 'Description' })} *</Label>
            <Textarea
              id="issue"
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              placeholder={t('maintenanceDescriptionPlaceholder', { fallback: 'Describe the maintenance issue in detail...' })}
              className="min-h-[100px]"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="priority">{t('priority', { fallback: 'Priority' })}</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger>
                <SelectValue placeholder={t('selectPriority', { fallback: 'Select priority' })} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">{t('low', { fallback: 'Low' })}</SelectItem>
                <SelectItem value="Medium">{t('medium', { fallback: 'Medium' })}</SelectItem>
                <SelectItem value="High">{t('high', { fallback: 'High' })}</SelectItem>
                <SelectItem value="Urgent">{t('urgent', { fallback: 'Urgent' })}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              {t('cancel', { fallback: 'Cancel' })}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#ea384c] hover:bg-[#ea384c]/90"
            >
              {isSubmitting ? t('submitting', { fallback: 'Submitting...' }) : t('submitRequest', { fallback: 'Submit Request' })}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
