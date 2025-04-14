
import { useEffect, useState } from "react";
import { MaintenanceMetrics } from "../MaintenanceMetrics";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

interface MaintenanceMetricsSectionProps {
  totalRequests: number;
  pendingRequests: number;
  resolvedRequests: number;
  urgentRequests: number;
  propertyId?: string;
  selectedYear?: number;
}

export const MaintenanceMetricsSection = ({
  totalRequests: initialTotal,
  pendingRequests: initialPending,
  resolvedRequests: initialResolved,
  urgentRequests: initialUrgent,
  propertyId,
  selectedYear,
}: MaintenanceMetricsSectionProps) => {
  // Query to fetch filtered maintenance data based on propertyId and selectedYear
  const { data: filteredMetrics, isLoading } = useQuery({
    queryKey: ['maintenance_metrics', propertyId, selectedYear],
    queryFn: async () => {
      // If no propertyId or selectedYear, return default metrics
      if (!propertyId || !selectedYear) {
        return {
          total: initialTotal,
          pending: initialPending,
          resolved: initialResolved
        };
      }

      try {
        // First get tenants for this property to filter by tenant_id
        const { data: tenants, error: tenantsError } = await supabase
          .from("tenants")
          .select("id")
          .eq("property_id", propertyId);
          
        if (tenantsError) throw tenantsError;
        
        if (!tenants?.length) {
          console.log("No tenants found for property:", propertyId);
          return { total: 0, pending: 0, resolved: 0 };
        }
        
        const tenantIds = tenants.map(t => t.id);
        console.log("Found tenants for property:", tenantIds);
        
        // Format dates correctly to ensure proper filtering
        const startOfYear = new Date(selectedYear, 0, 1).toISOString().split('T')[0];
        const endOfYear = new Date(selectedYear, 11, 31).toISOString().split('T')[0];
        
        console.log("Filtering maintenance requests from", startOfYear, "to", endOfYear);
        
        // Then get requests for these tenants within the selected year
        const { data: requests, error: requestsError } = await supabase
          .from("maintenance_requests")
          .select("*")
          .in("tenant_id", tenantIds)
          .gte("created_at", startOfYear)
          .lte("created_at", endOfYear);

        if (requestsError) throw requestsError;
        
        if (!requests) {
          console.log("No maintenance requests found for the selected filters");
          return { total: 0, pending: 0, resolved: 0 };
        }

        console.log(`Found ${requests.length} maintenance requests for the selected filters`);
        
        // Calculate metrics
        const total = requests.length;
        const pending = requests.filter(r => r.status === 'Pending').length;
        const resolved = requests.filter(r => r.status === 'Resolved').length;
        
        return { total, pending, resolved };
      } catch (error) {
        console.error("Error fetching filtered metrics:", error);
        // Return default metrics on error
        return {
          total: initialTotal,
          pending: initialPending,
          resolved: initialResolved
        };
      }
    },
    enabled: !!propertyId && !!selectedYear,
  });

  const [metrics, setMetrics] = useState({
    totalRequests: initialTotal,
    pendingRequests: initialPending,
    resolvedRequests: initialResolved,
    urgentRequests: initialUrgent,
  });

  useEffect(() => {
    setMetrics({
      totalRequests: initialTotal,
      pendingRequests: initialPending,
      resolvedRequests: initialResolved,
      urgentRequests: initialUrgent,
    });
  }, [initialTotal, initialPending, initialResolved, initialUrgent]);

  useEffect(() => {
    const channel = supabase
      .channel('maintenance-metrics')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'maintenance_requests'
        },
        async () => {
          const { data: requests, error } = await supabase
            .from('maintenance_requests')
            .select('status, priority');
            
          if (error) {
            console.error('Error fetching updated maintenance metrics:', error);
            return;
          }

          const total = requests.length;
          const pending = requests.filter(r => r.status === 'Pending').length;
          const resolved = requests.filter(r => r.status === 'Resolved').length;
          const urgent = requests.filter(r => r.priority === 'Urgent').length;

          setMetrics({
            totalRequests: total,
            pendingRequests: pending,
            resolvedRequests: resolved,
            urgentRequests: urgent,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Use filtered metrics when available
  const displayMetrics = (propertyId && selectedYear && filteredMetrics)
    ? {
        total: filteredMetrics.total,
        pending: filteredMetrics.pending,
        resolved: filteredMetrics.resolved
      }
    : {
        total: metrics.totalRequests,
        pending: metrics.pendingRequests,
        resolved: metrics.resolvedRequests
      };

  return (
    <div className="w-full mb-6">
      <MaintenanceMetrics
        total={displayMetrics.total}
        pending={displayMetrics.pending}
        resolved={displayMetrics.resolved}
        propertyId={propertyId}
        selectedYear={selectedYear}
        isLoading={isLoading}
      />
    </div>
  );
};
