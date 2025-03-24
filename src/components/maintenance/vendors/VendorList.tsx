
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VendorDialog } from "./VendorDialog";
import { VendorMainList } from "./main/VendorMainList";
import { EmergencyContactList } from "./emergency/EmergencyContactList";
import { VendorReviewList } from "./reviews/VendorReviewList";
import { InterventionHistory } from "./interventions/InterventionHistory";
import { VendorReviewDialog } from "./reviews/VendorReviewDialog";
import { VendorListHeader } from "./header/VendorListHeader";
import { VendorSearchFilters } from "./filters/VendorSearchFilters";
import { VendorSpecialtyFilters } from "./filters/VendorSpecialtyFilters";
import { useVendorList } from "./hooks/useVendorList";
import { useLocale } from "@/components/providers/LocaleProvider";
import { VendorAppointmentsTab } from "./appointments/VendorAppointmentsTab";
import { VendorAdvancedFilters } from "./filters/VendorAdvancedFilters";

export const VendorList = () => {
  const { t } = useLocale();
  const {
    // State
    selectedSpecialty,
    setSelectedSpecialty,
    searchQuery,
    setSearchQuery,
    selectedRating,
    setSelectedRating,
    showEmergencyOnly,
    setShowEmergencyOnly,
    dialogOpen,
    setDialogOpen,
    selectedVendor,
    reviewDialogOpen,
    setReviewDialogOpen,
    selectedVendorForReview,
    setSelectedVendorForReview,
    
    // Data
    specialties,
    filteredVendors,
    emergencyContacts,
    reviews,
    
    // Actions
    refetch,
    refetchReviews,
    handleEdit,
    handleDelete,
    handleOpenReviewDialog
  } = useVendorList();
  
  // Nouveaux états pour les filtres avancés
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [selectedAvailability, setSelectedAvailability] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <VendorListHeader onAddVendor={() => setDialogOpen(true)} />

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">{t('allVendors')}</TabsTrigger>
          <TabsTrigger value="emergency">{t('emergencyContacts')}</TabsTrigger>
          <TabsTrigger value="appointments">{t('appointments')}</TabsTrigger>
          <TabsTrigger value="reviews">{t('reviews')}</TabsTrigger>
          <TabsTrigger value="history">{t('history')}</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <VendorSearchFilters
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  selectedRating={selectedRating}
                  setSelectedRating={setSelectedRating}
                  showEmergencyOnly={showEmergencyOnly}
                  setShowEmergencyOnly={setShowEmergencyOnly}
                />
              </div>
              
              <VendorAdvancedFilters
                specialties={specialties}
                selectedSpecialty={selectedSpecialty}
                onSpecialtyChange={setSelectedSpecialty}
                selectedRating={selectedRating}
                onRatingChange={setSelectedRating}
                showEmergencyOnly={showEmergencyOnly}
                onEmergencyChange={setShowEmergencyOnly}
                showAvailableOnly={showAvailableOnly}
                onAvailableChange={setShowAvailableOnly}
                selectedAvailability={selectedAvailability}
                onAvailabilityChange={setSelectedAvailability}
              />
            </div>

            <VendorSpecialtyFilters
              specialties={specialties}
              selectedSpecialty={selectedSpecialty}
              onSpecialtyChange={setSelectedSpecialty}
            />

            <VendorMainList
              vendors={filteredVendors}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onReview={handleOpenReviewDialog}
            />
          </div>
        </TabsContent>

        <TabsContent value="emergency">
          <EmergencyContactList
            vendors={emergencyContacts}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabsContent>
        
        <VendorAppointmentsTab vendors={filteredVendors} />

        <TabsContent value="reviews">
          <VendorReviewList
            reviews={reviews}
            onRefresh={refetchReviews}
          />
        </TabsContent>

        <TabsContent value="history">
          <InterventionHistory />
        </TabsContent>
      </Tabs>

      <VendorDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        vendor={selectedVendor}
        onSuccess={() => {
          setDialogOpen(false);
          refetch();
        }}
      />

      {selectedVendorForReview && (
        <VendorReviewDialog
          open={reviewDialogOpen}
          onOpenChange={setReviewDialogOpen}
          vendorId={selectedVendorForReview.id}
          vendorName={selectedVendorForReview.name}
          onSuccess={() => {
            setReviewDialogOpen(false);
            setSelectedVendorForReview(null);
            refetchReviews();
          }}
        />
      )}
    </div>
  );
};
