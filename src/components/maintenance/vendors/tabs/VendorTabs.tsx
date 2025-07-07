
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VendorMainContent } from "../main/VendorMainContent";
import { EmergencyContactList } from "../emergency/EmergencyContactList";
import { InterventionHistory } from "../interventions/InterventionHistory";
import { VendorAppointmentsTab } from "../appointments/VendorAppointmentsTab";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Vendor } from "@/types/vendor";

interface VendorTabsProps {
  vendors: Vendor[];
  emergencyContacts: Vendor[];
  filteredVendors: Vendor[];
  specialties: string[];
  selectedSpecialty: string | null;
  searchQuery: string;
  selectedRating: string | null;
  showEmergencyOnly: boolean;
  showAvailableOnly: boolean;
  selectedAvailability: string | null;
  onSpecialtyChange: (specialty: string | null) => void;
  onSearchChange: (query: string) => void;
  onRatingChange: (rating: string | null) => void;
  onEmergencyChange: (show: boolean) => void;
  onAvailableChange: (show: boolean) => void;
  onAvailabilityChange: (availability: string | null) => void;
  onEdit: (vendor: Vendor) => void;
  onDelete: (vendor: Vendor) => void;
  onReview: (vendor: { id: string; name: string }) => void;
}

export const VendorTabs = ({
  vendors,
  emergencyContacts,
  filteredVendors,
  specialties,
  selectedSpecialty,
  searchQuery,
  selectedRating,
  showEmergencyOnly,
  showAvailableOnly,
  selectedAvailability,
  onSpecialtyChange,
  onSearchChange,
  onRatingChange,
  onEmergencyChange,
  onAvailableChange,
  onAvailabilityChange,
  onEdit,
  onDelete,
  onReview
}: VendorTabsProps) => {
  const { t } = useLocale();

  return (
    <Tabs defaultValue="all" className="space-y-4">
      <TabsList>
        <TabsTrigger value="all">{t('allVendors')}</TabsTrigger>
        <TabsTrigger value="emergency">{t('emergencyContacts')}</TabsTrigger>
        <TabsTrigger value="appointments">{t('appointments')}</TabsTrigger>
        <TabsTrigger value="history">{t('history')}</TabsTrigger>
      </TabsList>

      <TabsContent value="all">
        <VendorMainContent
          vendors={filteredVendors}
          specialties={specialties}
          selectedSpecialty={selectedSpecialty}
          searchQuery={searchQuery}
          selectedRating={selectedRating}
          showEmergencyOnly={showEmergencyOnly}
          showAvailableOnly={showAvailableOnly}
          selectedAvailability={selectedAvailability}
          onSpecialtyChange={onSpecialtyChange}
          onSearchChange={onSearchChange}
          onRatingChange={onRatingChange}
          onEmergencyChange={onEmergencyChange}
          onAvailableChange={onAvailableChange}
          onAvailabilityChange={onAvailabilityChange}
          onEdit={onEdit}
          onDelete={onDelete}
          onReview={onReview}
        />
      </TabsContent>

      <TabsContent value="emergency">
        <EmergencyContactList
          vendors={emergencyContacts}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </TabsContent>
      
      <VendorAppointmentsTab vendors={filteredVendors} />

      <TabsContent value="history">
        <InterventionHistory />
      </TabsContent>
    </Tabs>
  );
};
