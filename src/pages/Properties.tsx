import React, { useState } from "react";
import PropertyCard from "@/components/PropertyCard";
import PropertyFinancials from "@/components/PropertyFinancials";
import { AddPropertyModal } from "@/components/AddPropertyModal";
import { useToast } from "@/components/ui/use-toast";
import { useProperties } from "@/hooks/useProperties";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

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

  // Mock financial data since it's not in the database yet
  const mockFinancials = {
    rentRoll: [
      { unit: "1A", tenant: "John Doe", rent: 1200, status: "Active" }
    ],
    expenses: [
      { category: "Maintenance", amount: 500, date: "2024-01-15" }
    ],
    maintenance: [
      { description: "Plumbing repair", cost: 300, date: "2024-01-10" }
    ]
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-end mb-6">
        <AddPropertyModal />
      </div>
      
      {properties.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Start by adding your first property!
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

      {selectedPropertyId && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">
            Financial Overview - {properties.find(p => p.id === selectedPropertyId)?.name}
          </h2>
          <PropertyFinancials
            propertyId={selectedPropertyId}
            rentRoll={mockFinancials.rentRoll}
            expenses={mockFinancials.expenses}
            maintenance={mockFinancials.maintenance}
          />
        </div>
      )}
    </div>
  );
};

export default Properties;
