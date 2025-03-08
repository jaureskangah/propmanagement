
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Property } from "@/hooks/useProperties";
import { useLocale } from "@/components/providers/LocaleProvider";

export function usePropertyActions() {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const { toast } = useToast();
  const { t } = useLocale();

  const handleEdit = (properties: Property[], id: string) => {
    const property = properties.find(p => p.id === id);
    if (property) {
      setEditingProperty(property);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("properties")
        .delete()
        .eq("id", id);

      if (error) throw error;

      if (selectedPropertyId === id) {
        setSelectedPropertyId(null);
      }

      toast({
        title: t('propertyDeleted'),
        description: t('propertyDeleteSuccess'),
      });
    } catch (error) {
      console.error("Error deleting property:", error);
      toast({
        variant: "destructive",
        title: t('error'),
        description: t('propertyDeleteError'),
      });
    }
  };

  const handleViewFinancials = (id: string) => {
    console.log("View financials for property:", id);
    setSelectedPropertyId(id);
  };

  return {
    selectedPropertyId,
    setSelectedPropertyId,
    editingProperty,
    setEditingProperty,
    handleEdit,
    handleDelete,
    handleViewFinancials
  };
}
