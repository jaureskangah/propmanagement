
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { MaintenanceRequestItem } from '@/components/maintenance/request/MaintenanceRequestItem';
import { MaintenanceRequestDialog } from '@/components/maintenance/request/MaintenanceRequestDialog';
import { MaintenanceRequest } from '@/components/maintenance/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocale } from '@/components/providers/LocaleProvider';
import { useSearchParams } from 'react-router-dom';

const MaintenanceRequestList = () => {
  const { t } = useLocale();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Fetch maintenance requests
  const { data: requests = [], refetch } = useQuery({
    queryKey: ['maintenance_requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .select('*, tenants(name, properties(name), unit_number)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      console.log("Fetched maintenance requests:", data);
      return data;
    },
  });

  // Handle opening a request dialog
  const handleRequestClick = (request: MaintenanceRequest) => {
    console.log("Opening request dialog for:", request);
    setSelectedRequest(request);
    setDialogOpen(true);
  };

  // Handle closing the dialog
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setTimeout(() => setSelectedRequest(null), 300); // Clear after animation finishes
  };

  // Handle maintenance update and refetch data
  const handleMaintenanceUpdate = () => {
    console.log("Maintenance updated, refetching...");
    refetch();
    handleCloseDialog();
  };

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t('maintenanceRequests')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {requests.length > 0 ? (
              requests.map((request) => (
                <MaintenanceRequestItem 
                  key={request.id}
                  request={request}
                  onClick={() => handleRequestClick(request)}
                />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {t('noMaintenanceRequests')}
              </div>
            )}
          </div>
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
    </div>
  );
};

export default MaintenanceRequestList;
