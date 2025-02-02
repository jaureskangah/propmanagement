import { RevenueChart } from "./RevenueChart";
import { RecentActivity } from "./RecentActivity";
import { DashboardMetrics } from "./DashboardMetrics";
import { PrioritySection } from "./PrioritySection";
import { DashboardDateFilter, type DateRange } from "./DashboardDateFilter";

interface DashboardContentProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  propertiesData: any[];
  maintenanceData: any[];
  tenantsData: any[];
}

export const DashboardContent = ({
  dateRange,
  onDateRangeChange,
  propertiesData,
  maintenanceData,
  tenantsData,
}: DashboardContentProps) => {
  // Extraire les données de paiement de tous les locataires
  const paymentsData = tenantsData?.flatMap(tenant => 
    tenant.tenant_payments?.map((payment: any) => ({
      ...payment,
      tenants: tenant
    }))
  ) || [];

  return (
    <div className="space-y-6">
      <DashboardDateFilter onDateRangeChange={onDateRangeChange} />
      
      <DashboardMetrics 
        propertiesData={propertiesData}
        maintenanceData={maintenanceData}
        tenantsData={tenantsData}
        dateRange={dateRange}
      />

      <PrioritySection 
        maintenanceData={maintenanceData}
        tenantsData={tenantsData}
        paymentsData={paymentsData}
      />

      <RevenueChart />
      
      <RecentActivity />
    </div>
  );
};