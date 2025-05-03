
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InterventionStats } from "./InterventionStats";
import { InterventionCalendar } from "./InterventionCalendar";
import { InterventionTimeline } from "./InterventionTimeline";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { VendorIntervention } from "@/types/vendor";
import { useLocale } from "@/components/providers/LocaleProvider";

export const InterventionHistory = () => {
  const { t } = useLocale();
  
  const { data: interventions = [], isLoading } = useQuery({
    queryKey: ['vendor_interventions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendor_interventions')
        .select(`
          *,
          vendors (
            name,
            specialty
          )
        `)
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data as VendorIntervention[];
    },
  });

  return (
    <div className="space-y-6">
      <InterventionStats interventions={interventions} />
      
      <Tabs defaultValue="calendar" className="space-y-4">
        <TabsList>
          <TabsTrigger value="calendar">{t('interventionCalendar')}</TabsTrigger>
          <TabsTrigger value="timeline">{t('interventionHistory')}</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>{t('interventionCalendar')}</CardTitle>
            </CardHeader>
            <CardContent>
              <InterventionCalendar interventions={interventions} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>{t('interventionHistory')}</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary"></div>
                </div>
              ) : (
                <InterventionTimeline interventions={interventions} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
