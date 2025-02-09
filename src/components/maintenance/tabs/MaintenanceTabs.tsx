
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, ClipboardList, Users, DollarSign } from "lucide-react";
import { PreventiveMaintenance } from "../PreventiveMaintenance";
import { WorkOrderList } from "../work-orders/WorkOrderList";
import { VendorList } from "../vendors/VendorList";
import { PropertyFinancials } from "../PropertyFinancials";

interface MaintenanceTabsProps {
  propertyId: string;
  mockFinancialData: {
    propertyId: string;
    expenses: Array<{ category: string; amount: number; date: string }>;
    maintenance: Array<{ description: string; cost: number; date: string }>;
  };
}

export const MaintenanceTabs = ({ propertyId, mockFinancialData }: MaintenanceTabsProps) => {
  const mockWorkOrders = [
    {
      id: "1",
      title: "Fix Leaking Faucet",
      status: "In Progress",
      property: "123 Main St",
      unit: "4B",
      vendor: "John's Plumbing",
      cost: 150,
      date: "2024-03-20",
      priority: "high"
    },
    {
      id: "2",
      title: "Replace AC Filter",
      status: "Scheduled",
      property: "456 Oak Ave",
      unit: "2A",
      vendor: "Cool Air Services",
      cost: 75,
      date: "2024-03-22",
      priority: "medium"
    }
  ];

  const handleCreateWorkOrder = () => {
    console.log("Create work order clicked");
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
          workOrders={mockWorkOrders}
          onCreateWorkOrder={handleCreateWorkOrder}
        />
      </TabsContent>

      <TabsContent value="financials" className="animate-fade-in">
        <PropertyFinancials {...mockFinancialData} />
      </TabsContent>
    </Tabs>
  );
};
