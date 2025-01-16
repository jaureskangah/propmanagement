import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMaintenanceRequests } from "./hooks/useMaintenanceRequests";

export const TenantMaintenanceView = () => {
  const { requests } = useMaintenanceRequests();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Maintenance Requests</CardTitle>
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          <p className="text-muted-foreground text-center">
            No maintenance requests found
          </p>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div
                key={request.id}
                className="p-4 border rounded-lg hover:bg-gray-50"
              >
                <h3 className="font-medium">{request.title || request.issue}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Status: {request.status}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};