
import React, { useState } from "react";
import { useMaintenanceTasks } from "./useMaintenanceTasks";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BatchTaskDialog } from "../task-dialog/BatchTaskDialog";
import { AddTaskDialog } from "../task-dialog/AddTaskDialog";
import { MaintenanceTasksList } from "./MaintenanceTasksList";

interface MaintenanceTasksProps {
  propertyId: string;
}

export const MaintenanceTasks = ({ propertyId }: MaintenanceTasksProps) => {
  const { t } = useLocale();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isBatchDialogOpen, setIsBatchDialogOpen] = useState(false);
  
  const {
    tasks,
    isLoading,
    handleTaskCompletion,
    handleAddTask,
    handleUpdateTaskPosition,
    handleDeleteTask,
  } = useMaintenanceTasks(propertyId);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">{t('loading')}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <CardTitle className="text-xl font-medium">
          {t('scheduledTasks')}
        </CardTitle>
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            onClick={() => setIsAddDialogOpen(true)}
            className="gap-1"
          >
            <Plus size={16} />
            <span>{t('addTask')}</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsBatchDialogOpen(true)}
            className="gap-1"
          >
            <Plus size={16} />
            <span>{t('batchAdd')}</span>
          </Button>
        </div>
      </div>

      <MaintenanceTasksList
        tasks={tasks || []}
        isLoading={isLoading}
        onTaskCompletion={handleTaskCompletion}
        onTaskDelete={handleDeleteTask}
        onTaskPositionChange={handleUpdateTaskPosition}
      />

      {isAddDialogOpen && (
        <AddTaskDialog
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onAddTask={handleAddTask}
          initialPropertyId={propertyId}
        />
      )}

      {isBatchDialogOpen && (
        <BatchTaskDialog
          isOpen={isBatchDialogOpen}
          onClose={() => setIsBatchDialogOpen(false)}
          onAddTasks={(tasks) => {
            tasks.forEach(task => {
              handleAddTask(task);
            });
          }}
          initialPropertyId={propertyId}
        />
      )}
    </div>
  );
};
