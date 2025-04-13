
import { useState } from "react";
import { Task } from "../../types";
import { useTasksQuery } from "../../tasks/hooks/useTasksQuery";
import { useTaskCompletion } from "../../tasks/hooks/useTaskCompletion";
import { useTaskDeletion } from "../../tasks/hooks/useTaskDeletion";
import { startOfDay, endOfDay, isSameDay, addDays } from "date-fns";
import { useTaskAddition } from "../../tasks/hooks/useTaskAddition";
import { NewTask } from "../../types";

export const usePreventiveMaintenance = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isBatchSchedulingOpen, setIsBatchSchedulingOpen] = useState(false);
  
  const { tasks, isLoading, refreshTasks } = useTasksQuery();
  const { handleTaskCompletion } = useTaskCompletion();
  const { handleDeleteTask } = useTaskDeletion();
  const { handleAddTask, handleAddMultipleTasks } = useTaskAddition();
  
  // Filtrer les tâches par la date sélectionnée
  const filteredTasksByDate = tasks.filter(task => {
    const taskDate = task.date instanceof Date ? task.date : new Date(task.date as string);
    return isSameDay(taskDate, selectedDate) && 
      (!selectedType || task.type === selectedType);
  });
  
  // Récupérer les tâches récurrentes
  const recurringTasks = tasks.filter(task => task.is_recurring);
  
  // Récupérer les tâches avec des rappels (correction principale ici)
  const reminderTasks = tasks.filter(task => {
    if (!task.has_reminder) return false;
    
    // Vérifier si reminder_date existe
    if (!task.reminder_date) {
      console.log(`Task ${task.id} has has_reminder=true but no reminder_date`);
      return false;
    }
    
    // S'assurer que reminder_date est valide
    try {
      const reminderDate = task.reminder_date instanceof Date 
        ? task.reminder_date 
        : new Date(task.reminder_date as string);
      
      if (isNaN(reminderDate.getTime())) {
        console.log(`Task ${task.id} has invalid reminder_date`);
        return false;
      }
      
      console.log(`Found valid reminder task: ${task.id} - ${task.title} - Reminder date:`, 
        reminderDate.toISOString().split('T')[0]);
      
      return true;
    } catch (error) {
      console.error(`Error parsing reminder_date for task ${task.id}:`, error);
      return false;
    }
  });
  
  console.log(`Total tasks: ${tasks.length}, Reminders: ${reminderTasks.length}, Recurring: ${recurringTasks.length}`);
  
  const onAddTask = async (newTask: NewTask) => {
    await handleAddTask(newTask);
    refreshTasks();
  };
  
  const onAddMultipleTasks = async (newTasks: NewTask[]) => {
    await handleAddMultipleTasks(newTasks);
    refreshTasks();
  };
  
  return {
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
  };
};
