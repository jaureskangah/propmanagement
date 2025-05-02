
import React from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VendorAppointmentCalendarProps } from "./types";
import { VendorAppointmentDialog } from "./VendorAppointmentDialog";
import { CalendarTab } from "./CalendarTab";
import { TodayTab } from "./TodayTab";
import { UpcomingTab } from "./UpcomingTab";
import { useAppointmentCalendar } from "./useAppointmentCalendar";

export const VendorAppointmentCalendar = ({ vendors }: VendorAppointmentCalendarProps) => {
  const { t } = useLocale();
  const {
    selectedDate,
    setSelectedDate,
    dialogOpen,
    setDialogOpen,
    searchQuery,
    setSearchQuery,
    appointmentToEdit,
    filteredAppointments,
    upcomingAppointments,
    todayAppointments,
    getVendorById,
    handleAddAppointment,
    handleEditAppointment,
    handleStatusChange,
    handleNewOrUpdateAppointment
  } = useAppointmentCalendar(vendors);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h3 className="text-xl font-medium">{t('vendorAppointments')}</h3>
          <p className="text-sm text-muted-foreground">{t('manageVendorAppointments')}</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Input 
            placeholder={t('searchAppointments')} 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full sm:w-64"
          />
          <Button size="sm" onClick={handleAddAppointment}>
            {t('scheduleAppointment')}
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="calendar" className="space-y-4">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="calendar">{t('calendar')}</TabsTrigger>
          <TabsTrigger value="today">{t('today')}</TabsTrigger>
          <TabsTrigger value="upcoming">{t('upcoming')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar">
          <CalendarTab 
            selectedDate={selectedDate} 
            setSelectedDate={setSelectedDate}
            filteredAppointments={filteredAppointments}
            getVendorById={getVendorById}
            handleEditAppointment={handleEditAppointment}
            handleStatusChange={handleStatusChange}
          />
        </TabsContent>
        
        <TabsContent value="today">
          <TodayTab 
            todayAppointments={todayAppointments}
            getVendorById={getVendorById}
            handleStatusChange={handleStatusChange}
          />
        </TabsContent>
        
        <TabsContent value="upcoming">
          <UpcomingTab 
            upcomingAppointments={upcomingAppointments}
            getVendorById={getVendorById}
            handleEditAppointment={handleEditAppointment}
            handleStatusChange={handleStatusChange}
          />
        </TabsContent>
      </Tabs>

      <VendorAppointmentDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        vendors={vendors}
        appointment={appointmentToEdit}
        onSuccess={handleNewOrUpdateAppointment}
      />
    </div>
  );
};
