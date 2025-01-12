import React, { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { AddMaintenanceDialog } from "./AddMaintenanceDialog";
import { MaintenanceHeader } from "./components/MaintenanceHeader";
import { MaintenanceList } from "./components/MaintenanceList";
import { useMaintenanceRequests } from "./hooks/useMaintenanceRequests";

export const TenantMaintenanceView = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { requests, tenantId, fetchRequests, handleRequestCreated } = useMaintenanceRequests();

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <Card>
      <MaintenanceHeader onAddClick={() => setIsAddDialogOpen(true)} />
      <MaintenanceList requests={requests} />

      <AddMaintenanceDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSuccess={handleRequestCreated}
        tenantId={tenantId}
      />
    </Card>
  );
};