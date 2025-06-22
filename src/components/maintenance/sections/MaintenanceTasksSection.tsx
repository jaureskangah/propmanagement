
import React from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { MaintenanceTasks } from "../tasks/MaintenanceTasks";

export const MaintenanceTasksSection = () => {
  const { t } = useLocale();

  const savedPropertyId = localStorage.getItem('selectedPropertyId') || "property-1";

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h2 className="text-2xl font-semibold">Tâches de maintenance</h2>
        <p className="text-muted-foreground">
          Planifiez et suivez vos tâches de maintenance
        </p>
      </div>

      {/* Tasks List */}
      <MaintenanceTasks propertyId={savedPropertyId} />
    </div>
  );
};
