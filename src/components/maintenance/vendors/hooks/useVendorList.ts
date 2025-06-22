
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Vendor, VendorReview } from "@/types/vendor";

export const useVendorList = () => {
  const { toast } = useToast();
  const { t } = useLocale();
  const queryClient = useQueryClient();
  
  // Filter states
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRating, setSelectedRating] = useState<string | null>(null);
  const [showEmergencyOnly, setShowEmergencyOnly] = useState(false);
  
  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | undefined>();
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedVendorForReview, setSelectedVendorForReview] = useState<{ id: string; name: string } | null>(null);

  // Fetch vendors
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

  // Fetch reviews
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

  // Get unique specialties
  const specialties = [...new Set(vendors.map(vendor => vendor.specialty))];

  // Filter vendors
  const filteredVendors = vendors.filter(vendor => {
    if (searchQuery && !vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !vendor.specialty.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    if (selectedSpecialty && vendor.specialty !== selectedSpecialty) {
      return false;
    }
    
    if (selectedRating && vendor.rating < parseInt(selectedRating)) {
      return false;
    }
    
    if (showEmergencyOnly && !vendor.emergency_contact) {
      return false;
    }
    
    return true;
  });

  // Delete vendor mutation
  const deleteVendorMutation = useMutation({
    mutationFn: async (vendorId: string) => {
      const { error } = await supabase
        .from('vendors')
        .delete()
        .eq('id', vendorId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      toast({
        title: t('success'),
        description: t('vendorDeleted'),
      });
    },
    onError: () => {
      toast({
        title: t('error'),
        description: t('vendorDeleteError'),
        variant: "destructive",
      });
    },
  });

  // Handlers
  const handleEdit = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setDialogOpen(true);
  };

  const handleDelete = (vendor: Vendor) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${vendor.name} ?`)) {
      deleteVendorMutation.mutate(vendor.id);
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
  };
};
