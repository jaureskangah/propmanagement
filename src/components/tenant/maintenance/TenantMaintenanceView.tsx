
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Filter, Search } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { MaintenanceRequest } from "@/types/tenant";
import { useAuth } from '@/components/AuthProvider';
import { MaintenanceList } from "./components/MaintenanceList";
import { AddMaintenanceDialog } from "./AddMaintenanceDialog";
import { MaintenanceFilters } from "./components/MaintenanceFilters";
import { MaintenanceDetailSheet } from "./components/MaintenanceDetailSheet"; 
import { useLocale } from "@/components/providers/LocaleProvider";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export const TenantMaintenanceView = () => {
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

  if (!tenantId) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            {t('notLinkedToTenant')}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">{t('maintenanceRequestTitle')}</CardTitle>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-[#ea384c] hover:bg-[#ea384c]/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t('addNewTask')}
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-blue-50 dark:bg-blue-900/20">
            <CardContent className="p-4 flex flex-col items-center">
              <p className="font-semibold text-lg">{totalRequests}</p>
              <p className="text-sm text-muted-foreground">{t('totalRequests')}</p>
            </CardContent>
          </Card>
          <Card className="bg-yellow-50 dark:bg-yellow-900/20">
            <CardContent className="p-4 flex flex-col items-center">
              <p className="font-semibold text-lg">{pendingRequests}</p>
              <p className="text-sm text-muted-foreground">{t('pendingRequests')}</p>
            </CardContent>
          </Card>
          <Card className="bg-green-50 dark:bg-green-900/20">
            <CardContent className="p-4 flex flex-col items-center">
              <p className="font-semibold text-lg">{resolvedRequests}</p>
              <p className="text-sm text-muted-foreground">{t('resolvedRequests')}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('searchPlaceholder')}
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <MaintenanceFilters 
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </div>

        {/* List */}
        <MaintenanceList 
          requests={filteredRequests}
          onMaintenanceUpdate={handleMaintenanceUpdate}
          onViewDetails={handleViewDetails}
        />
      </CardContent>

      <AddMaintenanceDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        tenantId={tenantId}
        onSuccess={handleMaintenanceUpdate}
      />

      {selectedRequest && (
        <MaintenanceDetailSheet
          isOpen={isDetailSheetOpen}
          onClose={() => setIsDetailSheetOpen(false)}
          request={selectedRequest}
          onUpdate={handleMaintenanceUpdate}
          canRate={selectedRequest.status === "Resolved"}
        />
      )}
    </Card>
  );
};
