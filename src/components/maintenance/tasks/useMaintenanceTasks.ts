
import { useTasksQuery } from "./hooks/useTasksQuery";
import { useTaskCompletion } from "./hooks/useTaskCompletion";
import { useTaskDeletion } from "./hooks/useTaskDeletion";
import { useTaskAddition } from "./hooks/useTaskAddition";
import { useTaskPosition } from "./hooks/useTaskPosition";
import { Task, NewTask } from "../types";
import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";

export const useMaintenanceTasks = (propertyId?: string) => {
  const { tasks, isLoading, refreshTasks } = useTasksQuery(propertyId);
  const { handleTaskCompletion } = useTaskCompletion();
  const { handleDeleteTask } = useTaskDeletion();
  const { handleAddTask, handleAddMultipleTasks } = useTaskAddition();
  const { handleUpdateTaskPosition } = useTaskPosition();
  const queryClient = useQueryClient();

  // Fonction pour compléter une tâche
  const handleTaskComplete = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    await handleTaskCompletion(taskId, task.completed);
    
    // Forcer un rafraîchissement immédiat des données
    queryClient.invalidateQueries({ queryKey: ['maintenance_tasks', propertyId] });
  };

  // Fonction améliorée pour ajouter une tâche et rafraîchir les données
  const addTaskWithRefresh = useCallback(async (newTask: NewTask) => {
    try {
      console.log("Adding task and will refresh afterwards:", newTask);
      
      // S'assurer que la propriété est définie dans la tâche si fournie
      const taskWithProperty = propertyId && !newTask.property_id 
        ? { ...newTask, property_id: propertyId } 
        : newTask;
      
      // Ajouter la tâche
      const result = await handleAddTask(taskWithProperty);
      
      console.log("Task added, refreshing data now...");
      
      // Forcer un rafraîchissement immédiat des données
      refreshTasks();
      
      return result;
    } catch (error) {
      console.error("Erreur lors de l'ajout de la tâche:", error);
      throw error;
    }
  }, [handleAddTask, refreshTasks, propertyId]);

  // Fonction améliorée pour ajouter plusieurs tâches et rafraîchir les données
  const addMultipleTasksWithRefresh = useCallback(async (newTasks: NewTask[]) => {
    try {
      console.log("Adding multiple tasks and will refresh afterwards:", newTasks.length);
      
      // S'assurer que la propriété est définie pour toutes les tâches si fournie
      const tasksWithProperty = propertyId 
        ? newTasks.map(task => ({
            ...task,
            property_id: task.property_id || propertyId
          }))
        : newTasks;
      
      // Ajouter les tâches
      const result = await handleAddMultipleTasks(tasksWithProperty);
      
      console.log("Multiple tasks added, refreshing data now...");
      
      // Forcer un rafraîchissement immédiat des données
      refreshTasks();
      
      return result;
    } catch (error) {
      console.error("Erreur lors de l'ajout des tâches:", error);
      throw error;
    }
  }, [handleAddMultipleTasks, refreshTasks, propertyId]);

  // Fonction améliorée pour supprimer une tâche et rafraîchir les données
  const deleteTaskWithRefresh = useCallback(async (taskId: string) => {
    try {
      console.log("Deleting task and will refresh afterwards:", taskId);
      
      // Supprimer la tâche
      const result = await handleDeleteTask(taskId);
      
      console.log("Task deleted, refreshing data now...");
      
      // Forcer un rafraîchissement immédiat des données
      refreshTasks();
      
      return result;
    } catch (error) {
      console.error("Erreur lors de la suppression de la tâche:", error);
      throw error;
    }
  }, [handleDeleteTask, refreshTasks]);

  return {
    tasks,
    isLoading,
    handleTaskCompletion: handleTaskComplete,
    handleDeleteTask: deleteTaskWithRefresh,
    handleAddTask: addTaskWithRefresh,
    handleAddMultipleTasks: addMultipleTasksWithRefresh,
    handleUpdateTaskPosition,
  };
};
