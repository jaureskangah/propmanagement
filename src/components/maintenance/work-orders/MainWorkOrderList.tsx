
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
  const safeWorkOrders = useMemo(() => workOrders.slice(0, 500), [workOrders]);

  const handleCreateWorkOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCreateDialogOpen(true);
    onCreateWorkOrder(); 
  };

  const handleDialogClose = () => {
    setIsCreateDialogOpen(false);
  };

  const handleWorkOrderCreated = () => {
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

        <WorkOrderGrid orders={safeWorkOrders} />

        <CreateWorkOrderDialog
          isOpen={isCreateDialogOpen}
          onClose={handleDialogClose}
          onSuccess={handleWorkOrderCreated}
        />
      </TooltipProvider>
    </div>
  );
};
