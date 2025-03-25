
import React, { useState } from "react";
import { MaintenanceHeader } from "./header/MaintenanceHeader";
import { MaintenanceMetricsSection } from "./metrics/MaintenanceMetricsSection";
import { MaintenanceTabs } from "./tabs/MaintenanceTabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Separator } from "@/components/ui/separator";
import { VendorList } from "./vendors/VendorList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocale } from "@/components/providers/LocaleProvider";

export const MaintenancePageContainer = () => {
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState("requests");
  
  // Mock data for the financial section
  const mockFinancialData = {
    propertyId: "property-1",
    expenses: [
      { category: "Plumbing", amount: 350, date: "2023-02-15" },
      { category: "Electrical", amount: 275, date: "2023-03-10" },
      { category: "HVAC", amount: 520, date: "2023-04-05" },
    ],
    maintenance: [
      {
        title: "Fix broken pipe",
        description: "Repair bathroom pipe leak",
        cost: 250,
        date: "2023-02-15",
        status: "Completed",
        unit_number: "2B",
        vendors: {
          name: "ABC Plumbing",
          specialty: "Plumbing"
        }
      },
      {
        title: "Replace light fixtures",
        description: "Install new LED fixtures in hallway",
        cost: 175,
        date: "2023-03-08",
        status: "Scheduled",
        unit_number: "5A",
        vendors: {
          name: "ElectriCity",
          specialty: "Electrical"
        }
      },
    ]
  };

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['maintenance_requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const handleRequestClick = (request) => {
    console.log("Request clicked:", request);
    // Handle request click (could open a modal, etc.)
  };

  // Filter for active requests
  const filteredRequests = requests.filter(request => 
    request.status !== "Resolved" && request.status !== "Cancelled"
  );

  return (
    <div className="space-y-6">
      <MaintenanceHeader />

      <MaintenanceMetricsSection 
        totalRequests={requests.length} 
        pendingRequests={requests.filter(r => r.status === "Pending").length}
        resolvedRequests={requests.filter(r => r.status === "Resolved").length}
      />

      <Tabs defaultValue="maintenance" className="w-full">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="maintenance">{t('maintenanceAndRepairs')}</TabsTrigger>
          <TabsTrigger value="vendors">{t('vendors')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="maintenance" className="pt-4">
          <MaintenanceTabs 
            propertyId="property-1" 
            mockFinancialData={mockFinancialData}
            filteredRequests={filteredRequests}
            onRequestClick={handleRequestClick}
          />
        </TabsContent>
        
        <TabsContent value="vendors" className="pt-4">
          <VendorList />
        </TabsContent>
      </Tabs>
    </div>
  );
};
