import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TenantMaintenanceView } from "../TenantMaintenanceView";
import { TenantCommunications } from "../../TenantCommunications";

interface MaintenanceContentProps {
  tenantId: string;
  communications: any[];
}

export const MaintenanceContent = ({ tenantId, communications }: MaintenanceContentProps) => {
  return (
    <div className="grid grid-cols-1 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Recent Maintenance Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <TenantMaintenanceView />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Communications with Owner</CardTitle>
        </CardHeader>
        <CardContent>
          <TenantCommunications 
            communications={communications}
            tenantId={tenantId}
          />
        </CardContent>
      </Card>
    </div>
  );
};