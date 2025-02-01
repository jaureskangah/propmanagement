import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import type { DateRange } from "@/types/tenant";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import { useNavigate } from "react-router-dom";
import AppSidebar from "@/components/AppSidebar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  console.log("Rendering Dashboard");
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showNewMessageDialog, setShowNewMessageDialog] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
  });

  // Query to check if user is a tenant
  const { data: profileData, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Query to fetch unread messages
  const { data: messagesData } = useQuery({
    queryKey: ["unread_messages", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tenant_communications")
        .select(`
          *,
          tenants (
            id,
            name,
            unit_number
          )
        `)
        .eq("status", "unread")
        .eq("is_from_tenant", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      console.log("Unread messages:", data);
      return data;
    },
    enabled: !!user && !profileData?.is_tenant_user,
  });

  useEffect(() => {
    if (messagesData && messagesData.length > 0) {
      setUnreadMessages(messagesData);
      setShowNewMessageDialog(true);
    }
  }, [messagesData]);

  // Redirect tenant users to maintenance page
  useEffect(() => {
    if (profileData?.is_tenant_user) {
      navigate("/maintenance");
    }
  }, [profileData, navigate]);

  const handleViewMessages = () => {
    setShowNewMessageDialog(false);
    // Navigate to the tenant's page with the communications tab selected
    if (unreadMessages.length > 0 && unreadMessages[0].tenants?.id) {
      console.log("Navigating to tenant communications:", unreadMessages[0].tenants.id);
      navigate(`/tenants?selected=${unreadMessages[0].tenants.id}&tab=communications`);
    } else {
      navigate("/tenants");
    }
  };

  const { data: propertiesData, isLoading: isLoadingProperties } = useQuery({
    queryKey: ["properties", user?.id, dateRange],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*, tenants(*)");
      if (error) throw error;
      console.log("Properties data:", data);
      return data;
    },
    enabled: !!user && !profileData?.is_tenant_user,
  });

  const { data: maintenanceData, isLoading: isLoadingMaintenance } = useQuery({
    queryKey: ["maintenance_requests", user?.id, dateRange],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("maintenance_requests")
        .select("*");
      if (error) throw error;
      console.log("Maintenance data:", data);
      return data;
    },
    enabled: !!user && !profileData?.is_tenant_user,
  });

  const { data: tenantsData, isLoading: isLoadingTenants } = useQuery({
    queryKey: ["tenants", user?.id, dateRange],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tenants")
        .select("*");
      if (error) throw error;
      console.log("Tenants data:", data);
      return data;
    },
    enabled: !!user && !profileData?.is_tenant_user,
  });

  if (isLoadingProfile || isLoadingProperties) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    navigate("/");
    return null;
  }

  return (
    <>
      <div className="flex h-screen">
        <AppSidebar />
        <div className="flex-1 space-y-6 p-8 font-sans">
          <DashboardHeader />
          
          <DashboardDateFilter onDateRangeChange={setDateRange} />

          <DashboardMetrics 
            propertiesData={propertiesData || []}
            maintenanceData={maintenanceData || []}
            tenantsData={tenantsData || []}
            dateRange={dateRange}
          />

          <RevenueChart />

          <RecentActivity />
        </div>
      </div>

      <Dialog open={showNewMessageDialog} onOpenChange={setShowNewMessageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Messages</DialogTitle>
            <DialogDescription>
              You have {unreadMessages.length} new unread message{unreadMessages.length > 1 ? 's' : ''} from your tenants:
              <ul className="mt-2 space-y-2">
                {unreadMessages.map((message) => (
                  <li key={message.id} className="text-sm">
                    <span className="font-semibold">
                      {message.tenants?.name} (Unit {message.tenants?.unit_number}):
                    </span>{' '}
                    {message.subject}
                  </li>
                ))}
              </ul>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewMessageDialog(false)}>
              Close
            </Button>
            <Button onClick={handleViewMessages}>
              View Messages
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Dashboard;