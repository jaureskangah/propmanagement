import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ExpensesFiltersProps {
  period: string;
  setPeriod: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

export const ExpensesFilters = ({
  period,
  setPeriod,
  sortBy,
  setSortBy,
  searchQuery,
  setSearchQuery,
}: ExpensesFiltersProps) => {
  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Period Filter */}
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Periods</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date-desc">Date (Recent)</SelectItem>
            <SelectItem value="date-asc">Date (Oldest)</SelectItem>
            <SelectItem value="amount-desc">Amount (High)</SelectItem>
            <SelectItem value="amount-asc">Amount (Low)</SelectItem>
            <SelectItem value="category">Category</SelectItem>
          </SelectContent>
        </Select>

        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-3 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search expenses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      </div>
    </div>
  );
};