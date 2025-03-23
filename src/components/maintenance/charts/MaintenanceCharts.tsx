
import React from "react";
import { useMaintenanceData } from "./hooks/useMaintenanceData";
import { LoadingChartState } from "./components/LoadingChartState";
import { EmptyChartState } from "./components/EmptyChartState";
import { MaintenanceRequestsChart } from "./components/MaintenanceRequestsChart";
import { MaintenanceExpensesChart } from "./components/MaintenanceExpensesChart";

interface MaintenanceChartsProps {
  propertyId: string;
}

export const MaintenanceCharts = ({ propertyId }: MaintenanceChartsProps) => {
  // Récupération des données de maintenance
  const { data: maintenanceData, isLoading: isLoadingMaintenance } = useMaintenanceData(propertyId);
  
  // Afficher le chargement
  if (isLoadingMaintenance) {
    return <LoadingChartState />;
  }
  
  // Si pas de données
  if (!maintenanceData || maintenanceData.length === 0) {
    return <EmptyChartState />;
  }
  
  return (
    <div className="space-y-6">
      <MaintenanceRequestsChart maintenanceData={maintenanceData} />
      <MaintenanceExpensesChart maintenanceData={maintenanceData} />
    </div>
  );
};
