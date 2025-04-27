
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTaskForm } from "./hooks/useTaskForm";
import { TaskFormContent } from "./TaskFormContent";
import { NewTask } from "../types";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useToast } from "@/hooks/use-toast";
import { formatLocalDateForStorage } from "../utils/dateUtils";

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
        // Diagnostic logging
        console.log("AddTaskDialog - Starting task submission:", task);
        console.log("Task date before submission:", task.date);
        
        // CRITICAL FIX: Ensure we're using the correct date format
        if (task.date instanceof Date) {
          // Safe date formatting that preserves the exact day as selected by user
          const formattedDate = formatLocalDateForStorage(task.date);
          
          // Create a new task object with the formatted date string
          const safeTask = {
            ...task,
            date: formattedDate
          };
          
          console.log("AddTaskDialog - Submitting task with safe date:", safeTask);
          console.log("Original date components:", {
            year: task.date.getFullYear(),
            month: task.date.getMonth() + 1,
            day: task.date.getDate()
          });
          console.log("Formatted date for submission:", formattedDate);
          
          // Use the safe task with formatted date string for submission
          const result = await Promise.resolve(onAddTask(safeTask as NewTask));
          console.log("AddTaskDialog - Task saved successfully:", result);
        } else {
          // If for some reason we don't have a Date object, just submit as is
          console.warn("AddTaskDialog - Task date is not a Date object:", task.date);
          const result = await Promise.resolve(onAddTask(task));
          console.log("AddTaskDialog - Task saved with non-Date date:", result);
        }
        
        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess();
        }
        
        // Always close the dialog on success
        onClose();
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
