
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MaintenanceRequest } from "@/components/maintenance/types";
import { useSupabaseUpdate } from "@/hooks/supabase/useSupabaseUpdate";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface MaintenanceDetailsTabProps {
  request: MaintenanceRequest;
  onUpdate: () => void;
}

export const MaintenanceDetailsTab = ({ request, onUpdate }: MaintenanceDetailsTabProps) => {
  const { t } = useLocale();
  const [status, setStatus] = useState(request.status);
  const [priority, setPriority] = useState(request.priority);
  const [isUpdating, setIsUpdating] = useState(false);
  const [notifyTenant, setNotifyTenant] = useState(false);
  const { toast } = useToast();

  const { mutate: updateRequest } = useSupabaseUpdate('maintenance_requests', {
    successMessage: t('requestUpdated'),
    onSuccess: (data) => {
      console.log("Request updated successfully:", data);
      
      if (notifyTenant && request.tenant_id) {
        handleNotifyTenant(data);
      } else {
        setIsUpdating(false);
        onUpdate();
      }
    },
  });

  const handleStatusChange = (value: string) => {
    console.log("Status changed to:", value);
    setStatus(value);
  };

  const handlePriorityChange = (value: string) => {
    console.log("Priority changed to:", value);
    setPriority(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting maintenance request update:", { status, priority });
    
    if (status === request.status && priority === request.priority) {
      console.log("No changes to update");
      return;
    }
    
    setIsUpdating(true);
    
    updateRequest({
      id: request.id,
      data: {
        status,
        priority,
        updated_at: new Date().toISOString(),
      },
    });
  };

  const handleNotifyTenant = async (updatedRequest: MaintenanceRequest) => {
    try {
      console.log("Notifying tenant about update:", updatedRequest);
      
      // Créer une notification pour le locataire
      const { error } = await supabase
        .from('tenant_communications')
        .insert({
          tenant_id: request.tenant_id,
          message: `Your maintenance request "${request.issue}" has been updated to ${status}`,
          category: 'maintenance',
          status: 'unread',
          sender: 'system',
          related_id: request.id,
        });

      if (error) throw error;
      
      // Mettre à jour le flag de notification
      const { error: updateError } = await supabase
        .from('maintenance_requests')
        .update({ tenant_notified: false })
        .eq('id', request.id);
        
      if (updateError) throw updateError;
      
      console.log("Tenant notification sent successfully");
      toast({
        title: t('notificationSent'),
        description: t('tenantNotified'),
      });
    } catch (error) {
      console.error("Error sending tenant notification:", error);
      toast({
        title: t('notificationFailed'),
        description: t('failedToSendNotification'),
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
      onUpdate();
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="status">{t('status')}</Label>
              <Select 
                value={status} 
                onValueChange={handleStatusChange}
                disabled={isUpdating}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder={t('selectStatus')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">{t('pending')}</SelectItem>
                  <SelectItem value="In Progress">{t('inProgress')}</SelectItem>
                  <SelectItem value="Resolved">{t('resolved')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="priority">{t('priority')}</Label>
              <Select 
                value={priority} 
                onValueChange={handlePriorityChange}
                disabled={isUpdating}
              >
                <SelectTrigger id="priority">
                  <SelectValue placeholder={t('selectPriority')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">{t('low')}</SelectItem>
                  <SelectItem value="Medium">{t('medium')}</SelectItem>
                  <SelectItem value="High">{t('high')}</SelectItem>
                  <SelectItem value="Urgent">{t('urgent')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="pt-4">
            <div className="flex items-center space-x-2 mb-4">
              <Switch 
                id="notify-tenant" 
                checked={notifyTenant} 
                onCheckedChange={setNotifyTenant}
                disabled={isUpdating || !request.tenant_id}
              />
              <Label htmlFor="notify-tenant">
                {t('notifyTenantAboutUpdate')}
              </Label>
            </div>
            
            <div className="prose max-w-none dark:prose-invert">
              <h4>{t('description')}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {request.description || t('noDescriptionProvided')}
              </p>
            </div>
            
            <div className="prose max-w-none dark:prose-invert mt-4">
              <h4>{t('created')}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(request.created_at).toLocaleString()}
              </p>
            </div>
            
            {request.updated_at && request.updated_at !== request.created_at && (
              <div className="prose max-w-none dark:prose-invert mt-4">
                <h4>{t('updated')}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(request.updated_at).toLocaleString()}
                </p>
              </div>
            )}
          </div>
          
          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? t('updating') : t('updateRequest')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
