
import React, { useMemo } from "react";
import { DollarSign, Calendar, Clock, Activity } from "lucide-react";
import { VendorIntervention } from "@/types/vendor";
import { DashboardMetric } from "@/components/DashboardMetric";
import { useLocale } from "@/components/providers/LocaleProvider";

interface InterventionStatsProps {
  interventions: VendorIntervention[];
}

export const InterventionStats = ({ interventions }: InterventionStatsProps) => {
  const { t } = useLocale();
  
  const stats = useMemo(() => {
    const totalCost = interventions.reduce((sum, int) => sum + (int.cost || 0), 0);
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    
    const monthlyInterventions = interventions.filter(int => {
      const date = new Date(int.date);
      return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
    });

    const pendingInterventions = interventions.filter(int => 
      int.status === "pending" || int.status === "in_progress"
    );

    const avgCostPerIntervention = interventions.length > 0 
      ? totalCost / interventions.length 
      : 0;

    return {
      totalCost,
      monthlyCount: monthlyInterventions.length,
      pendingCount: pendingInterventions.length,
      avgCost: avgCostPerIntervention
    };
  }, [interventions]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <DashboardMetric
        title={t('totalExpenses')}
        value={`$${stats.totalCost.toLocaleString()}`}
        icon={<DollarSign className="h-4 w-4 text-blue-500" />}
        description={t('allTime')}
        className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-100 dark:border-blue-800/30 hover:border-blue-200 dark:hover:border-blue-700/40"
      />
      <DashboardMetric
        title={t('monthlyInterventions')}
        value={stats.monthlyCount.toString()}
        icon={<Calendar className="h-4 w-4 text-green-500" />}
        description={t('thisMonth')}
        className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-100 dark:border-green-800/30 hover:border-green-200 dark:hover:border-green-700/40"
      />
      <DashboardMetric
        title={t('pendingInterventions')}
        value={stats.pendingCount.toString()}
        icon={<Clock className="h-4 w-4 text-amber-500" />}
        description={t('toBeProcessed')}
        className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-amber-100 dark:border-amber-800/30 hover:border-amber-200 dark:hover:border-amber-700/40"
      />
      <DashboardMetric
        title={t('averageCost')}
        value={`$${stats.avgCost.toLocaleString()}`}
        icon={<Activity className="h-4 w-4 text-purple-500" />}
        description={t('perIntervention')}
        className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-purple-100 dark:border-purple-800/30 hover:border-purple-200 dark:hover:border-purple-700/40"
      />
    </div>
  );
};
