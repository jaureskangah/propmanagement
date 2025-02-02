import { RevenueChart } from "./RevenueChart";
import { RecentActivity } from "./RecentActivity";
import { DashboardMetrics } from "./DashboardMetrics";
import { PrioritySection } from "./PrioritySection";
import { DashboardDateFilter, type DateRange } from "./DashboardDateFilter";
import { DashboardCustomization } from "./DashboardCustomization";
import { useDashboardPreferences } from "./hooks/useDashboardPreferences";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableSection } from "./SortableSection";

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
  const { preferences, updatePreferences } = useDashboardPreferences();
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Extract payment data from tenants
  const paymentsData = tenantsData?.flatMap(tenant => 
    tenant.tenant_payments?.map((payment: any) => ({
      ...payment,
      tenants: tenant
    }))
  ) || [];

  const defaultOrder = ["metrics", "priority", "revenue", "activity"];
  const currentOrder = preferences.widget_order.length > 0 
    ? preferences.widget_order 
    : defaultOrder;

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = currentOrder.indexOf(active.id);
      const newIndex = currentOrder.indexOf(over.id);
      
      const newOrder = arrayMove(currentOrder, oldIndex, newIndex);
      updatePreferences.mutate({ widget_order: newOrder });
    }
  };

  const renderSection = (sectionId: string) => {
    if (preferences.hidden_sections.includes(sectionId)) return null;

    switch (sectionId) {
      case "metrics":
        return (
          <SortableSection id="metrics">
            <DashboardMetrics
              propertiesData={propertiesData}
              maintenanceData={maintenanceData}
              tenantsData={tenantsData}
              dateRange={dateRange}
            />
          </SortableSection>
        );
      case "priority":
        return (
          <SortableSection id="priority">
            <PrioritySection
              maintenanceData={maintenanceData}
              tenantsData={tenantsData}
              paymentsData={paymentsData}
            />
          </SortableSection>
        );
      case "revenue":
        return (
          <SortableSection id="revenue">
            <RevenueChart />
          </SortableSection>
        );
      case "activity":
        return (
          <SortableSection id="activity">
            <RecentActivity />
          </SortableSection>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <DashboardDateFilter onDateRangeChange={onDateRangeChange} />
        <DashboardCustomization />
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={currentOrder}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-6">
            {currentOrder.map((sectionId) => renderSection(sectionId))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};