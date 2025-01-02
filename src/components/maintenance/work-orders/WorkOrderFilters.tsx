import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, SortAsc, SortDesc } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface WorkOrderFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  sortBy: "date" | "cost";
  setSortBy: (value: "date" | "cost") => void;
}

export const WorkOrderFilters = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy
}: WorkOrderFiltersProps) => {
  return (
    <div className="space-y-4 mb-6 animate-fade-in">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search input */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-500" />
          </div>
          <Input
            placeholder="Search by title or property..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] transition-all duration-200 hover:border-primary">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <span className="flex items-center gap-2">
                  All statuses
                  <Badge variant="outline" className="ml-2">
                    All
                  </Badge>
                </span>
              </SelectItem>
              <SelectItem value="In Progress">
                <span className="flex items-center gap-2">
                  In Progress
                  <Badge className="bg-blue-600">Active</Badge>
                </span>
              </SelectItem>
              <SelectItem value="Scheduled">
                <span className="flex items-center gap-2">
                  Scheduled
                  <Badge className="bg-orange-500">Pending</Badge>
                </span>
              </SelectItem>
              <SelectItem value="Completed">
                <span className="flex items-center gap-2">
                  Completed
                  <Badge className="bg-green-600">Done</Badge>
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort selection */}
        <div className="flex items-center gap-2">
          {sortBy === "date" ? (
            <SortAsc className="h-4 w-4 text-gray-500" />
          ) : (
            <SortDesc className="h-4 w-4 text-gray-500" />
          )}
          <Select value={sortBy} onValueChange={(value: "date" | "cost") => setSortBy(value)}>
            <SelectTrigger className="w-[180px] transition-all duration-200 hover:border-primary">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Sort by date</SelectItem>
              <SelectItem value="cost">Sort by cost</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};