
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Trash2, Bell, Repeat } from "lucide-react";
import { format, isValid, parseISO } from "date-fns";
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
        
        // Log directly from the Date object's components to diagnose any issues
        const year = taskDate.getFullYear();
        const month = taskDate.getMonth() + 1;
        const day = taskDate.getDate();
        
        dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        console.log(`Task ${task.id} date components: ${year}-${month}-${day}, formatted: ${dateStr}`);
      } else if (typeof task.date === 'string') {
        // If it's a string, try to parse it
        try {
          const parsedDate = parseISO(task.date);
          if (isValid(parsedDate)) {
            taskDate = parsedDate;
            dateStr = task.date;
          }
        } catch (e) {
          console.error("Error parsing date string:", task.date, e);
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
      priority: task.priority,
      has_reminder: task.has_reminder,
      is_recurring: task.is_recurring
    })));
  }
  
  return (
    <ScrollArea className="h-[200px]">
      {tasks.length === 0 ? (
        <p className="text-center text-muted-foreground py-4">{t('noTasks')}</p>
      ) : (
        displayTasks.map((task) => {
          // Ensure task date is properly handled
          let taskDate: Date;
          let displayDate: string;
          
          if (isValidDate(task.date)) {
            taskDate = toDate(task.date) || new Date();
            
            // CRITICAL FIX: Use a more direct approach to format the date to prevent timezone issues
            const day = String(taskDate.getDate()).padStart(2, '0');
            const month = String(taskDate.getMonth() + 1).padStart(2, '0');
            const year = taskDate.getFullYear();
            
            // Format directly using components for display
            displayDate = language === 'fr' ? 
              `${day}/${month}/${year}` : 
              `${month}/${day}/${year}`;
              
            console.log(`Task ${task.id} (${task.title}) display date: ${displayDate}`);
          } else if (typeof task.date === 'string') {
            try {
              // Try to parse the string date
              const parts = task.date.split('-');
              if (parts.length === 3) {
                const year = parseInt(parts[0]);
                const month = parseInt(parts[1]);
                const day = parseInt(parts[2]);
                
                // Format for display based on language
                displayDate = language === 'fr' ? 
                  `${day}/${month}/${year}` : 
                  `${month}/${day}/${year}`;
              } else {
                displayDate = "Invalid date";
              }
            } catch (e) {
              console.error('Error parsing date string:', task.date, e);
              displayDate = "Invalid date";
            }
          } else {
            console.error('Invalid date format:', task.date);
            displayDate = "Invalid date";
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
                {/* Show recurring and reminder indicators */}
                <div className="flex items-center gap-1">
                  {task.is_recurring && (
                    <div title={t('recurringTask')}>
                      <Repeat className="h-3 w-3 text-blue-500" />
                    </div>
                  )}
                  {task.has_reminder && (
                    <div title={t('hasReminder')}>
                      <Bell className="h-3 w-3 text-orange-500" />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={task.completed ? "default" : "secondary"}
                  className={task.completed ? "bg-green-500" : ""}
                >
                  {displayDate}
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
