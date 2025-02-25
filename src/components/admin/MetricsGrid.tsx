
import { Users, Building2, DollarSign } from "lucide-react";
import { MetricCard } from "./MetricCard";
import { useLocale } from "@/components/providers/LocaleProvider";

interface MetricsGridProps {
  totalUsers: number;
  activeUsers: number;
  totalProperties: number;
  totalRevenue: number;
}

export function MetricsGrid({ totalUsers, activeUsers, totalProperties, totalRevenue }: MetricsGridProps) {
  const { t } = useLocale();
  
  console.log('Current translations:', {
    totalUsers: t('totalUsers'),
    activeUsers: t('activeUsers'),
    properties: t('properties'),
    totalRevenue: t('totalRevenue')
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
      <MetricCard
        title={t('totalUsers')}
        value={totalUsers}
        icon={Users}
      />
      <MetricCard
        title={t('activeUsers')}
        value={activeUsers}
        icon={Users}
        iconColor="text-green-500"
      />
      <MetricCard
        title={t('properties')}
        value={totalProperties}
        icon={Building2}
      />
      <MetricCard
        title={t('totalRevenue')}
        value={`$${totalRevenue.toLocaleString()}`}
        icon={DollarSign}
      />
    </div>
  );
}
