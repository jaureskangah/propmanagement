import { Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import type { MaintenanceRequest } from "@/types/tenant";

interface MaintenanceListProps {
  requests: MaintenanceRequest[];
}

export const MaintenanceList = ({ requests }: MaintenanceListProps) => {
  if (requests.length === 0) {
    return (
      <CardContent>
        <p className="text-muted-foreground text-center py-4">
          No maintenance requests found
        </p>
      </CardContent>
    );
  }

  return (
    <CardContent>
      <div className="space-y-4">
        {requests.map((request) => (
          <div
            key={request.id}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <Wrench className="h-5 w-5 text-[#ea384c]" />
              <div>
                <p className="font-medium">{request.issue}</p>
                <p className="text-sm text-muted-foreground">
                  Created on {formatDate(request.created_at)}
                </p>
              </div>
            </div>
            <Badge
              variant={request.status === "Resolved" ? "default" : "secondary"}
              className={
                request.status === "Resolved"
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-yellow-500 hover:bg-yellow-600"
              }
            >
              {request.status}
            </Badge>
          </div>
        ))}
      </div>
    </CardContent>
  );
};