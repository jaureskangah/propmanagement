
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { MaintenanceRequest } from "@/types/tenant";
import { useAuth } from "@/components/AuthProvider";
import { useLocale } from "@/components/providers/LocaleProvider";

export const useTenantMaintenance = () => {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "priority">("newest");
  const { session } = useAuth();
  const { toast } = useToast();
  const { t } = useLocale();

  // Filtered requests
  const filteredRequests = requests.filter(request => {
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    const matchesSearch = searchQuery === "" || 
      request.issue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (request.description && request.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    } else if (sortBy === "oldest") {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    } else if (sortBy === "priority") {
      const priorityOrder = { Urgent: 0, High: 1, Medium: 2, Low: 3 };
      return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
    }
    return 0;
  });

  // Statistics
  const totalRequests = requests.length;
  const pendingRequests = requests.filter(r => r.status === "Pending").length;
  const resolvedRequests = requests.filter(r => r.status === "Resolved").length;

  useEffect(() => {
    if (session?.user) {
      fetchTenantId();
    }
  }, [session?.user]);

  useEffect(() => {
    if (tenantId) {
      fetchMaintenanceRequests();
      setupRealtimeSubscription();
    }
  }, [tenantId]);

  const fetchTenantId = async () => {
    try {
      const { data: tenant, error } = await supabase
        .from('tenants')
        .select('id')
        .eq('tenant_profile_id', session?.user?.id)
        .maybeSingle();

      if (error) throw error;
      
      if (tenant) {
        console.log("Found tenant ID:", tenant.id);
        setTenantId(tenant.id);
      } else {
        console.log("No tenant found for user:", session?.user?.id);
        toast({
          title: t('error'),
          description: t('notLinkedToTenant'),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching tenant ID:', error);
      toast({
        title: t('error'),
        description: t('errorLoadingTenant'),
        variant: "destructive",
      });
    }
  };

  const fetchMaintenanceRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      console.log("Fetched maintenance requests:", data);
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching maintenance requests:', error);
      toast({
        title: t('error'),
        description: t('errorLoadingRequests'),
        variant: "destructive",
      });
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('maintenance_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'maintenance_requests',
          filter: `tenant_id=eq.${tenantId}`
        },
        (payload) => {
          console.log("Realtime notification received:", payload);
          if (payload.eventType === 'UPDATE' && payload.new.status !== payload.old.status) {
            toast({
              title: t('maintenanceNotification'),
              description: `${t('maintenanceRequestTitle')} "${payload.new.issue}" ${t('statusChanged')} ${payload.new.status}`,
            });
          }
          fetchMaintenanceRequests();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleMaintenanceUpdate = async () => {
    await fetchMaintenanceRequests();
  };

  const handleViewDetails = (request: MaintenanceRequest) => {
    setSelectedRequest(request);
    setIsDetailSheetOpen(true);
  };

  return {
    requests: filteredRequests,
    totalRequests,
    pendingRequests,
    resolvedRequests,
    tenantId,
    isAddDialogOpen,
    setIsAddDialogOpen,
    selectedRequest,
    isDetailSheetOpen,
    setIsDetailSheetOpen,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    handleMaintenanceUpdate,
    handleViewDetails
  };
};
