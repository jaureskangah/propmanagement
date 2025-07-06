
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useLocale } from "@/components/providers/LocaleProvider";

interface PropertySelectProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
}

export const PropertySelect = ({ value, onChange, label }: PropertySelectProps) => {
  const { t } = useLocale();

  const { data: properties, isLoading } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div>
        <Label className="block text-sm font-medium mb-1">{label}</Label>
        <div className="text-sm text-muted-foreground">{t('loadingProperties')}</div>
      </div>
    );
  }

  return (
    <div>
      <Label className="block text-sm font-medium mb-1">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={t('selectProperty', { fallback: 'Select a property' })} />
        </SelectTrigger>
        <SelectContent>
          {properties?.map((property) => (
            <SelectItem key={property.id} value={property.id}>
              {property.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
