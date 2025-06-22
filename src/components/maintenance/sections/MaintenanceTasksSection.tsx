
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { MaintenanceTasks } from "../tasks/MaintenanceTasks";
import { AddTaskDialog } from "../task-dialog/AddTaskDialog";
import { useTaskAddition } from "../tasks/hooks/useTaskAddition";
import { useToast } from "@/hooks/use-toast";
import { NewTask } from "../types";

export const MaintenanceTasksSection = () => {
  const { t } = useLocale();
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const { handleAddTask } = useTaskAddition();
  const { toast } = useToast();

  const savedPropertyId = localStorage.getItem('selectedPropertyId') || "property-1";

  const handleAddTaskFromDialog = async (newTask: NewTask): Promise<any> => {
    try {
      const result = await handleAddTask(newTask);
      toast({
        title: t('success'),
        description: t('taskAdded'),
      });
      return result;
    } catch (error) {
      console.error("Error adding task:", error);
      toast({
        title: t('error'),
        description: t('errorAddingTask'),
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Header with Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Tâches de maintenance</h2>
          <p className="text-muted-foreground">
            Planifiez et suivez vos tâches de maintenance
          </p>
        </div>
        <Button 
          onClick={() => setIsAddTaskOpen(true)}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle tâche
        </Button>
      </div>

      {/* Tasks List */}
      <MaintenanceTasks propertyId={savedPropertyId} />

      {/* Add Task Dialog */}
      <AddTaskDialog
        onAddTask={handleAddTaskFromDialog}
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        initialPropertyId={savedPropertyId}
      />
    </div>
  );
};
