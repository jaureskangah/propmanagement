import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { AddTaskDialog } from "./AddTaskDialog";
import { TaskList } from "./TaskList";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider"; // Correction ici

interface MaintenanceTask {
  id: string;
  title: string;
  date: Date;
  completed: boolean;
  type: "regular" | "inspection" | "seasonal";
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const PreventiveMaintenance = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedType, setSelectedType] = useState<string>("all");
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth(); // Correction ici pour extraire user directement

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['maintenance_tasks'],
    queryFn: async () => {
      console.log("Fetching maintenance tasks...");
      const { data, error } = await supabase
        .from('maintenance_tasks')
        .select('*')
        .order('date', { ascending: true });
      
      if (error) {
        console.error("Error fetching tasks:", error);
        throw error;
      }
      
      return data.map(task => ({
        ...task,
        date: new Date(task.date),
        type: task.type as "regular" | "inspection" | "seasonal"
      }));
    },
  });

  const handleTaskCompletion = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    try {
      const { error } = await supabase
        .from('maintenance_tasks')
        .update({ completed: !task.completed })
        .eq('id', taskId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['maintenance_tasks'] });
      toast({
        title: "Success",
        description: `Task marked as ${!task.completed ? 'completed' : 'incomplete'}`,
      });
    } catch (error) {
      console.error("Error updating task:", error);
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('maintenance_tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['maintenance_tasks'] });
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting task:", error);
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    }
  };

  const handleAddTask = async (newTask: {
    title: string;
    date: Date;
    type: "regular" | "inspection" | "seasonal";
  }) => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to add tasks",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('maintenance_tasks')
        .insert({
          title: newTask.title,
          date: format(newTask.date, 'yyyy-MM-dd'),
          type: newTask.type,
          completed: false,
          user_id: user.id
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
        description: "Failed to add task",
        variant: "destructive",
      });
    }
  };

  const filteredTasks = tasks.filter((task) =>
    selectedType === "all" ? true : task.type === selectedType
  );

  const getTasksForDate = (date: Date) => {
    return tasks.filter(
      (task) =>
        format(task.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd") &&
        (selectedType === "all" || task.type === selectedType)
    ).length;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
      <Card className="lg:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-2">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Maintenance Calendar
          </CardTitle>
          <Select
            value={selectedType}
            onValueChange={(value) => setSelectedType(value)}
          >
            <SelectTrigger className="w-[140px] sm:w-[180px]">
              <SelectValue placeholder="Task type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All tasks</SelectItem>
              <SelectItem value="regular">Regular tasks</SelectItem>
              <SelectItem value="inspection">Inspections</SelectItem>
              <SelectItem value="seasonal">Seasonal tasks</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border w-full max-w-[400px] mx-auto"
            modifiers={{
              hasTasks: (date) => getTasksForDate(date) > 0,
            }}
            modifiersStyles={{
              hasTasks: {
                backgroundColor: "#ea384c",
                color: "white",
                fontWeight: "bold",
                transform: "scale(1.1)",
                borderRadius: "100%",
                transition: "all 0.2s ease-in-out",
              },
            }}
          />
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Scheduled Tasks</h3>
              <AddTaskDialog onAddTask={handleAddTask} />
            </div>
            <TaskList 
              tasks={filteredTasks} 
              onTaskComplete={handleTaskCompletion} 
              onTaskDelete={handleDeleteTask}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};