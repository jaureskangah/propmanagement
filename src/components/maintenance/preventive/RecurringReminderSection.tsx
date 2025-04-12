
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BellRing, Repeat } from "lucide-react";
import { RecurringTasksView } from "../recurring/RecurringTasksView";
import { RemindersView } from "../reminders/RemindersView";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Task } from "../types";

interface RecurringReminderSectionProps {
  recurringTasks: Task[];
  reminderTasks: Task[];
}

export const RecurringReminderSection = ({ 
  recurringTasks, 
  reminderTasks 
}: RecurringReminderSectionProps) => {
  const { t } = useLocale();
  
  return (
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
  );
};
