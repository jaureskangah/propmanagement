
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
import { MetricRenderers } from "./MetricRenderers";
import { MetricsData } from "./types";

interface MetricsGridProps {
  metrics: MetricsData;
  unreadMessages: number;
  dateRange?: any;
}

export const MetricsGrid = ({ metrics, unreadMessages, dateRange }: MetricsGridProps) => {
  const [metricOrder, setMetricOrder] = useState([
    'properties',
    'tenants',
    'maintenance',
    'messages'
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

  // Log metrics data for debugging
  useEffect(() => {
    console.log("Metrics data in grid:", {
      properties: metrics.properties?.chartData?.length,
      tenants: metrics.tenants?.chartData?.length,
      maintenance: metrics.maintenance?.chartData?.length,
      communications: metrics.communications?.chartData?.length,
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

  const renderers = MetricRenderers({ metrics, unreadMessages, dateRange });

  const renderMetric = (metricId: string) => {
    switch (metricId) {
      case 'properties': return renderers.renderProperties();
      case 'tenants': return renderers.renderTenants();
      case 'maintenance': return renderers.renderMaintenance();
      case 'messages': return renderers.renderMessages();
      default: return null;
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
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {metricOrder.map((metricId) => (
            <div key={metricId} className="transform transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              {renderMetric(metricId)}
            </div>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};
