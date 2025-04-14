
import { useTasksQuery } from "./hooks/useTasksQuery";
import { useTaskCompletion } from "./hooks/useTaskCompletion";
import { useTaskDeletion } from "./hooks/useTaskDeletion";
import { useTaskAddition } from "./hooks/useTaskAddition";
import { useTaskPosition } from "./hooks/useTaskPosition";
import { Task, NewTask } from "../types";
import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";

export const useMaintenanceTasks = (propertyId?: string) => {
  const queryResult = useTasksQuery(propertyId);
  const { tasks, isLoading, refreshTasks, error } = queryResult;
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
    
    // Force an immediate data refresh
    queryClient.invalidateQueries({ queryKey: ['maintenance_tasks', propertyId] });
  };

  // Enhanced function to add a task and refresh data
  const addTaskWithRefresh = useCallback(async (newTask: NewTask) => {
    try {
      console.log("Adding task and will refresh afterwards:", newTask);
      
      // Ensure property is defined in the task if provided
      const taskWithProperty = propertyId && !newTask.property_id 
        ? { ...newTask, property_id: propertyId } 
        : newTask;
      
      // Add the task
      const result = await handleAddTask(taskWithProperty);
      
      console.log("Task added, refreshing data now...");
      
      // Force an immediate data refresh
      refreshTasks();
      
      return result;
    } catch (error) {
      console.error("Error adding task:", error);
      throw error;
    }
  }, [handleAddTask, refreshTasks, propertyId]);

  // Enhanced function to add multiple tasks and refresh data
  const addMultipleTasksWithRefresh = useCallback(async (newTasks: NewTask[]) => {
    try {
      console.log("Adding multiple tasks and will refresh afterwards:", newTasks.length);
      
      // Ensure property is defined for all tasks if provided
      const tasksWithProperty = propertyId 
        ? newTasks.map(task => ({
            ...task,
            property_id: task.property_id || propertyId
          }))
        : newTasks;
      
      // Add the tasks
      const result = await handleAddMultipleTasks(tasksWithProperty);
      
      console.log("Multiple tasks added, refreshing data now...");
      
      // Force an immediate data refresh
      refreshTasks();
      
      return result;
    } catch (error) {
      console.error("Error adding tasks:", error);
      throw error;
    }
  }, [handleAddMultipleTasks, refreshTasks, propertyId]);

  // Enhanced function to delete a task and refresh data
  const deleteTaskWithRefresh = useCallback(async (taskId: string) => {
    try {
      console.log("Deleting task and will refresh afterwards:", taskId);
      
      // Delete the task
      const result = await handleDeleteTask(taskId);
      
      console.log("Task deleted, refreshing data now...");
      
      // Force an immediate data refresh
      refreshTasks();
      
      return result;
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  }, [handleDeleteTask, refreshTasks]);

  return {
    tasks,
    isLoading,
    error,
    handleTaskCompletion: handleTaskComplete,
    handleDeleteTask: deleteTaskWithRefresh,
    handleAddTask: addTaskWithRefresh,
    handleAddMultipleTasks: addMultipleTasksWithRefresh,
    handleUpdateTaskPosition,
  };
};
