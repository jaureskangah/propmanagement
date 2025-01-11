import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TypeFilterProps {
  value: string | null;
  onChange: (value: string) => void;
  types: string[];
}

export const TypeFilter = ({ value, onChange, types }: TypeFilterProps) => {
  console.log("TypeFilter - Current value:", value);
  console.log("TypeFilter - Available types:", types);

  return (
    <Select 
      value={value || undefined} 
      onValueChange={onChange}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Filter by type" />
      </SelectTrigger>
      <SelectContent>
        {types.map((type) => (
          type && (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          )
        ))}
      </SelectContent>
    </Select>
  );
};