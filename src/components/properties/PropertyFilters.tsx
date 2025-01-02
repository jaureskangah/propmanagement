import React from "react";
import { Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface PropertyFiltersProps {
  selectedType: string;
  setSelectedType: (value: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  propertyTypes: readonly string[];
}

const PropertyFilters = ({
  selectedType,
  setSelectedType,
  searchQuery,
  setSearchQuery,
  propertyTypes,
}: PropertyFiltersProps) => {
  return (
    <div className="bg-slate-50 p-6 rounded-xl shadow-sm mb-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-64">
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full bg-white border-slate-200 hover:bg-slate-50 transition-colors">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              {propertyTypes.map((type) => (
                <SelectItem
                  key={type}
                  value={type}
                  className="hover:bg-slate-100 cursor-pointer"
                >
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search by name or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full bg-white border-slate-200 focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:border-slate-300"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyFilters;