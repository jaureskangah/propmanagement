
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTaskForm } from "./hooks/useTaskForm";
import { TaskFormContent } from "./TaskFormContent";
import { NewTask } from "../types";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useToast } from "@/hooks/use-toast";

export interface AddTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: NewTask) => Promise<any> | void;
  onSuccess?: () => void;
  initialDate?: Date;
  initialPropertyId?: string;
}

export const AddTaskDialog = ({ 
  isOpen, 
  onClose, 
  onAddTask, 
  onSuccess,
  initialDate,
  initialPropertyId
}: AddTaskDialogProps) => {
  const { t } = useLocale();
  const { toast } = useToast();
  
  const taskForm = useTaskForm({
    onSubmit: async (task) => {
      try {
        // Log the task before submission for debugging
        console.log("AddTaskDialog - Starting task submission:", task);
        console.log("Task date before submission:", task.date);
        
        if (task.date instanceof Date) {
          // Log date components to verify correct date
          console.log(`Task date components: Year=${task.date.getFullYear()}, Month=${task.date.getMonth() + 1}, Day=${task.date.getDate()}`);
        }
        
        // Make sure we await the result of onAddTask, no matter if it returns a Promise or not
        const result = await Promise.resolve(onAddTask(task));
        console.log("AddTaskDialog - Task saved successfully:", result);
        
        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess();
        }
        
        // Always close the dialog on success
        onClose();
        
        return result;
      } catch (error) {
        console.error("AddTaskDialog - Error adding task:", error);
        toast({
          title: t('error'),
          description: t('errorAddingTask'),
          variant: "destructive",
        });
        throw error; // Re-throw to keep the form open
      }
    },
    initialDate,
    initialValue: initialPropertyId ? { 
      title: "",
      type: "regular",
      priority: "medium",
      date: initialDate || new Date(),
      property_id: initialPropertyId
    } : undefined
  });
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('addNewTask')}</DialogTitle>
        </DialogHeader>
        <TaskFormContent 
          {...taskForm} 
          initialPropertyId={initialPropertyId}
        />
      </DialogContent>
    </Dialog>
  );
};
