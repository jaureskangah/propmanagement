import { Wrench } from "lucide-react";
import { ActivityItem } from "./ActivityItem";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const MaintenanceActivity = () => {
  const { data: maintenance } = useQuery({
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

  return (
    <>
      {maintenance?.map((request) => (
        <ActivityItem
          key={request.id}
          icon={Wrench}
          iconColor="text-amber-600"
          iconBgColor="bg-amber-100"
          title="Maintenance Completed"
          description={request.issue}
          date={request.created_at}
        />
      ))}
    </>
  );
};