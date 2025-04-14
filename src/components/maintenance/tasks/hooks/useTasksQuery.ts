import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Task } from "../../types";
import { startOfDay, format, isValid, parseISO } from "date-fns";

export const useTasksQuery = (propertyId?: string) => {
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['maintenance_tasks', propertyId],
    queryFn: async () => {
      console.log(`Fetching maintenance tasks for property: ${propertyId || 'all'}`);
      
      // Construire la requête de base
      let query = supabase
        .from('maintenance_tasks')
        .select('*')
        .order('position', { ascending: true });
      
      // Ajouter le filtre par propriété si fourni
      if (propertyId) {
        query = query.eq('property_id', propertyId);
      }
      
      // Exécuter la requête
      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching tasks:", error);
        throw error;
      }
      
      console.log(`Retrieved ${data?.length || 0} tasks for property ${propertyId || 'all'}`);
      
      // Le reste du code reste le même pour le formatage des tâches
      const formattedTasks = data.map(task => {
        // Convert dates to Date objects and normalize them (without hours/minutes/seconds)
        let taskDate: Date;
        try {
          if (task.date) {
            // Si la date est une chaîne, la convertir en objet Date
            if (typeof task.date === 'string') {
              try {
                taskDate = parseISO(task.date);
                
                // Ajouter des logs détaillés pour le parsing de la date
                console.log(`Task ${task.id} date parsing:
                  - Original string: ${task.date}
                  - Parsed as: ${isValid(taskDate) ? format(taskDate, "yyyy-MM-dd") : "INVALID"}
                  - ISO string: ${isValid(taskDate) ? taskDate.toISOString() : "INVALID"}
                `);
              } catch (e) {
                console.error("Error parsing date string:", task.date, e);
                taskDate = startOfDay(new Date()); // Date par défaut
              }
              
              // Vérifier si la date est valide
              if (!isValid(taskDate)) {
                console.warn("Invalid date for task:", task.id, task.date);
                taskDate = startOfDay(new Date()); // Date par défaut
              } else {
                // Normaliser la date (sans heures/minutes/secondes)
                taskDate = startOfDay(taskDate);
              }
            } else if (task.date instanceof Date) {
              // Si c'est déjà un objet Date, le normaliser
              taskDate = startOfDay(task.date);
            } else {
              console.warn("Unrecognized date format for task:", task.id);
              taskDate = startOfDay(new Date()); // Date par défaut
            }
          } else {
            console.warn("No date for task:", task.id);
            taskDate = startOfDay(new Date()); // Date par défaut
          }
          
          // Logger la date traitée pour le débogage
          const formattedDate = format(taskDate, "yyyy-MM-dd");
          console.log(`Task ${task.id} processed date: ${formattedDate}`);
        } catch (e) {
          console.error("Error processing date:", task.date, e);
          taskDate = startOfDay(new Date());
        }
        
        let reminderDate = undefined;
        if (task.reminder_date) {
          try {
            if (typeof task.reminder_date === 'string') {
              try {
                reminderDate = parseISO(task.reminder_date);
              } catch (e) {
                console.error("Error parsing reminder date:", task.reminder_date, e);
                reminderDate = undefined;
              }
              
              if (!isValid(reminderDate)) {
                console.warn("Invalid reminder date for task:", task.id, task.reminder_date);
                reminderDate = undefined;
              } else {
                reminderDate = startOfDay(reminderDate);
              }
            } else if (task.reminder_date instanceof Date) {
              reminderDate = startOfDay(task.reminder_date);
            }
          } catch (e) {
            console.error("Error processing reminder date:", task.reminder_date, e);
            reminderDate = undefined;
          }
        }
        
        // Retourner la tâche avec les dates normalisées
        return {
          ...task,
          date: taskDate,
          type: (task.type || "regular") as "regular" | "inspection" | "seasonal",
          priority: (task.priority || "medium") as "low" | "medium" | "high" | "urgent",
          status: (task.status || "pending") as "pending" | "in_progress" | "completed",
          completed: Boolean(task.completed),
          is_recurring: Boolean(task.is_recurring),
          has_reminder: Boolean(task.has_reminder),
          reminder_date: reminderDate,
          reminder_method: task.reminder_method || "app",
          recurrence_pattern: task.recurrence_pattern ? {
            frequency: task.recurrence_pattern.frequency || "daily",
            interval: task.recurrence_pattern.interval || 1,
            weekdays: task.recurrence_pattern.weekdays || [],
            end_date: task.recurrence_pattern.end_date ? startOfDay(new Date(task.recurrence_pattern.end_date)) : undefined
          } : undefined
        } as Task;
      });
      
      console.log("Tasks processed after retrieval:", formattedTasks.length);
      if (formattedTasks.length > 0) {
        console.log("Task examples:", formattedTasks.slice(0, 3).map(t => ({ 
          id: t.id, 
          title: t.title,
          date: t.date instanceof Date ? format(t.date, "yyyy-MM-dd") : 'Invalid date',
          type: t.type,
          priority: t.priority,
          property_id: t.property_id
        })));
      }
      
      return formattedTasks;
    },
    refetchInterval: 5000, // Refresh every 5 seconds
    staleTime: 3000, // Consider data stale after 3 seconds to encourage refetching
  });

  // Fonction pour forcer le rafraîchissement des tâches
  const refreshTasks = () => {
    console.log("Manually refreshing tasks...");
    queryClient.invalidateQueries({ queryKey: ['maintenance_tasks', propertyId] });
  };

  return { tasks, isLoading, refreshTasks };
};
