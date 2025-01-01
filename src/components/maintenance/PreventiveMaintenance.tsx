import { useState } from "react";
import { Calendar as CalendarIcon, CheckSquare, Bell, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface MaintenanceTask {
  id: string;
  title: string;
  date: Date;
  completed: boolean;
  type: "inspection" | "seasonal" | "regular";
}

const SEASONAL_TASKS = [
  { id: "1", task: "Vérification du système de chauffage", season: "Automne" },
  { id: "2", task: "Nettoyage des gouttières", season: "Automne" },
  { id: "3", task: "Inspection du système de climatisation", season: "Printemps" },
  { id: "4", task: "Vérification de l'isolation", season: "Hiver" },
];

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
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
            </div>
            <ScrollArea className="h-[200px]">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={task.id}
                      checked={task.completed}
                      onCheckedChange={() => handleTaskCompletion(task.id)}
                    />
                    <label
                      htmlFor={task.id}
                      className={`text-sm ${
                        task.completed ? "line-through text-gray-500" : ""
                      }`}
                    >
                      {task.title}
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={task.completed ? "default" : "secondary"}
                      className={task.completed ? "bg-green-500" : ""}
                    >
                      {format(task.date, "dd/MM/yyyy")}
                    </Badge>
                    <Badge variant="outline">{task.type}</Badge>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Rappels
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {tasks
                .filter((task) => !task.completed)
                .map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                  >
                    <span className="text-sm">{task.title}</span>
                    <Badge variant="outline">
                      {format(task.date, "dd/MM/yyyy")}
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5" />
              Checklist saisonnière
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              <div className="space-y-2">
                {SEASONAL_TASKS.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <Checkbox id={`seasonal-${task.id}`} />
                      <label
                        htmlFor={`seasonal-${task.id}`}
                        className="text-sm"
                      >
                        {task.task}
                      </label>
                    </div>
                    <Badge>{task.season}</Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};