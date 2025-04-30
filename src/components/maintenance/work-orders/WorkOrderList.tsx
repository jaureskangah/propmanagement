
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWorkOrderFilterState } from "./hooks/useWorkOrderFilterState";
import { useWorkOrderFiltering } from "./hooks/useWorkOrderFiltering";
import { WorkOrderFilters } from "./WorkOrderFilters";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { WorkOrderAdvancedFilters } from "./components/WorkOrderAdvancedFilters";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";

interface WorkOrderListProps {
  workOrders: any[];
  onAddOrder?: () => void;
}

export const WorkOrderList = ({ workOrders, onAddOrder }: WorkOrderListProps) => {
  const isMobile = useIsMobile();
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
    <TooltipProvider>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Ordres de travail</CardTitle>
          {onAddOrder && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={onAddOrder} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  {!isMobile && "Nouvel ordre de travail"}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Créer un nouvel ordre de travail</p>
              </TooltipContent>
            </Tooltip>
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
            dateRange={dateRange}
            setDateRange={setDateRange}
            priorityFilter={priorityFilter}
            setPriorityFilter={setPriorityFilter}
            vendorSearch={vendorSearch}
            setVendorSearch={setVendorSearch}
          />
          
          {!isMobile && (
            <WorkOrderAdvancedFilters
              dateRange={dateRange}
              setDateRange={setDateRange}
              priorityFilter={priorityFilter}
              setPriorityFilter={setPriorityFilter}
              vendorSearch={vendorSearch}
              setVendorSearch={setVendorSearch}
              resetFilters={resetFilters}
            />
          )}
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-2 border-b">Titre</th>
                  <th className="text-left p-2 border-b">Propriété</th>
                  <th className="text-left p-2 border-b">Statut</th>
                  <th className="text-left p-2 border-b">Priorité</th>
                  <th className="text-left p-2 border-b">Prestataire</th>
                  <th className="text-left p-2 border-b">Coût</th>
                  <th className="text-left p-2 border-b">Date</th>
                  <th className="text-left p-2 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-muted/50">
                    <td className="p-2 border-b">{order.title}</td>
                    <td className="p-2 border-b">{order.property || '-'}</td>
                    <td className="p-2 border-b">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        order.status === "En cours" ? "bg-blue-100 text-blue-800" :
                        order.status === "Planifié" ? "bg-amber-100 text-amber-800" :
                        order.status === "Terminé" ? "bg-green-100 text-green-800" :
                        "bg-gray-100 text-gray-800"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-2 border-b">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        order.priority === "Haute" ? "bg-red-100 text-red-800" :
                        order.priority === "Moyenne" ? "bg-amber-100 text-amber-800" :
                        "bg-blue-100 text-blue-800"
                      }`}>
                        {order.priority}
                      </span>
                    </td>
                    <td className="p-2 border-b">{order.vendor}</td>
                    <td className="p-2 border-b">${order.cost.toLocaleString()}</td>
                    <td className="p-2 border-b">{order.date ? new Date(order.date).toLocaleDateString() : '-'}</td>
                    <td className="p-2 border-b">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="sm">Voir</Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Afficher les détails de l'ordre</p>
                        </TooltipContent>
                      </Tooltip>
                    </td>
                  </tr>
                ))}
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-4 text-muted-foreground">
                      Aucun ordre de travail trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};
