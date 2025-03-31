
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Wrench } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { NavigateFunction } from "react-router-dom";

interface MaintenanceTriggerProps {
  t: (key: string, options?: any) => string;
}

const Trigger = ({ t }: MaintenanceTriggerProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const { count, error } = await supabase
          .from('maintenance_requests')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'Pending');

        if (error) throw error;
        setCount(count || 0);
      } catch (error) {
        console.error("Error fetching maintenance count:", error);
      }
    };

    fetchCount();
  }, []);

  return (
    <>
      <Wrench className="h-4 w-4" />
      {t("maintenance")}
      {count > 0 && (
        <Badge variant="destructive" className="ml-1">{count}</Badge>
      )}
    </>
  );
};

interface MaintenanceContentProps {
  t: (key: string, options?: any) => string;
  onOpenChange: (open: boolean) => void;
}

const Content = ({ t, onOpenChange }: MaintenanceContentProps) => {
  const [pendingMaintenanceRequests, setPendingMaintenanceRequests] = useState<any[]>([]);
  const [isLoadingMaintenance, setIsLoadingMaintenance] = useState(true);

  // Load pending maintenance requests
  useEffect(() => {
    const fetchPendingMaintenance = async () => {
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
    };

    fetchPendingMaintenance();
  }, []);

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

  return (
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
                      window.location.href = "/maintenance";
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
  );
};

export const MaintenanceTab = {
  Trigger,
  Content
};
