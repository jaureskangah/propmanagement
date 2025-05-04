
import React from "react";
import { AddTaskDialog } from "../task-dialog/AddTaskDialog";
import { AddExpenseDialog } from "../financials/dialogs/AddExpenseDialog";
import { NewTask } from "../types";

interface MaintenanceDialogsProps {
  isAddTaskOpen: boolean;
  onCloseTaskDialog: () => void;
  onAddTask: (task: NewTask) => Promise<any>;
  isAddExpenseOpen: boolean;
  onCloseExpenseDialog: () => void;
  propertyId: string;
}

export const MaintenanceDialogs = ({
  isAddTaskOpen,
  onCloseTaskDialog,
  onAddTask,
  isAddExpenseOpen,
  onCloseExpenseDialog,
  propertyId
}: MaintenanceDialogsProps) => {
  return (
    <>
      <AddTaskDialog
        onAddTask={onAddTask}
        isOpen={isAddTaskOpen}
        onClose={onCloseTaskDialog}
        initialPropertyId={propertyId}
      />
      
      <AddExpenseDialog
        isOpen={isAddExpenseOpen}
        onClose={onCloseExpenseDialog}
        propertyId={propertyId}
      />
    </>
  );
};
