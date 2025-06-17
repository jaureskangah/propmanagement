
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
import { StatsCard } from "@/components/ui/stats-4";
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
    console.log("Enhanced Metrics data in grid:", {
      properties: metrics.properties?.chartData?.length,
      tenants: metrics.tenants?.chartData?.length,
      maintenance: metrics.maintenance?.chartData?.length,
      dateRange
    });
  }, [metrics, dateRange]);

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

  const renderMetric = (metricId: string) => {
    switch (metricId) {
      case 'properties':
        return (
          <SortableMetric key="properties" id="properties">
            <StatsCard
              name={t('properties')}
              value={metrics.properties.total.toString()}
              icon={<Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
              chartData={metrics.properties.chartData}
              color="#3B82F6"
              className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-100 dark:border-blue-800/30 hover:border-blue-200 dark:hover:border-blue-700/40"
            />
          </SortableMetric>
        );
      case 'tenants':
        return (
          <SortableMetric key="tenants" id="tenants">
            <StatsCard
              name={t('tenants')}
              value={metrics.tenants.total.toString()}
              icon={<Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />}
              chartData={metrics.tenants.chartData}
              color="#818CF8"
              className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-purple-100 dark:border-purple-800/30 hover:border-purple-200 dark:hover:border-purple-700/40"
            />
          </SortableMetric>
        );
      case 'maintenance':
        return (
          <SortableMetric key="maintenance" id="maintenance">
            <StatsCard
              name={t('pendingMaintenance')}
              value={metrics.maintenance.pending.toString()}
              icon={<Wrench className="h-5 w-5 text-amber-600 dark:text-amber-400" />}
              chartData={metrics.maintenance.chartData}
              color="#F59E0B"
              className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-amber-100 dark:border-amber-800/30 hover:border-amber-200 dark:hover:border-amber-700/40"
            />
          </SortableMetric>
        );
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
        <div className="grid gap-6 md:grid-cols-3">
          {metricOrder.map((metricId) => (
            <div key={metricId} className="transform transition-all duration-300">
              {renderMetric(metricId)}
            </div>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};
