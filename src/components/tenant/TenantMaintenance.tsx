
import { useState } from "react";
import { Wrench, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MaintenanceRequest } from "@/types/tenant";
import { AddMaintenanceDialog } from "./maintenance/AddMaintenanceDialog";
import { EditMaintenanceDialog } from "./maintenance/EditMaintenanceDialog";
import { DeleteMaintenanceDialog } from "./maintenance/DeleteMaintenanceDialog";
import { formatDate } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useQueryClient } from "@tanstack/react-query";

interface TenantMaintenanceProps {
  requests: MaintenanceRequest[];
  tenantId: string;
  onMaintenanceUpdate: () => void;
}

export const TenantMaintenance = ({ 
  requests, 
  tenantId,
  onMaintenanceUpdate 
}: TenantMaintenanceProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
  const { t } = useLocale();
  const queryClient = useQueryClient();

  const handleEditClick = async (request: MaintenanceRequest) => {
    if (!request.tenant_notified) {
      await supabase
        .from('maintenance_requests')
        .update({ tenant_notified: true })
        .eq('id', request.id);
    }
    setSelectedRequest(request);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (request: MaintenanceRequest) => {
    setSelectedRequest(request);
    setIsDeleteDialogOpen(true);
  };

  const handleMaintenanceAdded = () => {
    // Invalider les queries pour forcer le rechargement des données
    queryClient.invalidateQueries({ queryKey: ["tenants"] });
    queryClient.invalidateQueries({ queryKey: ["tenant_maintenance", tenantId] });
    onMaintenanceUpdate();
    setIsAddDialogOpen(false);
  };

  const handleMaintenanceUpdated = () => {
    // Invalider les queries pour forcer le rechargement des données
    queryClient.invalidateQueries({ queryKey: ["tenants"] });
    queryClient.invalidateQueries({ queryKey: ["tenant_maintenance", tenantId] });
    onMaintenanceUpdate();
    setIsEditDialogOpen(false);
    setSelectedRequest(null);
  };

  const handleMaintenanceDeleted = () => {
    // Invalider les queries pour forcer le rechargement des données
    queryClient.invalidateQueries({ queryKey: ["tenants"] });
    queryClient.invalidateQueries({ queryKey: ["tenant_maintenance", tenantId] });
    onMaintenanceUpdate();
    setIsDeleteDialogOpen(false);
    setSelectedRequest(null);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Maintenance</CardTitle>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-[#ea384c] hover:bg-[#ea384c]/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t('newRequest')}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {requests.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              {t('noMaintenanceRequests')}
            </p>
          ) : (
            requests.map((request) => (
              <div
                key={request.id}
                className={`flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 ${
                  !request.tenant_notified ? 'bg-yellow-50' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <Wrench className="h-5 w-5 text-[#ea384c]" />
                  <div>
                    <p className="font-medium">{request.title || request.issue}</p>
                    <p className="text-sm text-muted-foreground">
                      {t('createdOn')} {formatDate(request.created_at)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge
                    variant={request.status === "Resolved" ? "default" : "secondary"}
                    className={
                      request.status === "Resolved"
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-yellow-500 hover:bg-yellow-600"
                    }
                  >
                    {t(request.status.toLowerCase())}
                  </Badge>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditClick(request)}
                    >
                      {t('edit')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick(request)}
                      className="text-red-500 hover:text-red-600"
                    >
                      {t('deleteMaintenanceRequest')}
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>

      <AddMaintenanceDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        tenantId={tenantId}
        onSuccess={handleMaintenanceAdded}
      />

      {selectedRequest && (
        <>
          <EditMaintenanceDialog
            isOpen={isEditDialogOpen}
            onClose={() => {
              setIsEditDialogOpen(false);
              setSelectedRequest(null);
            }}
            request={selectedRequest}
            onSuccess={handleMaintenanceUpdated}
          />

          <DeleteMaintenanceDialog
            isOpen={isDeleteDialogOpen}
            onClose={() => {
              setIsDeleteDialogOpen(false);
              setSelectedRequest(null);
            }}
            request={selectedRequest}
            onSuccess={handleMaintenanceDeleted}
          />
        </>
      )}
    </Card>
  );
};
