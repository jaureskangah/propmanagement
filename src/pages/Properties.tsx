import React, { useState } from "react";
import PropertyCard from "@/components/PropertyCard";
import PropertyFinancials from "@/components/PropertyFinancials";
import { AddPropertyModal } from "@/components/AddPropertyModal";
import { useToast } from "@/components/ui/use-toast";
import { useProperties } from "@/hooks/useProperties";
import { Loader2 } from "lucide-react";

const Properties = () => {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const { properties, isLoadingProperties } = useProperties();
  const { toast } = useToast();

  const handleEdit = (id: string) => {
    console.log("Edit property:", id);
    // Implement edit functionality
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
        title: "Propriété supprimée",
        description: "La propriété a été supprimée avec succès.",
      });
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la propriété.",
      });
    }
  };

  const handleViewFinancials = (id: string) => {
    console.log("View financials for property:", id);
    setSelectedPropertyId(id);
  };

  const selectedProperty = properties.find(p => p.id === selectedPropertyId);

  if (isLoadingProperties) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Propriétés</h1>
        <AddPropertyModal />
      </div>
      
      {properties.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Vous n'avez pas encore de propriétés. Commencez par en ajouter une !
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewFinancials={handleViewFinancials}
            />
          ))}
        </div>
      )}

      {selectedProperty && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">
            Aperçu financier - {selectedProperty.name}
          </h2>
          <PropertyFinancials
            propertyId={selectedProperty.id}
            rentRoll={selectedProperty.financials?.rentRoll || []}
            expenses={selectedProperty.financials?.expenses || []}
            maintenance={selectedProperty.financials?.maintenance || []}
          />
        </div>
      )}
    </div>
  );
};

export default Properties;