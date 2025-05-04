
import React from "react";
import { AddTaskDialog } from "../task-dialog/AddTaskDialog";
import { AddExpenseDialog } from "../financials/dialogs/AddExpenseDialog";
import { NewTask } from "../types";

interface MaintenanceDialogsProps {
  isAddTaskOpen: boolean;
  onAddTaskClose: () => void;
  onAddTask: (task: NewTask) => Promise<any>;
  isAddExpenseOpen: boolean;
  onAddExpenseClose: () => void;
  propertyId: string;
}

export const MaintenanceDialogs = ({
  isAddTaskOpen,
  onAddTaskClose,
  onAddTask,
  isAddExpenseOpen,
  onAddExpenseClose,
  propertyId
}: MaintenanceDialogsProps) => {
  return (
    <>
      <AddTaskDialog
        onAddTask={onAddTask}
        isOpen={isAddTaskOpen}
        onClose={onAddTaskClose}
        initialPropertyId={propertyId}
      />
      
      <AddExpenseDialog
        isOpen={isAddExpenseOpen}
        onClose={onAddExpenseClose}
        propertyId={propertyId}
      />
    </>
  );
};
