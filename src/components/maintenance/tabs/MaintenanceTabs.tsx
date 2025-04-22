
import React, { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MaintenanceRequests } from "./MaintenanceRequests";
import { MaintenanceTasks } from "../tasks/MaintenanceTasks";
import { MaintenanceCharts } from "../charts/MaintenanceCharts";
import { PropertyFinancials } from "../PropertyFinancials";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useIsMobile } from "@/hooks/use-mobile";
import { Skeleton } from "@/components/ui/skeleton";

// Création d'un composant de chargement réutilisable
const TabContentSkeleton = () => (
  <div className="pt-6">
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array(4).fill(0).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-md" />
        ))}
      </div>
    </div>
  </div>
);

export const MaintenanceTabs = ({ 
  propertyId, 
  selectedYear,
  filteredRequests, 
  onRequestClick 
}) => {
  const { t } = useLocale();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    console.log("MaintenanceTabs - propertyId:", propertyId);
    console.log("MaintenanceTabs - selectedYear:", selectedYear);
  }, [propertyId, selectedYear]);
  
  return (
    <Tabs defaultValue="financials" className="w-full">
      <TabsList className={`${isMobile ? "flex flex-wrap" : "w-full md:grid md:grid-cols-4"} bg-card`}>
        <TabsTrigger 
          value="dashboard" 
          className={`${isMobile ? "flex-1" : ""} text-sm data-[state=active]:bg-[#ea384c]/10 data-[state=active]:text-[#ea384c] data-[state=active]:font-medium`}
        >
          {t('dashboard')}
        </TabsTrigger>
        <TabsTrigger 
          value="requests" 
          className={`${isMobile ? "flex-1" : ""} text-sm data-[state=active]:bg-[#ea384c]/10 data-[state=active]:text-[#ea384c] data-[state=active]:font-medium`}
        >
          {t('maintenanceRequests')}
        </TabsTrigger>
        <TabsTrigger 
          value="tasks" 
          className={`${isMobile ? "flex-1" : ""} text-sm data-[state=active]:bg-[#ea384c]/10 data-[state=active]:text-[#ea384c] data-[state=active]:font-medium`}
        >
          {t('scheduledTasks')}
        </TabsTrigger>
        <TabsTrigger 
          value="financials" 
          className={`${isMobile ? "flex-1" : ""} text-sm data-[state=active]:bg-[#ea384c]/10 data-[state=active]:text-[#ea384c] data-[state=active]:font-medium`}
        >
          {t('costs', { fallback: 'Coûts et dépenses' })}
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="dashboard" className="pt-6">
        <MaintenanceCharts propertyId={propertyId} selectedYear={selectedYear} />
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
