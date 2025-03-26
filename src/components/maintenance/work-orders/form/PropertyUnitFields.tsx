import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface PropertyUnitFieldsProps {
  propertyId: string | null;
  setPropertyId: (value: string) => void;
  unit: string;
  setUnit: (value: string) => void;
}

export const PropertyUnitFields = ({
  propertyId,
  setPropertyId,
  unit,
  setUnit,
}: PropertyUnitFieldsProps) => {
  // Fetch properties
  const { data: properties = [] } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*');
      if (error) throw error;
      return data;
    },
  });

  // Fetch units for selected property
  const { data: tenants = [] } = useQuery({
    queryKey: ['tenants', propertyId],
    queryFn: async () => {
      if (!propertyId) return [];
      const { data, error } = await supabase
        .from('tenants')
        .select('unit_number')
        .eq('property_id', propertyId);
      if (error) throw error;
      return data;
    },
    enabled: !!propertyId,
  });

  // Get unique unit numbers
  const uniqueUnits = Array.from(new Set(tenants.map(t => t.unit_number)));

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="property">Property</Label>
        <Select
          value={propertyId || ''}
          onValueChange={setPropertyId}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a property" />
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

      <div className="space-y-2">
        <Label htmlFor="unit">Unit</Label>
        <Select
          value={unit}
          onValueChange={setUnit}
          disabled={!propertyId}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a unit" />
          </SelectTrigger>
          <SelectContent>
            {uniqueUnits.map((unitNumber) => (
              <SelectItem key={unitNumber} value={unitNumber}>
                {unitNumber}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};