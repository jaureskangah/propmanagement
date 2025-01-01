import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardMetric } from "@/components/DashboardMetric";
import { Calendar, DollarSign, Clock, Activity } from "lucide-react";
import { VendorIntervention } from "@/types/vendor";

interface InterventionStatsProps {
  interventions: VendorIntervention[];
}

export const InterventionStats = ({ interventions }: InterventionStatsProps) => {
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
        title="Total Cost"
        value={`$${stats.totalCost.toLocaleString()}`}
        icon={<DollarSign className="h-4 w-4 text-blue-500" />}
        description="Total expenses"
      />
      <DashboardMetric
        title="Monthly Interventions"
        value={stats.monthlyCount.toString()}
        icon={<Calendar className="h-4 w-4 text-green-500" />}
        description="This month's activity"
      />
      <DashboardMetric
        title="Pending Interventions"
        value={stats.pendingCount.toString()}
        icon={<Clock className="h-4 w-4 text-yellow-500" />}
        description="To be processed"
      />
      <DashboardMetric
        title="Average Cost"
        value={`$${stats.avgCost.toLocaleString()}`}
        icon={<Activity className="h-4 w-4 text-purple-500" />}
        description="Per intervention"
      />
    </div>
  );
};