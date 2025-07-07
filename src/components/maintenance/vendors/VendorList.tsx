
import React from "react";
import { VendorListHeader } from "./header/VendorListHeader";
import { VendorSimplifiedTabs } from "./tabs/VendorSimplifiedTabs";
import { VendorSimplifiedFilters } from "./filters/VendorSimplifiedFilters";
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
    
    // Data
    vendors,
    specialties,
    filteredVendors,
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

      <VendorSimplifiedFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedSpecialty={selectedSpecialty}
        setSelectedSpecialty={setSelectedSpecialty}
        selectedRating={selectedRating}
        setSelectedRating={setSelectedRating}
        showEmergencyOnly={showEmergencyOnly}
        setShowEmergencyOnly={setShowEmergencyOnly}
        specialties={specialties}
      />

      <VendorSimplifiedTabs
        vendors={filteredVendors}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onReview={handleOpenReviewDialog}
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
