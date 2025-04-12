
import { useTasksQuery } from "./hooks/useTasksQuery";
import { useTaskCompletion } from "./hooks/useTaskCompletion";
import { useTaskDeletion } from "./hooks/useTaskDeletion";
import { useTaskAddition } from "./hooks/useTaskAddition";
import { useTaskPosition } from "./hooks/useTaskPosition";
import { Task, NewTask } from "../types";
import { useEffect } from "react";

export const useMaintenanceTasks = () => {
  const { tasks, isLoading, refetch } = useTasksQuery();
  const { handleTaskCompletion } = useTaskCompletion();
  const { handleDeleteTask } = useTaskDeletion();
  const { handleAddTask, handleAddMultipleTasks } = useTaskAddition();
  const { handleUpdateTaskPosition } = useTaskPosition();

  // Rafraîchir automatiquement les données chaque fois que le composant est monté
  useEffect(() => {
    refetch();
    // Créer un intervalle pour rafraîchir régulièrement
    const interval = setInterval(() => {
      refetch();
    }, 10000); // Rafraîchir toutes les 10 secondes
    
    return () => clearInterval(interval);
  }, [refetch]);

  // Function to complete a task
  const handleTaskComplete = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    await handleTaskCompletion(taskId, task.completed);
    // Rafraîchir les données après avoir complété une tâche
    refetch();
  };

  // Modification de handleAddTask pour refetch automatiquement après ajout
  const addTaskWithRefresh = async (newTask: NewTask) => {
    const result = await handleAddTask(newTask);
    // Rafraîchir les données après avoir ajouté une tâche
    await refetch();
    return result;
  };

  // Modification de handleAddMultipleTasks pour refetch automatiquement après ajout
  const addMultipleTasksWithRefresh = async (newTasks: NewTask[]) => {
    const result = await handleAddMultipleTasks(newTasks);
    // Rafraîchir les données après avoir ajouté plusieurs tâches
    await refetch();
    return result;
  };

  return {
    tasks,
    isLoading,
    handleTaskCompletion: handleTaskComplete,
    handleDeleteTask,
    handleAddTask: addTaskWithRefresh,
    handleAddMultipleTasks: addMultipleTasksWithRefresh,
    handleUpdateTaskPosition,
    refetchTasks: refetch
  };
};
