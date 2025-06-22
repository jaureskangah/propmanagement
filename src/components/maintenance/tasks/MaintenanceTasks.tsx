
import React from "react";
import { useMaintenanceTasks } from "./useMaintenanceTasks";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Card, CardContent } from "@/components/ui/card";
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
    handleDeleteTask,
    handleUpdateTaskPosition,
  } = useMaintenanceTasks(propertyId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="p-6">
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
          </CardContent>
        </Card>
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
