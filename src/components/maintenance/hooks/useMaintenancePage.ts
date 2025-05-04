
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useTaskAddition } from "../tasks/hooks/useTaskAddition";
import { NewTask } from "../types";
import { useLocale } from "@/components/providers/LocaleProvider";

export function useMaintenancePage() {
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState("requests");
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
  
  // Save selections to localStorage when they change
  useEffect(() => {
    localStorage.setItem('selectedPropertyId', selectedPropertyId);
    localStorage.setItem('selectedYear', selectedYear.toString());
  }, [selectedPropertyId, selectedYear]);
  
  // Log values for debugging
  useEffect(() => {
    console.log("MaintenancePageContainer - selectedPropertyId:", selectedPropertyId);
    console.log("MaintenancePageContainer - selectedYear:", selectedYear);
    
    if (!selectedPropertyId) {
      console.warn("Warning: selectedPropertyId est vide dans MaintenancePageContainer");
    }
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

  return {
    requests,
    filteredRequests,
    isLoading,
    activeTab,
    setActiveTab,
    showFilters,
    setShowFilters,
    searchQuery,
    setSearchQuery,
    isAddTaskOpen,
    setIsAddTaskOpen,
    isAddExpenseOpen,
    setIsAddExpenseOpen,
    selectedPropertyId,
    selectedYear,
    pendingRequests: requests.filter(r => r.status === "Pending").length,
    resolvedRequests: requests.filter(r => r.status === "Resolved").length,
    urgentRequests,
    handleViewAllRequests,
    handleCreateTask,
    handleAddExpense,
    handleAddTaskFromDialog,
    handlePropertySelect,
    handleYearChange
  };
}
