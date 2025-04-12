
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Task } from "../../types";
import { startOfDay } from "date-fns";

export const useTasksQuery = () => {
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['maintenance_tasks'],
    queryFn: async () => {
      console.log("Fetching maintenance tasks...");
      const { data, error } = await supabase
        .from('maintenance_tasks')
        .select('*')
        .order('position', { ascending: true });
      
      if (error) {
        console.error("Error fetching tasks:", error);
        throw error;
      }
      
      console.log("Raw task data from Supabase:", data);
      console.log("Number of tasks retrieved:", data.length);
      
      const formattedTasks = data.map(task => {
        // Convertir les dates en objets Date et les normaliser (sans heure/minute/seconde)
        let taskDate;
        try {
          if (task.date) {
            // Si la date est une chaîne, la convertir en objet Date
            if (typeof task.date === 'string') {
              // Créer une nouvelle date à partir de la chaîne
              taskDate = new Date(task.date);
              
              // Vérifier si la date est valide
              if (isNaN(taskDate.getTime())) {
                console.warn("Date invalide pour la tâche:", task.id, task.date);
                taskDate = startOfDay(new Date()); // Date par défaut
              } else {
                // Normaliser la date (sans heure/minute/seconde)
                taskDate = startOfDay(taskDate);
              }
            } else if (task.date instanceof Date) {
              // Si c'est déjà un objet Date, le normaliser
              taskDate = startOfDay(task.date);
            } else {
              console.warn("Format de date non reconnu pour la tâche:", task.id);
              taskDate = startOfDay(new Date()); // Date par défaut
            }
          } else {
            console.warn("Pas de date pour la tâche:", task.id);
            taskDate = startOfDay(new Date()); // Date par défaut
          }
        } catch (e) {
          console.error("Erreur lors du traitement de la date:", task.date, e);
          taskDate = startOfDay(new Date());
        }
        
        let reminderDate = undefined;
        if (task.reminder_date) {
          try {
            if (typeof task.reminder_date === 'string') {
              reminderDate = new Date(task.reminder_date);
              if (isNaN(reminderDate.getTime())) {
                console.warn("Date de rappel invalide pour la tâche:", task.id, task.reminder_date);
                reminderDate = undefined;
              } else {
                reminderDate = startOfDay(reminderDate);
              }
            } else if (task.reminder_date instanceof Date) {
              reminderDate = startOfDay(task.reminder_date);
            }
          } catch (e) {
            console.error("Erreur lors du traitement de la date de rappel:", task.reminder_date, e);
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
      
      console.log("Tâches traitées après récupération:", formattedTasks.length);
      console.log("Exemples de tâches:", formattedTasks.slice(0, 3).map(t => ({ 
        id: t.id, 
        title: t.title,
        date: t.date instanceof Date ? t.date.toISOString() : 'Date invalide',
        type: t.type,
        priority: t.priority
      })));
      
      return formattedTasks;
    },
    refetchInterval: 5000, // Rafraîchissement toutes les 5 secondes
  });

  return { tasks, isLoading };
};
