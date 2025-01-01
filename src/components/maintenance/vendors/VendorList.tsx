import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { VendorDialog } from "./VendorDialog";
import { VendorMainList } from "./main/VendorMainList";
import { EmergencyContactList } from "./emergency/EmergencyContactList";
import { VendorReviewList } from "./reviews/VendorReviewList";
import { InterventionHistory } from "./interventions/InterventionHistory";
import { VendorReviewDialog } from "./reviews/VendorReviewDialog";
import { VendorListHeader } from "./header/VendorListHeader";
import { VendorSearchFilters } from "./filters/VendorSearchFilters";
import { VendorSpecialtyFilters } from "./filters/VendorSpecialtyFilters";
import { Vendor } from "@/types/vendor";

export const VendorList = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRating, setSelectedRating] = useState<string | null>(null);
  const [showEmergencyOnly, setShowEmergencyOnly] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | undefined>();
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedVendorForReview, setSelectedVendorForReview] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const { data: vendors = [], refetch } = useQuery({
    queryKey: ['vendors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .order('name');
      if (error) throw error;
      return data as Vendor[];
    },
  });

  const specialties = [...new Set(vendors.map(vendor => vendor.specialty))];

  const filteredVendors = vendors.filter(vendor => {
    const matchesSpecialty = !selectedSpecialty || vendor.specialty === selectedSpecialty;
    const matchesSearch = !searchQuery || 
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRating = !selectedRating || vendor.rating >= parseInt(selectedRating);
    const matchesEmergency = !showEmergencyOnly || vendor.emergency_contact;

    return matchesSpecialty && matchesSearch && matchesRating && matchesEmergency;
  });

  const emergencyContacts = vendors.filter(vendor => vendor.emergency_contact);

  const handleEdit = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setDialogOpen(true);
  };

  const handleDelete = async (vendor: Vendor) => {
    // Handle delete logic here
  };

  return (
    <div className="space-y-6">
      <VendorListHeader onAddVendor={() => setDialogOpen(true)} />

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Vendors</TabsTrigger>
          <TabsTrigger value="emergency">Emergency Contacts</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="space-y-4">
            <VendorSearchFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedRating={selectedRating}
              onRatingChange={setSelectedRating}
              showEmergencyOnly={showEmergencyOnly}
              onEmergencyChange={setShowEmergencyOnly}
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
            vendors={vendors}
            onSelectVendor={(vendor) => {
              setSelectedVendorForReview({
                id: vendor.id,
                name: vendor.name,
              });
              setReviewDialogOpen(true);
            }}
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
          }}
        />
      )}
    </div>
  );
};
