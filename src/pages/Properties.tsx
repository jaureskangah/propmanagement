import { useEffect, useState } from "react";

import { motion } from "framer-motion";
import { useProperties } from "@/hooks/useProperties";
import { usePropertyActions } from "@/hooks/usePropertyActions";
import PropertyPageHeader from "@/components/properties/PropertyPageHeader";
import PropertyFiltersSection from "@/components/properties/PropertyFiltersSection";
import PropertyCardsSection from "@/components/properties/PropertyCardsSection";
import PropertyActionsBar from "@/components/properties/PropertyActionsBar";
import PropertyTableView from "@/components/properties/PropertyTableView";
import { useLocale } from "@/components/providers/LocaleProvider";
import { AddPropertyModal } from "@/components/AddPropertyModal";
import { EditPropertyModal } from "@/components/EditPropertyModal";
import { useMediaQuery } from "@/hooks/use-mobile";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import PropertyFinancialsSection from "@/components/properties/PropertyFinancialsSection";
import { useAuth } from "@/components/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import PropertyDetailView from "@/components/properties/PropertyDetailView";
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';

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
  
  // Nouveaux états pour les améliorations CRUD
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [selectedPropertyIds, setSelectedPropertyIds] = useState<string[]>([]);
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);
  const [selectedPropertyForDetails, setSelectedPropertyForDetails] = useState<string | null>(null);
  
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

  // Fetch des données d'occupation pour la vue tableau
  const { data: tenants = [] } = useQuery({
    queryKey: ["tenants"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tenants")
        .select("*");
      
      if (error) {
        console.error("Error fetching tenants:", error);
        throw error;
      }
      
      return data;
    }
  });

  // Calculer les taux d'occupation
  const occupancyData = filteredProperties.reduce((acc, property) => {
    const propertyTenants = tenants.filter(tenant => tenant.property_id === property.id);
    const occupiedUnits = propertyTenants.length;
    const occupancyRate = property.units > 0 ? Math.round((occupiedUnits / property.units) * 100) : 0;
    acc[property.id] = occupancyRate;
    return acc;
  }, {} as Record<string, number>);

  // Gestion de la sélection multiple
  const togglePropertySelection = (id: string) => {
    setSelectedPropertyIds(prev => 
      prev.includes(id) 
        ? prev.filter(pid => pid !== id)
        : [...prev, id]
    );
  };

  const selectAllProperties = () => {
    setSelectedPropertyIds(filteredProperties.map(p => p.id));
  };

  const clearSelection = () => {
    setSelectedPropertyIds([]);
  };

  const handleBulkDelete = () => {
    setIsBulkDeleteDialogOpen(true);
  };

  const executeBulkDelete = async () => {
    for (const id of selectedPropertyIds) {
      await handleDelete(id);
    }
    setSelectedPropertyIds([]);
    setIsBulkDeleteDialogOpen(false);
  };

  useEffect(() => {
    document.title = "Properties | PropManagement";
  }, []);

  return (
    <ResponsiveLayout title={t('properties')} className="p-6 md:p-8" isTenant={isTenant}>
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

          {/* Barre d'actions améliorée */}
          {filteredProperties.length > 0 && !isLoading && (
            <PropertyActionsBar
              selectedCount={selectedPropertyIds.length}
              onBulkDelete={handleBulkDelete}
              onSelectAll={selectAllProperties}
              onClearSelection={clearSelection}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-[300px] animate-pulse bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">
              <p>{error.message || "An error occurred while loading properties"}</p>
            </div>
          ) : (
            <>
              {viewMode === "grid" ? (
                <PropertyCardsSection
                  properties={properties}
                  filteredProperties={filteredProperties}
                  onEdit={handleEditProperty}
                  onDelete={confirmDelete}
                  onViewFinancials={handleViewFinancials}
                />
              ) : (
                <PropertyTableView
                  properties={filteredProperties}
                  selectedIds={selectedPropertyIds}
                  onToggleSelection={togglePropertySelection}
                  onEdit={handleEditProperty}
                  onDelete={confirmDelete}
                  onViewFinancials={handleViewFinancials}
                  occupancyData={occupancyData}
                />
              )}
            </>
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

        {/* Dialog de suppression simple */}
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

        {/* Dialog de suppression en masse */}
        <AlertDialog open={isBulkDeleteDialogOpen} onOpenChange={setIsBulkDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Supprimer plusieurs propriétés</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir supprimer {selectedPropertyIds.length} propriété(s) ? 
                Cette action ne peut pas être annulée et supprimera définitivement :
                <ul className="mt-2 space-y-1">
                  {selectedPropertyIds.slice(0, 3).map(id => {
                    const property = properties.find(p => p.id === id);
                    return property ? (
                      <li key={id} className="text-sm">• {property.name}</li>
                    ) : null;
                  })}
                  {selectedPropertyIds.length > 3 && (
                    <li className="text-sm text-muted-foreground">
                      ... et {selectedPropertyIds.length - 3} autre(s)
                    </li>
                  )}
                </ul>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
              <AlertDialogAction 
                onClick={executeBulkDelete}
                className="bg-red-500 hover:bg-red-600"
              >
                Supprimer {selectedPropertyIds.length} propriété(s)
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
    </ResponsiveLayout>
  );
};

export default Properties;
