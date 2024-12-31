import { Wrench } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MaintenanceRequest } from "@/types/tenant";

interface TenantMaintenanceProps {
  requests: MaintenanceRequest[];
}

export const TenantMaintenance = ({ requests }: TenantMaintenanceProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Maintenance Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request.id}
              className="flex items-center justify-between p-2 border rounded"
            >
              <div className="flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                <span>{request.issue}</span>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`text-sm ${
                    request.status === "Resolved"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {request.status}
                </span>
                <span className="text-sm text-muted-foreground">
                  {request.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};