
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MaintenanceRequest } from "@/components/maintenance/types";
import { supabase } from "@/lib/supabase";
import { MaintenanceDetailsTab } from "./tabs/MaintenanceDetailsTab";
import { MaintenancePhotosTab } from "./tabs/MaintenancePhotosTab";
import { MaintenanceHistoryTab } from "./tabs/MaintenanceHistoryTab";
import { MaintenanceFeedbackTab } from "./tabs/MaintenanceFeedbackTab";
import { DirectMessaging } from "@/components/tenant/maintenance/components/DirectMessaging";
import { Communication } from "@/types/tenant";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/components/providers/LocaleProvider";

interface MaintenanceRequestDialogProps {
  request: MaintenanceRequest | null;
  onClose: () => void;
  onUpdate: () => void;
  open: boolean;
}

export const MaintenanceRequestDialog = ({
  request,
  onClose,
  onUpdate,
  open,
}: MaintenanceRequestDialogProps) => {
  const [activeTab, setActiveTab] = useState("details");
  const [tenantMessages, setTenantMessages] = useState<Communication[]>([]);
  const { t } = useLocale();
  const { toast } = useToast();

  // Reset active tab when a new request is selected
  useEffect(() => {
    if (request && open) {
      setActiveTab("details");
      console.log(`Dialog opened for request: ${request.id}`, { open });
      if (request.tenant_id) {
        fetchTenantMessages(request.tenant_id);
      }
    }
  }, [request, open]);

  const fetchTenantMessages = async (tenantId: string) => {
    try {
      console.log(`Fetching messages for tenant: ${tenantId}`);
      const { data, error } = await supabase
        .from('tenant_communications')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('category', 'maintenance')
        .order('created_at', { ascending: false })
        .limit(10);
        
      if (error) throw error;
      
      setTenantMessages(data || []);
      console.log(`Fetched ${data?.length || 0} tenant messages`);
    } catch (error) {
      console.error("Error fetching tenant messages:", error);
      toast({
        title: t('error'),
        description: t('errorLoadingMessages'),
        variant: "destructive",
      });
    }
  };

  const handleMaintenanceUpdate = () => {
    console.log("Updating maintenance data from dialog");
    onUpdate();
  };

  if (!request) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{request.issue}</DialogTitle>
          <DialogDescription>
            {t('maintenanceRequestDetails')}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="details">{t('details')}</TabsTrigger>
            <TabsTrigger value="photos">{t('photos')}</TabsTrigger>
            <TabsTrigger value="history">{t('history')}</TabsTrigger>
            <TabsTrigger value="feedback">{t('feedback')}</TabsTrigger>
            <TabsTrigger value="messages">{t('messages')}</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <MaintenanceDetailsTab 
              request={request} 
              onUpdate={handleMaintenanceUpdate} 
            />
          </TabsContent>

          <TabsContent value="photos">
            <MaintenancePhotosTab photos={request.photos || []} />
          </TabsContent>

          <TabsContent value="history">
            <MaintenanceHistoryTab requestId={request.id} />
          </TabsContent>

          <TabsContent value="feedback">
            <MaintenanceFeedbackTab 
              feedback={request.tenant_feedback || ""} 
              rating={request.tenant_rating || 0}
            />
          </TabsContent>
          
          <TabsContent value="messages">
            {request.tenant_id ? (
              <DirectMessaging 
                tenantId={request.tenant_id}
                onMessageSent={() => {
                  fetchTenantMessages(request.tenant_id!);
                  onUpdate();
                }}
                latestMessages={tenantMessages}
              />
            ) : (
              <div className="text-center p-6 text-gray-500">
                {t('noTenantAssociated')}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={onClose}>
            {t('close')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
