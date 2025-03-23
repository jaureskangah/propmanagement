
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/components/providers/LocaleProvider";
import { NewTask } from "../types";

export const useAddTaskDialog = (onTaskAdded: () => void) => {
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  const { toast } = useToast();
  const { t } = useLocale();

  const handleCreateTask = () => {
    setIsAddTaskDialogOpen(true);
  };

  const handleAddTask = (task: NewTask) => {
    console.log("Adding task:", task);
    toast({
      title: t('success'),
      description: t('taskAdded'),
    });
    onTaskAdded();
    setIsAddTaskDialogOpen(false);
  };

  return {
    isAddTaskDialogOpen,
    setIsAddTaskDialogOpen,
    handleCreateTask,
    handleAddTask
  };
};
