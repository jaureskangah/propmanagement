
import { Calendar } from "@/components/ui/calendar";
import { format, startOfDay, isSameDay, isValid } from "date-fns";
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
    // Afficher les détails de la date pour le débogage
    console.log(`Checking tasks for date: ${date.toISOString()}`);
    
    // Normaliser la date pour la comparaison (sans heure/minute/seconde)
    const normalizedDate = startOfDay(date);
    console.log(`Normalized date for comparison: ${normalizedDate.toISOString()}`);
    
    // Filtrer les tâches qui correspondent à la date
    const filteredTasks = tasks.filter((task) => {
      // Ensure task.date is a Date object
      let taskDate: Date;
      
      if (task.date instanceof Date) {
        taskDate = task.date;
      } else if (typeof task.date === 'string') {
        // Si la date est une chaîne, essayer de la convertir en Date
        taskDate = new Date(task.date);
        // Vérifier si la date est valide
        if (!isValid(taskDate)) {
          console.error("Invalid date format for task:", task.id, task.date);
          return false;
        }
      } else {
        console.error("Unexpected date format for task:", task.id, task.date);
        return false;
      }
      
      // Normaliser la date de la tâche pour la comparaison
      const normalizedTaskDate = startOfDay(taskDate);
      
      console.log(`Task ${task.id} (${task.title}) - Date: ${taskDate.toISOString()}, Normalized: ${normalizedTaskDate.toISOString()}`);
      console.log(`Comparing with calendar date: ${normalizedDate.toISOString()}`);
      
      const dateMatch = isSameDay(normalizedTaskDate, normalizedDate);
      console.log(`Date match for task ${task.id}: ${dateMatch}`);
      
      // Vérifier si le type correspond (si un type est sélectionné)
      const typeMatches = selectedType === "all" || task.type === selectedType;
      
      // Retourner vrai si les dates sont les mêmes et le type correspond
      return dateMatch && typeMatches;
    });
    
    console.log(`Found ${filteredTasks.length} tasks for date ${date.toDateString()}:`, 
      filteredTasks.map(t => ({ id: t.id, title: t.title }))
    );
    
    return filteredTasks;
  };
  
  console.log("All tasks in calendar:", tasks.length);
  console.log("Tasks date formats:", tasks.map(task => ({
    id: task.id,
    title: task.title,
    date: task.date,
    dateType: typeof task.date,
    dateIsDate: task.date instanceof Date
  })));

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
