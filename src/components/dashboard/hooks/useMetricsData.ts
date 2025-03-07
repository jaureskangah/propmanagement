
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
    occupancyTrend,
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
  
  // Revenu mensuel total basé sur les locataires actuels
  const totalMonthlyRevenue = filteredTenantsData.reduce((acc, tenant) => {
    const rentAmount = tenant.rent_amount || 0;
    return acc + rentAmount;
  }, 0);

  // Générer des données de graphique
  const occupancyChartData = generateMonthlyData(filteredTenantsData).map((m) => {
    const monthUnits = validPropertiesData.reduce((acc, property) => {
      const propertyDate = new Date(property.created_at);
      if (propertyDate.getMonth() <= m.month && propertyDate.getFullYear() <= m.year) {
        return acc + (property.units || 1); // Default to 1 if units not specified
      }
      return acc;
    }, 0);
    
    return {
      value: monthUnits > 0 ? Math.round((m.value / monthUnits) * 100) : 0
    };
  });

  const revenueChartData = generateMonthlyData(validTenantsData, 'rent_amount');
  const maintenanceChartData = generateMonthlyData(validMaintenanceData);
  const tenantsChartData = generateMonthlyData(validTenantsData).map(m => ({ value: m.value || 0 }));
  const propertiesChartData = generateMonthlyData(validPropertiesData).map(m => ({ 
    value: m.value > 0 ? m.value : 0
  }));

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
      occupancy: {
        rate: globalOccupancyRate || 0,
        trend: occupancyTrend || 0,
        chartData: occupancyChartData
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
      revenue: {
        monthly: totalMonthlyRevenue,
        chartData: revenueChartData
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
