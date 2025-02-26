
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
import { useLocale } from "@/components/providers/LocaleProvider";

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
        className: "bg-blue-500/90"
      };
    case "Scheduled":
      return {
        variant: "secondary" as const,
        icon: <Clock className="h-4 w-4 mr-1" />,
        className: "bg-orange-500/90"
      };
    case "Completed":
      return {
        variant: "outline" as const,
        icon: <CheckCircle2 className="h-4 w-4 mr-1" />,
        className: "bg-green-500/90 text-white"
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
  const { t } = useLocale();

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
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-card-foreground">{t('workOrders')}</h2>
        <Button 
          onClick={onCreateWorkOrder} 
          className="flex items-center gap-2 transition-all duration-300 hover:scale-105 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md hover:shadow-lg"
        >
          <Plus className="h-4 w-4" />
          {t('createOrder')}
        </Button>
      </div>

      <div className="space-y-4 animate-fade-in">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 transition-all duration-300 hover:border-primary focus:ring-2 focus:ring-primary/20 bg-background"
              />
            </div>
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] transition-all duration-300 hover:border-primary bg-background">
              <SelectValue placeholder={t('filterByStatus')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('allStatuses')}</SelectItem>
              <SelectItem value="In Progress">{t('statusInProgress')}</SelectItem>
              <SelectItem value="Scheduled">{t('statusPending')}</SelectItem>
              <SelectItem value="Completed">{t('statusCompleted')}</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(value: "date" | "cost") => setSortBy(value)}>
            <SelectTrigger className="w-[180px] transition-all duration-300 hover:border-primary bg-background">
              <SelectValue placeholder={t('sortBy')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">{t('date')}</SelectItem>
              <SelectItem value="cost">{t('cost')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAndSortedOrders.map((order) => {
          const statusConfig = getStatusConfig(order.status);
          return (
            <Card key={order.id} className="group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-border bg-card">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold group-hover:text-red-500 transition-colors duration-300">{order.title}</h3>
                    <Wrench className="h-5 w-5 text-red-500 transition-transform duration-300 group-hover:rotate-12" />
                  </div>
                  {order.property && (
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <p><strong>{t('property')}:</strong> {order.property}</p>
                    </div>
                  )}
                  {order.unit && (
                    <div className="flex items-center gap-2">
                      <Home className="h-4 w-4 text-muted-foreground" />
                      <p><strong>{t('unit')}:</strong> {order.unit}</p>
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={`${statusConfig.className} transition-all duration-300 shadow-sm`}>
                      <div className="flex items-center">
                        {statusConfig.icon}
                        {order.status}
                      </div>
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wrench className="h-4 w-4 text-muted-foreground" />
                    <p><strong>{t('vendor')}:</strong> {order.vendor}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <p><strong>{t('cost')}:</strong> ${order.cost}</p>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="transition-all duration-300 hover:scale-105"
                    >
                      <FileImage className="h-4 w-4 mr-2" />
                      {t('photos')}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="transition-all duration-300 hover:scale-105"
                    >
                      <CheckSquare className="h-4 w-4 mr-2" />
                      {t('update')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
