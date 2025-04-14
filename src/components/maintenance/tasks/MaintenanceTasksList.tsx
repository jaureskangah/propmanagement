
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useLocale } from "@/components/providers/LocaleProvider";
import { TaskList } from "../TaskList";
import { Skeleton } from "@/components/ui/skeleton";
import { Task } from "../types";

export interface MaintenanceTasksListProps {
  tasks: Task[];
  isLoading: boolean;
  onTaskCompletion: (taskId: string) => void;
  onTaskDelete: (taskId: string) => void;
  onTaskPositionChange?: (taskId: string, newPosition: number) => void;
}

export const MaintenanceTasksList: React.FC<MaintenanceTasksListProps> = ({
  tasks,
  isLoading,
  onTaskCompletion,
  onTaskDelete,
  onTaskPositionChange
}) => {
  const { t } = useLocale();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-3">
            <Skeleton className="h-5 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[180px]" />
            <Skeleton className="h-4 w-[220px]" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <TaskList
          tasks={tasks}
          onTaskComplete={onTaskCompletion}
          onTaskDelete={onTaskDelete}
        />
      </CardContent>
    </Card>
  );
};
