
import React from "react";
import { DashboardMetrics } from "../DashboardMetrics";
import { DateRange } from "../DashboardDateFilter";
import { useLocale } from "@/components/providers/LocaleProvider";

interface DashboardOverviewProps {
  dateRange: DateRange;
  propertiesData: any[];
  maintenanceData: any[];
  tenantsData: any[];
}

export const DashboardOverview = ({ 
  dateRange, 
  propertiesData, 
  maintenanceData, 
  tenantsData 
}: DashboardOverviewProps) => {
  const { t } = useLocale();

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h2 className="text-2xl font-semibold">{t('overview')}</h2>
        <p className="text-muted-foreground">
          {t('overviewDescription')}
        </p>
      </div>

      {/* Metrics */}
      <DashboardMetrics 
        propertiesData={propertiesData}
        maintenanceData={maintenanceData}
        tenantsData={tenantsData}
        dateRange={dateRange}
      />
    </div>
  );
};
