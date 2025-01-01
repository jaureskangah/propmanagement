import { Users, DollarSign, Wrench } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";

export const RecentActivity = () => {
  const { data: tenants, isLoading: isLoadingTenants } = useQuery({
    queryKey: ["recent_tenants"],
    queryFn: async () => {
      console.log("Fetching recent tenants...");
      const { data, error } = await supabase
        .from("tenants")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);
      if (error) throw error;
      console.log("Recent tenants data:", data);
      return data;
    },
  });

  const { data: payments, isLoading: isLoadingPayments } = useQuery({
    queryKey: ["recent_payments"],
    queryFn: async () => {
      console.log("Fetching recent payments...");
      const { data, error } = await supabase
        .from("tenant_payments")
        .select(`
          *,
          tenants (
            unit_number
          )
        `)
        .order("created_at", { ascending: false })
        .limit(3);
      if (error) throw error;
      console.log("Recent payments data:", data);
      return data;
    },
  });

  const { data: maintenance, isLoading: isLoadingMaintenance } = useQuery({
    queryKey: ["recent_maintenance"],
    queryFn: async () => {
      console.log("Fetching recent maintenance requests...");
      const { data, error } = await supabase
        .from("maintenance_requests")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);
      if (error) throw error;
      console.log("Recent maintenance data:", data);
      return data;
    },
  });

  if (isLoadingTenants || isLoadingPayments || isLoadingMaintenance) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="font-sans">
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tenants?.map((tenant) => (
            <div key={tenant.id} className="flex items-center gap-4 rounded-lg border p-4 transition-all hover:bg-muted/50">
              <div className="rounded-full bg-blue-100 p-2">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">New Tenant</p>
                <p className="text-sm text-muted-foreground">
                  {tenant.name} - Apartment {tenant.unit_number}
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(tenant.created_at), { 
                  addSuffix: true,
                  locale: enUS 
                })}
              </p>
            </div>
          ))}

          {payments?.map((payment) => (
            <div key={payment.id} className="flex items-center gap-4 rounded-lg border p-4 transition-all hover:bg-muted/50">
              <div className="rounded-full bg-emerald-100 p-2">
                <DollarSign className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Payment Received</p>
                <p className="text-sm text-muted-foreground">
                  ${payment.amount.toLocaleString()} - Studio {payment.tenants?.unit_number}
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(payment.created_at), { 
                  addSuffix: true,
                  locale: enUS 
                })}
              </p>
            </div>
          ))}

          {maintenance?.map((request) => (
            <div key={request.id} className="flex items-center gap-4 rounded-lg border p-4 transition-all hover:bg-muted/50">
              <div className="rounded-full bg-amber-100 p-2">
                <Wrench className="h-4 w-4 text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Maintenance Completed</p>
                <p className="text-sm text-muted-foreground">
                  {request.issue}
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(request.created_at), { 
                  addSuffix: true,
                  locale: enUS 
                })}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};