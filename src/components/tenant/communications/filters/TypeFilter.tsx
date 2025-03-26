
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TypeFilterProps {
  value: string | null;
  onChange: (value: string) => void;
  types: string[];
  placeholder?: string;
}

export const TypeFilter = ({ value, onChange, types, placeholder = "Filter by type" }: TypeFilterProps) => {
  console.log("TypeFilter - Current value:", value);
  console.log("TypeFilter - Available types:", types);

  // Filtrer les types pour éliminer les chaînes vides
  const filteredTypes = types.filter(type => type && type.trim() !== "");

  return (
    <Select 
      value={value || undefined} 
      onValueChange={onChange}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {filteredTypes.map((type) => (
          <SelectItem key={type} value={type}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
