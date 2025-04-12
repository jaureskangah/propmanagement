
import { Task } from "../types";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, CalendarClock, PhoneCall, Mail, Smartphone, BellRing } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { isScheduledCall, getReminderMethodIcon, getReminderMethodLabel } from "./utils/reminderUtils";

interface ReminderItemProps {
  task: Task;
}

export const ReminderItem = ({ task }: ReminderItemProps) => {
  const { t, language } = useLocale();
  const dateLocale = language === 'fr' ? fr : undefined;
  
  // Ensure reminder_date is a Date object
  const reminderDate = task.reminder_date instanceof Date ? 
    task.reminder_date : new Date(task.reminder_date as string);
  
  // Ensure task date is a Date object
  const taskDate = task.date instanceof Date ? 
    task.date : new Date(task.date as unknown as string);
  
  // Detect if this is a scheduled call
  const isCall = isScheduledCall(task);
  
  // Get appropriate icon for reminder method
  const reminderMethod = getReminderMethodIcon(task.reminder_method);
  
  // Render the reminder method icon
  const renderReminderMethodIcon = () => {
    switch (reminderMethod) {
      case "Mail":
        return <Mail className="h-3 w-3 text-blue-500" />;
      case "Smartphone":
        return <Smartphone className="h-3 w-3 text-green-500" />;
      case "Both":
        return (
          <div className="flex gap-1">
            <Smartphone className="h-3 w-3 text-green-500" />
            <Mail className="h-3 w-3 text-blue-500" />
          </div>
        );
      default:
        return <BellRing className="h-3 w-3" />;
    }
  };
  
  return (
    <div 
      className={`p-3 border rounded-md hover:bg-accent/20 transition-colors ${isCall ? 'bg-purple-50 border-purple-200' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-medium flex items-center gap-1">
            {isCall && <PhoneCall className="h-3.5 w-3.5 text-purple-500" />}
            {task.title}
          </h4>
          <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <CalendarClock className="h-3 w-3 mr-1" />
            {format(reminderDate, 'dd MMM yyyy', { locale: dateLocale })}
            <span className="mx-1">•</span>
            {renderReminderMethodIcon()}
            <span className="text-xs">{getReminderMethodLabel(t, task.reminder_method)}</span>
          </div>
        </div>
        <Badge 
          variant={
            task.priority === 'urgent' ? 'destructive' : 
            task.priority === 'high' ? 'default' :
            task.priority === 'medium' ? 'secondary' : 'outline'
          }
          className="text-xs"
        >
          {t(task.priority as 'low' | 'medium' | 'high' | 'urgent')}
        </Badge>
      </div>
      
      <div className="flex gap-2 mt-2">
        <Badge variant="outline" className="text-xs">
          {t(task.type)}
        </Badge>
        <Badge variant="outline" className="text-xs flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {format(taskDate, 'dd MMM yyyy', { locale: dateLocale })}
        </Badge>
      </div>
    </div>
  );
};
