
import React from "react";
import { useMaintenanceTasks } from "./useMaintenanceTasks";
import { useLocale } from "@/components/providers/LocaleProvider";
import { MaintenanceTasksList } from "./MaintenanceTasksList";
import { Skeleton } from "@/components/ui/skeleton";

interface MaintenanceTasksProps {
  propertyId: string;
}

export const MaintenanceTasks = ({ propertyId }: MaintenanceTasksProps) => {
  const { t } = useLocale();
  
  const {
    tasks,
    isLoading,
    handleTaskCompletion,
    handleUpdateTaskPosition,
    handleDeleteTask,
  } = useMaintenanceTasks(propertyId);

  // Debug logs pour diagnostiquer le problème
  console.log("MaintenanceTasks - Property ID:", propertyId);
  console.log("MaintenanceTasks - Tasks:", tasks);
  console.log("MaintenanceTasks - Is Loading:", isLoading);
  console.log("MaintenanceTasks - Tasks count:", tasks?.length || 0);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array(3).fill(0).map((_, index) => (
          <div key={index} className="flex items-center justify-between p-2 border rounded-md">
            <div className="space-y-2">
              <Skeleton className="h-5 w-[250px]" />
              <Skeleton className="h-4 w-[180px]" />
            </div>
            <div className="flex space-x-2">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <MaintenanceTasksList
        tasks={tasks || []}
        isLoading={isLoading}
        onTaskCompletion={handleTaskCompletion}
        onTaskDelete={handleDeleteTask}
        onTaskPositionChange={handleUpdateTaskPosition}
      />
    </div>
  );
};
