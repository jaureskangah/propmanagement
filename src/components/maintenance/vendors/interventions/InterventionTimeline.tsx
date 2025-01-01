import React from "react";
import { VendorIntervention } from "@/types/vendor";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface InterventionTimelineProps {
  interventions: VendorIntervention[];
}

export const InterventionTimeline = ({ interventions }: InterventionTimelineProps) => {
  return (
    <div className="space-y-4">
      {interventions.length === 0 ? (
        <p className="text-muted-foreground text-center py-4">
          No interventions found
        </p>
      ) : (
        interventions.map((intervention, index) => (
          <div
            key={intervention.id}
            className="relative pl-8 pb-8 last:pb-0"
          >
            <div className="absolute left-0 top-0 h-full w-px bg-border">
              <div className="absolute left-[-4px] top-2 h-2 w-2 rounded-full bg-primary" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{intervention.title}</h3>
                <Badge variant={
                  intervention.status === "completed" ? "default" :
                  intervention.status === "in_progress" ? "secondary" :
                  "outline"
                }>
                  {intervention.status === "completed" ? "Completed" :
                   intervention.status === "in_progress" ? "In Progress" :
                   "Pending"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {formatDate(intervention.date)}
              </p>
              <p className="text-sm">{intervention.description}</p>
              <p className="text-sm font-medium">
                Cost: ${intervention.cost?.toFixed(2) || "N/A"}
              </p>
              {intervention.vendors && (
                <p className="text-sm text-muted-foreground">
                  Vendor: {intervention.vendors.name} ({intervention.vendors.specialty})
                </p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};