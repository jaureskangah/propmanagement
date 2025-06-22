
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { MaintenanceRequestItem } from '@/components/maintenance/request/MaintenanceRequestItem';
import { MaintenanceRequestDialog } from '@/components/maintenance/request/MaintenanceRequestDialog';
import { MaintenanceRequest } from '@/components/maintenance/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocale } from '@/components/providers/LocaleProvider';
import AppSidebar from '@/components/AppSidebar';
import { useAuth } from '@/components/AuthProvider';
import { cn } from '@/lib/utils';

const MaintenanceRequestList = () => {
  const { t } = useLocale();
  const { user } = useAuth();
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isTenantUser = user?.user_metadata?.is_tenant_user;
  
  // Fetch maintenance requests
  const { data: requests = [], refetch } = useQuery({
    queryKey: ['maintenance_requests'],
    queryFn: async () => {
      console.log("Starting maintenance requests fetch...");
      
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
      
      console.log("Raw data from Supabase:", data);
      
      // Log the structure of the first item to debug
      if (data && data.length > 0) {
        console.log("First request structure:", {
          id: data[0].id,
          issue: data[0].issue,
          tenant_id: data[0].tenant_id,
          tenants: data[0].tenants,
          description: data[0].description
        });
      }
      
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
    <div className="min-h-screen bg-background">
      <AppSidebar isTenant={isTenantUser} isCollapsed={sidebarCollapsed} setIsCollapsed={setSidebarCollapsed} />
      <div className={cn(
        "p-3 sm:p-6 md:p-8 pt-24 md:pt-8 transition-all duration-300",
        sidebarCollapsed ? "md:ml-[80px]" : "md:ml-[270px]"
      )}>
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
    </div>
  );
};

export default MaintenanceRequestList;
