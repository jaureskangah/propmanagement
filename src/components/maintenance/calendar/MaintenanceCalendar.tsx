
import { Calendar } from "@/components/ui/calendar";
import { format, startOfDay, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";
import { Task } from "../types";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { useLocale } from "@/components/providers/LocaleProvider";

interface MaintenanceCalendarProps {
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  tasks: Task[];
  selectedType: string;
}

export const MaintenanceCalendar = ({
  selectedDate,
  onSelectDate,
  tasks,
  selectedType,
}: MaintenanceCalendarProps) => {
  const { t, language } = useLocale();

  const getTasksForDate = (date: Date) => {
    // Normaliser la date pour la comparaison (sans heure/minute/seconde)
    const normalizedDate = startOfDay(date);
    
    return tasks.filter((task) => {
      // Ensure task.date is a Date object
      const taskDate = task.date instanceof Date ? task.date : new Date(task.date);
      
      // Use isSameDay to compare dates properly
      return (
        isSameDay(taskDate, normalizedDate) &&
        (selectedType === "all" || task.type === selectedType)
      );
    });
  };
  
  console.log("Tasks in calendar:", tasks);
  if (selectedDate) {
    console.log("Tasks for selected date:", getTasksForDate(selectedDate));
  }

  const getTaskColor = (tasks: Task[]) => {
    const hasPriority = {
      urgent: tasks.some(task => task.priority === 'urgent'),
      high: tasks.some(task => task.priority === 'high'),
      medium: tasks.some(task => task.priority === 'medium'),
      low: tasks.some(task => task.priority === 'low')
    };

    if (hasPriority.urgent) return "#ea384c";
    if (hasPriority.high) return "#f97316";
    if (hasPriority.medium) return "#facc15";
    return "#22c55e";
  };

  const modifiersStyles = {
    hasTasks: (date: Date) => {
      const dateTasks = getTasksForDate(date);
      if (dateTasks.length === 0) return {};
      
      return {
        backgroundColor: getTaskColor(dateTasks),
        color: "white",
        fontWeight: "bold",
        transform: "scale(1.1)",
        borderRadius: "100%",
        transition: "all 0.2s ease-in-out",
      };
    }
  };

  // Obtenir la locale appropriée pour date-fns
  const dateFnsLocale = language === 'fr' ? fr : undefined;
  
  return (
    <TooltipProvider>
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={onSelectDate}
        className="rounded-md border w-full max-w-[400px] mx-auto pointer-events-auto"
        modifiers={{
          hasTasks: (date) => getTasksForDate(date).length > 0,
        }}
        modifiersStyles={modifiersStyles}
        locale={dateFnsLocale}
        // Personnaliser les textes du calendrier (jours de la semaine, mois, etc.)
        formatters={{
          formatCaption: (date, options) => {
            return format(date, 'MMMM yyyy', { locale: dateFnsLocale });
          }
        }}
      />
    </TooltipProvider>
  );
};
