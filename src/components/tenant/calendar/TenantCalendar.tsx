import { useState, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Clock, DollarSign, Wrench } from "lucide-react";
import { format, isSameDay, parseISO } from "date-fns";
import { useLocale } from "@/components/providers/LocaleProvider";
import { motion } from "framer-motion";
import type { Payment, MaintenanceRequest, Communication } from "@/types/tenant";
import type { TenantData } from "@/hooks/tenant/dashboard/useTenantData";

interface TenantCalendarProps {
  tenant: TenantData;
  payments: Payment[];
  maintenanceRequests: MaintenanceRequest[];
  communications: Communication[];
}

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: 'payment' | 'maintenance' | 'lease' | 'communication';
  status?: string;
  description?: string;
}

export const TenantCalendar = ({
  tenant,
  payments,
  maintenanceRequests,
  communications
}: TenantCalendarProps) => {
  const { t } = useLocale();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Generate events from data
  const events = useMemo(() => {
    const eventList: CalendarEvent[] = [];

    // Add payment events
    payments.forEach(payment => {
      eventList.push({
        id: `payment-${payment.id}`,
        title: `${t('rentPayment')} - $${payment.amount}`,
        date: parseISO(payment.payment_date),
        type: 'payment',
        status: payment.status,
        description: `${t('status')}: ${payment.status}`
      });
    });

    // Add maintenance events
    maintenanceRequests.forEach(request => {
      eventList.push({
        id: `maintenance-${request.id}`,
        title: request.title || request.issue,
        date: parseISO(request.created_at),
        type: 'maintenance',
        status: request.status,
        description: `${t('priority')}: ${request.priority}`
      });

      // Add deadline if exists
      if (request.deadline) {
        eventList.push({
          id: `maintenance-deadline-${request.id}`,
          title: `${t('maintenanceDeadline')}: ${request.title || request.issue}`,
          date: parseISO(request.deadline),
          type: 'maintenance',
          status: 'deadline',
          description: `${t('deadline')} - ${request.priority}`
        });
      }
    });

    // Add lease events
    if (tenant) {
      eventList.push({
        id: 'lease-start',
        title: t('leaseStart'),
        date: parseISO(tenant.lease_start),
        type: 'lease',
        description: t('leaseStartDate')
      });

      eventList.push({
        id: 'lease-end',
        title: t('leaseEnd'),
        date: parseISO(tenant.lease_end),
        type: 'lease',
        description: t('leaseEndDate')
      });
    }

    // Add communication events
    communications.slice(0, 10).forEach(comm => {
      eventList.push({
        id: `communication-${comm.id}`,
        title: comm.subject,
        date: parseISO(comm.created_at),
        type: 'communication',
        status: comm.status,
        description: `${t('communication')}: ${comm.category}`
      });
    });

    return eventList.sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [tenant, payments, maintenanceRequests, communications, t]);

  // Get events for selected date
  const selectedDateEvents = selectedDate 
    ? events.filter(event => isSameDay(event.date, selectedDate))
    : [];

  // Get upcoming events (next 7 days)
  const upcomingEvents = events.filter(event => {
    const now = new Date();
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return event.date >= now && event.date <= weekFromNow;
  }).slice(0, 5);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return <DollarSign className="h-3 w-3" />;
      case 'maintenance':
        return <Wrench className="h-3 w-3" />;
      case 'communication':
        return <Clock className="h-3 w-3" />;
      default:
        return <CalendarIcon className="h-3 w-3" />;
    }
  };

  const getEventColor = (type: string, status?: string) => {
    switch (type) {
      case 'payment':
        return status === 'paid' 
          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
          : status === 'overdue'
          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'maintenance':
        return status === 'completed'
          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
          : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'lease':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  // Check if date has events
  const hasEvents = (date: Date) => {
    return events.some(event => isSameDay(event.date, date));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            {t('calendar')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="w-full pointer-events-auto"
            modifiers={{
              hasEvents: (date) => hasEvents(date)
            }}
            modifiersClassNames={{
              hasEvents: "bg-primary/10 text-primary font-medium"
            }}
          />
        </CardContent>
      </Card>

      {/* Events Panel */}
      <div className="space-y-4">
        {/* Selected Date Events */}
        {selectedDate && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {format(selectedDate, 'EEEE, MMMM do')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDateEvents.length > 0 ? (
                <div className="space-y-3">
                  {selectedDateEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex-shrink-0 mt-1">
                        {getEventIcon(event.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{event.title}</p>
                        <p className="text-xs text-muted-foreground">{event.description}</p>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${getEventColor(event.type, event.status)}`}
                      >
                        {event.type}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm text-center py-4">
                  {t('noEventsThisDay')}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('upcomingEvents')}</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingEvents.length > 0 ? (
              <div className="space-y-3">
                {upcomingEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex-shrink-0 mt-1">
                      {getEventIcon(event.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{event.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(event.date, 'MMM do, yyyy')} - {event.description}
                      </p>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${getEventColor(event.type, event.status)}`}
                    >
                      {event.type}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm text-center py-4">
                {t('noUpcomingEvents')}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};