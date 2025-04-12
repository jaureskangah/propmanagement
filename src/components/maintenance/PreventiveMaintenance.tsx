
import { useState, useEffect, useCallback } from "react";
import { CalendarIcon, PlusIcon, BellRing, Calendar as CalendarIcon2, Repeat, RotateCw } from "lucide-react";
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
import { isSameDay, startOfDay, isValid, parseISO, format } from "date-fns";

export const PreventiveMaintenance = () => {
  // Définir la date du jour (locale, sans fuseau horaire)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(today);
  const [selectedType, setSelectedType] = useState<string>("all");
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isBatchSchedulingOpen, setIsBatchSchedulingOpen] = useState(false);
  const { t } = useLocale();
  const { toast } = useToast();
  
  const {
    tasks,
    isLoading,
    lastAddedTask,
    handleTaskCompletion,
    handleDeleteTask,
    handleAddTask,
    handleAddMultipleTasks,
    refetchTasks
  } = useMaintenanceTasks();

  // Effect pour mettre à jour la date sélectionnée si une nouvelle tâche est ajoutée
  useEffect(() => {
    if (lastAddedTask && lastAddedTask.date) {
      const taskDate = lastAddedTask.date instanceof Date 
        ? lastAddedTask.date 
        : new Date(lastAddedTask.date);
      
      console.log("New task added, setting calendar to task date:", format(taskDate, "yyyy-MM-dd"));
      setSelectedDate(new Date(taskDate));
    }
  }, [lastAddedTask]);

  // Fonction pour normaliser une date pour la comparaison
  const normalizeDate = useCallback((date: Date | string | undefined): Date | null => {
    if (!date) return null;
    
    let normalizedDate: Date;
    if (date instanceof Date) {
      normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    } else if (typeof date === 'string') {
      try {
        // Essayer d'abord avec parseISO pour les formats ISO
        normalizedDate = parseISO(date);
        if (!isValid(normalizedDate)) {
          // Si ce n'est pas valide, essayer avec le constructeur standard
          normalizedDate = new Date(date);
        }
        // Réinitialiser les heures, minutes et secondes
        normalizedDate = new Date(normalizedDate.getFullYear(), normalizedDate.getMonth(), normalizedDate.getDate());
      } catch (e) {
        console.error("Error parsing date string:", date, e);
        return null;
      }
    } else {
      console.error("Invalid date format:", date);
      return null;
    }
    
    if (!isValid(normalizedDate)) {
      console.error("Date is invalid after parsing:", date);
      return null;
    }
    
    return normalizedDate;
  }, []);

  // Force refresh the component when tasks change
  const [forceRefresh, setForceRefresh] = useState(0);
  useEffect(() => {
    // When tasks change, trigger a re-render
    setForceRefresh(prev => prev + 1);
  }, [tasks.length]);

  // Rafraîchir périodiquement la liste des tâches
  useEffect(() => {
    const intervalId = setInterval(() => {
      refetchTasks();
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, [refetchTasks]);

  // Log to check if tasks exist
  console.log("All tasks in PreventiveMaintenance:", tasks.length);
  
  if (tasks.length > 0) {
    console.log("Task details:", tasks.map(task => ({
      id: task.id, 
      title: task.title,
      date: task.date instanceof Date ? task.date.toISOString() : task.date,
      type: task.type,
      priority: task.priority
    })));
  }

  const filteredTasksByType = tasks.filter((task) =>
    selectedType === "all" ? true : task.type === selectedType
  );

  // Filter tasks by selected date - improved date comparison
  const filteredTasksByDate = filteredTasksByType.filter(task => {
    if (!selectedDate) return false; // Don't show tasks if no date is selected
    
    const taskNormalizedDate = normalizeDate(task.date);
    const selectedNormalizedDate = normalizeDate(selectedDate);
    
    if (!taskNormalizedDate || !selectedNormalizedDate) return false;
    
    const isSame = isSameDay(taskNormalizedDate, selectedNormalizedDate);
    
    if (isSame) {
      console.log(`Task ${task.id} "${task.title}" MATCHES selected date`);
    }
    
    return isSame;
  });
  
  console.log("Selected date:", selectedDate ? selectedDate.toISOString() : "No date selected");
  console.log("Filtered tasks for selected date:", filteredTasksByDate.length);
  
  if (filteredTasksByDate.length > 0) {
    console.log("Filtered task details:", filteredTasksByDate.map(t => ({ 
      id: t.id, 
      title: t.title,
      date: t.date instanceof Date ? t.date.toISOString() : t.date
    })));
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center space-y-4">
          <RotateCw className="h-8 w-8 animate-spin mx-auto text-primary" />
          <div>{t('loading')}</div>
        </div>
      </div>
    );
  }

  const onAddTask = (newTask: NewTask) => {
    console.log("Create task clicked with data:", newTask);
    handleAddTask(newTask).then((result) => {
      console.log("Task added successfully:", result);
      toast({
        title: t('success'),
        description: t('taskAdded'),
      });
      
      // Si la date de la nouvelle tâche est différente de la date sélectionnée,
      // mettre à jour la date sélectionnée pour montrer la tâche
      if (newTask.date) {
        const taskDate = newTask.date instanceof Date ? newTask.date : new Date(newTask.date);
        console.log("Setting calendar to task date:", taskDate.toISOString());
        setSelectedDate(taskDate);
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
    handleAddMultipleTasks(newTasks).then((result) => {
      console.log("Multiple tasks added successfully:", result);
      toast({
        title: t('success'),
        description: t('multipleTasksAdded'),
      });
      // Si des tâches ont été ajoutées, forcer un rafraîchissement
      setForceRefresh(prev => prev + 1);
      
      // Si des tâches ont été ajoutées, sélectionner la date de la première tâche
      if (newTasks.length > 0 && newTasks[0].date) {
        const taskDate = newTasks[0].date instanceof Date ? newTasks[0].date : new Date(newTasks[0].date);
        setSelectedDate(taskDate);
      }
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

  const handleRefresh = () => {
    refetchTasks();
    toast({
      title: t('refreshed'),
      description: t('dataRefreshed'),
    });
  };

  // Ouvrir le dialogue d'ajout de tâche pour aujourd'hui
  const handleAddTodayTask = () => {
    setSelectedDate(today);
    setIsAddTaskOpen(true);
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
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              className="flex items-center gap-1"
            >
              <RotateCw className="h-4 w-4" />
              {t('refresh')}
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
              <div className="flex items-center gap-2">
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={handleAddTodayTask}
                  className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
                >
                  <PlusIcon className="h-4 w-4" />
                  {t('addTaskToday')} 
                </Button>
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
