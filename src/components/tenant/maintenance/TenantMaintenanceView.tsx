import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AddMaintenanceDialog } from "./AddMaintenanceDialog";
import { MaintenanceRequest } from "@/types/tenant";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { formatDate } from "@/lib/utils";

export const TenantMaintenanceView = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [tenantId, setTenantId] = useState<string>("");
  const { toast } = useToast();

  const fetchRequests = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    const { data: tenantData, error: tenantError } = await supabase
      .from("tenants")
      .select("id")
      .eq("tenant_profile_id", userData.user.id)
      .single();

    if (tenantError || !tenantData) {
      console.error("Error fetching tenant:", tenantError);
      return;
    }

    setTenantId(tenantData.id);

    const { data, error } = await supabase
      .from("maintenance_requests")
      .select("*")
      .eq("tenant_id", tenantData.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching maintenance requests:", error);
      toast({
        title: "Error",
        description: "Failed to load maintenance requests",
        variant: "destructive",
      });
      return;
    }

    setRequests(data || []);
  };

  React.useEffect(() => {
    fetchRequests();
  }, []);

  const handleRequestCreated = () => {
    fetchRequests();
    setIsAddDialogOpen(false);
    toast({
      title: "Success",
      description: "Maintenance request submitted successfully",
    });
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
            ))
          )}
        </div>
      </CardContent>

      <AddMaintenanceDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSuccess={handleRequestCreated}
        tenantId={tenantId}
      />
    </Card>
  );
};