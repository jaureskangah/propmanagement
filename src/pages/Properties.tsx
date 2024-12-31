import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import PropertyCard from "@/components/PropertyCard";
import PropertyFinancials from "@/components/PropertyFinancials";
import { AddPropertyModal } from "@/components/AddPropertyModal";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Property {
  id: string;
  name: string;
  address: string;
  units: number;
  type: string;
  image_url?: string;
  financials?: {
    rentRoll: any[];
    expenses: any[];
    maintenance: any[];
  };
}

const Properties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from("properties")
        .select("*");

      if (error) throw error;

      setProperties(data || []);
    } catch (error) {
      console.error("Erreur lors du chargement des propriétés:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les propriétés.",
      });
    }
  };

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

      setProperties(properties.filter(property => property.id !== id));
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

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Propriétés</h1>
        <AddPropertyModal />
      </div>
      
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