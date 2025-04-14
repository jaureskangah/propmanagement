import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MaintenanceRequests } from "./MaintenanceRequests";
import { MaintenanceTasks } from "../tasks/MaintenanceTasks";
import { MaintenanceCharts } from "../charts/MaintenanceCharts";
import { PropertyFinancials } from "../PropertyFinancials";
import { useLocale } from "@/components/providers/LocaleProvider";
import { MaintenanceRequest } from "../types";
import { useIsMobile } from "@/hooks/use-mobile";

export const MaintenanceTabs = ({ 
  propertyId, 
  selectedYear,
  filteredRequests, 
  onRequestClick 
}) => {
  const { t } = useLocale();
  const isMobile = useIsMobile();
  
  return (
    <Tabs defaultValue="dashboard" className="w-full">
      <TabsList className={`${isMobile ? "flex flex-wrap" : "w-full md:grid md:grid-cols-4"} bg-card`}>
        <TabsTrigger value="dashboard" className={`${isMobile ? "flex-1" : ""} text-sm`}>
          {t('dashboard')}
        </TabsTrigger>
        <TabsTrigger value="requests" className={`${isMobile ? "flex-1" : ""} text-sm`}>
          {t('maintenanceRequests')}
        </TabsTrigger>
        <TabsTrigger value="tasks" className={`${isMobile ? "flex-1" : ""} text-sm`}>
          {t('scheduledTasks')}
        </TabsTrigger>
        <TabsTrigger value="financials" className={`${isMobile ? "flex-1" : ""} text-sm`}>
          {t('financials')}
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="dashboard" className="pt-6">
        <MaintenanceCharts propertyId={propertyId} />
      </TabsContent>
      
      <TabsContent value="requests" className="pt-6">
        <MaintenanceRequests 
          requests={filteredRequests} 
          onRequestClick={onRequestClick} 
        />
      </TabsContent>
      
      <TabsContent value="tasks" className="pt-6">
        <MaintenanceTasks propertyId={propertyId} />
      </TabsContent>
      
      <TabsContent value="financials" className="pt-6">
        <PropertyFinancials propertyId={propertyId} selectedYear={selectedYear} />
      </TabsContent>
    </Tabs>
  );
};
