
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Vendor, VendorReview } from "@/types/vendor";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/components/providers/LocaleProvider";

export const useVendorList = () => {
  // State
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
  
  const { toast } = useToast();
  const { t } = useLocale();

  // Data fetching
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

  const { data: reviews = [], refetch: refetchReviews } = useQuery({
    queryKey: ['vendor_reviews'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendor_reviews')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as VendorReview[];
    },
  });

  // Derived data
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

  // Actions
  const handleEdit = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setDialogOpen(true);
  };

  const handleDelete = async (vendor: Vendor) => {
    try {
      const { error } = await supabase
        .from('vendors')
        .delete()
        .eq('id', vendor.id);

      if (error) throw error;

      toast({
        title: t('success'),
        description: t('vendorDeleted'),
      });

      refetch();
    } catch (error) {
      console.error('Error deleting vendor:', error);
      toast({
        title: t('error'),
        description: t('vendorDeleteError'),
        variant: "destructive",
      });
    }
  };

  const handleOpenReviewDialog = (vendor: { id: string; name: string }) => {
    setSelectedVendorForReview(vendor);
    setReviewDialogOpen(true);
  };

  return {
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
    setSelectedVendorForReview, // This was missing from the return value
    
    // Data
    vendors,
    reviews,
    specialties,
    filteredVendors,
    emergencyContacts,
    
    // Actions
    refetch,
    refetchReviews,
    handleEdit,
    handleDelete,
    handleOpenReviewDialog
  };
};
