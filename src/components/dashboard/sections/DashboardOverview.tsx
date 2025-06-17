
import React from "react";
import { DashboardMetrics } from "../DashboardMetrics";
import { DateRange } from "../DashboardDateFilter";

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
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h2 className="text-2xl font-semibold">Vue d'ensemble</h2>
        <p className="text-muted-foreground">
          Indicateurs clés de performance de votre portefeuille immobilier
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
