
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useLocale } from "@/components/providers/LocaleProvider";
import { formatDate } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  date: Date;
  completed: boolean;
  type: "regular" | "inspection" | "seasonal";
  user_id: string;
}

interface TaskListProps {
  tasks: Task[];
  onTaskComplete: (taskId: string) => void;
  onTaskDelete: (taskId: string) => void;
}

export const TaskList = ({ tasks, onTaskComplete, onTaskDelete }: TaskListProps) => {
  const { t, language } = useLocale();
  
  return (
    <ScrollArea className="h-[200px]">
      {tasks.length === 0 ? (
        <p className="text-center text-muted-foreground py-4">{t('noTasks')}</p>
      ) : (
        tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg group"
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
                {format(task.date, "dd/MM/yyyy", { locale: language === 'fr' ? fr : undefined })}
              </Badge>
              <Badge variant="outline">{t(task.type as 'regularTask' | 'inspection' | 'seasonalTask')}</Badge>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onTaskDelete(task.id)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </div>
        ))
      )}
    </ScrollArea>
  );
};
