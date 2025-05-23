
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
import { Filter, Plus } from "lucide-react";
import { useTaskAddition } from "./tasks/hooks/useTaskAddition";
import { useNavigate } from "react-router-dom";
import { AddExpenseDialog } from "./financials/dialogs/AddExpenseDialog";

export const MaintenancePageContainer = () => {
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState("requests");
  const isMobile = useIsMobile();
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const { toast } = useToast();
  const { handleAddTask } = useTaskAddition();
  const navigate = useNavigate();
  
  // Get saved property and year from localStorage or use defaults
  const savedPropertyId = localStorage.getItem('selectedPropertyId') || "property-1";
  const savedYear = localStorage.getItem('selectedYear') ? 
    parseInt(localStorage.getItem('selectedYear') || '') : new Date().getFullYear();
  
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(savedPropertyId);
  const [selectedYear, setSelectedYear] = useState<number>(savedYear);
  
  // Ajoutons un useEffect pour vérifier la valeur de selectedPropertyId
  useEffect(() => {
    console.log("MaintenancePageContainer - selectedPropertyId:", selectedPropertyId);
    console.log("MaintenancePageContainer - selectedYear:", selectedYear);
    
    if (!selectedPropertyId) {
      console.warn("Warning: selectedPropertyId est vide dans MaintenancePageContainer");
    }
  }, [selectedPropertyId, selectedYear]);
  
  // Save selections to localStorage when they change
  useEffect(() => {
    localStorage.setItem('selectedPropertyId', selectedPropertyId);
    localStorage.setItem('selectedYear', selectedYear.toString());
  }, [selectedPropertyId, selectedYear]);
  
  // Fetch maintenance requests
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

  const handleViewAllRequests = () => {
    navigate('/maintenance-requests');
  };

  const handleCreateTask = () => {
    console.log("Create task clicked in MaintenancePageContainer");
    setIsAddTaskOpen(true);
  };
  
  const handleAddExpense = () => {
    console.log("Add expense clicked in MaintenancePageContainer");
    setIsAddExpenseOpen(true);
  };

  const handleAddTaskFromDialog = async (newTask: NewTask): Promise<any> => {
    console.log("Task to be added:", newTask);
    try {
      const result = await handleAddTask(newTask);
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
        onPropertySelect={handlePropertySelect}
        onYearChange={handleYearChange}
        selectedPropertyId={selectedPropertyId}
        selectedYear={selectedYear}
      />
      
      <div className="flex justify-between items-center">
        <Button 
          onClick={handleCreateTask}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t('addTask')}
        </Button>
        
        <Button 
          onClick={handleAddExpense}
          variant="outline"
          className="border-primary text-primary hover:bg-primary/10"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t('addExpense') || "Ajouter une dépense"}
        </Button>
      </div>

      <MaintenanceMetricsSection 
        totalRequests={requests.length} 
        pendingRequests={requests.filter(r => r.status === "Pending").length}
        resolvedRequests={requests.filter(r => r.status === "Resolved").length}
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
              // Navigate to the requests list instead of opening the dialog here
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
      
      <AddExpenseDialog
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        propertyId={selectedPropertyId}
      />
    </div>
  );
};
