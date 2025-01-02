import { MaintenanceTable } from "./tables/MaintenanceTable";

interface DataTablesProps {
  propertyId: string;
  expenses: any[];
  maintenance: any[];
}

export const DataTables = ({ propertyId, expenses, maintenance }: DataTablesProps) => {
  return (
    <div className="space-y-6">
      <MaintenanceTable maintenance={maintenance} />
    </div>
  );
};