import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Task {
  id: string;
  title: string;
  date: Date;
  completed: boolean;
  type: "regular" | "inspection" | "seasonal";
}

interface TaskListProps {
  tasks: Task[];
  onTaskComplete: (taskId: string) => void;
}

export const TaskList = ({ tasks, onTaskComplete }: TaskListProps) => {
  return (
    <ScrollArea className="h-[200px]">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
        >
          <div className="flex items-center gap-2">
            <Checkbox
              id={task.id}
              checked={task.completed}
              onCheckedChange={() => onTaskComplete(task.id)}
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
              {format(task.date, "dd/MM/yyyy", { locale: fr })}
            </Badge>
            <Badge variant="outline">{task.type}</Badge>
          </div>
        </div>
      ))}
    </ScrollArea>
  );
};