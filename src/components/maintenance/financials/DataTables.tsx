
import { MaintenanceTable } from "./tables/MaintenanceTable";
import { ExpensesTable } from "./tables/ExpensesTable";
import { RentRollTable } from "./tables/rent-roll/RentRollTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocale } from "@/components/providers/LocaleProvider";

interface DataTablesProps {
  propertyId: string;
  expenses: any[];
  maintenance: any[];
}

export const DataTables = ({ propertyId, expenses, maintenance }: DataTablesProps) => {
  const { t } = useLocale();
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="maintenance" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="maintenance">{t('maintenanceTitle', { fallback: 'Maintenance' })}</TabsTrigger>
          <TabsTrigger value="expenses">{t('expenses', { fallback: 'Expenses' })}</TabsTrigger>
          <TabsTrigger value="rent-roll">{t('rentRoll', { fallback: 'Rent Roll' })}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="maintenance">
          <MaintenanceTable maintenance={maintenance} />
        </TabsContent>
        
        <TabsContent value="expenses">
          <ExpensesTable expenses={expenses} />
        </TabsContent>
        
        <TabsContent value="rent-roll">
          <RentRollTable propertyId={propertyId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
