
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskList } from "../TaskList";
import { useMaintenanceTasks } from "./useMaintenanceTasks";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddTaskDialog } from "../task-dialog/AddTaskDialog";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/components/providers/LocaleProvider";
import { BatchTaskDialog } from "../task-dialog/BatchTaskDialog";

interface MaintenanceTasksProps {
  propertyId?: string;
}

export const MaintenanceTasks = ({ propertyId }: MaintenanceTasksProps) => {
  const { t } = useLocale();
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isBatchDialogOpen, setIsBatchDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const {
    tasks,
    isLoading,
    handleTaskCompletion,
    handleDeleteTask,
    handleAddTask,
    handleAddMultipleTasks
  } = useMaintenanceTasks(propertyId);
  
  console.log(`MaintenanceTasks rendered with ${tasks.length} tasks for property: ${propertyId || 'all'}`);
  
  const handleAddTaskClick = () => {
    setIsAddTaskOpen(true);
  };
  
  const handleBatchTaskClick = () => {
    setIsBatchDialogOpen(true);
  };
  
  const handleAddTaskSuccess = () => {
    toast({
      title: t('success'),
      description: t('taskAdded'),
    });
    setIsAddTaskOpen(false);
  };
  
  const handleBatchTaskSuccess = (count: number) => {
    toast({
      title: t('success'),
      description: t('multipleTasksAdded', { count }),
    });
    setIsBatchDialogOpen(false);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex-row justify-between items-start pb-2">
          <div>
            <CardTitle className="text-base">{t('scheduledTasks')}</CardTitle>
            <CardDescription>{t('tasksDescription')}</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleBatchTaskClick}>
              {t('batchScheduling')}
            </Button>
            <Button size="sm" onClick={handleAddTaskClick}>
              <Plus className="mr-1 h-4 w-4" /> {t('addTask')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-6 text-center text-muted-foreground">{t('loading')}</div>
          ) : (
            <TaskList
              tasks={tasks}
              onTaskComplete={handleTaskCompletion}
              onTaskDelete={handleDeleteTask}
            />
          )}
        </CardContent>
      </Card>
      
      <AddTaskDialog
        onAddTask={handleAddTask}
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        onSuccess={handleAddTaskSuccess}
        initialPropertyId={propertyId}
      />
      
      <BatchTaskDialog
        isOpen={isBatchDialogOpen}
        onClose={() => setIsBatchDialogOpen(false)}
        onAddTasks={handleAddMultipleTasks}
        onSuccess={handleBatchTaskSuccess}
        initialPropertyId={propertyId}
      />
    </div>
  );
};
