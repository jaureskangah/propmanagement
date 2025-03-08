
import React, { useState } from "react";
import { useProperties } from "@/hooks/useProperties";
import { usePropertyActions } from "@/hooks/usePropertyActions";
import { Loader2 } from "lucide-react";
import { AddPropertyModal } from "@/components/AddPropertyModal";
import { EditPropertyModal } from "@/components/EditPropertyModal";
import AppSidebar from "@/components/AppSidebar";
import { useLocale } from "@/components/providers/LocaleProvider";
import PropertyPageHeader from "@/components/properties/PropertyPageHeader";
import PropertyFiltersSection from "@/components/properties/PropertyFiltersSection";
import PropertyCardsSection from "@/components/properties/PropertyCardsSection";
import PropertyFinancialsSection from "@/components/properties/PropertyFinancialsSection";

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
  const [selectedType, setSelectedType] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const { properties, isLoading, error } = useProperties();
  const { t } = useLocale();
  
  const {
    selectedPropertyId,
    editingProperty,
    setEditingProperty,
    handleEdit,
    handleDelete,
    handleViewFinancials
  } = usePropertyActions();

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
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <AppSidebar />
      <div className="flex-1 container mx-auto px-4 lg:px-6 py-8 space-y-6 lg:space-y-8 max-w-[1400px] overflow-y-auto">
        <PropertyPageHeader 
          propertiesCount={properties.length}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          setIsAddModalOpen={setIsAddModalOpen}
        />
        
        <PropertyFiltersSection 
          showFilters={showFilters}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          propertyTypes={PROPERTY_TYPES}
        />
        
        <PropertyCardsSection 
          properties={properties}
          filteredProperties={filteredProperties}
          onEdit={(id) => handleEdit(properties, id)}
          onDelete={handleDelete}
          onViewFinancials={handleViewFinancials}
        />

        <PropertyFinancialsSection 
          selectedPropertyId={selectedPropertyId}
          selectedProperty={selectedProperty}
        />

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
