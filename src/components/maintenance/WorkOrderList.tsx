import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wrench, FileImage, CheckSquare, Plus, Search } from "lucide-react";

// Types
interface WorkOrder {
  id: number;
  title: string;
  property: string;
  unit: string;
  status: string;
  vendor: string;
  cost: number;
  date?: string; // Adding date field for sorting
}

interface WorkOrderListProps {
  workOrders: WorkOrder[];
  onCreateWorkOrder: () => void;
}

export const WorkOrderList = ({ workOrders, onCreateWorkOrder }: WorkOrderListProps) => {
  // State for filters and search
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "cost">("date");

  // Filter and sort work orders
  const filteredAndSortedOrders = useMemo(() => {
    return workOrders
      .filter((order) => {
        const matchesStatus = statusFilter === "all" || order.status === statusFilter;
        const matchesSearch = 
          order.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.property.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "date") {
          return (b.date || "").localeCompare(a.date || "");
        } else {
          return b.cost - a.cost;
        }
      });
  }, [workOrders, statusFilter, searchQuery, sortBy]);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Ordres de Travail</h2>
        <Button onClick={onCreateWorkOrder} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Créer un Ordre
        </Button>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search input */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-3 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Rechercher par titre ou propriété..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {/* Status filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="En cours">En cours</SelectItem>
              <SelectItem value="Planifié">Planifié</SelectItem>
              <SelectItem value="Terminé">Terminé</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort selection */}
          <Select value={sortBy} onValueChange={(value: "date" | "cost") => setSortBy(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="cost">Coût</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAndSortedOrders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{order.title}</CardTitle>
                <Wrench className="h-5 w-5 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Propriété:</strong> {order.property}</p>
                <p><strong>Unité:</strong> {order.unit}</p>
                <p><strong>Statut:</strong> {order.status}</p>
                <p><strong>Prestataire:</strong> {order.vendor}</p>
                <p><strong>Coût:</strong> {order.cost}€</p>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm">
                    <FileImage className="h-4 w-4 mr-2" />
                    Photos
                  </Button>
                  <Button variant="outline" size="sm">
                    <CheckSquare className="h-4 w-4 mr-2" />
                    Mettre à jour
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};