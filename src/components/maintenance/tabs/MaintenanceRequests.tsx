
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MaintenanceRequest } from "../types";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Button } from "@/components/ui/button";
import { MaintenanceRequestItem } from "../request/MaintenanceRequestItem";
import { MaintenanceRequestDialog } from "../request/MaintenanceRequestDialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface MaintenanceRequestsProps {
  requests?: MaintenanceRequest[];
  onRequestClick?: (request: MaintenanceRequest) => void;
  onViewAllRequests: () => void;
}

export const MaintenanceRequests = ({ onViewAllRequests }: MaintenanceRequestsProps) => {
  const { t } = useLocale();
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Fetch maintenance requests with tenant data - same logic as working component
  const { data: requests = [], isLoading, refetch } = useQuery({
    queryKey: ['maintenance_requests_tab'],
    queryFn: async () => {
      console.log("Fetching maintenance requests with tenant data for tab...");
      
      const { data, error } = await supabase
        .from('maintenance_requests')
        .select(`
          *,
          tenants (
            name,
            unit_number,
            properties (
              name
            )
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) {
        console.error("Error fetching maintenance requests:", error);
        throw error;
      }
      
      console.log("Fetched data with tenants for tab:", data);
      return data || [];
    },
  });

  const handleRequestClick = (request: MaintenanceRequest) => {
    console.log("Opening request dialog for:", request);
    setSelectedRequest(request);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setTimeout(() => setSelectedRequest(null), 300);
  };

  const handleMaintenanceUpdate = () => {
    console.log("Maintenance updated, refetching...");
    refetch();
    handleCloseDialog();
  };
  
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t('maintenanceRequests')}</CardTitle>
          <Button onClick={onViewAllRequests} variant="outline">
            {t('viewAllRequests')}
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Chargement...
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {t('noMaintenanceRequests')}
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <MaintenanceRequestItem 
                  key={request.id}
                  request={request}
                  onClick={() => handleRequestClick(request)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedRequest && (
        <MaintenanceRequestDialog
          request={selectedRequest}
          onClose={handleCloseDialog}
          onUpdate={handleMaintenanceUpdate}
          open={dialogOpen}
        />
      )}
    </>
  );
};
