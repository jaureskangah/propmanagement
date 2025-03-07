
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { AlertOctagon, Calendar as CalendarIcon, AlertTriangle, CheckCircle2, Calendar, User, Home } from "lucide-react";
import { useMemo } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useMaintenanceTasks } from "@/components/maintenance/tasks/useMaintenanceTasks";
import { format } from "date-fns";
import { fr } from 'date-fns/locale';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PrioritySectionProps {
  maintenanceData: any[];
  tenantsData: any[];
  paymentsData: any[];
}

export const PrioritySection = ({ maintenanceData, tenantsData, paymentsData }: PrioritySectionProps) => {
  const { t, language } = useLocale();
  const { tasks, isLoading } = useMaintenanceTasks();
  const dateLocale = language === 'fr' ? fr : undefined;

  // Mémoriser les données filtrées pour éviter des recalculs inutiles
  const urgentMaintenance = useMemo(() => 
    maintenanceData?.filter(
      req => req.priority === "Urgent" && req.status !== "Resolved"
    ) || [], 
    [maintenanceData]
  );

  // Get tenant information based on tenant_id
  const getTenantInfo = (tenantId) => {
    if (!tenantId || !tenantsData) return null;
    return tenantsData.find(tenant => tenant.id === tenantId);
  };

  // Trier les tâches par date
  const upcomingTasks = useMemo(() => {
    if (!tasks) return [];
    return tasks
      .filter(task => !task.completed)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5); // Limiter à 5 tâches
  }, [tasks]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertOctagon className="h-5 w-5 text-red-500" />
            {t('priorityTasks')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px] pr-4">
            {urgentMaintenance.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                {t('noUrgentTasks')}
              </p>
            ) : (
              <div className="space-y-4">
                {urgentMaintenance.map((task) => {
                  const tenant = getTenantInfo(task.tenant_id);
                  const propertyName = tenant?.properties?.name || "";
                  
                  return (
                    <div
                      key={task.id}
                      className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                      <div className="w-full">
                        <h4 className="font-medium">{task.title || task.issue}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {task.description || t('urgentMaintenanceRequest')}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {propertyName && (
                            <Badge variant="success" className="text-xs flex items-center gap-1">
                              {propertyName}
                            </Badge>
                          )}
                          {task.unit_number && (
                            <Badge variant="secondary" className="text-xs flex items-center gap-1">
                              <Home className="h-3 w-3" />
                              {task.unit_number}
                            </Badge>
                          )}
                          <Badge variant="destructive" className="text-xs">
                            {t('emergency')}
                          </Badge>
                          {tenant && (
                            <TooltipProvider delayDuration={300}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Badge variant="outline" className="text-xs flex items-center gap-1 cursor-pointer">
                                    <User className="h-3 w-3" />
                                    {tenant.name}
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{tenant.email}</p>
                                  {tenant.phone && <p>{tenant.phone}</p>}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <CalendarIcon className="h-5 w-5 text-blue-500" />
            {t('importantEvents')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px] pr-4">
            {isLoading ? (
              <p className="text-muted-foreground text-center py-8">
                {t('loading')}
              </p>
            ) : upcomingTasks.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                {t('noScheduledTasks')}
              </p>
            ) : (
              <div className="space-y-3">
                {upcomingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <Calendar className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium">{task.title}</h4>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          {format(new Date(task.date), 'dd MMM yyyy', { locale: dateLocale })}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            task.priority === 'urgent' ? 'bg-red-50 border-red-200 text-red-700' :
                            task.priority === 'high' ? 'bg-orange-50 border-orange-200 text-orange-700' :
                            task.priority === 'medium' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' :
                            'bg-green-50 border-green-200 text-green-700'
                          }`}
                        >
                          {t(task.priority)}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {t(task.type)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};
