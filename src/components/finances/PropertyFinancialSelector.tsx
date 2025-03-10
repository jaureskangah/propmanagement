
import { Building2 } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocale } from "@/components/providers/LocaleProvider";

interface Property {
  id: string;
  name: string;
}

interface PropertyFinancialSelectorProps {
  properties: Property[];
  isLoading: boolean;
  selectedPropertyId: string | null;
  onPropertySelect: (propertyId: string) => void;
}

export default function PropertyFinancialSelector({
  properties,
  isLoading,
  selectedPropertyId,
  onPropertySelect
}: PropertyFinancialSelectorProps) {
  const { t } = useLocale();

  if (isLoading) {
    return <Skeleton className="h-10 w-[200px]" />;
  }

  if (properties.length === 0) {
    return (
      <div className="text-sm text-muted-foreground flex items-center gap-2 p-2 bg-muted/50 rounded-md">
        <Building2 className="h-4 w-4" />
        {t('noPropertiesAvailable')}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Building2 className="h-5 w-5 text-muted-foreground" />
      <Select 
        value={selectedPropertyId || undefined} 
        onValueChange={onPropertySelect}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder={t('selectProperty')} />
        </SelectTrigger>
        <SelectContent>
          {properties.map((property) => (
            <SelectItem key={property.id} value={property.id}>
              {property.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
