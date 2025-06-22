
import { useEffect, useState } from "react";
import AppSidebar from "@/components/AppSidebar";
import { motion } from "framer-motion";
import { useProperties } from "@/hooks/useProperties";
import { usePropertyActions } from "@/hooks/usePropertyActions";
import PropertyPageHeader from "@/components/properties/PropertyPageHeader";
import PropertyFiltersSection from "@/components/properties/PropertyFiltersSection";
import PropertyCardsSection from "@/components/properties/PropertyCardsSection";
import { useLocale } from "@/components/providers/LocaleProvider";
import { AddPropertyModal } from "@/components/AddPropertyModal";
import { EditPropertyModal } from "@/components/EditPropertyModal";
import { useMediaQuery } from "@/hooks/use-mobile";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import PropertyFinancialsSection from "@/components/properties/PropertyFinancialsSection";
import { useAuth } from "@/components/AuthProvider";

const Properties = () => {
  const { t } = useLocale();
  const { isTenant } = useAuth();
  const { properties, isLoading, error, canAddProperty } = useProperties();
  const { selectedPropertyId, editingProperty, setEditingProperty, handleEdit, handleDelete, handleViewFinancials } = usePropertyActions();
  
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  // Définir les types de propriétés disponibles (Studio retiré)
  const propertyTypes = ["All", "Apartment", "House", "Office", "Commercial Space", "Condo"] as const;

  // Get the selected property object for financial display
  const selectedProperty = selectedPropertyId 
    ? properties.find(p => p.id === selectedPropertyId) 
    : undefined;

  // Filtrer les propriétés en fonction des critères de recherche
  const filteredProperties = properties.filter((property) => {
    // Filtrer par type
    const typeMatch = selectedType === "All" || property.type === selectedType;
    
    // Filtrer par recherche de texte
    const searchMatch = 
      property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    return typeMatch && searchMatch;
  });

  const confirmDelete = (id: string) => {
    setPropertyToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const executeDelete = () => {
    if (propertyToDelete) {
      handleDelete(propertyToDelete);
      setPropertyToDelete(null);
    }
    setIsDeleteDialogOpen(false);
  };

  const handleEditProperty = (id: string) => {
    handleEdit(properties, id);
  };

  useEffect(() => {
    document.title = "Properties | PropManagement";
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar isTenant={isTenant} isCollapsed={sidebarCollapsed} setIsCollapsed={setSidebarCollapsed} />
      <div className={cn(
        "p-6 md:p-8 pt-24 md:pt-8 transition-all duration-300",
        sidebarCollapsed ? "md:ml-[80px]" : "md:ml-[270px]"
      )}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <PropertyPageHeader
            propertiesCount={properties.length}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            setIsAddModalOpen={setIsAddModalOpen}
            isMobile={isMobile}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          <PropertyFiltersSection
            showFilters={showFilters}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            propertyTypes={propertyTypes}
          />

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-[300px] animate-pulse bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">
              <p>{error}</p>
            </div>
          ) : (
            <PropertyCardsSection
              properties={properties}
              filteredProperties={filteredProperties}
              onEdit={handleEditProperty}
              onDelete={confirmDelete}
              onViewFinancials={handleViewFinancials}
            />
          )}

          {selectedPropertyId && selectedProperty && (
            <PropertyFinancialsSection 
              selectedPropertyId={selectedPropertyId}
              selectedProperty={selectedProperty}
            />
          )}
        </motion.div>

        {/* Modals - seulement pour les propriétaires */}
        {canAddProperty && (
          <AddPropertyModal 
            isOpen={isAddModalOpen} 
            onClose={() => setIsAddModalOpen(false)} 
          />
        )}
        
        {editingProperty && !isTenant && (
          <EditPropertyModal 
            isOpen={!!editingProperty} 
            onClose={() => setEditingProperty(null)} 
            property={editingProperty} 
          />
        )}

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('confirmPropertyDelete')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('propertyDeleteWarning')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
              <AlertDialogAction 
                onClick={executeDelete}
                className="bg-red-500 hover:bg-red-600"
              >
                {t('deleteProperty')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Properties;
