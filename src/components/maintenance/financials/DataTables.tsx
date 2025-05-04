
import { MaintenanceTable } from "./tables/MaintenanceTable";
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

  return (
    <div className="space-y-6">
      <MaintenanceTable maintenance={maintenance} />
    </div>
  );
};
