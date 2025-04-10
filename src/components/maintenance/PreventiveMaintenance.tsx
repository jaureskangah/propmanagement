
import { useState, useEffect } from "react";
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
import { isSameDay, startOfDay, isValid } from "date-fns";

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

  // Force refresh the component when tasks change
  const [forceRefresh, setForceRefresh] = useState(0);
  useEffect(() => {
    // When tasks change, trigger a re-render
    if (tasks.length > 0) {
      setForceRefresh(prev => prev + 1);
    }
  }, [tasks.length]);

  // Log to check if tasks exist
  console.log("All tasks in PreventiveMaintenance:", tasks);
  console.log("Recurring tasks:", tasks.filter(task => task.is_recurring));
  console.log("Reminder tasks:", tasks.filter(task => task.has_reminder));

  const filteredTasksByType = tasks.filter((task) =>
    selectedType === "all" ? true : task.type === selectedType
  );

  // Filter tasks by selected date - improved date comparison
  const filteredTasksByDate = filteredTasksByType.filter(task => {
    if (!selectedDate) return false; // Don't show tasks if no date is selected
    
    // Get a properly formatted task date
    let taskDate: Date;
    if (task.date instanceof Date) {
      taskDate = task.date;
    } else if (typeof task.date === 'string') {
      taskDate = new Date(task.date);
      if (!isValid(taskDate)) {
        console.error("Invalid date string in task:", task.id, task.date);
        return false;
      }
    } else {
      console.error("Unexpected date format in task:", task.id, task.date);
      return false;
    }
    
    // Normaliser les dates avant comparaison
    const normalizedTaskDate = startOfDay(taskDate);
    const normalizedSelectedDate = startOfDay(selectedDate);
    
    // Log each task date comparison for debugging
    const isSame = isSameDay(normalizedTaskDate, normalizedSelectedDate);
    console.log(`Task ${task.id} "${task.title}" date: ${taskDate} matches selected ${selectedDate}? ${isSame}`);
    console.log(`Task date normalized: ${normalizedTaskDate.toISOString()} - Selected date normalized: ${normalizedSelectedDate.toISOString()}`);
    
    return isSame;
  });
  
  console.log("Selected date:", selectedDate);
  console.log("Filtered tasks for selected date:", filteredTasksByDate);

  if (isLoading) {
    return <div>{t('loading')}</div>;
  }

  const onAddTask = (newTask: NewTask) => {
    console.log("Create task clicked with data:", newTask);
    handleAddTask(newTask).then(() => {
      toast({
        title: t('success'),
        description: t('taskAdded'),
      });
      
      // Si la date de la nouvelle tâche est différente de la date sélectionnée,
      // mettre à jour la date sélectionnée pour montrer la tâche
      if (newTask.date && selectedDate && !isSameDay(newTask.date, selectedDate)) {
        console.log("Setting calendar to task date:", newTask.date);
        setSelectedDate(new Date(newTask.date));
      } else {
        console.log("Keeping selected date after adding task:", selectedDate);
        // Forcer un rafraîchissement pour afficher la nouvelle tâche
        setForceRefresh(prev => prev + 1);
      }
    }).catch(error => {
      console.error("Error adding task:", error);
      toast({
        title: t('error'),
        description: t('errorAddingTask'),
        variant: "destructive",
      });
    });
    setIsAddTaskOpen(false);
  };

  const onAddMultipleTasks = (newTasks: NewTask[]) => {
    handleAddMultipleTasks(newTasks).then(() => {
      toast({
        title: t('success'),
        description: t('multipleTasksAdded'),
      });
      // Si des tâches ont été ajoutées, forcer un rafraîchissement
      setForceRefresh(prev => prev + 1);
    }).catch(error => {
      console.error("Error adding multiple tasks:", error);
      toast({
        title: t('error'),
        description: t('errorAddingTasks'),
        variant: "destructive",
      });
    });
    setIsBatchSchedulingOpen(false);
  };

  const recurringTasks = tasks.filter(task => task.is_recurring);
  const reminderTasks = tasks.filter(task => task.has_reminder);

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

      <div className="lg:col-span-1 space-y-4">
        {/* Recurring Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Repeat className="h-5 w-5" />
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
                <RecurringTasksView tasks={recurringTasks} />
              </TabsContent>
              
              <TabsContent value="patterns" className="mt-4">
                <div className="text-sm text-muted-foreground">
                  {t('recurringTasksPatterns')}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Reminders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BellRing className="h-5 w-5" />
              {t('reminders')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RemindersView tasks={reminderTasks} />
          </CardContent>
        </Card>
      </div>

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
