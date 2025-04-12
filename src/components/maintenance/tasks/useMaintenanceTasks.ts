
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

  // Function to complete a task
  const handleTaskComplete = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    await handleTaskCompletion(taskId, task.completed);
  };

  // Version améliorée qui force une actualisation des données immédiatement après l'ajout d'une tâche
  const addTaskWithRefresh = useCallback(async (newTask: NewTask) => {
    const result = await handleAddTask(newTask);
    // Force un rafraîchissement immédiat des données après l'ajout d'une tâche
    queryClient.invalidateQueries({ queryKey: ['maintenance_tasks'] });
    return result;
  }, [handleAddTask, queryClient]);

  // Version améliorée pour ajouter plusieurs tâches avec actualisation immédiate
  const addMultipleTasksWithRefresh = useCallback(async (newTasks: NewTask[]) => {
    const result = await handleAddMultipleTasks(newTasks);
    // Force un rafraîchissement immédiat des données
    queryClient.invalidateQueries({ queryKey: ['maintenance_tasks'] });
    return result;
  }, [handleAddMultipleTasks, queryClient]);

  return {
    tasks,
    isLoading,
    handleTaskCompletion: handleTaskComplete,
    handleDeleteTask,
    handleAddTask: addTaskWithRefresh,
    handleAddMultipleTasks: addMultipleTasksWithRefresh,
    handleUpdateTaskPosition,
  };
};
