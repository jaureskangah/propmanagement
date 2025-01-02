import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Task } from "../types";

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
  const getTasksForDate = (date: Date) => {
    return tasks.filter(
      (task) =>
        format(task.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd") &&
        (selectedType === "all" || task.type === selectedType)
    ).length;
  };

  return (
    <Calendar
      mode="single"
      selected={selectedDate}
      onSelect={onSelectDate}
      className="rounded-md border w-full max-w-[400px] mx-auto"
      modifiers={{
        hasTasks: (date) => getTasksForDate(date) > 0,
      }}
      modifiersStyles={{
        hasTasks: {
          backgroundColor: "#ea384c",
          color: "white",
          fontWeight: "bold",
          transform: "scale(1.1)",
          borderRadius: "100%",
          transition: "all 0.2s ease-in-out",
        },
      }}
    />
  );
};