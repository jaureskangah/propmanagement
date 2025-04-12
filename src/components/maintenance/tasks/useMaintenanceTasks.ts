
import { useTasksQuery } from "./hooks/useTasksQuery";
import { useTaskCompletion } from "./hooks/useTaskCompletion";
import { useTaskDeletion } from "./hooks/useTaskDeletion";
import { useTaskAddition } from "./hooks/useTaskAddition";
import { useTaskPosition } from "./hooks/useTaskPosition";
import { Task, NewTask } from "../types";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const useMaintenanceTasks = () => {
  const { tasks, isLoading, refetch } = useTasksQuery();
  const { handleTaskCompletion } = useTaskCompletion();
  const { handleDeleteTask } = useTaskDeletion();
  const { handleAddTask, handleAddMultipleTasks } = useTaskAddition();
  const { handleUpdateTaskPosition } = useTaskPosition();
  const [lastAddedTask, setLastAddedTask] = useState<NewTask | null>(null);
  const { toast } = useToast();

  // Rafraîchir automatiquement les données chaque fois que le composant est monté
  useEffect(() => {
    console.log("Initializing tasks refresh mechanism");
    refetch();
    // Créer un intervalle pour rafraîchir régulièrement
    const interval = setInterval(() => {
      console.log("Auto-refreshing tasks");
      refetch();
    }, 5000); // Rafraîchir toutes les 5 secondes pour plus de réactivité
    
    return () => clearInterval(interval);
  }, [refetch]);

  // Function to complete a task
  const handleTaskComplete = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    await handleTaskCompletion(taskId, task.completed);
    // Rafraîchir les données après avoir complété une tâche
    await refetch();
    toast({
      title: "Tâche mise à jour",
      description: "Le statut de la tâche a été mis à jour avec succès",
    });
  };

  // Modification de handleAddTask pour refetch automatiquement après ajout
  const addTaskWithRefresh = async (newTask: NewTask) => {
    console.log("Adding new task with immediate refresh:", newTask);
    setLastAddedTask(newTask);
    const result = await handleAddTask(newTask);
    
    // Rafraîchir les données plusieurs fois après avoir ajouté une tâche
    // pour s'assurer que la tâche est bien récupérée
    await refetch();
    
    // Programmer plusieurs rafraîchissements supplémentaires pour être sûr
    setTimeout(() => refetch(), 500);
    setTimeout(() => refetch(), 1500);
    
    toast({
      title: "Tâche ajoutée",
      description: "La tâche a été ajoutée avec succès",
    });
    
    return result;
  };

  // Modification de handleAddMultipleTasks pour refetch automatiquement après ajout
  const addMultipleTasksWithRefresh = async (newTasks: NewTask[]) => {
    console.log("Adding multiple tasks with immediate refresh:", newTasks);
    if (newTasks.length > 0) {
      setLastAddedTask(newTasks[0]);
    }
    
    const result = await handleAddMultipleTasks(newTasks);
    
    // Rafraîchir les données plusieurs fois après avoir ajouté plusieurs tâches
    await refetch();
    setTimeout(() => refetch(), 500);
    setTimeout(() => refetch(), 1500);
    
    toast({
      title: "Tâches ajoutées",
      description: `${newTasks.length} tâches ont été ajoutées avec succès`,
    });
    
    return result;
  };

  return {
    tasks,
    isLoading,
    lastAddedTask,
    handleTaskCompletion: handleTaskComplete,
    handleDeleteTask,
    handleAddTask: addTaskWithRefresh,
    handleAddMultipleTasks: addMultipleTasksWithRefresh,
    handleUpdateTaskPosition,
    refetchTasks: refetch
  };
};
