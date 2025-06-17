
import React from "react";
import { PrioritySection } from "../PrioritySection";

interface DashboardPrioritiesProps {
  maintenanceData: any[];
  tenantsData: any[];
  paymentsData: any[];
}

export const DashboardPriorities = ({ 
  maintenanceData, 
  tenantsData, 
  paymentsData 
}: DashboardPrioritiesProps) => {
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h2 className="text-2xl font-semibold">Priorités</h2>
        <p className="text-muted-foreground">
          Tâches urgentes et éléments nécessitant votre attention
        </p>
      </div>

      {/* Priority Content */}
      <PrioritySection
        maintenanceData={maintenanceData}
        tenantsData={tenantsData}
        paymentsData={paymentsData}
      />
    </div>
  );
};
