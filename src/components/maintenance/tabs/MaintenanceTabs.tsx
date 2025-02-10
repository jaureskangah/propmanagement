
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
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

  return (
    <div className="space-y-6">
      <div className="animate-fade-in bg-gradient-to-br from-white via-red-50 to-white dark:from-gray-900 dark:via-red-900/10 dark:to-gray-900 p-6 rounded-xl shadow-lg">
        <Tabs defaultValue="preventive" className="space-y-4">
          <TabsList className="w-full justify-start bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-b p-0 h-auto overflow-x-auto flex-nowrap rounded-t-xl shadow-sm">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger 
                    value="preventive"
                    className="flex items-center gap-2 px-4 sm:px-6 py-3 text-slate-600 dark:text-slate-300 rounded-none transition-all duration-300 hover:bg-red-50/50 dark:hover:bg-red-500/10 data-[state=active]:border-b-2 data-[state=active]:border-red-500 data-[state=active]:text-red-500 dark:data-[state=active]:text-red-400 whitespace-nowrap group"
                  >
                    <Calendar className="h-4 w-4 hidden sm:block transition-transform duration-300 group-hover:scale-110" />
                    <span>Preventive</span>
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  View Preventive Maintenance Schedule
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger 
                    value="vendors"
                    className="flex items-center gap-2 px-4 sm:px-6 py-3 text-slate-600 dark:text-slate-300 rounded-none transition-all duration-300 hover:bg-red-50/50 dark:hover:bg-red-500/10 data-[state=active]:border-b-2 data-[state=active]:border-red-500 data-[state=active]:text-red-500 dark:data-[state=active]:text-red-400 whitespace-nowrap group"
                  >
                    <Users className="h-4 w-4 hidden sm:block transition-transform duration-300 group-hover:scale-110" />
                    <span>Vendors</span>
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  Manage Vendor Information
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger 
                    value="work-orders"
                    className="flex items-center gap-2 px-4 sm:px-6 py-3 text-slate-600 dark:text-slate-300 rounded-none transition-all duration-300 hover:bg-red-50/50 dark:hover:bg-red-500/10 data-[state=active]:border-b-2 data-[state=active]:border-red-500 data-[state=active]:text-red-500 dark:data-[state=active]:text-red-400 whitespace-nowrap group"
                  >
                    <ClipboardList className="h-4 w-4 hidden sm:block transition-transform duration-300 group-hover:scale-110" />
                    <span>Work Orders</span>
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  Track Work Orders
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger 
                    value="financials"
                    className="flex items-center gap-2 px-4 sm:px-6 py-3 text-slate-600 dark:text-slate-300 rounded-none transition-all duration-300 hover:bg-red-50/50 dark:hover:bg-red-500/10 data-[state=active]:border-b-2 data-[state=active]:border-red-500 data-[state=active]:text-red-500 dark:data-[state=active]:text-red-400 whitespace-nowrap group"
                  >
                    <DollarSign className="h-4 w-4 hidden sm:block transition-transform duration-300 group-hover:scale-110" />
                    <span>Costs</span>
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  View Financial Information
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </TabsList>

          <TabsContent value="preventive" className="animate-fade-in bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 shadow-sm">
            <PreventiveMaintenance />
          </TabsContent>

          <TabsContent value="vendors" className="animate-fade-in bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 shadow-sm">
            <VendorList />
          </TabsContent>

          <TabsContent value="work-orders" className="animate-fade-in bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 shadow-sm">
            <WorkOrderList 
              workOrders={workOrders} 
              onCreateWorkOrder={handleCreateWorkOrder}
            />
          </TabsContent>

          <TabsContent value="financials" className="animate-fade-in bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 shadow-sm">
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

