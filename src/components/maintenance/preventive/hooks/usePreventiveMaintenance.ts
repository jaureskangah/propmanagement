
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

  // Log all tasks for debugging
  console.log("All available tasks:", tasks.map(task => ({
    id: task.id,
    title: task.title,
    date: task.date instanceof Date ? format(task.date, "yyyy-MM-dd") : typeof task.date === 'string' ? task.date : 'Invalid date',
    type: task.type
  })));

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
    
    // Log to help debug the date comparison
    console.log(`Comparing task "${task.title}": Task date (${format(taskDate, "yyyy-MM-dd")}) with selected date (${format(currentSelectedDate, "yyyy-MM-dd")})`);
    
    // Use isSameDay for reliable date comparison
    const result = isSameDay(taskDate, currentSelectedDate);
    console.log(`Match for task "${task.title}": ${result}`);
    
    return result;
  });
  
  // Log filtered tasks for debugging
  console.log(`Selected date: ${selectedDate ? format(selectedDate, "yyyy-MM-dd") : "none"}`);
  console.log(`Filtered tasks count: ${filteredTasksByDate.length}`);
  if (filteredTasksByDate.length > 0) {
    console.log(`Filtered tasks:`, filteredTasksByDate.map(t => ({ 
      id: t.id, 
      title: t.title, 
      date: t.date instanceof Date ? format(t.date, "yyyy-MM-dd") : 'Invalid date'
    })));
  }

  const onAddTask = (newTask: NewTask): Promise<any> => {
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
    
    console.log("Normalized task date for creation:", format(newTask.date, "yyyy-MM-dd"));
    
    // Set selected date to match the new task's date BEFORE adding the task
    // This ensures the calendar is already showing the correct date
    const taskDate = startOfDay(newTask.date);
    console.log("Setting calendar to task date BEFORE adding task:", format(taskDate, "yyyy-MM-dd"));
    setSelectedDate(taskDate);
    
    // Now add the task and return the promise
    return handleAddTask(newTask)
      .then((result) => {
        console.log("Task added successfully:", result);
        toast({
          title: t('success'),
          description: t('taskAdded'),
        });
        // Close dialog is now handled in the AddTaskDialog component
        return result;
      })
      .catch(error => {
        console.error("Error adding task:", error);
        toast({
          title: t('error'),
          description: t('errorAddingTask'),
          variant: "destructive",
        });
        throw error; // Rethrow so the dialog stays open
      });
  };

  const onAddMultipleTasks = (newTasks: NewTask[]): Promise<any> => {
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
    
    // Now add the tasks and return the promise
    return handleAddMultipleTasks(normalizedTasks)
      .then((result) => {
        console.log("Multiple tasks added successfully:", result);
        toast({
          title: t('success'),
          description: t('multipleTasksAdded'),
        });
        setIsBatchSchedulingOpen(false);
        return result;
      })
      .catch(error => {
        console.error("Error adding multiple tasks:", error);
        toast({
          title: t('error'),
          description: t('errorAddingTasks'),
          variant: "destructive",
        });
        throw error;
      });
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
    recurringTasks: tasks.filter(task => task.is_recurring),
    reminderTasks: tasks.filter(task => task.has_reminder)
  };
};
