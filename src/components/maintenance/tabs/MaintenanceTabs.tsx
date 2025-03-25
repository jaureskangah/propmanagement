
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PreventiveMaintenance } from "../PreventiveMaintenance";
import { MaintenanceList } from "../MaintenanceList";
import { WorkOrderList } from "../work-orders/MainWorkOrderList";
import { PropertyFinancials } from "../PropertyFinancials";
import { useLocale } from "@/components/providers/LocaleProvider";
import { WorkOrder } from "@/types/workOrder";

interface MaintenanceTabsProps {
  propertyId: string;
  mockFinancialData: any;
  filteredRequests: any[];
  onRequestClick: (request: any) => void;
}

export const MaintenanceTabs = ({ 
  propertyId, 
  mockFinancialData,
  filteredRequests,
  onRequestClick
}: MaintenanceTabsProps) => {
  const { t } = useLocale();
  
  // Mock work orders for the WorkOrderList component
  const mockWorkOrders: WorkOrder[] = [
    {
      id: "wo1",
      title: "Fix broken pipe",
      property: "Sunset Apartments",
      unit: "101",
      status: "En cours",
      vendor: "Plomberie Express",
      cost: 250,
      date: "2023-09-15",
      priority: "high"
    },
    {
      id: "wo2",
      title: "Replace light fixtures",
      property: "Mountain View Condos",
      unit: "305",
      status: "Planifié",
      vendor: "ElectroPro",
      cost: 180,
      date: "2023-09-22",
      priority: "medium"
    },
    {
      id: "wo3",
      title: "HVAC maintenance",
      property: "Sunset Apartments",
      unit: "205",
      status: "Terminé",
      vendor: "Cool Air Services",
      cost: 350,
      date: "2023-09-10",
      priority: "high"
    }
  ];
  
  // Handler for creating new work orders
  const handleCreateWorkOrder = () => {
    console.log("Create work order clicked");
    // In a real implementation, this would open a dialog to create a new work order
  };
  
  return (
    <Tabs defaultValue="preventive" className="w-full">
      <TabsList className="w-full grid grid-cols-4">
        <TabsTrigger value="preventive">{t('preventiveMaintenance')}</TabsTrigger>
        <TabsTrigger value="requests">{t('maintenanceRequestTitle')}</TabsTrigger>
        <TabsTrigger value="workorders">{t('workOrders')}</TabsTrigger>
        <TabsTrigger value="costs">{t('costs')}</TabsTrigger>
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
          workOrders={mockWorkOrders}
          onCreateWorkOrder={handleCreateWorkOrder}
        />
      </TabsContent>
      
      <TabsContent value="costs" className="pt-6">
        <PropertyFinancials propertyId={propertyId} />
      </TabsContent>
    </Tabs>
  );
};
