import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface MaintenanceRequest {
  id: string;
  title: string;
  issue: string;
  status: string;
  created_at: string;
  priority: string;
}

export const TenantMaintenanceView = () => {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data: tenantData } = await supabase
        .from('tenants')
        .select('id')
        .eq('tenant_profile_id', userData.user.id)
        .single();

      if (!tenantData) return;

      const { data, error } = await supabase
        .from('maintenance_requests')
        .select('*')
        .eq('tenant_id', tenantData.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);

    } catch (error) {
      console.error('Error fetching requests:', error);
      toast({
        title: "Error",
        description: "Failed to load maintenance requests",
        variant: "destructive",
      });
    }
  };

  return (
    <ScrollArea className="h-[300px]">
      {requests.length === 0 ? (
        <p className="text-center text-muted-foreground py-4">
          No maintenance requests found
        </p>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
            >
              <div>
                <h3 className="font-medium">{request.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(request.created_at), "dd/MM/yyyy", { locale: fr })}
                </p>
              </div>
              <div className="flex items-center gap-2">
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
                <Badge variant="outline">{request.priority}</Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </ScrollArea>
  );
};