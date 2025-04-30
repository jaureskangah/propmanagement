
import { MaintenanceTable } from "./tables/MaintenanceTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useEffect } from "react";
import { ExpensesTable } from "./tables/ExpensesTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExportButtons } from "./ExportButtons";

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

  return (
    <div className="space-y-6">
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Vue d'ensemble financière</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-medium">Dépenses totales</h3>
              <p className="text-3xl font-bold text-blue-600">
                ${expenses.reduce((total, expense) => total + expense.amount, 0).toLocaleString()}
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Coûts de maintenance</h3>
              <p className="text-3xl font-bold text-emerald-600">
                ${maintenance.reduce((total, m) => total + m.cost, 0).toLocaleString()}
              </p>
            </div>
            <div className="col-span-1 md:col-span-2">
              <ExportButtons 
                expenses={expenses} 
                maintenance={maintenance} 
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="maintenance" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="expenses">Dépenses</TabsTrigger>
        </TabsList>
        <TabsContent value="maintenance">
          <MaintenanceTable maintenance={maintenance} />
        </TabsContent>
        <TabsContent value="expenses">
          <ExpensesTable expenses={expenses} propertyId={propertyId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
