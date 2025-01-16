import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMaintenanceRequests } from "./hooks/useMaintenanceRequests";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MaintenanceMetrics } from "@/components/maintenance/MaintenanceMetrics";
import { MaintenanceList } from "./components/MaintenanceList";
import { AddMaintenanceDialog } from "./AddMaintenanceDialog";

export const TenantMaintenanceView = () => {
  const { requests, isLoading, error, fetchRequests } = useMaintenanceRequests();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-6">
          <p className="text-muted-foreground text-center">
            Unable to load maintenance requests. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calculate metrics
  const total = requests.length;
  const pending = requests.filter(r => r.status === "Pending").length;
  const resolved = requests.filter(r => r.status === "Resolved").length;

  return (
    <div className="space-y-6">
      {/* Metrics Section */}
      <div className="grid gap-4 md:grid-cols-3">
        <MaintenanceMetrics
          total={total}
          pending={pending}
          resolved={resolved}
        />
      </div>

      {/* Maintenance Requests List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Maintenance Requests</CardTitle>
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Request
          </Button>
        </CardHeader>
        <MaintenanceList requests={requests} />
      </Card>

      {/* Add Maintenance Dialog */}
      <AddMaintenanceDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSuccess={() => {
          setIsAddDialogOpen(false);
          fetchRequests();
        }}
        tenantId=""
      />
    </div>
  );
};