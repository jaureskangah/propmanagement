
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/components/providers/LocaleProvider";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { MaintenanceRequest } from "../types";
import { formatDate } from "@/lib/utils";

interface MaintenanceRequestDialogProps {
  request: MaintenanceRequest | null;
  onClose: () => void;
  onUpdateSuccess: () => void;
}

export const MaintenanceRequestDialog = ({ 
  request, 
  onClose,
  onUpdateSuccess 
}: MaintenanceRequestDialogProps) => {
  const { t } = useLocale();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusUpdate = async (requestId: string, newStatus: string) => {
    try {
      setIsUpdating(true);
      
      const { error } = await supabase
        .from('maintenance_requests')
        .update({ 
          status: newStatus,
          tenant_notified: true 
        })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: t('success'),
        description: t('maintenanceStatusUpdated'),
      });

      onUpdateSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating maintenance status:', error);
      toast({
        title: t('error'),
        description: t('errorUpdatingStatus'),
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (!request) return null;

  return (
    <Dialog open={!!request} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("maintenanceRequest")}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-1">{t("issue")}</h4>
            <p>{request.issue}</p>
          </div>
          
          <div>
            <h4 className="font-medium mb-1">{t("createdOn")}</h4>
            <p>{formatDate(request.created_at)}</p>
          </div>
          
          {request.tenants && (
            <div>
              <h4 className="font-medium mb-1">{t("tenant")}</h4>
              <p>{request.tenants.name}</p>
              <p className="text-sm text-muted-foreground">
                {request.tenants.properties?.name}, {t("unit")} {request.tenants.unit_number}
              </p>
            </div>
          )}
          
          <div>
            <h4 className="font-medium mb-1">{t("status")}</h4>
            <div className="flex flex-wrap gap-2">
              {["Pending", "In Progress", "Resolved"].map((status) => (
                <Button
                  key={status}
                  size="sm"
                  variant={request.status === status ? "default" : "outline"}
                  onClick={() => handleStatusUpdate(request.id, status)}
                  disabled={isUpdating}
                  className={
                    request.status === status 
                      ? status === "Resolved" 
                        ? "bg-green-600 hover:bg-green-700"
                        : status === "In Progress"
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "bg-yellow-600 hover:bg-yellow-700"
                      : ""
                  }
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-1">{t("priority")}</h4>
            <Badge 
              variant={request.priority === "Urgent" ? "destructive" : "default"}
            >
              {request.priority}
            </Badge>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
