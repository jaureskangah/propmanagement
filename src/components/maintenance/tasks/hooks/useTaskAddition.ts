
import { supabase } from "@/lib/supabase";
import { NewTask, Task } from "../../types";
import { format, parseISO, startOfDay } from "date-fns";

export const useTaskAddition = () => {
  const handleAddTask = async (newTask: NewTask) => {
    try {
      console.log("Adding new task:", newTask);
      
      // Normaliser la date de la tâche
      let taskDate: Date;
      if (newTask.date instanceof Date) {
        taskDate = startOfDay(newTask.date);
      } else if (typeof newTask.date === 'string') {
        try {
          const parsedDate = parseISO(newTask.date);
          taskDate = startOfDay(parsedDate);
        } catch (e) {
          console.error("Error parsing date:", newTask.date, e);
          taskDate = startOfDay(new Date());
        }
      } else {
        taskDate = startOfDay(new Date());
      }
      
      // Formater la date pour l'insertion dans la base de données
      const formattedDate = format(taskDate, "yyyy-MM-dd");
      console.log("Formatted date for database:", formattedDate);
      
      // Préparer les données de la tâche
      const taskData = {
        title: newTask.title,
        date: formattedDate, // Utiliser la date formatée
        type: newTask.type || "regular",
        priority: newTask.priority || "medium",
        status: "pending",
        user_id: (await supabase.auth.getUser()).data.user?.id,
        completed: false,
        is_recurring: newTask.is_recurring || false,
        recurrence_pattern: newTask.recurrence_pattern,
        has_reminder: newTask.has_reminder || false,
        reminder_date: newTask.reminder_date instanceof Date 
          ? format(startOfDay(newTask.reminder_date), "yyyy-MM-dd") 
          : newTask.reminder_date,
        reminder_method: newTask.reminder_method,
        position: 0, // Position par défaut
      };
      
      console.log("Processed task data for insert:", taskData);
      
      const { data, error } = await supabase
        .from('maintenance_tasks')
        .insert(taskData)
        .select("*")
        .single();
      
      if (error) {
        console.error("Error adding task:", error);
        throw error;
      }
      
      // Log detailed info about the added task
      console.log("Task added successfully:", data);
      console.log(`Added task date from DB: ${data.date}`);
      
      return data as Task;
    } catch (error) {
      console.error("Error in handleAddTask:", error);
      throw error;
    }
  };

  const handleAddMultipleTasks = async (newTasks: NewTask[]) => {
    try {
      console.log("Adding multiple tasks:", newTasks);
      
      const userId = (await supabase.auth.getUser()).data.user?.id;
      
      // Préparer les données des tâches
      const tasksData = newTasks.map((task, index) => {
        // Normaliser la date de la tâche
        let taskDate: Date;
        if (task.date instanceof Date) {
          taskDate = startOfDay(task.date);
        } else if (typeof task.date === 'string') {
          try {
            const parsedDate = parseISO(task.date);
            taskDate = startOfDay(parsedDate);
          } catch (e) {
            console.error("Error parsing date:", task.date, e);
            taskDate = startOfDay(new Date());
          }
        } else {
          taskDate = startOfDay(new Date());
        }
        
        // Formater la date pour l'insertion dans la base de données
        const formattedDate = format(taskDate, "yyyy-MM-dd");
        
        return {
          title: task.title,
          date: formattedDate, // Utiliser la date formatée
          type: task.type || "regular",
          priority: task.priority || "medium",
          status: "pending",
          user_id: userId,
          completed: false,
          is_recurring: task.is_recurring || false,
          recurrence_pattern: task.recurrence_pattern,
          has_reminder: task.has_reminder || false,
          reminder_date: task.reminder_date instanceof Date 
            ? format(startOfDay(task.reminder_date), "yyyy-MM-dd") 
            : task.reminder_date,
          reminder_method: task.reminder_method,
          position: index, // Position basée sur l'index
        };
      });
      
      console.log("Processed tasks data for batch insert:", tasksData);
      
      const { data, error } = await supabase
        .from('maintenance_tasks')
        .insert(tasksData)
        .select("*");
      
      if (error) {
        console.error("Error adding multiple tasks:", error);
        throw error;
      }
      
      console.log("Multiple tasks added successfully:", data);
      return data as Task[];
    } catch (error) {
      console.error("Error in handleAddMultipleTasks:", error);
      throw error;
    }
  };

  return {
    handleAddTask,
    handleAddMultipleTasks
  };
};
