
import React, { useState } from "react";
import { MaintenanceHeader } from "./header/MaintenanceHeader";
import { MaintenanceMetricsSection } from "./metrics/MaintenanceMetricsSection";
import { MaintenanceTabs } from "./tabs/MaintenanceTabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Separator } from "@/components/ui/separator";
import { VendorList } from "./vendors/VendorList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useIsMobile } from "@/hooks/use-mobile";
import MaintenancePageHeader from "./header/MaintenancePageHeader";
import { AddTaskDialog } from "./task-dialog/AddTaskDialog";
import { useToast } from "@/hooks/use-toast";
import { NewTask } from "./types";

export const MaintenancePageContainer = () => {
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState("requests");
  const isMobile = useIsMobile();
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const { toast } = useToast();
  
  // Mock data for the financial section
  const mockFinancialData = {
    propertyId: "property-1",
    expenses: [
      { category: "Plumbing", amount: 350, date: "2023-02-15" },
      { category: "Electrical", amount: 275, date: "2023-03-10" },
      { category: "HVAC", amount: 520, date: "2023-04-05" },
    ],
    maintenance: [
      {
        title: "Fix broken pipe",
        description: "Repair bathroom pipe leak",
        cost: 250,
        date: "2023-02-15",
        status: "Completed",
        unit_number: "2B",
        vendors: {
          name: "ABC Plumbing",
          specialty: "Plumbing"
        }
      },
      {
        title: "Replace light fixtures",
        description: "Install new LED fixtures in hallway",
        cost: 175,
        date: "2023-03-08",
        status: "Scheduled",
        unit_number: "5A",
        vendors: {
          name: "ElectriCity",
          specialty: "Electrical"
        }
      },
    ]
  };

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['maintenance_requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const handleRequestClick = (request) => {
    console.log("Request clicked:", request);
    // Handle request click (could open a modal, etc.)
  };

  const handleCreateTask = () => {
    console.log("Create task clicked in MaintenancePageContainer");
    setIsAddTaskOpen(true);
  };

  const handleAddTask = (newTask: NewTask) => {
    console.log("Task added:", newTask);
    toast({
      title: t('success'),
      description: t('taskAdded'),
    });
    setIsAddTaskOpen(false);
  };

  // Filter for active requests
  const filteredRequests = requests.filter(request => 
    request.status !== "Resolved" && request.status !== "Cancelled"
  );

  // Calculate urgent requests count
  const urgentRequests = requests.filter(r => r.priority === "Urgent").length;

  return (
    <div className="space-y-6 font-sans">
      <MaintenancePageHeader 
        totalRequests={requests.length} 
        pendingRequests={requests.filter(r => r.status === "Pending").length}
        resolvedRequests={requests.filter(r => r.status === "Resolved").length}
        urgentRequests={urgentRequests}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        isMobile={isMobile}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onCreateTask={handleCreateTask}
      />

      <MaintenanceMetricsSection 
        totalRequests={requests.length} 
        pendingRequests={requests.filter(r => r.status === "Pending").length}
        resolvedRequests={requests.filter(r => r.status === "Resolved").length}
        urgentRequests={urgentRequests}
      />

      <Tabs defaultValue="maintenance" className="w-full">
        <TabsList className={`w-full ${isMobile ? "flex flex-wrap" : "grid grid-cols-2"}`}>
          <TabsTrigger value="maintenance" className={`${isMobile ? "flex-1" : ""} font-sans text-sm`}>
            {t('maintenanceAndRepairs')}
          </TabsTrigger>
          <TabsTrigger value="vendors" className={`${isMobile ? "flex-1" : ""} font-sans text-sm`}>
            {t('vendors')}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="maintenance" className="pt-4">
          <MaintenanceTabs 
            propertyId="property-1" 
            mockFinancialData={mockFinancialData}
            filteredRequests={filteredRequests}
            onRequestClick={handleRequestClick}
          />
        </TabsContent>
        
        <TabsContent value="vendors" className="pt-4">
          <VendorList />
        </TabsContent>
      </Tabs>

      <AddTaskDialog
        onAddTask={handleAddTask}
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
      />
    </div>
  );
};
