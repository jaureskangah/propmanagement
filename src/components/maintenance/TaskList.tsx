
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { format, isValid, startOfDay, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Task } from "./types";
import { isValidDate, toDate } from "./utils/dateUtils";

interface TaskListProps {
  tasks: Task[];
  onTaskComplete: (taskId: string) => void;
  onTaskDelete: (taskId: string) => void;
}

export const TaskList = ({ tasks, onTaskComplete, onTaskDelete }: TaskListProps) => {
  const { t, language } = useLocale();
  
  // Log all tasks details and dates for debugging
  const displayTasks = tasks.map(task => {
    let taskDate: Date;
    let dateStr = "Invalid date";
    
    try {
      if (isValidDate(task.date)) {
        taskDate = toDate(task.date) || new Date();
        dateStr = format(taskDate, "yyyy-MM-dd");
      } else if (typeof task.date === 'string') {
        const parsedDate = parseISO(task.date);
        if (isValid(parsedDate)) {
          taskDate = startOfDay(parsedDate);
          dateStr = format(taskDate, "yyyy-MM-dd");
        }
      }
    } catch (e) {
      console.error("Error formatting task date", e);
    }

    return {
      ...task,
      formattedDate: dateStr
    };
  });
  
  console.log("Tasks in TaskList:", displayTasks.length);
  if (displayTasks.length > 0) {
    console.log("Task details:", displayTasks.map(task => ({
      id: task.id,
      title: task.title,
      date: task.formattedDate,
      type: task.type,
      priority: task.priority
    })));
  }
  
  return (
    <ScrollArea className="h-[200px]">
      {tasks.length === 0 ? (
        <p className="text-center text-muted-foreground py-4">{t('noTasks')}</p>
      ) : (
        displayTasks.map((task) => {
          // Ensure task date is properly handled
          let taskDate: Date = new Date();
          
          if (isValidDate(task.date)) {
            taskDate = toDate(task.date) || new Date();
          } else if (typeof task.date === 'string') {
            try {
              taskDate = startOfDay(parseISO(task.date));
            } catch (e) {
              console.error('Error parsing date string:', task.date, e);
              taskDate = startOfDay(new Date()); // Fallback
            }
            
            // Double-check if the date is valid
            if (!isValid(taskDate)) {
              console.error('Invalid date for task:', task.id, task.date);
              taskDate = startOfDay(new Date()); // Fallback
            }
          } else {
            console.error('Invalid date format:', task.date);
            taskDate = startOfDay(new Date()); // Fallback
          }
          
          // Log each task's date information when rendering
          console.log(`Task ${task.id} (${task.title}) display date: ${format(taskDate, "yyyy-MM-dd")}`);
          
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
                <Badge variant="outline">{t(task.type)}</Badge>
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
