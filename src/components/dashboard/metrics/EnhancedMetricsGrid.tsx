
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
import { StatsGrid, StatsCard } from "@/components/ui/stats";
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

  const getMetricData = (metricId: string) => {
    switch (metricId) {
      case 'properties':
        return {
          name: t('properties'),
          value: metrics.properties.total.toString(),
          change: metrics.properties.new > 0 ? `+${metrics.properties.new}` : undefined,
          changeType: "positive" as const,
          icon: <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        };
      case 'tenants':
        return {
          name: t('tenants'),
          value: metrics.tenants.total.toString(),
          change: metrics.tenants.occupancyRate ? `${Math.round(metrics.tenants.occupancyRate)}%` : undefined,
          changeType: "positive" as const,
          icon: <Users className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
        };
      case 'maintenance':
        return {
          name: t('pendingMaintenance'),
          value: metrics.maintenance.pending.toString(),
          change: metrics.maintenance.pending > 0 ? "En attente" : "Aucune",
          changeType: metrics.maintenance.pending > 0 ? "negative" as const : "positive" as const,
          icon: <Wrench className="h-4 w-4 text-amber-600 dark:text-amber-400" />
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
        <StatsGrid>
          {metricOrder.map((metricId, index) => {
            const metricData = getMetricData(metricId);
            
            if (!metricData) return null;
            
            return (
              <SortableMetric key={metricId} id={metricId}>
                <StatsCard
                  {...metricData}
                  index={index}
                  total={metricOrder.length}
                />
              </SortableMetric>
            );
          })}
        </StatsGrid>
      </SortableContext>
    </DndContext>
  );
};
