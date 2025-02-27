
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Task } from "../types";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { useLocale } from "@/components/providers/LocaleProvider";
import { DayProps } from "react-day-picker";

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
  const { t } = useLocale();

  const getTasksForDate = (date: Date) => {
    return tasks.filter(
      (task) =>
        format(task.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd") &&
        (selectedType === "all" || task.type === selectedType)
    );
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

  return (
    <TooltipProvider>
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={onSelectDate}
        className="rounded-md border w-full max-w-[400px] mx-auto"
        modifiers={{
          hasTasks: (date) => getTasksForDate(date).length > 0,
        }}
        modifiersStyles={modifiersStyles}
        components={{
          Day: ({ date, ...props }: DayProps & { date: Date }) => {
            const tasksForDate = getTasksForDate(date);
            if (tasksForDate.length === 0) return <button {...props} />;

            return (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button {...props} />
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-sm">
                    <p className="font-bold mb-1">{t('scheduledTasks')}: {tasksForDate.length}</p>
                    {tasksForDate.map((task, index) => (
                      <div key={index} className="text-xs">
                        • {task.title}
                      </div>
                    ))}
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          }
        }}
      />
    </TooltipProvider>
  );
};
