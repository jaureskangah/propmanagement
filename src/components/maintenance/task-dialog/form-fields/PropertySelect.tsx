
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useLocale } from "@/components/providers/LocaleProvider";

interface PropertySelectProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
}

export const PropertySelect: React.FC<PropertySelectProps> = ({ value, onChange, label }) => {
  const { t } = useLocale();
  
  const { data: properties = [] } = useQuery({
    queryKey: ["properties"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*");
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="space-y-2">
      <Label htmlFor="property">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="property">
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
};
