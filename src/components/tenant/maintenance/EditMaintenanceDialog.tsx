
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/components/providers/LocaleProvider";
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
  const { t } = useLocale();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!issue.trim()) {
      toast({
        title: t('error'),
        description: t('pleaseFillAllFields'),
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
        title: t('error'),
        description: t('errorUpdatingRequest'),
        variant: "destructive",
      });
      return;
    }

    toast({
      title: t('success'),
      description: t('maintenanceRequestUpdated'),
    });
    onSuccess();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('editMaintenanceRequest')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="issue">{t('description')}</Label>
            <Textarea
              id="issue"
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              placeholder={t('maintenanceDescriptionPlaceholder')}
              className="min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">{t('status')}</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder={t('status')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">{t('pending')}</SelectItem>
                <SelectItem value="In Progress">{t('inProgress')}</SelectItem>
                <SelectItem value="Resolved">{t('resolved')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              {t('cancel')}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#ea384c] hover:bg-[#ea384c]/90"
            >
              {isSubmitting ? t('updating') : t('updateRequest')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
