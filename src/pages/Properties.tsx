
import React, { useState } from "react";
import PropertyCard from "@/components/PropertyCard";
import PropertyFinancials from "@/components/PropertyFinancials";
import { AddPropertyModal } from "@/components/AddPropertyModal";
import { EditPropertyModal } from "@/components/EditPropertyModal";
import { useToast } from "@/components/ui/use-toast";
import { useProperties, Property } from "@/hooks/useProperties";
import { Loader2, Info, Plus, Filter, DollarSign } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import EmptyState from "@/components/properties/EmptyState";
import PropertyFilters from "@/components/properties/PropertyFilters";
import AppSidebar from "@/components/AppSidebar";
import { useLocale } from "@/components/providers/LocaleProvider";
import { motion } from "framer-motion";

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
  const [showFilters, setShowFilters] = useState(false);
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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

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
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-2"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                {t('propertiesManagement')}
              </h1>
              <p className="text-muted-foreground mt-1">
                {t('propertiesSubtitle')}
              </p>
            </div>
            <div className="flex items-center justify-end gap-4">
              <Badge variant="secondary" className="text-sm px-3 py-1.5 shadow-sm">
                <Info className="h-4 w-4 mr-1.5 text-primary" />
                {properties.length} {properties.length === 1 ? t('property') : t('properties')}
              </Badge>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowFilters(!showFilters)}
                  className="hidden md:flex"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  {t('filters')}
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-primary hover:bg-primary/90 transition-all duration-200 shadow-sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t('addProperty')}
                </Button>
              </div>
            </div>
          </div>
          <Separator className="my-6" />
          
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ 
              opacity: showFilters ? 1 : 0,
              height: showFilters ? "auto" : 0
            }}
            transition={{ duration: 0.3 }}
            className={`overflow-hidden ${showFilters ? 'mb-6' : 'mb-0'}`}
          >
            <PropertyFilters
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              propertyTypes={PROPERTY_TYPES}
            />
          </motion.div>

          <div className="flex md:hidden mb-4">
            <PropertyFilters
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              propertyTypes={PROPERTY_TYPES}
              compact={true}
            />
          </div>
        </motion.div>
        
        {filteredProperties.length === 0 ? (
          <EmptyState isFiltering={properties.length > 0} />
        ) : (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8"
          >
            {filteredProperties.map((property) => (
              <motion.div key={property.id} variants={item}>
                <PropertyCard
                  property={property}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onViewFinancials={handleViewFinancials}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {selectedPropertyId && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-12 p-6 bg-card rounded-xl shadow-sm border"
          >
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-primary" />
              {t('financialOverview')} - {selectedProperty?.name}
            </h2>
            <PropertyFinancials propertyId={selectedPropertyId} />
          </motion.div>
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
