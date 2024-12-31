import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface TenantSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export const TenantSearch = ({ value, onChange }: TenantSearchProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search tenants..."
        className="pl-9"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};