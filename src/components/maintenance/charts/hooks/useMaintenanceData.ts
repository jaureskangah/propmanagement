
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { format, parseISO, subMonths } from "date-fns";

export const useMaintenanceData = (propertyId: string) => {
  return useQuery({
    queryKey: ["maintenance_data", propertyId],
    queryFn: async () => {
      console.log("Fetching maintenance data for property:", propertyId);
      
      const { data: maintenanceRequests, error: maintenanceError } = await supabase
        .from("maintenance_requests")
        .select("created_at, status, priority, estimated_cost")
        .eq("property_id", propertyId)
        .order("created_at", { ascending: true });

      if (maintenanceError) {
        console.error("Error fetching maintenance requests:", maintenanceError);
        throw maintenanceError;
      }
      
      // Si pas de données réelles, utilisez des données fictives
      if (!maintenanceRequests?.length) {
        // Générer 6 mois de données fictives
        const today = new Date();
        const mockData = [];
        for (let i = 5; i >= 0; i--) {
          const date = subMonths(today, i);
          mockData.push({
            month: format(date, 'MMM yyyy'),
            requests: Math.floor(Math.random() * 7) + 1,
            completed: Math.floor(Math.random() * 5) + 1,
            urgent: Math.floor(Math.random() * 3),
            expenses: (Math.floor(Math.random() * 5) + 1) * 100
          });
        }
        console.log("Using mock maintenance data:", mockData);
        return mockData;
      }
      
      // Traiter les données réelles par mois
      const monthlyData = maintenanceRequests.reduce((acc: any, request) => {
        const month = format(parseISO(request.created_at), 'MMM yyyy');
        
        if (!acc[month]) {
          acc[month] = { 
            month, 
            requests: 0, 
            completed: 0, 
            urgent: 0,
            expenses: 0
          };
        }
        
        acc[month].requests += 1;
        
        if (request.status === 'completed' || request.status === 'resolved') {
          acc[month].completed += 1;
        }
        
        if (request.priority === 'urgent' || request.priority === 'high') {
          acc[month].urgent += 1;
        }
        
        if (request.estimated_cost) {
          acc[month].expenses += request.estimated_cost;
        }
        
        return acc;
      }, {});
      
      const result = Object.values(monthlyData);
      console.log("Processed maintenance data:", result);
      return result;
    },
  });
};
