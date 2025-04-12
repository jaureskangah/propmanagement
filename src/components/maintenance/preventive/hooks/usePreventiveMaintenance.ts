
import { useState } from "react";
import { useMaintenanceTasks } from "../../tasks/useMaintenanceTasks";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/components/providers/LocaleProvider";
import { NewTask } from "../../types";
import { startOfDay, format, parseISO, isSameDay } from "date-fns";

export const usePreventiveMaintenance = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(startOfDay(new Date()));
  const [selectedType, setSelectedType] = useState<string>("all");
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isBatchSchedulingOpen, setIsBatchSchedulingOpen] = useState(false);
  const { t } = useLocale();
  const { toast } = useToast();
  
  const {
    tasks,
    isLoading,
    handleTaskCompletion,
    handleDeleteTask,
    handleAddTask,
    handleAddMultipleTasks,
  } = useMaintenanceTasks();

  // Function to normalize dates for comparison by removing time component
  const normalizeDate = (date: Date | string | undefined): Date | undefined => {
    if (!date) return undefined;
    
    let normalizedDate: Date;
    if (typeof date === 'string') {
      try {
        normalizedDate = parseISO(date);
        if (!normalizedDate || isNaN(normalizedDate.getTime())) {
          console.error("Invalid date string:", date);
          return undefined;
        }
      } catch (error) {
        console.error("Error parsing date string:", date, error);
        return undefined;
      }
    } else {
      normalizedDate = new Date(date);
    }
    
    return startOfDay(normalizedDate);
  };

  // Filter tasks by selected type
  const filteredTasksByType = tasks.filter((task) =>
    selectedType === "all" ? true : task.type === selectedType
  );

  // Filter tasks by selected date using normalized dates for comparison
  const filteredTasksByDate = filteredTasksByType.filter(task => {
    if (!selectedDate) return false;
    
    const taskDate = normalizeDate(task.date);
    const currentSelectedDate = normalizeDate(selectedDate);
    
    if (!taskDate || !currentSelectedDate) {
      console.error("Invalid date in comparison:", { 
        taskDate: task.date, 
        selectedDate: selectedDate 
      });
      return false;
    }
    
    // Use isSameDay for reliable date comparison
    const result = isSameDay(taskDate, currentSelectedDate);
    return result;
  });
  
  // Log filtered tasks for debugging
  console.log(`Selected date: ${selectedDate ? format(selectedDate, "yyyy-MM-dd") : "none"}`);
  console.log(`Filtered tasks count: ${filteredTasksByDate.length}`);
  
  // Filter recurring tasks
  const recurringTasks = tasks.filter(task => task.is_recurring === true);
  
  // Debug logging for tasks
  console.log("All tasks:", tasks.length);
  
  // Filter tasks with reminders - improved approach with detailed logging
  const reminderTasks = tasks.filter(task => {
    // Vérifier si la tâche a has_reminder à true
    if (!task.has_reminder) {
      return false;
    }
    
    // Vérifier si la tâche a une date de rappel
    if (!task.reminder_date) {
      console.log(`Task ${task.id} has reminder=true but no reminder_date`);
      return false;
    }
    
    // Log détaillé pour chaque tâche avec rappel
    console.log(`REMINDER: Found task with reminder:
      ID: ${task.id}
      Title: ${task.title}
      Reminder date: ${task.reminder_date instanceof Date 
        ? format(task.reminder_date, "yyyy-MM-dd") 
        : typeof task.reminder_date === 'string' 
          ? task.reminder_date 
          : 'unknown format'}
      Reminder method: ${task.reminder_method}
    `);
    
    // Cette tâche a tous les éléments requis pour être un rappel
    return true;
  });
  
  console.log(`Recurring tasks: ${recurringTasks.length}`);
  console.log(`Reminder tasks: ${reminderTasks.length}`);

  const onAddTask = (newTask: NewTask) => {
    console.log("Create task clicked with data:", newTask);
    
    // Ensure the task has a valid date
    if (!newTask.date) {
      newTask.date = startOfDay(new Date());
    } else if (typeof newTask.date === 'string') {
      try {
        newTask.date = startOfDay(parseISO(newTask.date));
      } catch (e) {
        console.error("Error parsing task date string:", newTask.date, e);
        newTask.date = startOfDay(new Date());
      }
    } else {
      newTask.date = startOfDay(newTask.date);
    }
    
    // Set selected date to match the new task's date BEFORE adding the task
    const taskDate = startOfDay(newTask.date);
    console.log("Setting calendar to task date BEFORE adding task:", format(taskDate, "yyyy-MM-dd"));
    setSelectedDate(taskDate);
    
    // Ajouter des logs pour les rappels avant d'ajouter la tâche
    if (newTask.has_reminder && newTask.reminder_date) {
      console.log(`CRITICAL: Adding task with reminder:
        Title: ${newTask.title}
        has_reminder: ${newTask.has_reminder}
        reminder_date: ${newTask.reminder_date instanceof Date 
          ? format(newTask.reminder_date, "yyyy-MM-dd") 
          : typeof newTask.reminder_date === 'string' 
            ? newTask.reminder_date 
            : 'unknown format'}
        reminder_method: ${newTask.reminder_method}
      `);
    }
    
    // Now add the task
    handleAddTask(newTask).then((result) => {
      console.log("Task added successfully:", result);
      toast({
        title: t('success'),
        description: t('taskAdded'),
      });
    }).catch(error => {
      console.error("Error adding task:", error);
      toast({
        title: t('error'),
        description: t('errorAddingTask'),
        variant: "destructive",
      });
    });
    setIsAddTaskOpen(false);
  };

  const onAddMultipleTasks = (newTasks: NewTask[]) => {
    // Normalize dates in all new tasks
    const normalizedTasks = newTasks.map(task => ({
      ...task,
      date: task.date ? startOfDay(task.date instanceof Date ? task.date : new Date(task.date)) : startOfDay(new Date())
    }));
    
    // Set selected date to match the first task's date BEFORE adding the tasks
    if (normalizedTasks.length > 0 && normalizedTasks[0].date) {
      const taskDate = startOfDay(normalizedTasks[0].date);
      console.log("Setting calendar to first batch task date BEFORE adding tasks:", format(taskDate, "yyyy-MM-dd"));
      setSelectedDate(taskDate);
    }
    
    // Now add the tasks
    handleAddMultipleTasks(normalizedTasks).then((result) => {
      console.log("Multiple tasks added successfully:", result);
      toast({
        title: t('success'),
        description: t('multipleTasksAdded'),
      });
    }).catch(error => {
      console.error("Error adding multiple tasks:", error);
      toast({
        title: t('error'),
        description: t('errorAddingTasks'),
        variant: "destructive",
      });
    });
    setIsBatchSchedulingOpen(false);
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
