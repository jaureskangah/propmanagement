
import React, { useState, useEffect } from "react";
import { MaintenanceMetricsSection } from "./metrics/MaintenanceMetricsSection";
import { MaintenanceTabs } from "./tabs/MaintenanceTabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useIsMobile } from "@/hooks/use-mobile";
import MaintenancePageHeader from "./header/MaintenancePageHeader";
import { AddTaskDialog } from "./task-dialog/AddTaskDialog";
import { useToast } from "@/hooks/use-toast";
import { NewTask } from "./types";
import { VendorList } from "./vendors/VendorList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTaskAddition } from "./tasks/hooks/useTaskAddition";
import { useNavigate } from "react-router-dom";

export const MaintenancePageContainer = () => {
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState("requests");
  const isMobile = useIsMobile();
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const { toast } = useToast();
  const { handleAddTask } = useTaskAddition();
  const navigate = useNavigate();
  
  // State for selected property
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("");
  const [isLoadingProperty, setIsLoadingProperty] = useState(true);
  
  const savedYear = localStorage.getItem('selectedYear') ? 
    parseInt(localStorage.getItem('selectedYear') || '') : new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(savedYear);

  // Fetch user's first property
  useEffect(() => {
    const fetchUserProperty = async () => {
      try {
        console.log("MaintenancePageContainer - Fetching user's first property...");
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.log("MaintenancePageContainer - No user found");
          setIsLoadingProperty(false);
          return;
        }

        const { data: properties, error } = await supabase
          .from('properties')
          .select('id, name')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true })
          .limit(1);

        if (error) {
          console.error("MaintenancePageContainer - Error fetching user property:", error);
          const savedPropertyId = localStorage.getItem('selectedPropertyId') || "";
          setSelectedPropertyId(savedPropertyId);
        } else if (properties && properties.length > 0) {
          const firstProperty = properties[0];
          console.log("MaintenancePageContainer - Found user's first property:", firstProperty);
          setSelectedPropertyId(firstProperty.id);
          localStorage.setItem('selectedPropertyId', firstProperty.id);
        } else {
          console.log("MaintenancePageContainer - No properties found for user");
          const savedPropertyId = localStorage.getItem('selectedPropertyId') || "";
          setSelectedPropertyId(savedPropertyId);
        }
      } catch (error) {
        console.error("MaintenancePageContainer - Exception fetching user property:", error);
        const savedPropertyId = localStorage.getItem('selectedPropertyId') || "";
        setSelectedPropertyId(savedPropertyId);
      } finally {
        setIsLoadingProperty(false);
      }
    };

    fetchUserProperty();
  }, []);
  
  useEffect(() => {
    if (selectedPropertyId) {
      localStorage.setItem('selectedPropertyId', selectedPropertyId);
    }
    localStorage.setItem('selectedYear', selectedYear.toString());
  }, [selectedPropertyId, selectedYear]);
  
  // Fetch maintenance requests with error handling
  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['maintenance_requests_container'],
    queryFn: async () => {
      try {
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
          console.error("MaintenancePageContainer - Error fetching requests:", error);
          return [];
        }
        return data || [];
      } catch (error) {
        console.error("MaintenancePageContainer - Exception fetching requests:", error);
        return [];
      }
    },
    retry: false,
  });

  const handleViewAllRequests = () => {
    navigate('/maintenance-requests');
  };

  const handleCreateTask = () => {
    console.log("Create task clicked in MaintenancePageContainer");
    setIsAddTaskOpen(true);
  };

  const handleAddTaskFromDialog = async (newTask: NewTask): Promise<any> => {
    console.log("Task to be added:", newTask);
    try {
      const taskWithCorrectProperty = {
        ...newTask,
        property_id: selectedPropertyId || newTask.property_id
      };
      
      const result = await handleAddTask(taskWithCorrectProperty);
      console.log("Task added successfully:", result);
      toast({
        title: t('success'),
        description: t('taskAdded'),
      });
      return result;
    } catch (error) {
      console.error("Error adding task:", error);
      toast({
        title: t('error'),
        description: t('errorAddingTask'),
        variant: "destructive",
      });
      throw error;
    }
  };

  const handlePropertySelect = (propertyId: string) => {
    console.log("Selected property:", propertyId);
    setSelectedPropertyId(propertyId);
  };

  const handleYearChange = (year: number) => {
    console.log("Selected year:", year);
    setSelectedYear(year);
  };

  // Filter for active requests
  const filteredRequests = Array.isArray(requests) 
    ? requests.filter(request => request?.status !== "Resolved" && request?.status !== "Cancelled")
    : [];

  const urgentRequests = Array.isArray(requests) 
    ? requests.filter(r => r?.priority === "Urgent").length 
    : 0;

  if (isLoadingProperty) {
    return (
      <div className="space-y-6 font-sans">
        <div className="text-center py-8">
          <p className="text-muted-foreground">{t('loadingProperties')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      <MaintenancePageHeader 
        totalRequests={requests.length} 
        pendingRequests={requests.filter(r => r?.status === "Pending").length}
        resolvedRequests={requests.filter(r => r?.status === "Resolved").length}
        urgentRequests={urgentRequests}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        isMobile={isMobile}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onCreateTask={handleCreateTask}
        onPropertySelect={handlePropertySelect}
        onYearChange={handleYearChange}
        selectedPropertyId={selectedPropertyId}
        selectedYear={selectedYear}
      />
      
      <div className="flex justify-start items-center">
        <Button 
          onClick={handleCreateTask}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t('addTask')}
        </Button>
      </div>

      <MaintenanceMetricsSection 
        totalRequests={requests.length} 
        pendingRequests={requests.filter(r => r?.status === "Pending").length}
        resolvedRequests={requests.filter(r => r?.status === "Resolved").length}
        urgentRequests={urgentRequests}
        propertyId={selectedPropertyId}
        selectedYear={selectedYear}
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
            propertyId={selectedPropertyId} 
            selectedYear={selectedYear}
            filteredRequests={filteredRequests}
            onRequestClick={() => {
              navigate('/maintenance-requests');
            }}
            onViewAllRequests={handleViewAllRequests}
          />
        </TabsContent>
        
        <TabsContent value="vendors" className="pt-4">
          <VendorList />
        </TabsContent>
      </Tabs>

      <AddTaskDialog
        onAddTask={handleAddTaskFromDialog}
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        initialPropertyId={selectedPropertyId}
      />
    </div>
  );
};
