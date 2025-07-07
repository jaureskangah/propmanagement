
import { ExpensesTable } from "./tables/ExpensesTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useEffect } from "react";

interface DataTablesProps {
  propertyId: string;
  expenses: any[];
  allExpenses?: any[];
}

export const DataTables = ({ propertyId, expenses, allExpenses = [] }: DataTablesProps) => {
  const { t } = useLocale();

  console.log("DataTables propertyId:", propertyId);
  console.log("DataTables expenses length:", expenses.length);
  console.log("DataTables allExpenses length:", allExpenses.length);
  
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
      {/* Expenses Table - Always show the table, even when no expenses */}
      <ExpensesTable 
        expenses={expenses}
        propertyId={propertyId}
      />
    </div>
  );
};
