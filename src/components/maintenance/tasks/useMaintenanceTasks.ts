
import { useTasksQuery } from "./hooks/useTasksQuery";
import { useTaskCompletion } from "./hooks/useTaskCompletion";
import { useTaskDeletion } from "./hooks/useTaskDeletion";
import { useTaskAddition } from "./hooks/useTaskAddition";
import { useTaskPosition } from "./hooks/useTaskPosition";
import { Task, NewTask } from "../types";
import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";

export const useMaintenanceTasks = () => {
  const { tasks, isLoading } = useTasksQuery();
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
    queryClient.invalidateQueries({ queryKey: ['maintenance_tasks'] });
  };

  // Fonction améliorée pour ajouter une tâche et rafraîchir les données
  const addTaskWithRefresh = useCallback(async (newTask: NewTask) => {
    try {
      // Ajouter la tâche
      const result = await handleAddTask(newTask);
      
      // Forcer un rafraîchissement immédiat des données
      await queryClient.invalidateQueries({ queryKey: ['maintenance_tasks'] });
      
      return result;
    } catch (error) {
      console.error("Erreur lors de l'ajout de la tâche:", error);
      throw error;
    }
  }, [handleAddTask, queryClient]);

  // Fonction améliorée pour ajouter plusieurs tâches et rafraîchir les données
  const addMultipleTasksWithRefresh = useCallback(async (newTasks: NewTask[]) => {
    try {
      // Ajouter les tâches
      const result = await handleAddMultipleTasks(newTasks);
      
      // Forcer un rafraîchissement immédiat des données
      await queryClient.invalidateQueries({ queryKey: ['maintenance_tasks'] });
      
      return result;
    } catch (error) {
      console.error("Erreur lors de l'ajout des tâches:", error);
      throw error;
    }
  }, [handleAddMultipleTasks, queryClient]);

  // Fonction améliorée pour supprimer une tâche et rafraîchir les données
  const deleteTaskWithRefresh = useCallback(async (taskId: string) => {
    try {
      // Supprimer la tâche
      const result = await handleDeleteTask(taskId);
      
      // Forcer un rafraîchissement immédiat des données
      await queryClient.invalidateQueries({ queryKey: ['maintenance_tasks'] });
      
      return result;
    } catch (error) {
      console.error("Erreur lors de la suppression de la tâche:", error);
      throw error;
    }
  }, [handleDeleteTask, queryClient]);

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
