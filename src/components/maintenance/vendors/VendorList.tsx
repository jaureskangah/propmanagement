
import React from "react";
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

export const VendorList = () => {
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
    
    // Data
    specialties,
    filteredVendors,
    emergencyContacts,
    reviews,
    
    // Actions
    refetch,
    refetchReviews,
    handleEdit,
    handleDelete
  } = useVendorList();

  const { t } = useLocale();

  return (
    <div className="space-y-6">
      <VendorListHeader onAddVendor={() => setDialogOpen(true)} />

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">{t('allVendors')}</TabsTrigger>
          <TabsTrigger value="emergency">{t('emergencyContacts')}</TabsTrigger>
          <TabsTrigger value="reviews">{t('reviews')}</TabsTrigger>
          <TabsTrigger value="history">{t('history')}</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="space-y-4">
            <VendorSearchFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedRating={selectedRating}
              setSelectedRating={setSelectedRating}
              showEmergencyOnly={showEmergencyOnly}
              setShowEmergencyOnly={setShowEmergencyOnly}
            />

            <VendorSpecialtyFilters
              specialties={specialties}
              selectedSpecialty={selectedSpecialty}
              onSpecialtyChange={setSelectedSpecialty}
            />

            <VendorMainList
              vendors={filteredVendors}
              onEdit={handleEdit}
              onDelete={handleDelete}
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
