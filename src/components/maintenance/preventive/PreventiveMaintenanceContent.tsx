
import { useState } from "react";
import { CalendarSection } from "./CalendarSection";
import { RecurringReminderSection } from "./RecurringReminderSection";
import { AddTaskDialog } from "../task-dialog/AddTaskDialog";
import { BatchTaskDialog } from "../task-dialog/BatchTaskDialog";
import { usePreventiveMaintenance } from "./hooks/usePreventiveMaintenance";
import { useLocale } from "@/components/providers/LocaleProvider";

export const PreventiveMaintenanceContent = () => {
  const {
    selectedDate,
    setSelectedDate,
    selectedType,
    setSelectedType,
    isAddTaskOpen,
    setIsAddTaskOpen,
    isBatchSchedulingOpen,
    setIsBatchSchedulingOpen,
    tasks,
    isLoading,
    filteredTasksByDate,
    onAddTask,
    onAddMultipleTasks,
    handleTaskCompletion,
    handleDeleteTask,
    recurringTasks,
    reminderTasks
  } = usePreventiveMaintenance();
  
  const { t } = useLocale();
  
  if (isLoading) {
    return <div>{t('loading')}</div>;
  }
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
      <CalendarSection 
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        onBatchSchedulingOpen={() => setIsBatchSchedulingOpen(true)}
        onAddTaskOpen={() => setIsAddTaskOpen(true)}
        tasks={tasks}
        filteredTasks={filteredTasksByDate}
        onTaskComplete={handleTaskCompletion}
        onTaskDelete={handleDeleteTask}
      />
      
      <RecurringReminderSection
        recurringTasks={recurringTasks}
        reminderTasks={reminderTasks}
      />

      {isAddTaskOpen && (
        <AddTaskDialog
          isOpen={isAddTaskOpen}
          onClose={() => setIsAddTaskOpen(false)}
          onAddTask={onAddTask}
          initialDate={selectedDate}
        />
      )}

      {isBatchSchedulingOpen && (
        <BatchTaskDialog
          isOpen={isBatchSchedulingOpen}
          onClose={() => setIsBatchSchedulingOpen(false)}
          onAddTasks={onAddMultipleTasks}
        />
      )}
    </div>
  );
};
