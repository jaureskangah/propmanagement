
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MaintenanceRequest } from "../types";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Button } from "@/components/ui/button";

interface MaintenanceRequestsProps {
  requests: MaintenanceRequest[];
  onRequestClick: (request: MaintenanceRequest) => void;
  onViewAllRequests: () => void;
}

export const MaintenanceRequests = ({ requests, onRequestClick, onViewAllRequests }: MaintenanceRequestsProps) => {
  const { t } = useLocale();
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t('maintenanceRequests')}</CardTitle>
        <Button onClick={onViewAllRequests} variant="outline">
          {t('viewAllRequests')}
        </Button>
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {t('noMaintenanceRequests')}
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div 
                key={request.id}
                className="p-4 border rounded-md cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => onRequestClick(request)}
              >
                <div className="font-medium">{request.title || request.issue}</div>
                <div className="text-sm text-muted-foreground mt-1">{request.issue}</div>
                <div className="flex justify-between mt-2">
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {request.priority}
                  </span>
                  <span className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-full">
                    {request.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
