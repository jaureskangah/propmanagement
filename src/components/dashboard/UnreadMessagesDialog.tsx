
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Wrench, CheckCircle2 } from "lucide-react";

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
  const [pendingMaintenanceRequests, setPendingMaintenanceRequests] = useState<any[]>([]);
  const [isLoadingMaintenance, setIsLoadingMaintenance] = useState(true);

  // Synchroniser l'état local avec les props
  useEffect(() => {
    setLocalOpen(open);
  }, [open]);

  // Charger les demandes de maintenance en attente
  useEffect(() => {
    const fetchPendingMaintenance = async () => {
      if (localOpen) {
        try {
          setIsLoadingMaintenance(true);
          const { data, error } = await supabase
            .from('maintenance_requests')
            .select('*, tenants(id, name, unit_number)')
            .eq('status', 'Pending')
            .order('created_at', { ascending: false })
            .limit(5);

          if (error) throw error;
          
          setPendingMaintenanceRequests(data || []);
        } catch (error) {
          console.error("Error fetching maintenance requests:", error);
        } finally {
          setIsLoadingMaintenance(false);
        }
      }
    };

    fetchPendingMaintenance();
  }, [localOpen]);

  // Filtrer pour afficher uniquement les messages des locataires
  const tenantMessages = unreadMessages.filter(message => {
    return message.is_from_tenant === true && message.status === "unread";
  });

  // Gérer la navigation vers les communications du locataire
  const handleViewMessages = () => {
    onOpenChange(false);
    if (tenantMessages.length > 0 && tenantMessages[0].tenants?.id) {
      console.log("Navigating to tenant communications:", tenantMessages[0].tenants.id);
      navigate(`/tenants?selected=${tenantMessages[0].tenants.id}&tab=communications`);
    } else {
      navigate("/tenants");
    }
  };

  // Gérer la navigation vers les demandes de maintenance
  const handleViewMaintenance = () => {
    onOpenChange(false);
    navigate("/maintenance");
  };

  // Marquer tous les messages comme lus
  const handleMarkAllAsRead = async () => {
    try {
      const messageIds = tenantMessages.map(message => message.id);
      if (messageIds.length === 0) return;

      const { error } = await supabase
        .from('tenant_communications')
        .update({ status: 'read' })
        .in('id', messageIds);

      if (error) throw error;
      
      // Close the dialog and refresh
      onOpenChange(false);
      
      // Force an immediate refresh of data instead of waiting for the page reload
      setTimeout(() => {
        window.location.reload();
      }, 300);
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  // Animations pour les éléments de la liste
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({ 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: i * 0.1,
        duration: 0.3
      }
    })
  };

  // N'afficher pas le dialogue s'il n'y a pas de messages de locataires ni de demandes de maintenance
  if (tenantMessages.length === 0 && pendingMaintenanceRequests.length === 0) {
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
              <MessageSquare className="h-4 w-4" />
              {t("unreadMessages")}
              {tenantMessages.length > 0 && (
                <Badge variant="destructive" className="ml-1">{tenantMessages.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="flex items-center gap-1">
              <Wrench className="h-4 w-4" />
              {t("maintenance")}
              {pendingMaintenanceRequests.length > 0 && (
                <Badge variant="destructive" className="ml-1">{pendingMaintenanceRequests.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="messages" className="mt-0">
            <DialogDescription>
              {tenantMessages.length > 0 ? (
                <div>
                  {t("youHaveUnreadMessages", { 
                    count: String(tenantMessages.length) 
                  })}

                  <ScrollArea className="h-48 mt-2">
                    <AnimatePresence>
                      <div className="space-y-2">
                        {tenantMessages.map((message, index) => (
                          <motion.div 
                            key={message.id} 
                            custom={index}
                            initial="hidden"
                            animate="visible"
                            variants={itemVariants}
                            className="text-sm p-3 rounded bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                            onClick={() => {
                              onOpenChange(false);
                              navigate(`/tenants?selected=${message.tenants?.id}&tab=communications`);
                            }}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-semibold">
                                {message.tenants?.name} ({t("unit")} {message.tenants?.unit_number})
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {new Date(message.created_at).toLocaleDateString()}
                              </Badge>
                            </div>
                            <div className="line-clamp-2">{message.subject}</div>
                          </motion.div>
                        ))}
                      </div>
                    </AnimatePresence>
                  </ScrollArea>

                  <div className="flex justify-end mt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleMarkAllAsRead}
                      className="text-xs flex items-center gap-1"
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      {t("markAllAsRead")}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p>{t("noNotifications")}</p>
                </div>
              )}
            </DialogDescription>
          </TabsContent>
          
          <TabsContent value="maintenance" className="mt-0">
            <DialogDescription>
              {isLoadingMaintenance ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : pendingMaintenanceRequests.length > 0 ? (
                <div>
                  <p className="mb-2">{pendingMaintenanceRequests.length} {t("pendingRequests")}</p>
                  
                  <ScrollArea className="h-48">
                    <AnimatePresence>
                      <div className="space-y-2">
                        {pendingMaintenanceRequests.map((request, index) => (
                          <motion.div 
                            key={request.id} 
                            custom={index}
                            initial="hidden"
                            animate="visible"
                            variants={itemVariants}
                            className="text-sm p-3 rounded bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                            onClick={() => {
                              onOpenChange(false);
                              navigate(`/maintenance`);
                            }}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-semibold">
                                {request.tenants?.name} ({t("unit")} {request.tenants?.unit_number})
                              </span>
                              <Badge 
                                variant={request.priority === "Urgent" ? "destructive" : "outline"} 
                                className="text-xs"
                              >
                                {request.priority}
                              </Badge>
                            </div>
                            <div className="line-clamp-2">{request.issue}</div>
                          </motion.div>
                        ))}
                      </div>
                    </AnimatePresence>
                  </ScrollArea>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Wrench className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p>{t("noNotifications")}</p>
                </div>
              )}
            </DialogDescription>
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
          ) : activeTab === "maintenance" && pendingMaintenanceRequests.length > 0 ? (
            <Button onClick={handleViewMaintenance} className="bg-amber-600 hover:bg-amber-700">
              {t("maintenanceRequests")}
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
