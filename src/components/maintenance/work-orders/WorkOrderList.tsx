
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWorkOrderFilterState } from "./hooks/useWorkOrderFilterState";
import { useWorkOrderFiltering } from "./hooks/useWorkOrderFiltering";
import { WorkOrderFilters } from "./WorkOrderFilters";
import { WorkOrderTable } from "./components/WorkOrderTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { WorkOrderAdvancedFilters } from "./components/WorkOrderAdvancedFilters";

interface WorkOrderListProps {
  workOrders: any[];
  onAddOrder?: () => void;
}

export const WorkOrderList = ({ workOrders, onAddOrder }: WorkOrderListProps) => {
  const { t } = useLocale();
  const {
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    dateRange,
    setDateRange,
    priorityFilter,
    setPriorityFilter,
    vendorSearch,
    setVendorSearch
  } = useWorkOrderFilterState();

  const resetFilters = () => {
    setStatusFilter("all");
    setSearchQuery("");
    setSortBy("date");
    setDateRange({ from: undefined, to: undefined });
    setPriorityFilter("all");
    setVendorSearch("");
  };

  const filteredOrders = useWorkOrderFiltering(workOrders, {
    statusFilter,
    searchQuery,
    sortBy,
    dateRange,
    priorityFilter,
    vendorSearch
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Ordres de travail</CardTitle>
        {onAddOrder && (
          <Button onClick={onAddOrder} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nouvel ordre de travail
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <WorkOrderFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
        
        <WorkOrderAdvancedFilters
          dateRange={dateRange}
          setDateRange={setDateRange}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          vendorSearch={vendorSearch}
          setVendorSearch={setVendorSearch}
          resetFilters={resetFilters}
        />
        
        <WorkOrderTable workOrders={filteredOrders} />
      </CardContent>
    </Card>
  );
};
