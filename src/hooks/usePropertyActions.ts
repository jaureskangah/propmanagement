
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
      // Vérifier d'abord s'il y a des locataires pour cette propriété
      const { data: tenants, error: tenantsError } = await supabase
        .from("tenants")
        .select("id")
        .eq("property_id", id);

      if (tenantsError) throw tenantsError;

      if (tenants && tenants.length > 0) {
        toast({
          variant: "destructive",
          title: "Impossible de supprimer",
          description: "Vous devez d'abord supprimer tous les locataires associés à cette propriété.",
        });
        return;
      }

      // Vérifier s'il y a des dépenses de maintenance
      const { data: expenses, error: expensesError } = await supabase
        .from("maintenance_expenses")
        .select("id")
        .eq("property_id", id);

      if (expensesError) throw expensesError;

      if (expenses && expenses.length > 0) {
        toast({
          variant: "destructive",
          title: "Impossible de supprimer",
          description: "Vous devez d'abord supprimer toutes les dépenses de maintenance associées à cette propriété.",
        });
        return;
      }

      // Vérifier s'il y a des interventions de fournisseurs
      const { data: interventions, error: interventionsError } = await supabase
        .from("vendor_interventions")
        .select("id")
        .eq("property_id", id);

      if (interventionsError) throw interventionsError;

      if (interventions && interventions.length > 0) {
        toast({
          variant: "destructive",
          title: "Impossible de supprimer",
          description: "Vous devez d'abord supprimer toutes les interventions de fournisseurs associées à cette propriété.",
        });
        return;
      }

      // Si aucune contrainte, procéder à la suppression
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
    } catch (error: any) {
      console.error("Error deleting property:", error);
      let errorMessage = t('propertyDeleteError');
      
      // Messages d'erreur spécifiques
      if (error.message?.includes('foreign key')) {
        errorMessage = "Impossible de supprimer la propriété car elle est liée à d'autres données. Supprimez d'abord les locataires et dépenses associés.";
      }
      
      toast({
        variant: "destructive",
        title: t('error'),
        description: errorMessage,
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
