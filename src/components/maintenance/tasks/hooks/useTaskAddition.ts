
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { NewTask } from "../../types";
import { format, startOfDay } from "date-fns";

export const useTaskAddition = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  const getNextPosition = async () => {
    const { data: lastTask } = await supabase
      .from('maintenance_tasks')
      .select('position')
      .order('position', { ascending: false })
      .limit(1);
      
    return (lastTask?.[0]?.position ?? -1) + 1;
  };
  
  // Modifié pour s'assurer que la date n'est pas affectée par le fuseau horaire
  const formatTaskDate = (date: Date) => {
    // Normaliser la date en utilisant UTC pour éviter les décalages liés au fuseau horaire
    const normalizedDate = new Date(Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      12, 0, 0, 0
    ));
    
    // Format standard ISO pour la date (YYYY-MM-DD)
    return format(normalizedDate, 'yyyy-MM-dd');
  };

  const handleAddTask = async (newTask: NewTask) => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to add tasks",
        variant: "destructive",
      });
      return;
    }

    try {
      const nextPosition = await getNextPosition();
      const formattedDate = formatTaskDate(newTask.date);
      
      console.log("Adding task with date:", formattedDate, "Original date:", newTask.date);

      const { error } = await supabase
        .from('maintenance_tasks')
        .insert({
          title: newTask.title,
          date: formattedDate,
          type: newTask.type,
          priority: newTask.priority || 'medium',
          completed: false,
          user_id: user.id,
          position: nextPosition,
          is_recurring: newTask.is_recurring || false,
          recurrence_pattern: newTask.recurrence_pattern ? {
            frequency: newTask.recurrence_pattern.frequency,
            interval: newTask.recurrence_pattern.interval,
            weekdays: newTask.recurrence_pattern.weekdays,
            end_date: newTask.recurrence_pattern.end_date
          } : null
        });

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['maintenance_tasks'] });
      toast({
        title: "Success",
        description: "Task added successfully",
      });
    } catch (error) {
      console.error("Error adding task:", error);
      toast({
        title: "Error",
        description: "Unable to add task",
        variant: "destructive",
      });
    }
  };

  const handleAddMultipleTasks = async (newTasks: NewTask[]) => {
    if (!user?.id || newTasks.length === 0) {
      return;
    }

    try {
      const nextPosition = await getNextPosition();
      
      const tasksToInsert = newTasks.map((task, index) => {
        const formattedDate = formatTaskDate(task.date);
        console.log(`Task ${index + 1} date:`, formattedDate, "Original date:", task.date);
        
        return {
          title: task.title,
          date: formattedDate,
          type: task.type,
          priority: task.priority || 'medium',
          completed: false,
          user_id: user.id,
          position: nextPosition + index,
          is_recurring: task.is_recurring || false,
          recurrence_pattern: task.recurrence_pattern ? {
            frequency: task.recurrence_pattern.frequency,
            interval: task.recurrence_pattern.interval,
            weekdays: task.recurrence_pattern.weekdays,
            end_date: task.recurrence_pattern.end_date
          } : null
        };
      });

      const { error } = await supabase
        .from('maintenance_tasks')
        .insert(tasksToInsert);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['maintenance_tasks'] });
      toast({
        title: "Success",
        description: `${tasksToInsert.length} tasks added successfully`,
      });
    } catch (error) {
      console.error("Error adding batch tasks:", error);
      toast({
        title: "Error",
        description: "Unable to add tasks in batch",
        variant: "destructive",
      });
    }
  };

  return { handleAddTask, handleAddMultipleTasks };
};
