
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, ClipboardList, Users, DollarSign, Home } from "lucide-react";
import { PreventiveMaintenance } from "../PreventiveMaintenance";
import { WorkOrderList } from "../work-orders/WorkOrderList";
import { VendorList } from "../vendors/VendorList";
import { PropertyFinancials } from "../PropertyFinancials";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { CreateWorkOrderDialog } from "../work-orders/CreateWorkOrderDialog";
import { useQueryClient } from "@tanstack/react-query";
import { Tooltip } from "@/components/ui/tooltip";

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
  const queryClient = useQueryClient();

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

  const handleCloseDialog = () => {
    setIsCreatingWorkOrder(false);
  };

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['work-orders'] });
  };

  // Breadcrumbs component
  const Breadcrumbs = () => (
    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
      <Home className="h-4 w-4" />
      <span>/</span>
      <span>Maintenance</span>
      <span>/</span>
      <span className="text-primary">Dashboard</span>
    </div>
  );

  return (
    <div className="space-y-6">
      <Breadcrumbs />
      <div className="animate-fade-in bg-gradient-to-br from-white via-red-50 to-white p-6 rounded-xl shadow-lg">
        <Tabs defaultValue="preventive" className="space-y-4">
          <TabsList className="w-full justify-start bg-white/70 backdrop-blur-md border-b p-0 h-auto overflow-x-auto flex-nowrap rounded-t-xl shadow-sm">
            <Tooltip content="View Preventive Maintenance Schedule">
              <TabsTrigger 
                value="preventive"
                className="flex items-center gap-2 px-4 sm:px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none transition-all duration-300 hover:bg-red-50/50 data-[state=active]:animate-scale-in whitespace-nowrap group"
              >
                <Calendar className="h-4 w-4 hidden sm:block transition-transform duration-300 group-hover:scale-110 group-hover:text-red-500" />
                <span>Preventive</span>
              </TabsTrigger>
            </Tooltip>
            
            <Tooltip content="Manage Vendor Information">
              <TabsTrigger 
                value="vendors"
                className="flex items-center gap-2 px-4 sm:px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none transition-all duration-300 hover:bg-red-50/50 data-[state=active]:animate-scale-in whitespace-nowrap group"
              >
                <Users className="h-4 w-4 hidden sm:block transition-transform duration-300 group-hover:scale-110 group-hover:text-red-500" />
                <span>Vendors</span>
              </TabsTrigger>
            </Tooltip>

            <Tooltip content="Track Work Orders">
              <TabsTrigger 
                value="work-orders"
                className="flex items-center gap-2 px-4 sm:px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none transition-all duration-300 hover:bg-red-50/50 data-[state=active]:animate-scale-in whitespace-nowrap group"
              >
                <ClipboardList className="h-4 w-4 hidden sm:block transition-transform duration-300 group-hover:scale-110 group-hover:text-red-500" />
                <span>Work Orders</span>
              </TabsTrigger>
            </Tooltip>

            <Tooltip content="View Financial Information">
              <TabsTrigger 
                value="financials"
                className="flex items-center gap-2 px-4 sm:px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none transition-all duration-300 hover:bg-red-50/50 data-[state=active]:animate-scale-in whitespace-nowrap group"
              >
                <DollarSign className="h-4 w-4 hidden sm:block transition-transform duration-300 group-hover:scale-110 group-hover:text-red-500" />
                <span>Costs</span>
              </TabsTrigger>
            </Tooltip>
          </TabsList>

          <TabsContent value="preventive" className="animate-fade-in bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm">
            <PreventiveMaintenance />
          </TabsContent>

          <TabsContent value="vendors" className="animate-fade-in bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm">
            <VendorList />
          </TabsContent>

          <TabsContent value="work-orders" className="animate-fade-in bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm">
            <WorkOrderList 
              workOrders={workOrders} 
              onCreateWorkOrder={handleCreateWorkOrder}
            />
          </TabsContent>

          <TabsContent value="financials" className="animate-fade-in bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm">
            <PropertyFinancials {...mockFinancialData} />
          </TabsContent>
        </Tabs>

        <CreateWorkOrderDialog 
          isOpen={isCreatingWorkOrder}
          onClose={handleCloseDialog}
          onSuccess={handleSuccess}
          propertyId={propertyId}
        />
      </div>
    </div>
  );
};
