
import { Database } from "@/integrations/supabase/types";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Wrench } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

interface Tenant {
  id: string;
  name: string;
  unit_number: string;
  properties?: {
    name: string;
  };
}

interface MaintenanceRequest {
  id: string;
  issue: string;
  status: string;
  priority: string;
  created_at: string;
  tenant_id: string;
  tenant_notified: boolean;
  tenants?: Tenant;
}

interface MaintenanceListProps {
  requests: MaintenanceRequest[];
  onMaintenanceUpdate: () => void;
}

export const MaintenanceList = ({ 
  requests,
  onMaintenanceUpdate 
}: MaintenanceListProps) => {
  const { toast } = useToast();
  const { t } = useLocale();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Check if there's a request ID in the URL params
  useEffect(() => {
    const requestId = searchParams.get('request');
    if (requestId) {
      const request = requests.find(r => r.id === requestId);
      if (request) {
        setSelectedRequest(request);
      }
      // Clear the request param after showing the dialog
      setSearchParams(prev => {
        prev.delete('request');
        return prev;
      });
    }
  }, [searchParams, requests]);

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

      onMaintenanceUpdate();
      setSelectedRequest(null);
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

  if (requests.length === 0) {
    return (
      <div className="text-center py-8 border-2 border-dashed rounded-lg">
        <Wrench className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">
          {t('noMaintenanceRequests')}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {requests.map((request) => (
          <div
            key={request.id}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
            onClick={() => setSelectedRequest(request)}
          >
            <div className="flex items-center gap-3">
              <Wrench className="h-5 w-5 text-[#ea384c]" />
              <div>
                <p className="font-medium">{request.issue}</p>
                {request.tenants && (
                  <p className="text-sm text-muted-foreground">
                    {t("from")} {request.tenants.name} - {request.tenants.properties?.name}, {t("unit")} {request.tenants.unit_number}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  {t("createdOn")} {formatDate(request.created_at)}
                </p>
              </div>
            </div>
            <Badge
              variant={request.status === "Resolved" ? "default" : "secondary"}
              className={
                request.status === "Resolved"
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-yellow-500 hover:bg-yellow-600"
              }
            >
              {request.status}
            </Badge>
          </div>
        ))}
      </div>

      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("maintenanceRequest")}</DialogTitle>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-1">{t("issue")}</h4>
                <p>{selectedRequest.issue}</p>
              </div>
              
              {selectedRequest.tenants && (
                <div>
                  <h4 className="font-medium mb-1">{t("tenant")}</h4>
                  <p>{selectedRequest.tenants.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedRequest.tenants.properties?.name}, {t("unit")} {selectedRequest.tenants.unit_number}
                  </p>
                </div>
              )}
              
              <div>
                <h4 className="font-medium mb-1">{t("status")}</h4>
                <div className="flex gap-2">
                  {["Pending", "In Progress", "Resolved"].map((status) => (
                    <Button
                      key={status}
                      size="sm"
                      variant={selectedRequest.status === status ? "default" : "outline"}
                      onClick={() => handleStatusUpdate(selectedRequest.id, status)}
                      disabled={isUpdating}
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-1">{t("priority")}</h4>
                <Badge 
                  variant={selectedRequest.priority === "Urgent" ? "destructive" : "default"}
                >
                  {selectedRequest.priority}
                </Badge>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedRequest(null)}>
              {t("close")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
