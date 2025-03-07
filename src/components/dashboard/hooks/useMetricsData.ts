
import { DateRange } from "../DashboardDateFilter";
import { generateMonthlyData, filterDataByDateRange, calculateOccupancyData } from "../utils/chartDataUtils";
import { useEffect } from "react";

export const useMetricsData = (
  propertiesData: any[],
  maintenanceData: any[],
  tenantsData: any[],
  dateRange: DateRange
) => {
  // Assurons-nous que les données sont valides
  const validPropertiesData = Array.isArray(propertiesData) ? propertiesData : [];
  const validMaintenanceData = Array.isArray(maintenanceData) ? maintenanceData : [];
  const validTenantsData = Array.isArray(tenantsData) ? tenantsData : [];

  // Logging pour débogage
  useEffect(() => {
    console.log("useMetricsData input:", {
      propertiesLength: validPropertiesData.length,
      maintenanceLength: validMaintenanceData.length,
      tenantsLength: validTenantsData.length,
      dateRange
    });
  }, [validPropertiesData, validMaintenanceData, validTenantsData, dateRange]);

  // Filtrer les données par plage de dates
  const filteredMaintenanceData = filterDataByDateRange(validMaintenanceData, dateRange);
  const filteredTenantsData = filterDataByDateRange(validTenantsData, dateRange);

  const {
    globalOccupancyRate,
    totalUnits,
    occupiedUnits
  } = calculateOccupancyData(validPropertiesData, filteredTenantsData, dateRange);

  // Calculer de nouvelles propriétés ce mois-ci
  const newPropertiesThisMonth = filterDataByDateRange(validPropertiesData, {
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date()
  }).length;

  // Demandes de maintenance en attente
  const pendingMaintenance = filteredMaintenanceData.filter(req => req.status === "Pending" || req.status === "pending").length;

  // Générer des données de graphique
  const tenantsChartData = generateMonthlyData(validTenantsData).map(m => ({ value: m.value || 0 }));
  const propertiesChartData = generateMonthlyData(validPropertiesData).map(m => ({ 
    value: m.value > 0 ? m.value : 0
  }));
  const maintenanceChartData = generateMonthlyData(validMaintenanceData);

  // Calculer les messages non lus
  const unreadMessages = validTenantsData.reduce((acc, tenant) => {
    const unreadCount = tenant.tenant_communications?.filter(
      (comm: any) => comm.status === 'unread' && comm.is_from_tenant
    ).length || 0;
    return acc + unreadCount;
  }, 0);

  // Retourner les métriques formatées
  return {
    metrics: {
      properties: {
        total: validPropertiesData.length || 0,
        new: newPropertiesThisMonth,
        chartData: propertiesChartData
      },
      tenants: {
        total: validTenantsData.length || 0,
        occupancyRate: globalOccupancyRate || 0,
        chartData: tenantsChartData
      },
      maintenance: {
        pending: pendingMaintenance,
        chartData: maintenanceChartData
      },
      communications: {
        chartData: Array.from({ length: 7 }, (_, i) => ({
          value: Math.max(0, Math.floor(Math.random() * 5) + (i === 6 ? unreadMessages : 0))
        }))
      }
    },
    unreadMessages
  };
};
