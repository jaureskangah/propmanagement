import { Users } from "lucide-react";
import { ActivityItem } from "./ActivityItem";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const TenantActivity = () => {
  const { data: tenants } = useQuery({
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

  return (
    <>
      {tenants?.map((tenant) => (
        <ActivityItem
          key={tenant.id}
          icon={Users}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100"
          title="New Tenant"
          description={`${tenant.name} - Apartment ${tenant.unit_number}`}
          date={tenant.created_at}
        />
      ))}
    </>
  );
};