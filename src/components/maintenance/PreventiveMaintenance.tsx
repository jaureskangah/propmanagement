
import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MaintenanceCalendar } from "./calendar/MaintenanceCalendar";
import { TypeFilter } from "./calendar/TypeFilter";
import { AddTaskDialog } from "./AddTaskDialog";
import { TaskList } from "./TaskList";
import { useMaintenanceTasks } from "./tasks/useMaintenanceTasks";
import { useLocale } from "@/components/providers/LocaleProvider";

export const PreventiveMaintenance = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedType, setSelectedType] = useState<string>("all");
  const { t } = useLocale();
  
  const {
    tasks,
    isLoading,
    handleTaskCompletion,
    handleDeleteTask,
    handleAddTask,
  } = useMaintenanceTasks();

  const filteredTasks = tasks.filter((task) =>
    selectedType === "all" ? true : task.type === selectedType
  );

  if (isLoading) {
    return <div>{t('loading')}</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
      <Card className="lg:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-2">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            {t('maintenanceCalendar')}
          </CardTitle>
          <TypeFilter
            selectedType={selectedType}
            onTypeChange={setSelectedType}
          />
        </CardHeader>
        <CardContent>
          <MaintenanceCalendar
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            tasks={tasks}
            selectedType={selectedType}
          />
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">{t('scheduledTasks')}</h3>
              <AddTaskDialog onAddTask={handleAddTask} />
            </div>
            <TaskList 
              tasks={filteredTasks} 
              onTaskComplete={handleTaskCompletion} 
              onTaskDelete={handleDeleteTask}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
