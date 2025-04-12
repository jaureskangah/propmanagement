
import { Calendar } from "@/components/ui/calendar";
import { format, startOfDay, isSameDay, isValid, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
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

  // Vérifier quels mois ont des tâches pour aider visuellement l'utilisateur
  const getMonthsWithTasks = () => {
    const months = new Set<string>();
    
    tasks.forEach(task => {
      if (task.date instanceof Date && isValid(task.date)) {
        months.add(format(task.date, 'yyyy-MM'));
      } else if (typeof task.date === 'string') {
        const date = new Date(task.date);
        if (isValid(date)) {
          months.add(format(date, 'yyyy-MM'));
        }
      }
    });
    
    return Array.from(months);
  };
  
  console.log("Months with tasks:", getMonthsWithTasks());

  const getTasksForDate = (date: Date) => {
    // Normaliser la date pour la comparaison (sans heure/minute/seconde)
    const normalizedDate = startOfDay(date);
    
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
      
      const dateMatch = isSameDay(normalizedTaskDate, normalizedDate);
      
      // Vérifier si le type correspond (si un type est sélectionné)
      const typeMatches = selectedType === "all" || task.type === selectedType;
      
      // Retourner vrai si les dates sont les mêmes et le type correspond
      return dateMatch && typeMatches;
    });
    
    return filteredTasks;
  };
  
  console.log("All tasks in calendar:", tasks.length);
  
  // Afficher quelles tâches sont disponibles pour aider au débogage
  if (tasks.length > 0) {
    console.log("Available tasks:", tasks.map(task => ({
      id: task.id,
      title: task.title,
      date: task.date instanceof Date 
        ? task.date.toISOString() 
        : typeof task.date === 'string' 
          ? new Date(task.date).toISOString() 
          : 'invalid date',
      type: task.type
    })));
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
  
  // Mettre en évidence les mois qui ont des tâches
  const monthsWithTasks = getMonthsWithTasks();
  
  return (
    <TooltipProvider>
      <div className="space-y-2">
        {monthsWithTasks.length > 0 && (
          <div className="text-xs text-muted-foreground mb-2">
            {t('monthsWithTasks')}: 
            <div className="flex flex-wrap gap-1 mt-1">
              {monthsWithTasks.map(monthKey => {
                const [year, month] = monthKey.split('-');
                const date = new Date(parseInt(year), parseInt(month) - 1, 1);
                return (
                  <button 
                    key={monthKey}
                    className="px-2 py-1 bg-primary/10 rounded-md hover:bg-primary/20 text-xs"
                    onClick={() => onSelectDate(date)}
                  >
                    {format(date, 'MMMM yyyy', { locale: dateFnsLocale })}
                  </button>
                );
              })}
            </div>
          </div>
        )}
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
      </div>
    </TooltipProvider>
  );
};
