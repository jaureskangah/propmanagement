
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
    type: task.type,
    has_reminder: task.has_reminder,
    is_recurring: task.is_recurring
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
      date: t.date instanceof Date ? format(t.date, "yyyy-MM-dd") : 'Invalid date',
      has_reminder: t.has_reminder,
      is_recurring: t.is_recurring
    })));
  }

  const onAddTask = (newTask: NewTask): Promise<any> => {
    console.log("Create task clicked with data:", newTask);
    console.log("Task has reminder:", newTask.has_reminder);
    console.log("Reminder data:", { date: newTask.reminder_date, method: newTask.reminder_method });
    console.log("Task is recurring:", newTask.is_recurring);
    console.log("Recurrence pattern:", newTask.recurrence_pattern);
    
    // Ensure the task has a valid date
    let dateToStore: string;
    
    if (!newTask.date) {
      // Default to today if no date
      dateToStore = formatLocalDateForStorage(startOfDay(new Date()));
    } else if (newTask.date instanceof Date) {
      // If it's already a Date object, format it properly
      dateToStore = formatLocalDateForStorage(startOfDay(newTask.date));
    } else if (typeof newTask.date === 'string' && newTask.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      // If it's already in YYYY-MM-DD format, use it directly
      dateToStore = newTask.date;
    } else {
      // Try to parse string to Date then format
      try {
        const parsedDate = typeof newTask.date === 'string' ? parseISO(newTask.date) : new Date();
        dateToStore = formatLocalDateForStorage(startOfDay(parsedDate));
      } catch (e) {
        console.error("Error parsing task date:", newTask.date, e);
        dateToStore = formatLocalDateForStorage(startOfDay(new Date()));
      }
    }
    
    console.log("Formatted date string for storage:", dateToStore);
    
    // Set selected date to match the new task's date BEFORE adding the task
    let taskDate: Date;
    
    if (newTask.date instanceof Date) {
      taskDate = startOfDay(newTask.date);
    } else if (typeof newTask.date === 'string') {
      try {
        taskDate = parseISO(newTask.date);
      } catch {
        taskDate = startOfDay(new Date());
      }
    } else {
      taskDate = startOfDay(new Date());
    }
    
    console.log("Setting calendar to task date BEFORE adding task:", format(taskDate, "yyyy-MM-dd"));
    setSelectedDate(taskDate);
    
    // Create a task object with the formatted date string
    const taskWithFormattedDate = {
      ...newTask,
      date: dateToStore
    };
    
    console.log("Final task data being sent to handleAddTask:", taskWithFormattedDate);
    
    // Now add the task with formatted date and return the promise
    return handleAddTask(taskWithFormattedDate as NewTask)
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
      let dateToStore: string;
      
      if (!task.date) {
        // Default to today if no date
        dateToStore = formatLocalDateForStorage(startOfDay(new Date()));
      } else if (task.date instanceof Date) {
        // If it's already a Date object, format it properly
        dateToStore = formatLocalDateForStorage(startOfDay(task.date));
      } else if (typeof task.date === 'string' && task.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        // If it's already in YYYY-MM-DD format, use it directly
        dateToStore = task.date;
      } else {
        // Try to parse string to Date then format
        try {
          const parsedDate = typeof task.date === 'string' ? parseISO(task.date) : new Date();
          dateToStore = formatLocalDateForStorage(startOfDay(parsedDate));
        } catch (e) {
          console.error("Error parsing task date:", task.date, e);
          dateToStore = formatLocalDateForStorage(startOfDay(new Date()));
        }
      }
      
      return {
        ...task, // Keep all reminder and recurrence data
        date: dateToStore
      };
    });
    
    // Set selected date to match the first task's date BEFORE adding the tasks
    if (normalizedTasks.length > 0) {
      const firstTaskDate = typeof normalizedTasks[0].date === 'string' 
        ? parseISO(normalizedTasks[0].date) 
        : normalizedTasks[0].date as Date;
        
      console.log("Setting calendar to first batch task date BEFORE adding tasks:", 
        format(firstTaskDate, "yyyy-MM-dd"));
      setSelectedDate(firstTaskDate);
    }
    
    // Now add the tasks and return the promise
    return handleAddMultipleTasks(normalizedTasks as NewTask[])
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
