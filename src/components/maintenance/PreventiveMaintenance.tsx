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
import { fr } from "date-fns/locale";
import { format } from "date-fns";
import { AddTaskDialog } from "./AddTaskDialog";
import { TaskList } from "./TaskList";

interface MaintenanceTask {
  id: string;
  title: string;
  date: Date;
  completed: boolean;
  type: "regular" | "inspection" | "seasonal";
}

export const PreventiveMaintenance = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedType, setSelectedType] = useState<string>("all");
  const [tasks, setTasks] = useState<MaintenanceTask[]>([
    {
      id: "1",
      title: "Inspection mensuelle des détecteurs de fumée",
      date: new Date(),
      completed: false,
      type: "regular",
    },
    {
      id: "2",
      title: "Vérification trimestrielle de la plomberie",
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      completed: false,
      type: "inspection",
    },
  ]);

  const handleTaskCompletion = (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleAddTask = (newTask: {
    title: string;
    date: Date;
    type: "regular" | "inspection" | "seasonal";
  }) => {
    const task: MaintenanceTask = {
      id: (tasks.length + 1).toString(),
      ...newTask,
      completed: false,
    };
    setTasks((prevTasks) => [...prevTasks, task]);
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Calendrier d'entretien
          </CardTitle>
          <Select
            value={selectedType}
            onValueChange={(value) => setSelectedType(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Type de tâche" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les tâches</SelectItem>
              <SelectItem value="regular">Tâches régulières</SelectItem>
              <SelectItem value="inspection">Inspections</SelectItem>
              <SelectItem value="seasonal">Tâches saisonnières</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
            locale={fr}
            modifiers={{
              hasTasks: (date) => getTasksForDate(date) > 0,
            }}
            modifiersStyles={{
              hasTasks: {
                backgroundColor: "rgb(234, 56, 76, 0.1)",
                fontWeight: "bold",
              },
            }}
          />
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Tâches prévues</h3>
              <AddTaskDialog onAddTask={handleAddTask} />
            </div>
            <TaskList tasks={filteredTasks} onTaskComplete={handleTaskCompletion} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};