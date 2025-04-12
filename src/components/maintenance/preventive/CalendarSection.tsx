
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MaintenanceCalendar } from "../calendar/MaintenanceCalendar";
import { TypeFilter } from "../calendar/TypeFilter";
import { Button } from "@/components/ui/button";
import { PlusIcon, Calendar as CalendarIcon2 } from "lucide-react";
import { TaskList } from "../TaskList";
import { CalendarIcon } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

interface CalendarSectionProps {
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
  onBatchSchedulingOpen: () => void;
  onAddTaskOpen: () => void;
  tasks: any[];
  filteredTasks: any[];
  onTaskComplete: (taskId: string) => void;
  onTaskDelete: (taskId: string) => void;
}

export const CalendarSection = ({
  selectedDate,
  onSelectDate,
  selectedType,
  onTypeChange,
  onBatchSchedulingOpen,
  onAddTaskOpen,
  tasks,
  filteredTasks,
  onTaskComplete,
  onTaskDelete
}: CalendarSectionProps) => {
  const { t } = useLocale();
  
  return (
    <Card className="lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <CalendarIcon className="h-5 w-5" />
          {t('maintenanceCalendar')}
        </CardTitle>
        <div className="flex flex-row gap-2">
          <TypeFilter
            selectedType={selectedType}
            onTypeChange={onTypeChange}
          />
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onBatchSchedulingOpen}
            className="flex items-center gap-1"
          >
            <CalendarIcon2 className="h-4 w-4" />
            {t('batchScheduling')}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <MaintenanceCalendar
          selectedDate={selectedDate}
          onSelectDate={onSelectDate}
          tasks={tasks}
          selectedType={selectedType}
        />
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">{t('scheduledTasks')}</h3>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onAddTaskOpen}
              className="flex items-center gap-1"
            >
              <PlusIcon className="h-4 w-4" />
              {t('addTask')}
            </Button>
          </div>
          <TaskList 
            tasks={filteredTasks} 
            onTaskComplete={onTaskComplete} 
            onTaskDelete={onTaskDelete}
          />
        </div>
      </CardContent>
    </Card>
  );
};
