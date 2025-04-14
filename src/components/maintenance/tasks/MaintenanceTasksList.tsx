
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
    );
  }

  if (tasks.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">{t('noTasks')}</p>
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
