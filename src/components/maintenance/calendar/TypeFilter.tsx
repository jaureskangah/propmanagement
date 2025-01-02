import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TypeFilterProps {
  selectedType: string;
  onTypeChange: (value: string) => void;
}

export const TypeFilter = ({ selectedType, onTypeChange }: TypeFilterProps) => {
  return (
    <Select value={selectedType} onValueChange={onTypeChange}>
      <SelectTrigger className="w-[140px] sm:w-[180px]">
        <SelectValue placeholder="Task type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All tasks</SelectItem>
        <SelectItem value="regular">Regular tasks</SelectItem>
        <SelectItem value="inspection">Inspections</SelectItem>
        <SelectItem value="seasonal">Seasonal tasks</SelectItem>
      </SelectContent>
    </Select>
  );
};