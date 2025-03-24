
import React from "react";
import { VendorListHeader } from "./header/VendorListHeader";
import { VendorTabs } from "./tabs/VendorTabs";
import { VendorDialogs } from "./dialogs/VendorDialogs";
import { useVendorList } from "./hooks/useVendorList";

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
    setSelectedVendorForReview,
    showAvailableOnly,
    setShowAvailableOnly,
    selectedAvailability,
    setSelectedAvailability,
    
    // Data
    vendors,
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

  return (
    <div className="space-y-6">
      <VendorListHeader onAddVendor={() => setDialogOpen(true)} />

      <VendorTabs
        vendors={vendors}
        emergencyContacts={emergencyContacts}
        reviews={reviews}
        filteredVendors={filteredVendors}
        specialties={specialties}
        selectedSpecialty={selectedSpecialty}
        searchQuery={searchQuery}
        selectedRating={selectedRating}
        showEmergencyOnly={showEmergencyOnly}
        showAvailableOnly={showAvailableOnly}
        selectedAvailability={selectedAvailability}
        onSpecialtyChange={setSelectedSpecialty}
        onSearchChange={setSearchQuery}
        onRatingChange={setSelectedRating}
        onEmergencyChange={setShowEmergencyOnly}
        onAvailableChange={setShowAvailableOnly}
        onAvailabilityChange={setSelectedAvailability}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onReview={handleOpenReviewDialog}
        refetchReviews={refetchReviews}
      />

      <VendorDialogs
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        selectedVendor={selectedVendor}
        reviewDialogOpen={reviewDialogOpen}
        setReviewDialogOpen={setReviewDialogOpen}
        selectedVendorForReview={selectedVendorForReview}
        setSelectedVendorForReview={setSelectedVendorForReview}
        refetch={refetch}
        refetchReviews={refetchReviews}
      />
    </div>
  );
};
