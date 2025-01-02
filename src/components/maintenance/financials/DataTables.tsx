import { RentRollTable } from "./tables/rent-roll/RentRollTable";
import { ExpensesTable } from "./tables/ExpensesTable";
import { MaintenanceTable } from "./tables/MaintenanceTable";

interface DataTablesProps {
  propertyId: string;
  expenses: any[];
  maintenance: any[];
}

export const DataTables = ({ propertyId, expenses, maintenance }: DataTablesProps) => {
  return (
    <div className="space-y-6">
      <RentRollTable propertyId={propertyId} />
      <ExpensesTable expenses={expenses} />
      <MaintenanceTable maintenance={maintenance} />
    </div>
  );
};