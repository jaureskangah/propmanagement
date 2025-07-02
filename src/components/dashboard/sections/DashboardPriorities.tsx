
import React from "react";
import { PrioritySection } from "../PrioritySection";
import { useLocale } from "@/components/providers/LocaleProvider";

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
  const { t } = useLocale();

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h2 className="text-2xl font-semibold">{t('priorities')}</h2>
        <p className="text-muted-foreground">
          {t('prioritiesDescription')}
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
