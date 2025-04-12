
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
import { isSameDay, startOfDay, format, parseISO } from "date-fns";

export const PreventiveMaintenance = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(startOfDay(new Date()));
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

  // Function to normalize dates for comparison by removing time component
  const normalizeDate = (date: Date | string | undefined): Date | undefined => {
    if (!date) return undefined;
    
    let normalizedDate: Date;
    if (typeof date === 'string') {
      try {
        normalizedDate = parseISO(date);
        if (!normalizedDate || isNaN(normalizedDate.getTime())) {
          console.error("Invalid date string:", date);
          return undefined;
        }
      } catch (error) {
        console.error("Error parsing date string:", date, error);
        return undefined;
      }
    } else {
      normalizedDate = new Date(date);
    }
    
    return startOfDay(normalizedDate);
  };

  // Filter tasks by selected type
  const filteredTasksByType = tasks.filter((task) =>
    selectedType === "all" ? true : task.type === selectedType
  );

  // Filter tasks by selected date using normalized dates for comparison
  const filteredTasksByDate = filteredTasksByType.filter(task => {
    if (!selectedDate) return false;
    
    const taskDate = normalizeDate(task.date);
    const currentSelectedDate = normalizeDate(selectedDate);
    
    if (!taskDate || !currentSelectedDate) {
      console.error("Invalid date in comparison:", { 
        taskDate: task.date, 
        selectedDate: selectedDate 
      });
      return false;
    }
    
    // Log to help debug the date comparison
    console.log(`Comparing: Task date (${format(taskDate, "yyyy-MM-dd")}) with selected date (${format(currentSelectedDate, "yyyy-MM-dd")})`);
    
    // Use isSameDay for reliable date comparison
    const result = isSameDay(taskDate, currentSelectedDate);
    console.log(`Match: ${result}`);
    
    return result;
  });
  
  // Log filtered tasks for debugging
  console.log(`Selected date: ${selectedDate ? format(selectedDate, "yyyy-MM-dd") : "none"}`);
  console.log(`Filtered tasks count: ${filteredTasksByDate.length}`);
  if (filteredTasksByDate.length > 0) {
    console.log(`Filtered tasks:`, filteredTasksByDate.map(t => ({ 
      id: t.id, 
      title: t.title, 
      date: t.date instanceof Date ? format(t.date, "yyyy-MM-dd") : 'Invalid date'
    })));
  }
  
  if (isLoading) {
    return <div>{t('loading')}</div>;
  }

  const onAddTask = (newTask: NewTask) => {
    console.log("Create task clicked with data:", newTask);
    
    // Ensure the task has a valid date
    if (!newTask.date) {
      newTask.date = startOfDay(new Date());
    } else if (typeof newTask.date === 'string') {
      newTask.date = startOfDay(new Date(newTask.date));
    } else {
      newTask.date = startOfDay(newTask.date);
    }
    
    console.log("Normalized task date for creation:", format(newTask.date, "yyyy-MM-dd"));
    
    handleAddTask(newTask).then((result) => {
      console.log("Task added successfully:", result);
      toast({
        title: t('success'),
        description: t('taskAdded'),
      });
      
      // Set selected date to match the new task's date to show it immediately
      if (newTask.date) {
        const taskDate = startOfDay(newTask.date);
        console.log("Setting calendar to task date:", format(taskDate, "yyyy-MM-dd"));
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
    // Normalize dates in all new tasks
    const normalizedTasks = newTasks.map(task => ({
      ...task,
      date: task.date ? startOfDay(task.date instanceof Date ? task.date : new Date(task.date)) : startOfDay(new Date())
    }));
    
    handleAddMultipleTasks(normalizedTasks).then((result) => {
      console.log("Multiple tasks added successfully:", result);
      toast({
        title: t('success'),
        description: t('multipleTasksAdded'),
      });
      
      if (normalizedTasks.length > 0 && normalizedTasks[0].date) {
        const taskDate = startOfDay(normalizedTasks[0].date);
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
        initialDate={selectedDate}
      />

      <BatchSchedulingDialog
        isOpen={isBatchSchedulingOpen}
        onClose={() => setIsBatchSchedulingOpen(false)}
        onSchedule={onAddMultipleTasks}
      />
    </div>
  );
};
