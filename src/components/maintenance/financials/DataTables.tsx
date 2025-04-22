
import { MaintenanceTable } from "./tables/MaintenanceTable";
import { ExpensesTable } from "./tables/ExpensesTable";
import { RentRollTable } from "./tables/rent-roll/RentRollTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useEffect } from "react";

interface DataTablesProps {
  propertyId: string;
  expenses: any[];
  maintenance: any[];
}

export const DataTables = ({ propertyId, expenses, maintenance }: DataTablesProps) => {
  const { t } = useLocale();

  console.log("DataTables propertyId:", propertyId);
  console.log("DataTables expenses length:", expenses.length);
  console.log("DataTables maintenance length:", maintenance.length);
  
  useEffect(() => {
    console.log("DataTables - propertyId a changé:", propertyId);
    
    if (!propertyId) {
      console.error("ATTENTION: propertyId est manquant dans DataTables");
    } else {
      console.log("DataTables a un propertyId valide:", propertyId);
    }
  }, [propertyId]);

  useEffect(() => {
    console.log("DataTables monté/mis à jour avec propertyId:", propertyId);
  }, []);
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="expenses" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="maintenance">{t('maintenanceTitle', { fallback: 'Maintenance' })}</TabsTrigger>
          <TabsTrigger value="expenses">{t('expenses', { fallback: 'Expenses' })}</TabsTrigger>
          <TabsTrigger value="rent-roll">{t('rentRoll', { fallback: 'Rent Roll' })}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="maintenance">
          <MaintenanceTable maintenance={maintenance} />
        </TabsContent>
        
        <TabsContent value="expenses">
          <ExpensesTable expenses={expenses} propertyId={propertyId} />
        </TabsContent>
        
        <TabsContent value="rent-roll">
          <RentRollTable propertyId={propertyId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
