
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
  
  // Filter tasks by the selected date
  const filteredTasksByDate = tasks.filter(task => {
    const taskDate = task.date instanceof Date ? task.date : new Date(task.date as string);
    return isSameDay(taskDate, selectedDate) && 
      (!selectedType || task.type === selectedType);
  });
  
  // Get recurring tasks
  const recurringTasks = tasks.filter(task => task.is_recurring);
  
  // Get tasks with reminders - simplified and more robust filtering
  const reminderTasks = tasks.filter(task => {
    // Task must have reminder flag
    if (!task.has_reminder) return false;
    
    // Task must have a reminder date
    if (!task.reminder_date) return false;
    
    // Convert reminder_date to Date object if it's a string
    let reminderDate;
    if (task.reminder_date instanceof Date) {
      reminderDate = task.reminder_date;
    } else if (typeof task.reminder_date === 'string') {
      try {
        reminderDate = new Date(task.reminder_date);
        if (isNaN(reminderDate.getTime())) {
          console.log(`Reminder date is invalid for task: ${task.id}`);
          return false;
        }
      } catch (e) {
        console.error(`Error parsing reminder date for task ${task.id}:`, e);
        return false;
      }
    } else {
      return false;
    }
    
    console.log(`Found valid reminder task: ${task.id} - ${task.title} - ${format(reminderDate, 'yyyy-MM-dd')}`);
    return true;
  });
  
  console.log(`Total tasks: ${tasks.length}, Reminders: ${reminderTasks.length}, Recurring: ${recurringTasks.length}`);
  
  // Add task handling
  const onAddTask = async (newTask: NewTask) => {
    // Ensure dates are properly formatted before submission
    const formattedTask = {
      ...newTask,
      date: startOfDay(newTask.date),
      reminder_date: newTask.has_reminder && newTask.reminder_date 
        ? startOfDay(newTask.reminder_date) 
        : undefined
    };
    
    // Log reminder information
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
  
  // Wrapper function for task completion
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
