
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { useState, useEffect } from "react";
import { Building2, Users, Wrench } from "lucide-react";
import { KPICard } from "@/components/ui/stats-4";
import { SortableMetric } from "./SortableMetric";
import { MetricsData } from "./types";
import { useLocale } from "@/components/providers/LocaleProvider";

interface EnhancedMetricsGridProps {
  metrics: MetricsData;
  dateRange?: any;
}

export const EnhancedMetricsGrid = ({ metrics, dateRange }: EnhancedMetricsGridProps) => {
  const { t } = useLocale();
  const [metricOrder, setMetricOrder] = useState([
    'properties',
    'tenants', 
    'maintenance'
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
        tolerance: 5,
        delay: 0,
      },
    }),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    console.log("Enhanced Metrics data:", {
      properties: metrics.properties?.chartData?.length,
      tenants: metrics.tenants?.chartData?.length,
      maintenance: metrics.maintenance?.chartData?.length,
      dateRange
    });

    // Debug des traductions critiques
    console.log("=== DEBUG TRADUCTIONS MÉTRIQUES ===");
    console.log("properties:", t('properties'));
    console.log("tenants:", t('tenants'));
    console.log("maintenance:", t('maintenance'));
    console.log("occupied:", t('occupied'));
    console.log("stable:", t('stable'));
    console.log("improvement:", t('improvement'));
    console.log("pending:", t('pending'));
    console.log("none:", t('none'));
    console.log("new:", t('new'));
  }, [metrics, dateRange, t]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = metricOrder.indexOf(active.id.toString());
      const newIndex = metricOrder.indexOf(over.id.toString());
      
      if (oldIndex !== -1 && newIndex !== -1) {
        setMetricOrder(arrayMove(metricOrder, oldIndex, newIndex));
      }
    }
  };

  const formatChartDataForDisplay = (chartData: any[]) => {
    return chartData?.map((item) => ({
      date: item.date || item.month || `Mois ${chartData.indexOf(item) + 1}`,
      value: item.value || 0
    })) || [];
  };

  const getMetricData = (metricId: string) => {
    switch (metricId) {
      case 'properties':
        return {
          name: t('properties'),
          value: metrics.properties.total.toString(),
          change: metrics.properties.new > 0 ? `+${metrics.properties.new}` : undefined,
          percentageChange: metrics.properties.new > 0 ? `↗ ${t('new')}` : `→ ${t('stable')}`,
          changeType: metrics.properties.new > 0 ? "positive" as const : "neutral" as const,
          icon: <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />,
          chartData: formatChartDataForDisplay(metrics.properties.chartData),
          color: "hsl(217 91% 60%)"
        };
      case 'tenants':
        const currentMonthTenants = metrics.tenants.total;
        const previousMonthTenants = Math.max(0, currentMonthTenants - 1);
        const tenantChange = currentMonthTenants - previousMonthTenants;
        const occupancyRate = Math.round(metrics.tenants.occupancyRate || 0);
        
        let arrow = "→";
        if (tenantChange > 0) arrow = "↗";
        else if (tenantChange < 0) arrow = "↘";
        
        return {
          name: t('tenants'),
          value: metrics.tenants.total.toString(),
          change: tenantChange > 0 ? `+${tenantChange}` : tenantChange < 0 ? `${tenantChange}` : undefined,
          percentageChange: `${arrow} ${occupancyRate}% ${t('occupied')}`,
          changeType: tenantChange > 0 ? "positive" as const : tenantChange < 0 ? "negative" as const : "neutral" as const,
          icon: <Users className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />,
          chartData: formatChartDataForDisplay(metrics.tenants.chartData),
          color: "hsl(262 83% 58%)"
        };
      case 'maintenance':
        const currentPending = metrics.maintenance.pending;
        const estimatedPreviousPending = currentPending > 0 ? currentPending + 1 : 0;
        const maintenanceChange = currentPending - estimatedPreviousPending;
        
        return {
          name: t('maintenance'),
          value: metrics.maintenance.pending.toString(),
          change: maintenanceChange !== 0 ? (maintenanceChange > 0 ? `+${maintenanceChange}` : `${maintenanceChange}`) : undefined,
          percentageChange: currentPending === 0 ? `✓ ${t('none')}` : maintenanceChange < 0 ? `↓ ${t('improvement')}` : `⚠️ ${t('pending')}`,
          changeType: currentPending === 0 ? "positive" as const : maintenanceChange < 0 ? "positive" as const : "negative" as const,
          icon: <Wrench className="h-4 w-4 text-amber-600 dark:text-amber-400" />,
          chartData: formatChartDataForDisplay(metrics.maintenance.chartData),
          color: "hsl(43 96% 56%)"
        };
      default:
        return null;
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={metricOrder}
        strategy={rectSortingStrategy}
      >
        <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full">
          {metricOrder.map((metricId) => {
            const metricData = getMetricData(metricId);
            
            if (!metricData) return null;
            
            return (
              <SortableMetric key={metricId} id={metricId}>
                <KPICard {...metricData} />
              </SortableMetric>
            );
          })}
        </dl>
      </SortableContext>
    </DndContext>
  );
};
