
import { useState } from "react";
import { CalendarIcon, PlusIcon, BellRing, Calendar as CalendarIcon2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MaintenanceCalendar } from "./calendar/MaintenanceCalendar";
import { TypeFilter } from "./calendar/TypeFilter";
import { AddTaskDialog } from "./AddTaskDialog";
import { TaskList } from "./TaskList";
import { useMaintenanceTasks } from "./tasks/useMaintenanceTasks";
import { useLocale } from "@/components/providers/LocaleProvider";
import { NewTask } from "./types";
import { Button } from "@/components/ui/button";
import { BatchSchedulingDialog } from "./scheduling/BatchSchedulingDialog";
import { useToast } from "@/hooks/use-toast";
import { RecurringTasksView } from "./recurring/RecurringTasksView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const PreventiveMaintenance = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedType, setSelectedType] = useState<string>("all");
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isBatchSchedulingOpen, setIsBatchSchedulingOpen] = useState(false);
  const { t } = useLocale();
  const { toast } = useToast();
  
  const {
    tasks,
    isLoading,
    handleTaskCompletion,
    handleDeleteTask,
    handleAddTask,
    handleAddMultipleTasks,
  } = useMaintenanceTasks();

  const filteredTasks = tasks.filter((task) =>
    selectedType === "all" ? true : task.type === selectedType
  );

  if (isLoading) {
    return <div>{t('loading')}</div>;
  }

  const onAddTask = (newTask: NewTask) => {
    handleAddTask(newTask);
    toast({
      title: t('success'),
      description: t('taskAdded'),
    });
  };

  const onAddMultipleTasks = (newTasks: NewTask[]) => {
    handleAddMultipleTasks(newTasks);
    toast({
      title: t('success'),
      description: t('multipleTasksAdded'),
    });
    setIsBatchSchedulingOpen(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
      <Card className="lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarIcon className="h-5 w-5" />
            {t('maintenanceCalendar')}
          </CardTitle>
          <div className="flex flex-row gap-2">
            <TypeFilter
              selectedType={selectedType}
              onTypeChange={setSelectedType}
            />
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsBatchSchedulingOpen(true)}
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
            onSelectDate={setSelectedDate}
            tasks={tasks}
            selectedType={selectedType}
          />
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">{t('scheduledTasks')}</h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsAddTaskOpen(true)}
                className="flex items-center gap-1"
              >
                <PlusIcon className="h-4 w-4" />
                {t('addTask')}
              </Button>
            </div>
            <TaskList 
              tasks={filteredTasks.filter(task => 
                selectedDate ? 
                  new Date(task.date).toDateString() === selectedDate.toDateString() 
                  : true
              )} 
              onTaskComplete={handleTaskCompletion} 
              onTaskDelete={handleDeleteTask}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BellRing className="h-5 w-5" />
            {t('recurringTasks')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="upcoming">{t('upcoming')}</TabsTrigger>
              <TabsTrigger value="patterns">{t('patterns')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming" className="mt-4">
              <RecurringTasksView tasks={tasks.filter(task => task.is_recurring)} />
            </TabsContent>
            
            <TabsContent value="patterns" className="mt-4">
              <div className="text-sm text-muted-foreground">
                {t('recurringTasksPatterns')}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <AddTaskDialog
        onAddTask={onAddTask}
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
      />

      <BatchSchedulingDialog
        isOpen={isBatchSchedulingOpen}
        onClose={() => setIsBatchSchedulingOpen(false)}
        onSchedule={onAddMultipleTasks}
      />
    </div>
  );
};
