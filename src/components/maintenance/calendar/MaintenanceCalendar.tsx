
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

  // Fonction pour normaliser une date (supprimer l'heure/minute/seconde)
  const normalizeDate = (date: Date): Date => {
    return startOfDay(date);
  };

  const getTasksForDate = (date: Date) => {
    // Normaliser la date pour la comparaison
    const normalizedDate = normalizeDate(date);
    
    // Filtrer les tâches qui correspondent à la date
    const filteredTasks = tasks.filter((task) => {
      // Convertir la date de la tâche en objet Date si nécessaire
      let taskDate: Date;
      
      if (task.date instanceof Date) {
        taskDate = task.date;
      } else if (typeof task.date === 'string') {
        // Convertir la chaîne en Date
        taskDate = new Date(task.date);
        if (!isValid(taskDate)) {
          console.error("Date invalide pour la tâche:", task.id, task.date);
          return false;
        }
      } else {
        console.error("Format de date inattendu pour la tâche:", task.id, task.date);
        return false;
      }
      
      // Normaliser la date de la tâche pour la comparaison
      const normalizedTaskDate = normalizeDate(taskDate);
      
      // Vérifier si la date correspond (même jour)
      const dateMatch = isSameDay(normalizedTaskDate, normalizedDate);
      
      // Vérifier si le type correspond (si un type est sélectionné)
      const typeMatches = selectedType === "all" || task.type === selectedType;
      
      // Retourner vrai si les dates sont les mêmes et le type correspond
      return dateMatch && typeMatches;
    });
    
    return filteredTasks;
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
