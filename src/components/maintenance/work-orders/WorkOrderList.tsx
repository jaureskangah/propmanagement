
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Wrench,
  FileImage,
  CheckSquare,
  Plus,
  Search,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building,
  Home,
  DollarSign
} from "lucide-react";
import { WorkOrder } from "@/types/workOrder";

interface WorkOrderListProps {
  workOrders: WorkOrder[];
  onCreateWorkOrder: () => void;
}

const getStatusConfig = (status: string) => {
  switch (status) {
    case "In Progress":
      return {
        variant: "default" as const,
        icon: <AlertCircle className="h-4 w-4 mr-1" />,
        className: "bg-blue-500"
      };
    case "Scheduled":
      return {
        variant: "secondary" as const,
        icon: <Clock className="h-4 w-4 mr-1" />,
        className: "bg-orange-500"
      };
    case "Completed":
      return {
        variant: "outline" as const,
        icon: <CheckCircle2 className="h-4 w-4 mr-1" />,
        className: "bg-green-500 text-white"
      };
    default:
      return {
        variant: "default" as const,
        icon: <Wrench className="h-4 w-4 mr-1" />,
        className: ""
      };
  }
};

export const WorkOrderList = ({ workOrders, onCreateWorkOrder }: WorkOrderListProps) => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "cost">("date");

  const filteredAndSortedOrders = React.useMemo(() => {
    if (!workOrders) return [];
    
    return workOrders
      .filter((order) => {
        const matchesStatus = statusFilter === "all" || order.status === statusFilter;
        const matchesSearch =
          order.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.property?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "date") {
          return (b.date || "").localeCompare(a.date || "");
        } else {
          return (b.cost || 0) - (a.cost || 0);
        }
      });
  }, [workOrders, statusFilter, searchQuery, sortBy]);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Work Orders</h2>
        <Button onClick={onCreateWorkOrder} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Order
        </Button>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-3 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search by title or property..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Scheduled">Scheduled</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(value: "date" | "cost") => setSortBy(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="cost">Cost</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAndSortedOrders.map((order) => {
          const statusConfig = getStatusConfig(order.status);
          return (
            <Card key={order.id}>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{order.title}</h3>
                    <Wrench className="h-5 w-5 text-blue-500" />
                  </div>
                  {order.property && (
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-gray-500" />
                      <p><strong>Property:</strong> {order.property}</p>
                    </div>
                  )}
                  {order.unit && (
                    <div className="flex items-center gap-2">
                      <Home className="h-4 w-4 text-gray-500" />
                      <p><strong>Unit:</strong> {order.unit}</p>
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={statusConfig.className}>
                      <div className="flex items-center">
                        {statusConfig.icon}
                        {order.status}
                      </div>
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wrench className="h-4 w-4 text-gray-500" />
                    <p><strong>Vendor:</strong> {order.vendor}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <p><strong>Cost:</strong> ${order.cost}</p>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm">
                      <FileImage className="h-4 w-4 mr-2" />
                      Photos
                    </Button>
                    <Button variant="outline" size="sm">
                      <CheckSquare className="h-4 w-4 mr-2" />
                      Update
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
};
