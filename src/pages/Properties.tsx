import React, { useState } from "react";
import PropertyCard from "@/components/PropertyCard";
import PropertyFinancials from "@/components/PropertyFinancials";
import { AddPropertyModal } from "@/components/AddPropertyModal";
import { EditPropertyModal } from "@/components/EditPropertyModal";
import { useToast } from "@/components/ui/use-toast";
import { useProperties, Property } from "@/hooks/useProperties";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

const Properties = () => {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const { properties, isLoadingProperties } = useProperties();
  const { toast } = useToast();

  const handleEdit = (id: string) => {
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
        title: "Property deleted",
        description: "The property has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting property:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unable to delete the property.",
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

  // Mock financial data
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
            Financial Overview - {selectedProperty?.name}
          </h2>
          <PropertyFinancials
            propertyId={selectedPropertyId}
            rentRoll={mockFinancials.rentRoll}
            expenses={mockFinancials.expenses}
            maintenance={mockFinancials.maintenance}
          />
        </div>
      )}

      {editingProperty && (
        <EditPropertyModal
          property={editingProperty}
          isOpen={true}
          onClose={() => setEditingProperty(null)}
        />
      )}
    </div>
  );
};

export default Properties;