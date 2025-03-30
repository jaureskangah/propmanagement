
import { useState } from "react";
import { Task } from "../types";
import { useLocale } from "@/components/providers/LocaleProvider";
import { format, addDays, addWeeks, addMonths } from "date-fns";
import { CalendarRange, Repeat } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface RecurringTasksViewProps {
  tasks: Task[];
}

export const RecurringTasksView = ({ tasks }: RecurringTasksViewProps) => {
  const { t } = useLocale();
  const [viewRange, setViewRange] = useState<'week' | 'month'>('week');
  
  // Add logging to debug what tasks are being passed
  console.log("RecurringTasksView received tasks:", tasks);
  console.log("Recurring tasks:", tasks.filter(task => task.is_recurring));
  
  // Calculate next occurrences based on recurrence patterns
  const getNextOccurrences = (task: Task, limit = 5): Date[] => {
    if (!task.is_recurring || !task.recurrence_pattern) {
      return [new Date(task.date)];
    }
    
    const occurrences: Date[] = [];
    const { frequency, interval } = task.recurrence_pattern;
    
    let currentDate = new Date(task.date);
    occurrences.push(new Date(currentDate)); // Include the first occurrence
    
    for (let i = 0; i < limit - 1; i++) { // -1 because we already added the first occurrence
      if (frequency === 'daily') {
        currentDate = addDays(currentDate, interval || 1);
      } else if (frequency === 'weekly') {
        currentDate = addWeeks(currentDate, interval || 1);
      } else if (frequency === 'monthly') {
        currentDate = addMonths(currentDate, interval || 1);
      }
      
      occurrences.push(new Date(currentDate));
    }
    
    return occurrences;
  };
  
  // Group and sort upcoming occurrences
  const upcomingOccurrences = tasks
    .filter(task => task.is_recurring && task.recurrence_pattern) // Ensure we only process recurring tasks
    .flatMap(task => {
      const occurrences = getNextOccurrences(task);
      return occurrences.map(date => ({
        ...task,
        nextDate: date
      }));
    }).sort((a, b) => a.nextDate.getTime() - b.nextDate.getTime());
  
  console.log("Upcoming occurrences:", upcomingOccurrences);
  
  // Filter based on view range
  const today = new Date();
  const filteredOccurrences = upcomingOccurrences.filter(task => {
    if (viewRange === 'week') {
      const weekLater = addDays(today, 7);
      return task.nextDate <= weekLater;
    } else {
      const monthLater = addMonths(today, 1);
      return task.nextDate <= monthLater;
    }
  });

  if (tasks.filter(task => task.is_recurring).length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        {t('noRecurringTasks')}
      </div>
    );
  }
  
  if (filteredOccurrences.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        {t('noRecurringTasksInRange')}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">{t('upcomingRecurring')}</h3>
        <div className="flex gap-1">
          <Badge 
            variant={viewRange === 'week' ? "default" : "outline"} 
            className="cursor-pointer"
            onClick={() => setViewRange('week')}
          >
            {t('week')}
          </Badge>
          <Badge 
            variant={viewRange === 'month' ? "default" : "outline"} 
            className="cursor-pointer"
            onClick={() => setViewRange('month')}
          >
            {t('month')}
          </Badge>
        </div>
      </div>
      
      <ScrollArea className="h-[300px] pr-4">
        <div className="space-y-2">
          {filteredOccurrences.map((task, index) => (
            <div 
              key={`${task.id}-${index}`} 
              className="p-3 border rounded-md hover:bg-muted transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="font-medium truncate flex-1">{task.title}</div>
                <Badge variant={
                  task.priority === 'urgent' ? 'destructive' :
                  task.priority === 'high' ? 'default' :
                  task.priority === 'medium' ? 'secondary' : 'outline'
                }>
                  {t(task.priority)}
                </Badge>
              </div>
              
              <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                <CalendarRange className="h-3.5 w-3.5" />
                <span>{format(task.nextDate, 'PPP')}</span>
              </div>
              
              <div className="flex items-center mt-1 text-xs text-muted-foreground">
                <Repeat className="h-3 w-3 mr-1" />
                {task.recurrence_pattern?.frequency === 'daily' && t('repeatsDaily')}
                {task.recurrence_pattern?.frequency === 'weekly' && t('repeatsWeekly')}
                {task.recurrence_pattern?.frequency === 'monthly' && t('repeatsMonthly')}
                {task.recurrence_pattern?.interval && task.recurrence_pattern.interval > 1 && 
                  ` (${t('every')} ${task.recurrence_pattern.interval} ${
                    task.recurrence_pattern.frequency === 'daily' ? t('days') : 
                    task.recurrence_pattern.frequency === 'weekly' ? t('weeks') : 
                    t('months')
                  })`
                }
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
