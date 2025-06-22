
import React, { useState, useEffect } from "react";
import { MaintenanceMetricsSection } from "../metrics/MaintenanceMetricsSection";
import { MaintenanceCharts } from "../charts/MaintenanceCharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const MaintenanceOverview = () => {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [isLoadingProperty, setIsLoadingProperty] = useState(true);

  // Fetch user's first property
  useEffect(() => {
    const fetchUserProperty = async () => {
      try {
        console.log("MaintenanceOverview - Fetching user's first property...");
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.log("MaintenanceOverview - No user found");
          setIsLoadingProperty(false);
          return;
        }

        const { data: properties, error } = await supabase
          .from('properties')
          .select('id, name')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true })
          .limit(1);

        if (error) {
          console.error("MaintenanceOverview - Error fetching user property:", error);
          const savedPropertyId = localStorage.getItem('selectedPropertyId') || "";
          setSelectedPropertyId(savedPropertyId);
        } else if (properties && properties.length > 0) {
          const firstProperty = properties[0];
          console.log("MaintenanceOverview - Found user's first property:", firstProperty);
          setSelectedPropertyId(firstProperty.id);
          localStorage.setItem('selectedPropertyId', firstProperty.id);
        } else {
          console.log("MaintenanceOverview - No properties found for user");
          const savedPropertyId = localStorage.getItem('selectedPropertyId') || "";
          setSelectedPropertyId(savedPropertyId);
        }
      } catch (error) {
        console.error("MaintenanceOverview - Exception fetching user property:", error);
        const savedPropertyId = localStorage.getItem('selectedPropertyId') || "";
        setSelectedPropertyId(savedPropertyId);
      } finally {
        setIsLoadingProperty(false);
      }
    };

    fetchUserProperty();
  }, []);

  // Fetch maintenance requests for metrics
  const { data: requests = [], isLoading: isLoadingRequests } = useQuery({
    queryKey: ['maintenance_requests'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('maintenance_requests')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error("MaintenanceOverview - Error fetching requests:", error);
          return [];
        }
        return data || [];
      } catch (error) {
        console.error("MaintenanceOverview - Exception fetching requests:", error);
        return [];
      }
    },
  });

  const totalRequests = requests.length;
  const pendingRequests = requests.filter(r => 
    r.status === "Pending" || r.status === "pending"
  ).length;
  const resolvedRequests = requests.filter(r => r.status === "Resolved").length;
  const urgentRequests = requests.filter(r => r.priority === "Urgent").length;

  if (isLoadingProperty || isLoadingRequests) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <MaintenanceMetricsSection 
        totalRequests={totalRequests}
        pendingRequests={pendingRequests}
        resolvedRequests={resolvedRequests}
        urgentRequests={urgentRequests}
        propertyId={selectedPropertyId}
        selectedYear={selectedYear}
      />
      
      <MaintenanceCharts 
        propertyId={selectedPropertyId} 
        selectedYear={selectedYear} 
      />
    </div>
  );
};
