
import React, { useState, useMemo } from "react";
import { WorkOrderHeader } from "./components/WorkOrderHeader";
import { WorkOrderFilters } from "./WorkOrderFilters";
import { WorkOrderGrid } from "./components/WorkOrderGrid";
import { WorkOrder } from "@/types/workOrder";
import { CreateWorkOrderDialog } from "./CreateWorkOrderDialog";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { Info } from "lucide-react";

interface WorkOrderListProps {
  workOrders: WorkOrder[];
  onCreateWorkOrder: () => void;
}

export const WorkOrderList = ({ workOrders, onCreateWorkOrder }: WorkOrderListProps) => {
  const isMobile = useIsMobile();
  // State for filters and search
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "cost" | "priority">("date");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({ 
    from: undefined, 
    to: undefined 
  });
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [vendorSearch, setVendorSearch] = useState("");

  // Limit to 500 records to avoid memory issues
  const safeWorkOrders = workOrders.slice(0, 500);

  // Filter and sort work orders
  const filteredAndSortedOrders = useMemo(() => {
    return safeWorkOrders
      .filter((order) => {
        const matchesStatus = statusFilter === "all" || order.status === statusFilter;
        const matchesSearch = 
          order.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (order.property && order.property.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesVendor = 
          !vendorSearch || 
          (order.vendor && order.vendor.toLowerCase().includes(vendorSearch.toLowerCase()));
        const matchesPriority = 
          priorityFilter === "all" || 
          order.priority === priorityFilter;
        
        // Date range filter
        let matchesDateRange = true;
        if (dateRange.from && dateRange.to && order.date) {
          try {
            const orderDate = new Date(order.date);
            matchesDateRange = orderDate >= dateRange.from && orderDate <= dateRange.to;
          } catch (error) {
            console.error("Date parsing error:", error);
            matchesDateRange = true;
          }
        }
        
        return matchesStatus && matchesSearch && matchesVendor && matchesPriority && matchesDateRange;
      })
      .sort((a, b) => {
        if (sortBy === "date") {
          return new Date(b.date || "").getTime() - new Date(a.date || "").getTime();
        } else if (sortBy === "cost") {
          return (b.cost || 0) - (a.cost || 0);
        } else if (sortBy === "priority") {
          const priorityWeight = { "Haute": 3, "Moyenne": 2, "Basse": 1 };
          return (priorityWeight[b.priority as keyof typeof priorityWeight] || 0) - 
                 (priorityWeight[a.priority as keyof typeof priorityWeight] || 0);
        }
        return 0;
      });
  }, [safeWorkOrders, statusFilter, searchQuery, sortBy, dateRange, priorityFilter, vendorSearch]);

  const handleCreateWorkOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Bouton de création d'ordre de travail cliqué");
    setIsCreateDialogOpen(true);
    onCreateWorkOrder(); // Call the parent handler if needed
  };

  const handleDialogClose = () => {
    setIsCreateDialogOpen(false);
  };

  const handleWorkOrderCreated = () => {
    // This would typically trigger a refresh of the work orders list
    console.log("Work order created, refreshing list...");
    setIsCreateDialogOpen(false);
  };

  return (
    <div className="animate-fade-in">
      <TooltipProvider>
        <WorkOrderHeader onCreateWorkOrder={handleCreateWorkOrder} />

        <WorkOrderFilters 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          dateRange={dateRange}
          setDateRange={setDateRange}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          vendorSearch={vendorSearch}
          setVendorSearch={setVendorSearch}
        />

        <div className="mt-2 mb-4">
          {!isMobile && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Info className="h-4 w-4 mr-1" />
              <span>Utilisez les filtres ci-dessus pour affiner votre recherche d'ordres de travail</span>
            </div>
          )}
        </div>

        <WorkOrderGrid orders={filteredAndSortedOrders} />

        <CreateWorkOrderDialog
          isOpen={isCreateDialogOpen}
          onClose={handleDialogClose}
          onSuccess={handleWorkOrderCreated}
        />
      </TooltipProvider>
    </div>
  );
};
