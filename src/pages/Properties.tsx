
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
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import EmptyState from "@/components/properties/EmptyState";
import PropertyFilters from "@/components/properties/PropertyFilters";
import AppSidebar from "@/components/AppSidebar";
import { useLocale } from "@/components/providers/LocaleProvider";

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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { properties, isLoading, error } = useProperties();
  const { toast } = useToast();
  const { t } = useLocale();

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

  const filteredProperties = properties
    .filter(property => selectedType === "All" || property.type === selectedType)
    .filter(property => 
      searchQuery === "" || 
      property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.address.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const selectedProperty = properties.find(p => p.id === selectedPropertyId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <AppSidebar />
      <div className="flex-1 container mx-auto px-4 lg:px-6 py-8 space-y-6 lg:space-y-8 max-w-[1400px]">
        <div className="space-y-2">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
                {t('propertiesManagement')}
              </h1>
              <p className="text-muted-foreground mt-1">
                {t('propertiesSubtitle')}
              </p>
            </div>
            <div className="flex items-center justify-end gap-4">
              <Badge variant="secondary" className="text-sm px-3 py-1.5">
                <Info className="h-4 w-4 mr-1.5" />
                {properties.length} {properties.length === 1 ? t('property') : t('properties')}
              </Badge>
              <div className="animate-fade-in">
                <Button size="sm" onClick={() => setIsAddModalOpen(true)}>
                  {t('addProperty')}
                </Button>
              </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
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
              {t('financialOverview')} - {selectedProperty?.name}
            </h2>
            <PropertyFinancials propertyId={selectedPropertyId} />
          </div>
        )}

        <AddPropertyModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />

        {editingProperty && (
          <EditPropertyModal
            property={editingProperty}
            isOpen={true}
            onClose={() => setEditingProperty(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Properties;
