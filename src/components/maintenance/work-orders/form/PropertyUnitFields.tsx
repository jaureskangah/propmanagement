
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Building, Home } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
  const { data: properties = [], isLoading: propertiesLoading } = useQuery({
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
  const { data: tenants = [], isLoading: tenantsLoading } = useQuery({
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
    <div className="space-y-6">
      <Card className="border-blue-100">
        <CardContent className="pt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="property" className="flex items-center text-base font-medium">
                <Building className="h-4 w-4 mr-2 text-blue-500" />
                Propriété
              </Label>
              <Select
                value={propertyId || ''}
                onValueChange={setPropertyId}
              >
                <SelectTrigger className={propertiesLoading ? "animate-pulse" : ""}>
                  <SelectValue placeholder="Sélectionner une propriété" />
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
              <Label htmlFor="unit" className="flex items-center text-base font-medium">
                <Home className="h-4 w-4 mr-2 text-blue-500" />
                Unité
              </Label>
              <Select
                value={unit}
                onValueChange={setUnit}
                disabled={!propertyId || tenantsLoading}
              >
                <SelectTrigger className={tenantsLoading ? "animate-pulse" : ""}>
                  <SelectValue placeholder="Sélectionner une unité" />
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
