import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InterventionStats } from "./InterventionStats";
import { InterventionCalendar } from "./InterventionCalendar";
import { InterventionTimeline } from "./InterventionTimeline";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { VendorIntervention } from "@/types/vendor";

export const InterventionHistory = () => {
  const { data: interventions = [] } = useQuery({
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
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Intervention Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <InterventionCalendar interventions={interventions} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Intervention History</CardTitle>
            </CardHeader>
            <CardContent>
              <InterventionTimeline interventions={interventions} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};