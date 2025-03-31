
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MessagesTab } from "./tabs/MessagesTab";
import { MaintenanceTab } from "./tabs/MaintenanceTab";

interface UnreadMessagesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  unreadMessages: any[];
}

export const UnreadMessagesDialog = ({
  open,
  onOpenChange,
  unreadMessages,
}: UnreadMessagesDialogProps) => {
  const navigate = useNavigate();
  const { t } = useLocale();
  const [localOpen, setLocalOpen] = useState(open);
  const [activeTab, setActiveTab] = useState<string>("messages");
  
  // Synchronize local state with props
  useEffect(() => {
    setLocalOpen(open);
  }, [open]);

  // Filter to show only tenant messages
  const tenantMessages = unreadMessages.filter(message => {
    return message.is_from_tenant === true && message.status === "unread";
  });
  
  // Handle navigation to tenant communications
  const handleViewMessages = () => {
    onOpenChange(false);
    if (tenantMessages.length > 0 && tenantMessages[0].tenants?.id) {
      navigate(`/tenants?selected=${tenantMessages[0].tenants.id}&tab=communications`);
    } else {
      navigate("/tenants");
    }
  };

  // Handle navigation to maintenance requests
  const handleViewMaintenance = () => {
    onOpenChange(false);
    navigate("/maintenance");
  };

  // If no messages of any kind, don't render the dialog
  if (tenantMessages.length === 0 && !localOpen) {
    return null;
  }

  return (
    <Dialog open={localOpen} onOpenChange={(value) => {
      setLocalOpen(value);
      onOpenChange(value);
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {t("notificationCenter")}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="messages" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="messages" className="flex items-center gap-1">
              {/* MessagesTabTrigger component content */}
              <MessagesTab.Trigger count={tenantMessages.length} t={t} />
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="flex items-center gap-1">
              {/* MaintenanceTabTrigger component content */}
              <MaintenanceTab.Trigger t={t} />
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="messages" className="mt-0">
            <MessagesTab.Content 
              tenantMessages={tenantMessages} 
              t={t} 
              onOpenChange={onOpenChange}
              navigate={navigate}
            />
          </TabsContent>
          
          <TabsContent value="maintenance" className="mt-0">
            <MaintenanceTab.Content t={t} onOpenChange={onOpenChange} />
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("close")}
          </Button>
          
          {activeTab === "messages" && tenantMessages.length > 0 ? (
            <Button onClick={handleViewMessages} className="bg-purple-600 hover:bg-purple-700">
              {t("viewMessages")}
            </Button>
          ) : activeTab === "maintenance" && localOpen ? (
            <Button onClick={handleViewMaintenance} className="bg-amber-600 hover:bg-amber-700">
              {t("maintenanceRequests")}
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
