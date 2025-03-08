
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PreventiveMaintenance } from "@/components/maintenance/PreventiveMaintenance";
import { VendorList } from "@/components/maintenance/vendors/VendorList";
import { WorkOrderList } from "@/components/maintenance/work-orders/WorkOrderList";
import { MaintenanceTasksList } from "@/components/maintenance/tasks/MaintenanceTasksList";
import { CreateWorkOrderDialog } from "@/components/maintenance/work-orders/CreateWorkOrderDialog";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useToast } from "@/hooks/use-toast";

interface MaintenanceTabsProps {
  propertyId: string;
  mockFinancialData: any;
  filteredRequests?: any[];
}

export const MaintenanceTabs = ({ propertyId, mockFinancialData, filteredRequests = [] }: MaintenanceTabsProps) => {
  const [workOrderDialogOpen, setWorkOrderDialogOpen] = useState(false);
  const { t } = useLocale();
  const { toast } = useToast();

  const handleWorkOrderSuccess = () => {
    toast({
      title: t('success'),
      description: t('workOrderCreated'),
    });
  };

  return (
    <Tabs defaultValue="tasks" className="space-y-4">
      <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <TabsTrigger value="tasks">{t('maintenanceTasks')}</TabsTrigger>
        <TabsTrigger value="preventive">{t('preventiveMaintenance')}</TabsTrigger>
        <TabsTrigger value="work-orders">{t('workOrders')}</TabsTrigger>
        <TabsTrigger value="vendors">{t('vendors')}</TabsTrigger>
      </TabsList>

      <TabsContent value="tasks" className="space-y-4">
        <MaintenanceTasksList
          requests={filteredRequests}
        />
      </TabsContent>

      <TabsContent value="preventive">
        <PreventiveMaintenance />
      </TabsContent>

      <TabsContent value="work-orders">
        <WorkOrderList
          workOrders={[]}
          onCreateWorkOrder={() => setWorkOrderDialogOpen(true)}
        />
      </TabsContent>

      <TabsContent value="vendors">
        <VendorList />
      </TabsContent>

      <CreateWorkOrderDialog
        isOpen={workOrderDialogOpen}
        onClose={() => setWorkOrderDialogOpen(false)}
        onSuccess={handleWorkOrderSuccess}
      />
    </Tabs>
  );
};
