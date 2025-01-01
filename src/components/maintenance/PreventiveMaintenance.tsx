import { useState } from "react";
import { Calendar as CalendarIcon, CheckSquare, Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const [tasks] = useState<MaintenanceTask[]>([
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Calendrier d'entretien
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
          />
          <div className="mt-4">
            <h3 className="font-medium mb-2">Tâches prévues</h3>
            <ScrollArea className="h-[200px]">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <Checkbox id={task.id} />
                    <label htmlFor={task.id} className="text-sm">
                      {task.title}
                    </label>
                  </div>
                  <Badge variant={task.completed ? "default" : "secondary"}>
                    {new Date(task.date).toLocaleDateString()}
                  </Badge>
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
                      {new Date(task.date).toLocaleDateString()}
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