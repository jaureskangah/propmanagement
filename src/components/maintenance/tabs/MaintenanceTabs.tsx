
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PreventiveMaintenance } from "@/components/maintenance/PreventiveMaintenance";
import { VendorList } from "@/components/maintenance/vendors/VendorList";
import { WorkOrderList } from "@/components/maintenance/work-orders/WorkOrderList";
import { MaintenanceTasksList } from "@/components/maintenance/tasks/MaintenanceTasksList";
import { CreateWorkOrderDialog } from "@/components/maintenance/work-orders/CreateWorkOrderDialog";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useToast } from "@/hooks/use-toast";
import { ClipboardList, Wrench, Hammer, CalendarCheck, FileSpreadsheet } from "lucide-react";

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
    <Tabs defaultValue="maintenance" className="space-y-4">
      <TabsList className="grid grid-cols-2 gap-2">
        <TabsTrigger value="maintenance" className="flex items-center gap-2">
          <ClipboardList className="h-4 w-4" />
          {t('maintenanceManagement')}
        </TabsTrigger>
        <TabsTrigger value="vendors" className="flex items-center gap-2">
          <Wrench className="h-4 w-4" />
          {t('vendors')}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="maintenance" className="space-y-6">
        <Tabs defaultValue="tasks" className="w-full">
          <TabsList className="w-full grid grid-cols-3 gap-2">
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              {t('maintenanceTasks')}
            </TabsTrigger>
            <TabsTrigger value="preventive" className="flex items-center gap-2">
              <CalendarCheck className="h-4 w-4" />
              {t('preventiveMaintenance')}
            </TabsTrigger>
            <TabsTrigger value="work-orders" className="flex items-center gap-2">
              <Hammer className="h-4 w-4" />
              {t('workOrders')}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="tasks" className="pt-4">
            <MaintenanceTasksList
              requests={filteredRequests}
            />
          </TabsContent>

          <TabsContent value="preventive" className="pt-4">
            <PreventiveMaintenance />
          </TabsContent>

          <TabsContent value="work-orders" className="pt-4">
            <WorkOrderList
              workOrders={[]}
              onCreateWorkOrder={() => setWorkOrderDialogOpen(true)}
            />
          </TabsContent>
        </Tabs>
      </TabsContent>

      <TabsContent value="vendors">
        <VendorList />
      </TabsContent>

      <CreateWorkOrderDialog
        isOpen={workOrderDialogOpen}
        onClose={() => setWorkOrderDialogOpen(false)}
        onSuccess={handleWorkOrderSuccess}
        propertyId={propertyId}
      />
    </Tabs>
  );
};
