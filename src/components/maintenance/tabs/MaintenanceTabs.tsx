
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, ClipboardList, Users, DollarSign } from "lucide-react";
import { PreventiveMaintenance } from "../PreventiveMaintenance";
import { WorkOrderList } from "../work-orders/WorkOrderList";
import { VendorList } from "../vendors/VendorList";
import { PropertyFinancials } from "../PropertyFinancials";
import { useLocale } from "@/components/providers/LocaleProvider";

interface MaintenanceTabsProps {
  propertyId: string;
  mockFinancialData: any;
}

export const MaintenanceTabs = ({ propertyId, mockFinancialData }: MaintenanceTabsProps) => {
  const { t } = useLocale();

  return (
    <div className="space-y-6">
      <div className="animate-fade-in bg-gradient-to-br from-white via-red-50 to-white dark:from-gray-900 dark:via-red-900/10 dark:to-gray-900 p-6 rounded-xl shadow-lg">
        <Tabs defaultValue="preventive" className="space-y-4">
          <TabsList className="w-full justify-start bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-b p-0 h-auto overflow-x-auto flex-nowrap rounded-t-xl shadow-sm">
            <TabsTrigger 
              value="preventive"
              className="flex items-center gap-2 px-4 sm:px-6 py-3 text-slate-600 dark:text-slate-300 rounded-none transition-all duration-300 hover:bg-red-50/50 dark:hover:bg-red-500/10 data-[state=active]:border-b-2 data-[state=active]:border-red-500 data-[state=active]:text-red-500 dark:data-[state=active]:text-red-400 whitespace-nowrap group"
            >
              <Calendar className="h-4 w-4 hidden sm:block transition-transform duration-300 group-hover:scale-110" />
              <span>{t('preventiveMaintenance')}</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="vendors"
              className="flex items-center gap-2 px-4 sm:px-6 py-3 text-slate-600 dark:text-slate-300 rounded-none transition-all duration-300 hover:bg-red-50/50 dark:hover:bg-red-500/10 data-[state=active]:border-b-2 data-[state=active]:border-red-500 data-[state=active]:text-red-500 dark:data-[state=active]:text-red-400 whitespace-nowrap group"
            >
              <Users className="h-4 w-4 hidden sm:block transition-transform duration-300 group-hover:scale-110" />
              <span>{t('vendors')}</span>
            </TabsTrigger>

            <TabsTrigger 
              value="work-orders"
              className="flex items-center gap-2 px-4 sm:px-6 py-3 text-slate-600 dark:text-slate-300 rounded-none transition-all duration-300 hover:bg-red-50/50 dark:hover:bg-red-500/10 data-[state=active]:border-b-2 data-[state=active]:border-red-500 data-[state=active]:text-red-500 dark:data-[state=active]:text-red-400 whitespace-nowrap group"
            >
              <ClipboardList className="h-4 w-4 hidden sm:block transition-transform duration-300 group-hover:scale-110" />
              <span>{t('workOrders')}</span>
            </TabsTrigger>

            <TabsTrigger 
              value="financials"
              className="flex items-center gap-2 px-4 sm:px-6 py-3 text-slate-600 dark:text-slate-300 rounded-none transition-all duration-300 hover:bg-red-50/50 dark:hover:bg-red-500/10 data-[state=active]:border-b-2 data-[state=active]:border-red-500 data-[state=active]:text-red-500 dark:data-[state=active]:text-red-400 whitespace-nowrap group"
            >
              <DollarSign className="h-4 w-4 hidden sm:block transition-transform duration-300 group-hover:scale-110" />
              <span>{t('costs')}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="preventive" className="animate-fade-in bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 shadow-sm">
            <PreventiveMaintenance />
          </TabsContent>

          <TabsContent value="vendors" className="animate-fade-in bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 shadow-sm">
            <VendorList />
          </TabsContent>

          <TabsContent value="work-orders" className="animate-fade-in bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 shadow-sm">
            <WorkOrderList workOrders={[]} onCreateWorkOrder={() => {}} />
          </TabsContent>

          <TabsContent value="financials" className="animate-fade-in bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 shadow-sm">
            <PropertyFinancials {...mockFinancialData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
