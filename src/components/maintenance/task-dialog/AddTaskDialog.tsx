
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLocale } from "@/components/providers/LocaleProvider";
import { NewTask } from "../types";
import { TaskForm } from "./TaskForm";

interface AddTaskDialogProps {
  onAddTask: (task: NewTask) => void;
  isOpen?: boolean;
  onClose?: () => void;
  initialDate?: Date;
}

export const AddTaskDialog = ({ onAddTask, isOpen, onClose, initialDate }: AddTaskDialogProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const { t } = useLocale();
  
  const handleAddTask = (task: NewTask) => {
    onAddTask(task);
    if (onClose) {
      onClose();
    } else {
      setInternalOpen(false);
    }
  };

  // Determine if we're using controlled or uncontrolled open state
  const open = isOpen !== undefined ? isOpen : internalOpen;
  const setOpen = onClose ? (value: boolean) => {
    if (!value) {
      onClose();
    }
  } : setInternalOpen;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* IMPORTANT: On supprime complètement le DialogTrigger qui ajoute le bouton + Ajouter 
          lorsque ce composant est utilisé en mode contrôlé (avec isOpen) */}
      <DialogContent className="max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>{initialDate ? t('addTaskForDate', { date: initialDate.toLocaleDateString() }) : t('addNewTask')}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-120px)] px-6 pb-6">
          <TaskForm onSubmit={handleAddTask} initialDate={initialDate} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
