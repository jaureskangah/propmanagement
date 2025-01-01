import React from "react";
import { VendorIntervention } from "@/types/vendor";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDate } from "@/lib/utils";

interface InterventionTimelineProps {
  interventions: VendorIntervention[];
}

export const InterventionTimeline = ({ interventions }: InterventionTimelineProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'scheduled':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <ScrollArea className="h-[500px] pr-4">
      <div className="space-y-8">
        {interventions.map((intervention) => (
          <div key={intervention.id} className="relative pl-6 border-l-2 border-gray-200">
            <div className="absolute -left-2 w-4 h-4 rounded-full bg-blue-500" />
            <div className="mb-2">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">{intervention.title}</h3>
                <Badge className={getStatusColor(intervention.status)}>
                  {intervention.status}
                </Badge>
              </div>
              <p className="text-sm text-gray-500">
                {formatDate(intervention.date)}
              </p>
            </div>
            <p className="text-gray-600">{intervention.description}</p>
            {intervention.cost && (
              <p className="mt-2 font-medium">
                Coût: {intervention.cost.toLocaleString()}€
              </p>
            )}
            {intervention.vendors && (
              <p className="text-sm text-gray-500 mt-1">
                Prestataire: {intervention.vendors.name} ({intervention.vendors.specialty})
              </p>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};