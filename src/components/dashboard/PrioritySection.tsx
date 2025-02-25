
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertOctagon, Calendar as CalendarIcon, AlertTriangle } from "lucide-react";
import { format, isSameDay } from "date-fns";
import { useState } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";

interface PrioritySectionProps {
  maintenanceData: any[];
  tenantsData: any[];
  paymentsData: any[];
}

export const PrioritySection = ({ maintenanceData, tenantsData, paymentsData }: PrioritySectionProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { t } = useLocale();

  const urgentMaintenance = maintenanceData?.filter(
    req => req.priority === "Urgent" && req.status !== "Resolved"
  ) || [];

  const calendarEvents = [
    ...(paymentsData?.map(payment => ({
      date: new Date(payment.payment_date),
      type: 'payment',
      title: `${t('paymentDue')}: $${payment.amount}`,
      tenant: payment.tenants?.name
    })) || []),
    ...(tenantsData?.map(tenant => ({
      date: new Date(tenant.lease_end),
      type: 'lease',
      title: `${t('leaseEnding')}: ${tenant.name}`,
      unit: tenant.unit_number
    })) || [])
  ];

  const selectedDateEvents = calendarEvents.filter(
    event => selectedDate && isSameDay(event.date, selectedDate)
  );

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
                {urgentMaintenance.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">{task.title || task.issue}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {task.description || t('urgentMaintenanceRequest')}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {t('unitLabel')} {task.unit_number || "N/A"}
                        </Badge>
                        <Badge variant="destructive" className="text-xs">
                          {t('emergency')}
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <CalendarIcon className="h-5 w-5 text-blue-500" />
            {t('importantEvents')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              modifiers={{
                hasEvent: (date) =>
                  calendarEvents.some(event => isSameDay(date, event.date)),
              }}
              modifiersStyles={{
                hasEvent: {
                  backgroundColor: "#3b82f6",
                  color: "white",
                  borderRadius: "100%",
                },
              }}
            />

            <div className="mt-4">
              <h4 className="font-medium mb-2">
                {t('eventsOn')} {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : ''}
              </h4>
              <ScrollArea className="h-[100px]">
                <div className="space-y-2">
                  {selectedDateEvents.length === 0 ? (
                    <p className="text-muted-foreground text-sm">
                      {t('noEvents')}
                    </p>
                  ) : (
                    selectedDateEvents.map((event, index) => (
                      <div
                        key={index}
                        className="p-2 rounded-lg border bg-card text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={event.type === 'payment' ? 'default' : 'secondary'}
                          >
                            {t(event.type)}
                          </Badge>
                          <span>{event.title}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
