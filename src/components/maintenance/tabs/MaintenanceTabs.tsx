
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, ClipboardList, Users, DollarSign } from "lucide-react";
import { PreventiveMaintenance } from "../PreventiveMaintenance";
import { WorkOrderList } from "../work-orders/WorkOrderList";
import { VendorList } from "../vendors/VendorList";
import { PropertyFinancials } from "../PropertyFinancials";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface MaintenanceTabsProps {
  propertyId: string;
  mockFinancialData: {
    propertyId: string;
    expenses: Array<{ category: string; amount: number; date: string }>;
    maintenance: Array<{ description: string; cost: number; date: string }>;
  };
}

export const MaintenanceTabs = ({ propertyId, mockFinancialData }: MaintenanceTabsProps) => {
  const [isCreatingWorkOrder, setIsCreatingWorkOrder] = useState(false);

  const { data: workOrders = [] } = useQuery({
    queryKey: ['work-orders', propertyId],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('vendor_interventions')
        .select(`
          *,
          vendors (
            name
          ),
          properties (
            name
          )
        `)
        .eq('user_id', userData.user.id);

      if (error) throw error;

      return data.map(order => ({
        ...order,
        vendor: order.vendors?.name || 'Unknown Vendor',
        property: order.properties?.name || undefined,
        unit: order.unit_number || undefined
      }));
    },
  });

  const handleCreateWorkOrder = () => {
    setIsCreatingWorkOrder(true);
  };

  return (
    <Tabs defaultValue="preventive" className="space-y-4">
      <TabsList className="w-full justify-start bg-background border-b p-0 h-auto overflow-x-auto flex-nowrap">
        <TabsTrigger 
          value="preventive"
          className="flex items-center gap-2 px-4 sm:px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none transition-all duration-200 whitespace-nowrap"
        >
          <Calendar className="h-4 w-4 hidden sm:block" />
          <span>Preventive</span>
        </TabsTrigger>
        <TabsTrigger 
          value="vendors"
          className="flex items-center gap-2 px-4 sm:px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none transition-all duration-200 whitespace-nowrap"
        >
          <Users className="h-4 w-4 hidden sm:block" />
          <span>Vendors</span>
        </TabsTrigger>
        <TabsTrigger 
          value="work-orders"
          className="flex items-center gap-2 px-4 sm:px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none transition-all duration-200 whitespace-nowrap"
        >
          <ClipboardList className="h-4 w-4 hidden sm:block" />
          <span>Work Orders</span>
        </TabsTrigger>
        <TabsTrigger 
          value="financials"
          className="flex items-center gap-2 px-4 sm:px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none transition-all duration-200 whitespace-nowrap"
        >
          <DollarSign className="h-4 w-4 hidden sm:block" />
          <span>Costs</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="preventive" className="animate-fade-in">
        <PreventiveMaintenance />
      </TabsContent>

      <TabsContent value="vendors" className="animate-fade-in">
        <VendorList />
      </TabsContent>

      <TabsContent value="work-orders" className="animate-fade-in">
        <WorkOrderList 
          workOrders={workOrders} 
          onCreateWorkOrder={handleCreateWorkOrder}
        />
      </TabsContent>

      <TabsContent value="financials" className="animate-fade-in">
        <PropertyFinancials {...mockFinancialData} />
      </TabsContent>
    </Tabs>
  );
};
