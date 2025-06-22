
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
  
  // Fetch maintenance requests with tenant data using a more reliable approach
  const { data: requests = [], refetch } = useQuery({
    queryKey: ['maintenance_requests'],
    queryFn: async () => {
      console.log("Starting maintenance requests fetch...");
      
      // First, get maintenance requests
      const { data: maintenanceData, error: maintenanceError } = await supabase
        .from('maintenance_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (maintenanceError) {
        console.error("Error fetching maintenance requests:", maintenanceError);
        throw maintenanceError;
      }
      
      console.log("Raw maintenance data:", maintenanceData);
      
      if (!maintenanceData || maintenanceData.length === 0) {
        return [];
      }
      
      // Get unique tenant IDs
      const tenantIds = [...new Set(maintenanceData.map(req => req.tenant_id).filter(Boolean))];
      console.log("Tenant IDs to fetch:", tenantIds);
      
      // Fetch tenant data separately
      const { data: tenantsData, error: tenantsError } = await supabase
        .from('tenants')
        .select(`
          id,
          name,
          unit_number,
          properties (
            name
          )
        `)
        .in('id', tenantIds);
      
      if (tenantsError) {
        console.error("Error fetching tenants:", tenantsError);
        // Continue without tenant data rather than failing completely
      }
      
      console.log("Tenants data:", tenantsData);
      
      // Create a lookup map for tenant data
      const tenantLookup = {};
      if (tenantsData) {
        tenantsData.forEach(tenant => {
          tenantLookup[tenant.id] = tenant;
        });
      }
      
      console.log("Tenant lookup:", tenantLookup);
      
      // Transform the data to include flat tenant fields
      const transformedData = maintenanceData.map(request => {
        const tenant = tenantLookup[request.tenant_id];
        const result = {
          ...request,
          tenant_name: tenant?.name || null,
          property_name: tenant?.properties?.name || null,
          tenant_unit_number: tenant?.unit_number || null
        };
        
        console.log(`Transformed request ${request.id}:`, {
          tenant_id: request.tenant_id,
          tenant_name: result.tenant_name,
          property_name: result.property_name,
          tenant_unit_number: result.tenant_unit_number
        });
        
        return result;
      });
      
      console.log("Final transformed data:", transformedData);
      return transformedData;
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
