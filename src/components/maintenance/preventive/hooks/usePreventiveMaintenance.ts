
import { useState } from "react";
import { Task } from "../../types";
import { useTasksQuery } from "../../tasks/hooks/useTasksQuery";
import { useTaskCompletion } from "../../tasks/hooks/useTaskCompletion";
import { useTaskDeletion } from "../../tasks/hooks/useTaskDeletion";
import { startOfDay, endOfDay, isSameDay, addDays, format } from "date-fns";
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
  
  // Récupérer les tâches avec des rappels (amélioration pour corriger le filtrage)
  const reminderTasks = tasks.filter(task => {
    // Vérifier que le rappel est activé
    if (!task.has_reminder) return false;
    
    // Vérifier que la date de rappel existe
    if (!task.reminder_date) {
      console.log(`Task ${task.id} has has_reminder=true but no reminder_date`);
      return false;
    }
    
    let reminderDate;
    
    // Normalisation de la date de rappel
    try {
      if (task.reminder_date instanceof Date) {
        reminderDate = task.reminder_date;
      } else if (typeof task.reminder_date === 'string') {
        reminderDate = new Date(task.reminder_date);
      } else {
        console.log(`Task ${task.id} has invalid reminder_date format:`, typeof task.reminder_date);
        return false;
      }
      
      // Vérifier si la date est valide
      if (isNaN(reminderDate.getTime())) {
        console.log(`Task ${task.id} has invalid reminder_date (NaN)`);
        return false;
      }
      
      console.log(`Task with valid reminder: ${task.id} - ${task.title} - ${format(reminderDate, 'yyyy-MM-dd')}`);
      return true;
    } catch (error) {
      console.error(`Error processing reminder_date for task ${task.id}:`, error);
      return false;
    }
  });
  
  console.log(`Total tasks: ${tasks.length}, Reminders: ${reminderTasks.length}, Recurring: ${recurringTasks.length}`);
  
  // Log détaillé des tâches avec rappels pour le débogage
  if (reminderTasks.length > 0) {
    console.log("Reminder tasks details:", reminderTasks.map(task => ({
      id: task.id,
      title: task.title,
      has_reminder: task.has_reminder,
      reminder_date: task.reminder_date instanceof Date 
        ? task.reminder_date.toISOString() 
        : task.reminder_date,
      reminder_method: task.reminder_method
    })));
  } else {
    console.log("No tasks with reminders found after filtering");
    
    // Log des tâches qui ont potentiellement des rappels mal configurés
    const potentialReminderTasks = tasks.filter(task => 
      task.has_reminder || task.reminder_date || task.reminder_method
    );
    
    if (potentialReminderTasks.length > 0) {
      console.log("Potential reminder tasks with issues:", potentialReminderTasks.map(task => ({
        id: task.id,
        title: task.title,
        has_reminder: task.has_reminder,
        reminder_date: task.reminder_date,
        reminder_method: task.reminder_method
      })));
    }
  }
  
  const onAddTask = async (newTask: NewTask) => {
    // S'assurer que les dates sont correctement formatées avant soumission
    const formattedTask = {
      ...newTask,
      date: startOfDay(newTask.date),
      reminder_date: newTask.has_reminder && newTask.reminder_date 
        ? startOfDay(newTask.reminder_date) 
        : undefined
    };
    
    // Log des informations de la tâche avant soumission
    if (formattedTask.has_reminder && formattedTask.reminder_date) {
      console.log("Adding task with reminder:", {
        title: formattedTask.title,
        has_reminder: formattedTask.has_reminder,
        reminder_date: formattedTask.reminder_date.toISOString(),
        reminder_method: formattedTask.reminder_method
      });
    }
    
    await handleAddTask(formattedTask);
    refreshTasks();
  };
  
  const onAddMultipleTasks = async (newTasks: NewTask[]) => {
    const formattedTasks = newTasks.map(task => ({
      ...task,
      date: startOfDay(task.date),
      reminder_date: task.has_reminder && task.reminder_date 
        ? startOfDay(task.reminder_date) 
        : undefined
    }));
    
    await handleAddMultipleTasks(formattedTasks);
    refreshTasks();
  };
  
  // Wrapper function that takes just a taskId and looks up the completion status
  const onTaskComplete = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      handleTaskCompletion(taskId, task.completed);
    } else {
      console.error(`Task with ID ${taskId} not found`);
    }
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
    handleDeleteTask,
    recurringTasks,
    reminderTasks,
    onTaskComplete
  };
};
