
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
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableSection } from "./SortableSection";
import { useEffect } from "react";

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
  
  useEffect(() => {
    console.log("DashboardContent mounted with data:", {
      propertiesCount: propertiesData?.length,
      maintenanceCount: maintenanceData?.length,
      tenantsCount: tenantsData?.length,
      dateRange,
      hasPreferences: !!preferences
    });

    return () => {
      console.log("DashboardContent unmounting");
    };
  }, [propertiesData, maintenanceData, tenantsData, dateRange, preferences]);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
        tolerance: 5,
        delay: 0,
      },
    }),
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

  console.log("Processed payments data:", {
    totalPayments: paymentsData.length,
    tenantsWithPayments: new Set(paymentsData.map(p => p.tenants?.id)).size
  });

  const defaultOrder = ["metrics", "priority", "revenue", "activity"];
  const currentOrder = preferences?.widget_order?.length > 0 
    ? preferences.widget_order 
    : defaultOrder;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    console.log("Drag end event:", { active, over });
    
    if (over && active.id !== over.id) {
      const oldIndex = currentOrder.indexOf(active.id.toString());
      const newIndex = currentOrder.indexOf(over.id.toString());
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(currentOrder, oldIndex, newIndex);
        console.log("Updating widget order:", newOrder);
        updatePreferences.mutate({ widget_order: newOrder });
      }
    }
  };

  const renderSection = (sectionId: string) => {
    console.log("Rendering section:", sectionId);
    
    if (preferences?.hidden_sections?.includes(sectionId)) {
      console.log("Section is hidden:", sectionId);
      return null;
    }

    switch (sectionId) {
      case "metrics":
        return (
          <SortableSection id="metrics" key="metrics">
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
          <SortableSection id="priority" key="priority">
            <PrioritySection
              maintenanceData={maintenanceData}
              tenantsData={tenantsData}
              paymentsData={paymentsData}
            />
          </SortableSection>
        );
      case "revenue":
        return (
          <SortableSection id="revenue" key="revenue">
            <RevenueChart />
          </SortableSection>
        );
      case "activity":
        return (
          <SortableSection id="activity" key="activity">
            <RecentActivity />
          </SortableSection>
        );
      default:
        console.warn("Unknown section ID:", sectionId);
        return null;
    }
  };

  useEffect(() => {
    console.log("Current dashboard state:", {
      currentOrder,
      hiddenSections: preferences?.hidden_sections,
      isUpdatePreferencesPending: updatePreferences.isPending
    });
  }, [currentOrder, preferences?.hidden_sections, updatePreferences.isPending]);

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
          <div className="space-y-6 pl-8">
            {currentOrder.map((sectionId) => renderSection(sectionId))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};
