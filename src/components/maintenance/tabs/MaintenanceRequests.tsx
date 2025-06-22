
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
  
  // Fetch maintenance requests with tenant data
  const { data: allRequests = [], isLoading, refetch } = useQuery({
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
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching maintenance requests:", error);
        throw error;
      }
      
      console.log("Fetched data with tenants for tab:", data);
      return data || [];
    },
  });

  // Show only first 5 requests
  const displayedRequests = allRequests.slice(0, 5);
  const remainingCount = allRequests.length - 5;

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
        <CardContent className="p-6">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Chargement...
            </div>
          ) : displayedRequests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {t('noMaintenanceRequests')}
            </div>
          ) : (
            <div className="space-y-4">
              {displayedRequests.map((request) => (
                <MaintenanceRequestItem 
                  key={request.id}
                  request={request}
                  onClick={() => handleRequestClick(request)}
                />
              ))}
              
              {remainingCount > 0 && (
                <div className="pt-4 border-t">
                  <Button 
                    onClick={onViewAllRequests} 
                    variant="outline"
                    className="w-full"
                  >
                    Voir {remainingCount} autre{remainingCount > 1 ? 's' : ''} demande{remainingCount > 1 ? 's' : ''}
                  </Button>
                </div>
              )}
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
