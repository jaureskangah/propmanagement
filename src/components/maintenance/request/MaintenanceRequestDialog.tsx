
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MaintenanceRequest } from "@/components/maintenance/types";
import { supabase } from "@/lib/supabase";
import { MaintenanceDetailsTab } from "./tabs/MaintenanceDetailsTab";
import { MaintenancePhotosTab } from "./tabs/MaintenancePhotosTab";
import { MaintenanceHistoryTab } from "./tabs/MaintenanceHistoryTab";
import { MaintenanceFeedbackTab } from "./tabs/MaintenanceFeedbackTab";
import { DirectMessaging } from "@/components/tenant/communications/DirectMessaging";
import { Communication } from "@/types/tenant";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/components/providers/LocaleProvider";

interface MaintenanceRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  request: MaintenanceRequest | null;
  onUpdate: () => void;
}

export const MaintenanceRequestDialog = ({
  isOpen,
  onClose,
  request,
  onUpdate,
}: MaintenanceRequestDialogProps) => {
  const [activeTab, setActiveTab] = useState("details");
  const [tenantMessages, setTenantMessages] = useState<Communication[]>([]);
  const { t } = useLocale();
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && request?.tenant_id) {
      fetchTenantMessages();
    }
  }, [isOpen, request?.tenant_id]);

  const fetchTenantMessages = async () => {
    if (!request?.tenant_id) return;
    
    try {
      const { data, error } = await supabase
        .from('tenant_communications')
        .select('*')
        .eq('tenant_id', request.tenant_id)
        .eq('category', 'maintenance')
        .order('created_at', { ascending: false })
        .limit(10);
        
      if (error) throw error;
      
      setTenantMessages(data || []);
    } catch (error) {
      console.error("Error fetching tenant messages:", error);
      toast({
        title: t('error'),
        description: t('errorLoadingMessages'),
        variant: "destructive",
      });
    }
  };

  if (!request) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{request.title || request.issue}</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <MaintenanceDetailsTab 
              request={request} 
              onUpdate={onUpdate} 
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
                  fetchTenantMessages();
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
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
