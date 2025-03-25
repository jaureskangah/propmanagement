
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PreventiveMaintenance } from "../PreventiveMaintenance";
import { MaintenanceList } from "../MaintenanceList";
import { WorkOrderList } from "../WorkOrderList";
import { PropertyFinancials } from "../PropertyFinancials";
import { useLocale } from "@/components/providers/LocaleProvider";

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
        <WorkOrderList />
      </TabsContent>
      
      <TabsContent value="costs" className="pt-6">
        <PropertyFinancials propertyId={propertyId} mockData={mockFinancialData} />
      </TabsContent>
    </Tabs>
  );
};
