
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { format, parseISO, isValid } from "date-fns";
import { fr } from "date-fns/locale";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Task } from "./types"; // Import Task from the types file

interface TaskListProps {
  tasks: Task[];
  onTaskComplete: (taskId: string) => void;
  onTaskDelete: (taskId: string) => void;
}

export const TaskList = ({ tasks, onTaskComplete, onTaskDelete }: TaskListProps) => {
  const { t, language } = useLocale();
  
  console.log("Tasks in TaskList:", tasks);
  
  return (
    <ScrollArea className="h-[200px]">
      {tasks.length === 0 ? (
        <p className="text-center text-muted-foreground py-4">{t('noTasks')}</p>
      ) : (
        tasks.map((task) => {
          // Ensure the task date is properly processed
          let taskDate: Date;
          if (task.date instanceof Date) {
            taskDate = task.date;
          } else if (typeof task.date === 'string') {
            taskDate = new Date(task.date);
          } else {
            console.error('Invalid task date format:', task.date);
            taskDate = new Date(); // Fallback to current date
          }
          
          return (
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
                  {format(taskDate, "dd/MM/yyyy", { locale: language === 'fr' ? fr : undefined })}
                </Badge>
                <Badge variant="outline">{t(task.type as 'regularTask' | 'inspection' | 'seasonalTask')}</Badge>
                {task.priority && (
                  <Badge 
                    variant={
                      task.priority === 'urgent' ? 'destructive' : 
                      task.priority === 'high' ? 'default' :
                      task.priority === 'medium' ? 'secondary' : 'outline'
                    }
                  >
                    {t(task.priority)}
                  </Badge>
                )}
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
          );
        })
      )}
    </ScrollArea>
  );
};
