import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { VendorIntervention } from "@/types/vendor";
import { Badge } from "@/components/ui/badge";

interface InterventionCalendarProps {
  interventions: VendorIntervention[];
}

export const InterventionCalendar = ({ interventions }: InterventionCalendarProps) => {
  const modifiers = {
    intervention: interventions.map(int => new Date(int.date))
  };

  const modifiersStyles = {
    intervention: {
      backgroundColor: '#3b82f6',
      color: 'white',
      borderRadius: '50%'
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Badge variant="default">Scheduled intervention</Badge>
      </div>
      <Calendar
        mode="multiple"
        selected={modifiers.intervention}
        modifiers={modifiers}
        modifiersStyles={modifiersStyles}
        className="rounded-md border"
      />
    </div>
  );
};