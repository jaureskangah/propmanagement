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

  const handleEditClick = (request: MaintenanceRequest) => {
    setSelectedRequest(request);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (request: MaintenanceRequest) => {
    setSelectedRequest(request);
    setIsDeleteDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Maintenance Requests</CardTitle>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-[#ea384c] hover:bg-[#ea384c]/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Request
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {requests.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No maintenance requests found
            </p>
          ) : (
            requests.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <Wrench className="h-5 w-5 text-[#ea384c]" />
                  <div>
                    <p className="font-medium">{request.issue}</p>
                    <p className="text-sm text-muted-foreground">
                      Created on {formatDate(request.created_at)}
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
                    {request.status}
                  </Badge>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditClick(request)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick(request)}
                      className="text-red-500 hover:text-red-600"
                    >
                      Delete
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
        onSuccess={onMaintenanceUpdate}
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
            onSuccess={onMaintenanceUpdate}
          />

          <DeleteMaintenanceDialog
            isOpen={isDeleteDialogOpen}
            onClose={() => {
              setIsDeleteDialogOpen(false);
              setSelectedRequest(null);
            }}
            request={selectedRequest}
            onSuccess={onMaintenanceUpdate}
          />
        </>
      )}
    </Card>
  );
};