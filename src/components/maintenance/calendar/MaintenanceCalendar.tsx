
import { Calendar } from "@/components/ui/calendar";
import { format, startOfDay, isSameDay, isValid, parseISO } from "date-fns";
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

  // Fonction pour normaliser une date (supprimer heure/minute/seconde)
  const normalizeDate = (date: Date | string): Date => {
    if (typeof date === 'string') {
      try {
        const parsedDate = parseISO(date);
        if (!isValid(parsedDate)) {
          console.error("Invalid date string:", date);
          return startOfDay(new Date());
        }
        return startOfDay(parsedDate);
      } catch (e) {
        console.error("Error parsing date string:", date, e);
        return startOfDay(new Date());
      }
    }
    return startOfDay(date);
  };

  const getTasksForDate = (date: Date) => {
    // Normaliser la date pour la comparaison
    const normalizedDate = normalizeDate(date);
    
    // Debug logs for date comparison
    const formattedDate = format(normalizedDate, "yyyy-MM-dd");
    console.log(`Checking tasks for date: ${formattedDate}`);
    
    // Filtrer les tâches qui correspondent à la date
    const filteredTasks = tasks.filter((task) => {
      // Convertir la date de la tâche en objet Date si nécessaire
      let taskDate: Date;
      
      if (task.date instanceof Date) {
        taskDate = task.date;
      } else if (typeof task.date === 'string') {
        // Convertir la chaîne en Date
        try {
          taskDate = parseISO(task.date);
        } catch (e) {
          console.error("Error parsing date for task:", task.id, task.date, e);
          return false;
        }
        
        if (!isValid(taskDate)) {
          console.error("Invalid date for task:", task.id, task.date);
          return false;
        }
      } else {
        console.error("Unexpected date format for task:", task.id, task.date);
        return false;
      }
      
      // Normaliser la date de la tâche pour la comparaison
      const normalizedTaskDate = normalizeDate(taskDate);
      
      // Debug logs for task date comparison
      const formattedTaskDate = format(normalizedTaskDate, "yyyy-MM-dd");
      
      // Vérifier si la date correspond (même jour)
      const dateMatch = isSameDay(normalizedTaskDate, normalizedDate);
      
      // Vérifier si le type correspond (si un type est sélectionné)
      const typeMatches = selectedType === "all" || task.type === selectedType;
      
      // Log detailed comparison for task dates
      console.log(`Task ${task.id} "${task.title}" date comparison:
        - Calendar date: ${formattedDate}
        - Task date: ${formattedTaskDate}
        - Same day: ${dateMatch}
        - Type match: ${typeMatches}
        - Raw task date: ${String(task.date)}
      `);
      
      // Return true if dates are the same and type matches
      return dateMatch && typeMatches;
    });
    
    if (filteredTasks.length > 0) {
      console.log(`Found ${filteredTasks.length} tasks for date ${formattedDate}:`, 
        filteredTasks.map(t => ({
          id: t.id,
          title: t.title,
          date: format(normalizeDate(t.date), "yyyy-MM-dd"),
          type: t.type
        }))
      );
    }
    
    return filteredTasks;
  };

  const handleSelectDate = (date: Date | undefined) => {
    if (date) {
      const normalizedDate = normalizeDate(date);
      console.log(`Calendar: Selected date ${format(normalizedDate, "yyyy-MM-dd")}`);
      onSelectDate(normalizedDate);
    } else {
      onSelectDate(undefined);
    }
  };

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

  // Get appropriate locale for date-fns
  const dateFnsLocale = language === 'fr' ? fr : undefined;
  
  return (
    <TooltipProvider>
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={handleSelectDate}
        className="rounded-md border w-full max-w-[400px] mx-auto pointer-events-auto"
        modifiers={{
          hasTasks: (date) => getTasksForDate(date).length > 0,
        }}
        modifiersStyles={modifiersStyles}
        locale={dateFnsLocale}
        // Customize calendar texts (weekdays, months, etc.)
        formatters={{
          formatCaption: (date, options) => {
            return format(date, 'MMMM yyyy', { locale: dateFnsLocale });
          }
        }}
      />
    </TooltipProvider>
  );
};
