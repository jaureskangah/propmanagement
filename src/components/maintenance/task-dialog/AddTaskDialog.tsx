
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTaskForm } from "./hooks/useTaskForm";
import { TaskFormContent } from "./TaskFormContent";
import { NewTask } from "../types";
import { useLocale } from "@/components/providers/LocaleProvider";

interface AddTaskDialogProps {
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
  
  const taskForm = useTaskForm({
    onSubmit: async (task) => {
      try {
        await onAddTask(task);
        if (onSuccess) {
          onSuccess();
        }
      } catch (error) {
        console.error("Error adding task:", error);
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
