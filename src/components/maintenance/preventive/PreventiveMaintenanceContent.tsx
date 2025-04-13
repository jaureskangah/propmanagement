
import { useState } from "react";
import { CalendarSection } from "./CalendarSection";
import { RecurringReminderSection } from "./RecurringReminderSection";
import { AddTaskDialog } from "../task-dialog/AddTaskDialog";
import { BatchSchedulingDialog } from "../scheduling/BatchSchedulingDialog";
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
    handleDeleteTask,
    recurringTasks,
    reminderTasks,
    onTaskComplete
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
        onTaskComplete={onTaskComplete}
        onTaskDelete={handleDeleteTask}
      />
      
      <RecurringReminderSection
        recurringTasks={recurringTasks}
        reminderTasks={reminderTasks}
      />

      <AddTaskDialog
        onAddTask={onAddTask}
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        initialDate={selectedDate}
      />

      <BatchSchedulingDialog
        isOpen={isBatchSchedulingOpen}
        onClose={() => setIsBatchSchedulingOpen(false)}
        onSchedule={onAddMultipleTasks}
      />
    </div>
  );
};
