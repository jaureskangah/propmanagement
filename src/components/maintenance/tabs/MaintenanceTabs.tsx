
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PreventiveMaintenance } from "../preventive/PreventiveMaintenance";
import { MaintenanceList } from "../MaintenanceList";
import { WorkOrderList } from "../work-orders/WorkOrderList";
import { PropertyFinancials } from "../PropertyFinancials";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useIsMobile } from "@/hooks/use-mobile";
import { useWorkOrdersData } from "../work-orders/hooks/useWorkOrdersData";

interface MaintenanceTabsProps {
  propertyId: string;
  selectedYear: number;
  filteredRequests: any[];
  onRequestClick: (request: any) => void;
}

export const MaintenanceTabs = ({ 
  propertyId, 
  selectedYear,
  filteredRequests,
  onRequestClick
}: MaintenanceTabsProps) => {
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState("preventive");
  const isMobile = useIsMobile();
  const [isCreateWorkOrderOpen, setIsCreateWorkOrderOpen] = useState(false);
  
  // Use real work order data
  const { workOrders, isLoading, refetch } = useWorkOrdersData();
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleCreateWorkOrder = () => {
    console.log("Create Work Order button clicked in MaintenanceTabs");
    setIsCreateWorkOrderOpen(true);
  };
  
  return (
    <Tabs defaultValue="preventive" className="w-full" onValueChange={handleTabChange}>
      <TabsList className={`w-full ${isMobile ? "flex flex-wrap gap-1" : "grid grid-cols-4"}`}>
        <TabsTrigger value="preventive" className={isMobile ? "flex-1 text-xs p-1" : ""}>
          {t('preventiveMaintenance')}
        </TabsTrigger>
        <TabsTrigger value="requests" className={isMobile ? "flex-1 text-xs p-1" : ""}>
          {t('maintenanceRequestTitle')}
        </TabsTrigger>
        <TabsTrigger value="workorders" className={isMobile ? "flex-1 text-xs p-1" : ""}>
          {t('workOrders')}
        </TabsTrigger>
        <TabsTrigger value="costs" className={isMobile ? "flex-1 text-xs p-1" : ""}>
          {t('costs')}
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="preventive" className="pt-6">
        <PreventiveMaintenance />
      </TabsContent>
      
      <TabsContent value="requests" className="pt-6">
        <MaintenanceList 
          requests={filteredRequests} 
          onMaintenanceUpdate={() => {}} 
        />
      </TabsContent>
      
      <TabsContent value="workorders" className="pt-6">
        <WorkOrderList 
          workOrders={workOrders}
          onCreateWorkOrder={handleCreateWorkOrder} 
        />
      </TabsContent>
      
      <TabsContent value="costs" className="pt-6">
        <PropertyFinancials 
          propertyId={propertyId} 
          selectedYear={selectedYear}
        />
      </TabsContent>
    </Tabs>
  );
};
