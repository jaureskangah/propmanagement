import React, { useState } from "react";
import PropertyCard from "@/components/PropertyCard";
import PropertyFinancials from "@/components/PropertyFinancials";
import { AddPropertyModal } from "@/components/AddPropertyModal";
import { EditPropertyModal } from "@/components/EditPropertyModal";
import { useToast } from "@/components/ui/use-toast";
import { useProperties, Property } from "@/hooks/useProperties";
import { Loader2, Info } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import EmptyState from "@/components/properties/EmptyState";
import PropertyFilters from "@/components/properties/PropertyFilters";

const PROPERTY_TYPES = [
  "All",
  "Apartment",
  "House",
  "Studio",
  "Condo",
  "Office",
  "Commercial Space"
] as const;

const Properties = () => {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [selectedType, setSelectedType] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
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

  const filteredProperties = properties
    .filter(property => selectedType === "All" || property.type === selectedType)
    .filter(property => 
      searchQuery === "" || 
      property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.address.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const selectedProperty = properties.find(p => p.id === selectedPropertyId);

  if (isLoadingProperties) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Properties Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage and track all your real estate properties in one place
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-sm">
              <Info className="h-4 w-4 mr-1" />
              {properties.length} {properties.length === 1 ? 'Property' : 'Properties'}
            </Badge>
            <AddPropertyModal />
          </div>
        </div>
        <Separator className="my-6" />
        
        <PropertyFilters
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          propertyTypes={PROPERTY_TYPES}
        />
      </div>
      
      {filteredProperties.length === 0 ? (
        <EmptyState isFiltering={properties.length > 0} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
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
        <div className="mt-8 animate-fade-in">
          <h2 className="text-xl font-bold mb-4">
            Financial Overview - {selectedProperty?.name}
          </h2>
          <PropertyFinancials propertyId={selectedPropertyId} />
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