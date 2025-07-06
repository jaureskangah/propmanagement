
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { MaintenanceTasks } from "../tasks/MaintenanceTasks";
import { AddTaskDialog } from "../task-dialog/AddTaskDialog";
import { useTaskAddition } from "../tasks/hooks/useTaskAddition";
import { useToast } from "@/hooks/use-toast";
import { NewTask } from "../types";
import { supabase } from "@/lib/supabase";

export const MaintenanceTasksSection = () => {
  const { t } = useLocale();
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const { handleAddTask } = useTaskAddition();
  const { toast } = useToast();
  const [propertyId, setPropertyId] = useState<string>("");
  const [isLoadingProperty, setIsLoadingProperty] = useState(true);

  // Fetch user's first property
  useEffect(() => {
    const fetchUserProperty = async () => {
      try {
        console.log("MaintenanceTasksSection - Fetching user's first property...");
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.log("MaintenanceTasksSection - No user found");
          setIsLoadingProperty(false);
          return;
        }

        const { data: properties, error } = await supabase
          .from('properties')
          .select('id, name')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true })
          .limit(1);

        if (error) {
          console.error("MaintenanceTasksSection - Error fetching user property:", error);
          const savedPropertyId = localStorage.getItem('selectedPropertyId') || "";
          setPropertyId(savedPropertyId);
        } else if (properties && properties.length > 0) {
          const firstProperty = properties[0];
          console.log("MaintenanceTasksSection - Found user's first property:", firstProperty);
          setPropertyId(firstProperty.id);
          localStorage.setItem('selectedPropertyId', firstProperty.id);
        } else {
          console.log("MaintenanceTasksSection - No properties found for user");
          const savedPropertyId = localStorage.getItem('selectedPropertyId') || "";
          setPropertyId(savedPropertyId);
        }
      } catch (error) {
        console.error("MaintenanceTasksSection - Exception fetching user property:", error);
        const savedPropertyId = localStorage.getItem('selectedPropertyId') || "";
        setPropertyId(savedPropertyId);
      } finally {
        setIsLoadingProperty(false);
      }
    };

    fetchUserProperty();
  }, []);

  const handleAddTaskFromDialog = async (newTask: NewTask): Promise<any> => {
    try {
      const taskWithCorrectProperty = {
        ...newTask,
        property_id: propertyId || newTask.property_id
      };
      
      console.log("MaintenanceTasksSection - Adding task with property ID:", taskWithCorrectProperty.property_id);
      
      const result = await handleAddTask(taskWithCorrectProperty);
      toast({
        title: t('success'),
        description: t('taskAdded'),
      });
      return result;
    } catch (error) {
      console.error("MaintenanceTasksSection - Error adding task:", error);
      toast({
        title: t('error'),
        description: t('errorAddingTask'),
        variant: "destructive",
      });
      throw error;
    }
  };

  if (isLoadingProperty) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold">{t('maintenanceTasks')}</h2>
            <p className="text-muted-foreground">
              {t('loadingProperties')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section Header with Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">{t('maintenanceTasks')}</h2>
          <p className="text-muted-foreground">
            {t('maintenanceTasksDescription')}
          </p>
        </div>
        <Button 
          onClick={() => setIsAddTaskOpen(true)}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t('newTask')}
        </Button>
      </div>

      {/* Tasks List - Show even if no property selected */}
      <MaintenanceTasks propertyId={propertyId} />

      {/* Add Task Dialog */}
      <AddTaskDialog
        onAddTask={handleAddTaskFromDialog}
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        initialPropertyId={propertyId}
      />
    </div>
  );
};
