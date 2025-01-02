import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface TenantSearchProps {
  value: string;
  onChange: (value: string) => void;
  onFilterChange: (filters: SearchFilters) => void;
}

export interface SearchFilters {
  propertyId: string | null;
  leaseStatus: "all" | "active" | "expiring" | "expired";
}

export const TenantSearch = ({ value, onChange, onFilterChange }: TenantSearchProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    propertyId: null,
    leaseStatus: "all",
  });

  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  return (
    <div className="space-y-2">
      <div className="relative flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors duration-200" />
          <Input
            placeholder="Search tenants..."
            className="pl-9 pr-4 transition-all duration-200 focus-within:ring-2 focus-within:ring-primary/20"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          <div className="absolute inset-0 pointer-events-none transition-opacity duration-200">
            {value && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 animate-fade-in">
                <Badge variant="secondary" className="pointer-events-auto">
                  {value}
                </Badge>
              </div>
            )}
          </div>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
          className={`transition-colors duration-200 ${
            showFilters ? "bg-primary/10 text-primary" : ""
          }`}
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {showFilters && (
        <div className="p-4 border rounded-lg bg-background shadow-sm animate-fade-in space-y-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Lease Status</h4>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "all", label: "All" },
                { value: "active", label: "Active" },
                { value: "expiring", label: "Expiring Soon" },
                { value: "expired", label: "Expired" },
              ].map((status) => (
                <Badge
                  key={status.value}
                  variant={filters.leaseStatus === status.value ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/90"
                  onClick={() => handleFilterChange({ leaseStatus: status.value as SearchFilters["leaseStatus"] })}
                >
                  {status.label}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};