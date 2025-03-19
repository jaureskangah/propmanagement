
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { MaintenanceMetricsSection } from "@/components/maintenance/metrics/MaintenanceMetricsSection";
import { MaintenanceTabs } from "@/components/maintenance/tabs/MaintenanceTabs";
import AppSidebar from "@/components/AppSidebar";
import { useLocale } from "@/components/providers/LocaleProvider";
import { TenantMaintenanceView } from "@/components/tenant/maintenance/TenantMaintenanceView";
import { useAuth } from "@/components/AuthProvider";
import { useIsMobile } from "@/hooks/use-mobile";
import MaintenancePageHeader from "@/components/maintenance/header/MaintenancePageHeader";
import MaintenanceFiltersSection from "@/components/maintenance/filters/MaintenanceFiltersSection";
import { AddTaskDialog } from "@/components/maintenance/AddTaskDialog";
import { useToast } from "@/hooks/use-toast";
import { MaintenanceRequest, NewTask } from "@/components/maintenance/types";
import { MaintenanceRequestDialog } from "@/components/maintenance/request/MaintenanceRequestDialog";

const MAINTENANCE_STATUSES = [
  "All",
  "Pending",
  "In Progress",
  "Resolved"
] as const;

const MAINTENANCE_PRIORITIES = [
  "All",
  "Low",
  "Medium",
  "High",
  "Urgent"
] as const;

const fetchMaintenanceRequests = async () => {
  const { data, error } = await supabase
    .from('maintenance_requests')
    .select(`
      *,
      tenants (
        id,
        name,
        unit_number,
        properties (
          name
        )
      )
    `);
  
  if (error) throw error;
  return data;
};

const Maintenance = () => {
  const { t } = useLocale();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const isTenantUser = user?.user_metadata?.is_tenant_user;
  const { toast } = useToast();
  
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedPriority, setSelectedPriority] = useState<string>("All");
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
  
  const { data: requests = [], isLoading, refetch } = useQuery({
    queryKey: ['maintenance_requests'],
    queryFn: fetchMaintenanceRequests,
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestId = params.get('request');
    
    if (requestId) {
      // Trouver la demande correspondant à l'ID
      const request = requests.find(req => req.id === requestId);
      if (request) {
        setSelectedRequest(request);
      }
      
      const maintenanceSection = document.getElementById('maintenance-section');
      if (maintenanceSection) {
        maintenanceSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [requests]);

  const filteredRequests = requests.filter(request => {
    const statusMatch = selectedStatus === "All" || request.status === selectedStatus;
    const priorityMatch = selectedPriority === "All" || request.priority === selectedPriority;
    const searchMatch = searchQuery === "" || 
      request.issue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return statusMatch && priorityMatch && searchMatch;
  });

  const handleViewRequest = (request: MaintenanceRequest) => {
    setSelectedRequest(request);
  };

  const handleCloseRequestDialog = () => {
    setSelectedRequest(null);
    // Nettoyer l'URL si besoin
    if (window.location.search.includes('request=')) {
      const url = new URL(window.location.href);
      url.searchParams.delete('request');
      window.history.replaceState({}, '', url.toString());
    }
  };

  const totalRequests = requests.length;
  const pendingRequests = requests.filter(r => r.status === 'Pending').length;
  const resolvedRequests = requests.filter(r => r.status === 'Resolved').length;
  const urgentRequests = requests.filter(r => r.priority === 'Urgent').length;

  const mockFinancialData = {
    propertyId: "123e4567-e89b-12d3-a456-426614174000",
    expenses: [
      { category: "Utilities", amount: 500, date: "2024-03-01" },
      { category: "Insurance", amount: 300, date: "2024-03-05" },
    ],
    maintenance: [
      { description: "Plumbing repair", cost: 250, date: "2024-03-02" },
      { description: "HVAC maintenance", cost: 400, date: "2024-03-10" },
    ],
  };

  const handleCreateTask = () => {
    setIsAddTaskDialogOpen(true);
  };

  const handleAddTask = (task: NewTask) => {
    console.log("Adding task:", task);
    toast({
      title: t('success'),
      description: t('taskAdded'),
    });
    refetch();
    setIsAddTaskDialogOpen(false);
  };

  return (
    <div className="flex h-screen">
      <AppSidebar isTenant={isTenantUser} />
      <div className="flex-1 container mx-auto p-3 sm:p-4 md:p-6 font-sans overflow-y-auto">
        {isTenantUser ? (
          <div className="space-y-6">
            <TenantMaintenanceView />
          </div>
        ) : (
          <>
            <MaintenancePageHeader
              totalRequests={totalRequests}
              pendingRequests={pendingRequests}
              urgentRequests={urgentRequests}
              showFilters={showFilters}
              setShowFilters={setShowFilters}
              isMobile={isMobile}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onCreateTask={handleCreateTask}
            />
            
            <MaintenanceFiltersSection
              showFilters={showFilters}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              selectedPriority={selectedPriority}
              setSelectedPriority={setSelectedPriority}
              statuses={MAINTENANCE_STATUSES}
              priorities={MAINTENANCE_PRIORITIES}
            />
            
            <MaintenanceMetricsSection
              totalRequests={totalRequests}
              pendingRequests={pendingRequests}
              resolvedRequests={resolvedRequests}
              urgentRequests={urgentRequests}
            />
            
            <div id="maintenance-section">
              <MaintenanceTabs 
                propertyId={mockFinancialData.propertyId}
                mockFinancialData={mockFinancialData}
                filteredRequests={filteredRequests}
                onRequestClick={handleViewRequest}
              />
            </div>

            <AddTaskDialog 
              onAddTask={handleAddTask}
              isOpen={isAddTaskDialogOpen}
              onClose={() => setIsAddTaskDialogOpen(false)}
            />

            {selectedRequest && (
              <MaintenanceRequestDialog
                request={selectedRequest}
                onClose={handleCloseRequestDialog}
                onUpdateSuccess={refetch}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Maintenance;
