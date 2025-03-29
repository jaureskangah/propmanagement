
import { Button } from "@/components/ui/button";
import { SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { MaintenanceRequest } from "@/types/tenant";
import { MaintenanceInfo } from "./MaintenanceInfo";
import { FeedbackSection } from "./FeedbackSection";
import { DirectMessaging } from "../DirectMessaging";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { DeleteMaintenanceDialog } from "../../DeleteMaintenanceDialog";
import { Communication } from "@/types/tenant";
import { supabase } from "@/lib/supabase";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface MaintenanceDetailSheetContentProps {
  request: MaintenanceRequest;
  onClose: () => void;
  onUpdate: () => void;
  canRate: boolean;
}

export const MaintenanceDetailSheetContent = ({
  request,
  onClose,
  onUpdate,
  canRate,
}: MaintenanceDetailSheetContentProps) => {
  const { t } = useLocale();
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [messages, setMessages] = useState<Communication[]>([]);
  
  const fetchMessages = async () => {
    if (!request.tenant_id) return;
    
    try {
      const { data, error } = await supabase
        .from('tenant_communications')
        .select('*')
        .eq('tenant_id', request.tenant_id)
        .eq('category', 'maintenance')
        .order('created_at', { ascending: false })
        .limit(20);
        
      if (error) throw error;
      
      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({
        title: t('error'),
        description: t('errorLoadingMessages'),
        variant: "destructive",
      });
    }
  };
  
  useEffect(() => {
    fetchMessages();
  }, [request.tenant_id]);
  
  return (
    <SheetContent className="sm:max-w-md p-0">
      <SheetHeader className="p-6 pb-2">
        <div className="flex justify-between items-center">
          <SheetTitle>{request.issue}</SheetTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsDeleteDialogOpen(true)} 
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </SheetHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 m-6 mb-2">
          <TabsTrigger value="details">{t('details')}</TabsTrigger>
          <TabsTrigger value="messages">{t('messages')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="px-6 py-4 max-h-[calc(100vh-15rem)] overflow-y-auto space-y-6">
          <MaintenanceInfo request={request} />
          
          {canRate && (
            <FeedbackSection 
              requestId={request.id} 
              existingFeedback={request.tenant_feedback} 
              existingRating={request.tenant_rating}
              onFeedbackSubmitted={onUpdate}
            />
          )}
        </TabsContent>
        
        <TabsContent value="messages" className="px-6 py-4 max-h-[calc(100vh-15rem)] overflow-y-auto">
          {request.tenant_id ? (
            <DirectMessaging 
              tenantId={request.tenant_id}
              onMessageSent={() => {
                fetchMessages();
                onUpdate();
              }}
              latestMessages={messages}
            />
          ) : (
            <div className="text-center p-6 text-gray-500">
              {t('noTenantAssociated')}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <SheetFooter className="px-6 py-4 border-t">
        <Button 
          variant="outline" 
          onClick={onClose} 
          className="w-full"
        >
          {t('close')}
        </Button>
      </SheetFooter>

      <DeleteMaintenanceDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        request={request}
        onSuccess={onUpdate}
      />
    </SheetContent>
  );
};
