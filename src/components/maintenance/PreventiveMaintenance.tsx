
import { useState } from "react";
import { CalendarIcon, PlusIcon, BellRing, Calendar as CalendarIcon2, Repeat } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MaintenanceCalendar } from "./calendar/MaintenanceCalendar";
import { TypeFilter } from "./calendar/TypeFilter";
import { AddTaskDialog } from "./task-dialog/AddTaskDialog";
import { TaskList } from "./TaskList";
import { useMaintenanceTasks } from "./tasks/useMaintenanceTasks";
import { useLocale } from "@/components/providers/LocaleProvider";
import { NewTask, Task } from "./types";
import { Button } from "@/components/ui/button";
import { BatchSchedulingDialog } from "./scheduling/BatchSchedulingDialog";
import { useToast } from "@/hooks/use-toast";
import { RecurringTasksView } from "./recurring/RecurringTasksView";
import { RemindersView } from "./reminders/RemindersView";
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

  console.log("All tasks:", tasks);
  console.log("Recurring tasks:", tasks.filter(task => task.is_recurring));
  console.log("Tasks with reminders:", tasks.filter(task => task.reminder?.enabled));

  const filteredTasksByType = tasks.filter((task) =>
    selectedType === "all" ? true : task.type === selectedType
  );

  // Filter tasks by selected date
  const filteredTasksByDate = filteredTasksByType.filter(task => {
    if (!selectedDate) return true;
    
    const taskDate = new Date(task.date);
    return (
      taskDate.getFullYear() === selectedDate.getFullYear() &&
      taskDate.getMonth() === selectedDate.getMonth() &&
      taskDate.getDate() === selectedDate.getDate()
    );
  });

  if (isLoading) {
    return <div>{t('loading')}</div>;
  }

  const onAddTask = (newTask: NewTask) => {
    handleAddTask(newTask);
    toast({
      title: t('success'),
      description: newTask.reminder?.enabled 
        ? t('reminderSaved') 
        : t('taskAdded'),
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

  // Use all tasks for the recurring and reminders views
  // Don't filter them by selectedType or selectedDate
  const allTasks = tasks;

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
              tasks={filteredTasksByDate} 
              onTaskComplete={handleTaskCompletion} 
              onTaskDelete={handleDeleteTask}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Tabs defaultValue="reminders" className="w-full">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="reminders" className="flex items-center gap-1">
                  <BellRing className="h-4 w-4" />
                  {t('reminders')}
                </TabsTrigger>
                <TabsTrigger value="recurring" className="flex items-center gap-1">
                  <Repeat className="h-4 w-4" />
                  {t('recurringTasks')}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="reminders" className="w-full">
            <TabsContent value="reminders">
              <div className="mt-2">
                <RemindersView tasks={allTasks} />
              </div>
            </TabsContent>
            
            <TabsContent value="recurring">
              <div className="mt-2">
                <Tabs defaultValue="upcoming" className="w-full">
                  <TabsList className="w-full grid grid-cols-2">
                    <TabsTrigger value="upcoming">{t('upcomingView')}</TabsTrigger>
                    <TabsTrigger value="patterns">{t('patternsView')}</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="upcoming" className="mt-4">
                    <RecurringTasksView tasks={allTasks} />
                  </TabsContent>
                  
                  <TabsContent value="patterns" className="mt-4">
                    <div className="text-sm text-muted-foreground">
                      {t('recurringTasksPatterns')}
                    </div>
                  </TabsContent>
                </Tabs>
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
