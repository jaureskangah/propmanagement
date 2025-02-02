import { DashboardMetric } from "@/components/DashboardMetric";
import { Building2, Users, Wrench, DollarSign, ArrowUpRight, ArrowDownRight, Percent, MessageSquare } from "lucide-react";
import { DateRange } from "./DashboardDateFilter";
import { NotificationBell } from "./NotificationBell";
import { useMetricsData } from "./hooks/useMetricsData";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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
import { useState } from "react";

interface DashboardMetricsProps {
  propertiesData: any[];
  maintenanceData: any[];
  tenantsData: any[];
  dateRange: DateRange;
}

const SortableMetric = ({ id, children }: { id: string; children: React.ReactNode }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
};

export const DashboardMetrics = ({ 
  propertiesData, 
  maintenanceData, 
  tenantsData,
  dateRange 
}: DashboardMetricsProps) => {
  const { metrics, unreadMessages } = useMetricsData(
    propertiesData,
    maintenanceData,
    tenantsData,
    dateRange
  );

  const [metricOrder, setMetricOrder] = useState([
    'occupancy',
    'properties',
    'tenants',
    'maintenance',
    'revenue',
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
      case 'occupancy':
        return (
          <SortableMetric key="occupancy" id="occupancy">
            <DashboardMetric
              title="Global Occupancy"
              value={`${metrics.occupancy.rate}%`}
              icon={<Percent className="h-4 w-4 text-violet-600" />}
              description={
                <div className={cn(
                  "flex items-center gap-1",
                  metrics.occupancy.trend >= 0 ? "text-green-600" : "text-red-600"
                )}>
                  {metrics.occupancy.trend >= 0 ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  <span>{Math.abs(metrics.occupancy.trend)}% from last month</span>
                </div>
              }
              chartData={metrics.occupancy.chartData}
              chartColor="#7C3AED"
              tooltip="Global occupancy rate of your properties. A high rate indicates effective rental management."
            />
          </SortableMetric>
        );
      case 'properties':
        return (
          <SortableMetric key="properties" id="properties">
            <DashboardMetric
              title="Properties"
              value={metrics.properties.total.toString()}
              icon={<Building2 className="h-4 w-4 text-blue-600" />}
              description={
                <div className="flex items-center gap-1 text-green-600">
                  <ArrowUpRight className="h-3 w-3" />
                  <span>{metrics.properties.new} new this month</span>
                </div>
              }
              chartData={metrics.properties.chartData}
              chartColor="#1E40AF"
              tooltip="Total number of properties in your portfolio and monthly evolution."
            />
          </SortableMetric>
        );
      case 'tenants':
        return (
          <SortableMetric key="tenants" id="tenants">
            <DashboardMetric
              title="Tenants"
              value={metrics.tenants.total.toString()}
              icon={<Users className="h-4 w-4 text-indigo-600" />}
              description={
                <div className="flex items-center gap-1 text-green-600">
                  <ArrowUpRight className="h-3 w-3" />
                  <span>{metrics.tenants.occupancyRate}% occupancy rate</span>
                </div>
              }
              chartData={metrics.tenants.chartData}
              chartColor="#4F46E5"
              tooltip="Total number of active tenants and corresponding occupancy rate."
            />
          </SortableMetric>
        );
      case 'maintenance':
        return (
          <SortableMetric key="maintenance" id="maintenance">
            <DashboardMetric
              title="Maintenance"
              value={metrics.maintenance.pending.toString()}
              icon={<Wrench className="h-4 w-4 text-amber-600" />}
              description={
                <div className="flex items-center gap-1 text-red-600">
                  <ArrowDownRight className="h-3 w-3" />
                  <span>{metrics.maintenance.pending} pending requests</span>
                </div>
              }
              chartData={metrics.maintenance.chartData}
              chartColor="#D97706"
              tooltip="Pending maintenance requests requiring your attention."
            />
          </SortableMetric>
        );
      case 'revenue':
        return (
          <SortableMetric key="revenue" id="revenue">
            <DashboardMetric
              title="Monthly Revenue"
              value={`$${metrics.revenue.monthly.toLocaleString()}`}
              icon={<DollarSign className="h-4 w-4 text-emerald-600" />}
              description={
                <div className="flex items-center gap-1 text-green-600">
                  <ArrowUpRight className="h-3 w-3" />
                  <span>Based on current leases</span>
                </div>
              }
              chartData={metrics.revenue.chartData}
              chartColor="#059669"
              tooltip="Monthly revenue based on current leases and payment history."
            />
          </SortableMetric>
        );
      case 'messages':
        return (
          <SortableMetric key="messages" id="messages">
            <DashboardMetric
              title="Unread Messages"
              value={unreadMessages.toString()}
              icon={<MessageSquare className="h-4 w-4 text-rose-600" />}
              description={
                <div className="flex items-center gap-1 text-rose-600">
                  <ArrowUpRight className="h-3 w-3" />
                  <span>Messages requiring attention</span>
                </div>
              }
              chartData={metrics.communications?.chartData || []}
              chartColor="#E11D48"
              tooltip="Unread messages from your tenants requiring a response."
            />
          </SortableMetric>
        );
    }
  };

  return (
    <div className="relative">
      <NotificationBell unreadCount={unreadMessages} />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={metricOrder}
          strategy={rectSortingStrategy}
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {metricOrder.map((metricId) => renderMetric(metricId))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};