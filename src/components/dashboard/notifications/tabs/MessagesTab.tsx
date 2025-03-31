
import { Badge } from "@/components/ui/badge";
import { DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { MessageSquare, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NavigateFunction } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

interface MessagesTriggerProps {
  count: number;
  t: (key: string, options?: any) => string;
}

const Trigger = ({ count, t }: MessagesTriggerProps) => {
  return (
    <>
      <MessageSquare className="h-4 w-4" />
      {t("unreadMessages")}
      {count > 0 && (
        <Badge variant="destructive" className="ml-1">{count}</Badge>
      )}
    </>
  );
};

interface MessagesContentProps {
  tenantMessages: any[];
  t: (key: string, options?: any) => string;
  onOpenChange: (open: boolean) => void;
  navigate: NavigateFunction;
}

const Content = ({ tenantMessages, t, onOpenChange, navigate }: MessagesContentProps) => {
  // Animations for list items
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

  // Mark all messages as read
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

  return (
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
  );
};

export const MessagesTab = {
  Trigger,
  Content
};
