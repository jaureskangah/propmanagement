
import { useState } from "react";
import { MaintenanceRequest } from "@/components/maintenance/types";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { formatDate } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useSupabaseUpdate } from "@/hooks/supabase/useSupabaseUpdate";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface MaintenanceDetailsTabProps {
  request: MaintenanceRequest;
  onUpdate: () => void;
}

export const MaintenanceDetailsTab = ({ request, onUpdate }: MaintenanceDetailsTabProps) => {
  const [status, setStatus] = useState(request.status);
  const [priority, setPriority] = useState(request.priority);
  const [notifyTenant, setNotifyTenant] = useState(false);
  const { toast } = useToast();
  const { t } = useLocale();

  // Utiliser le hook useSupabaseUpdate pour mettre à jour la demande de maintenance
  const { mutate: updateRequest, isPending: isUpdating } = useSupabaseUpdate('maintenance_requests', {
    successMessage: t('requestUpdated'),
    onSuccess: async (data) => {
      console.log("Maintenance request updated successfully:", data);
      
      // Si notification demandée, envoyer un email au locataire
      if (notifyTenant && request.tenant_id) {
        await sendStatusUpdate();
      }
      
      // Informer le parent de la mise à jour
      onUpdate();
    }
  });

  const sendStatusUpdate = async () => {
    if (!request.tenant_id || !notifyTenant) return;
    
    try {
      const { error } = await supabase.functions.invoke('send-tenant-email', {
        body: {
          tenantId: request.tenant_id,
          subject: `Maintenance Request Status Update: ${status}`,
          content: `Your maintenance request "${request.issue}" has been updated to status: ${status}. Priority: ${priority}.`,
          category: 'maintenance'
        }
      });
      
      if (error) throw error;
      
      toast({
        title: t('notificationSent'),
        description: t('tenantNotified')
      });
      
      return true;
    } catch (error) {
      console.error("Error sending notification:", error);
      toast({
        title: t('notificationFailed'),
        description: t('failedToSendNotification'),
        variant: "destructive"
      });
      
      return false;
    }
  };

  const handleUpdateRequest = () => {
    console.log("Attempting to update maintenance request with status:", status, "and priority:", priority);
    
    // Appeler la mutation pour mettre à jour la demande
    updateRequest({
      id: request.id,
      data: {
        status,
        priority,
        tenant_notified: notifyTenant,
        updated_at: new Date().toISOString()
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t('status')}</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pending">{t('pending')}</SelectItem>
              <SelectItem value="In Progress">{t('inProgress')}</SelectItem>
              <SelectItem value="Resolved">{t('resolved')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>{t('priority')}</Label>
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger>
              <SelectValue />
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
      
      <div className="space-y-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-md">
        <div>
          <span className="font-medium text-sm text-gray-500 dark:text-gray-400">{t('issue')}:</span>
          <p className="mt-1">{request.issue}</p>
        </div>
        
        <div>
          <span className="font-medium text-sm text-gray-500 dark:text-gray-400">{t('description')}:</span>
          <p className="mt-1">{request.description || t('noDescriptionProvided')}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="font-medium text-sm text-gray-500 dark:text-gray-400">{t('created')}:</span>
            <p className="mt-1">{formatDate(request.created_at)}</p>
          </div>
          
          <div>
            <span className="font-medium text-sm text-gray-500 dark:text-gray-400">{t('updated')}:</span>
            <p className="mt-1">{request.updated_at ? formatDate(request.updated_at) : t('notUpdatedYet')}</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="notify-tenant" 
          checked={notifyTenant}
          onCheckedChange={(checked) => setNotifyTenant(checked as boolean)}
        />
        <Label htmlFor="notify-tenant" className="cursor-pointer">
          {t('notifyTenantAboutUpdate')}
        </Label>
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={handleUpdateRequest} 
          disabled={isUpdating}
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
        >
          {isUpdating ? t('updating') : t('updateRequest')}
        </Button>
      </div>
    </div>
  );
};
