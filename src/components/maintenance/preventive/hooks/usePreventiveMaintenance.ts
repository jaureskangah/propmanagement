
import { useState } from "react";
import { useMaintenanceTasks } from "../../tasks/useMaintenanceTasks";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/components/providers/LocaleProvider";
import { NewTask } from "../../types";
import { startOfDay, format, parseISO, isSameDay } from "date-fns";
import { formatLocalDateForStorage } from "../../utils/dateUtils";

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
    
    // CRITICAL FIX: Format the date for storage BEFORE sending to handleAddTask
    const dateToStore = formatLocalDateForStorage(newTask.date);
    console.log(`Formatted date string for storage: ${dateToStore} from date ${newTask.date.toString()}`);
    
    // Set selected date to match the new task's date BEFORE adding the task
    // This ensures the calendar is already showing the correct date
    const taskDate = startOfDay(newTask.date);
    console.log("Setting calendar to task date BEFORE adding task:", format(taskDate, "yyyy-MM-dd"));
    setSelectedDate(taskDate);
    
    // Create a copy of the task with the formatted date
    const taskWithFormattedDate = {
      ...newTask,
      date: dateToStore // Use the formatted date string instead of Date object
    };
    
    // Now add the task with formatted date and return the promise
    return handleAddTask(taskWithFormattedDate)
      .then((result) => {
        console.log("Task added successfully:", result);
        toast({
          title: t('success'),
          description: t('taskAdded'),
        });
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
    // Normalize dates in all new tasks and format them for storage
    const normalizedTasks = newTasks.map(task => {
      const normalizedDate = task.date 
        ? startOfDay(task.date instanceof Date ? task.date : new Date(task.date))
        : startOfDay(new Date());
      
      // Format the date for storage
      const dateToStore = formatLocalDateForStorage(normalizedDate);
      
      return {
        ...task,
        date: dateToStore // Use the formatted date string for storage
      };
    });
    
    // Set selected date to match the first task's date BEFORE adding the tasks
    if (normalizedTasks.length > 0 && normalizedTasks[0].date) {
      // Parse the formatted date back to a Date for the calendar
      const firstTaskDate = parseISO(normalizedTasks[0].date);
      console.log("Setting calendar to first batch task date BEFORE adding tasks:", format(firstTaskDate, "yyyy-MM-dd"));
      setSelectedDate(firstTaskDate);
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
    filteredTasksByDate: tasks.filter((task) => {
      if (!selectedDate) return false;
      
      // CRITICAL FIX: Handle both string and Date types consistently
      const taskDate = task.date instanceof Date
        ? task.date
        : typeof task.date === 'string'
          ? parseISO(task.date + (task.date.includes('T') ? '' : 'T00:00:00'))
          : null;
          
      if (!taskDate) return false;
      
      const currentSelectedDate = startOfDay(selectedDate);
      return isSameDay(taskDate, currentSelectedDate);
    }),
    onAddTask,
    onAddMultipleTasks,
    handleTaskCompletion,
    handleDeleteTask,
    recurringTasks: tasks.filter(task => task.is_recurring),
    reminderTasks: tasks.filter(task => task.has_reminder)
  };
};
