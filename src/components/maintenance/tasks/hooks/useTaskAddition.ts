
import { supabase } from "@/lib/supabase";
import { NewTask, Task } from "../../types";

export const useTaskAddition = () => {
  const handleAddTask = async (newTask: NewTask) => {
    try {
      console.log("Adding new task:", newTask);
      
      // Préparer les données de la tâche (sans le champ description qui n'existe pas dans la table)
      const taskData = {
        title: newTask.title,
        date: newTask.date,
        type: newTask.type || "regular",
        priority: newTask.priority || "medium",
        status: "pending",
        user_id: (await supabase.auth.getUser()).data.user?.id,
        completed: false,
        is_recurring: newTask.is_recurring || false,
        recurrence_pattern: newTask.recurrence_pattern,
        has_reminder: newTask.has_reminder || false,
        reminder_date: newTask.reminder_date,
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
      
      console.log("Task added successfully:", data);
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
      
      // Préparer les données des tâches (sans le champ description)
      const tasksData = newTasks.map((task, index) => ({
        title: task.title,
        date: task.date,
        type: task.type || "regular",
        priority: task.priority || "medium",
        status: "pending",
        user_id: userId,
        completed: false,
        is_recurring: task.is_recurring || false,
        recurrence_pattern: task.recurrence_pattern,
        has_reminder: task.has_reminder || false,
        reminder_date: task.reminder_date,
        reminder_method: task.reminder_method,
        position: index, // Position basée sur l'index
      }));
      
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
