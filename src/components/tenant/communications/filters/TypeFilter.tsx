import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TypeFilterProps {
  value: string | null;
  types: string[];
  onChange: (value: string | null) => void;
}

export const TypeFilter = ({ value, types, onChange }: TypeFilterProps) => {
  return (
    <Select
      value={value || ""}
      onValueChange={(value) => onChange(value || null)}
    >
      <SelectTrigger>
        <SelectValue placeholder="Filter by type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="">All types</SelectItem>
        {types.map((type) => (
          <SelectItem key={type} value={type}>
            {type}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};