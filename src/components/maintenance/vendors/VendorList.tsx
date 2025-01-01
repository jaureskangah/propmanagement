import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, Star, History, Phone } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { VendorFilters } from "./VendorFilters";
import { VendorCard } from "./VendorCard";
import { VendorDialog } from "./VendorDialog";
import { useToast } from "@/hooks/use-toast";
import { VendorReviewList } from "./reviews/VendorReviewList";
import { VendorReviewDialog } from "./reviews/VendorReviewDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Vendor {
  id: string;
  name: string;
  specialty: string;
  phone: string;
  email: string;
  emergency_contact: boolean;
  rating: number;
}

interface VendorReview {
  id: string;
  vendor_id: string;
  comment: string;
  rating: number;
  created_at: string;
  quality_rating: number;
  price_rating: number;
  punctuality_rating: number;
}

interface VendorIntervention {
  id: string;
  vendor_id: string;
  title: string;
  description: string;
  date: string;
  cost: number;
  status: string;
}

export const VendorList = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRating, setSelectedRating] = useState<string | null>(null);
  const [showEmergencyOnly, setShowEmergencyOnly] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | undefined>();
  const { toast } = useToast();
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

  const { data: reviews = [] } = useQuery({
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

  const { data: interventions = [] } = useQuery({
    queryKey: ['vendor_interventions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendor_interventions')
        .select('*')
        .order('date', { ascending: false });
      if (error) throw error;
      return data as VendorIntervention[];
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
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Prestataires</h2>
        <Button onClick={() => setDialogOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Ajouter un Prestataire
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Tous les Prestataires</TabsTrigger>
          <TabsTrigger value="emergency">Contacts d'Urgence</TabsTrigger>
          <TabsTrigger value="reviews">Évaluations</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <VendorFilters
            specialties={specialties}
            selectedSpecialty={selectedSpecialty}
            onSpecialtyChange={setSelectedSpecialty}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedRating={selectedRating}
            onRatingChange={setSelectedRating}
            showEmergencyOnly={showEmergencyOnly}
            onEmergencyChange={setShowEmergencyOnly}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVendors.map((vendor) => (
              <VendorCard
                key={vendor.id}
                vendor={vendor}
                onEdit={() => handleEdit(vendor)}
                onDelete={() => handleDelete(vendor)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="emergency">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {emergencyContacts.map((vendor) => (
              <VendorCard
                key={vendor.id}
                vendor={vendor}
                isEmergencyView
                onEdit={() => handleEdit(vendor)}
                onDelete={() => handleDelete(vendor)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reviews">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Évaluations des prestataires</h3>
              <Select
                value={selectedVendorForReview?.id || ""}
                onValueChange={(value) => {
                  const vendor = vendors.find((v) => v.id === value);
                  if (vendor) {
                    setSelectedVendorForReview({
                      id: vendor.id,
                      name: vendor.name,
                    });
                    setReviewDialogOpen(true);
                  }
                }}
              >
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Sélectionner un prestataire" />
                </SelectTrigger>
                <SelectContent>
                  {vendors.map((vendor) => (
                    <SelectItem key={vendor.id} value={vendor.id}>
                      {vendor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <VendorReviewList reviews={reviews} />

            {selectedVendorForReview && (
              <VendorReviewDialog
                open={reviewDialogOpen}
                onOpenChange={setReviewDialogOpen}
                vendorId={selectedVendorForReview.id}
                vendorName={selectedVendorForReview.name}
                onSuccess={() => {
                  refetch();
                  setSelectedVendorForReview(null);
                }}
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value="history">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {interventions.map((intervention) => {
              const vendor = vendors.find(v => v.id === intervention.vendor_id);
              return (
                <Card key={intervention.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{vendor?.name}</CardTitle>
                      <History className="h-5 w-5 text-green-500" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p><strong>Titre:</strong> {intervention.title}</p>
                      <p><strong>Description:</strong> {intervention.description}</p>
                      <p><strong>Date:</strong> {new Date(intervention.date).toLocaleDateString()}</p>
                      <p><strong>Coût:</strong> {intervention.cost}€</p>
                      <p><strong>Statut:</strong> {intervention.status}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
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
    </div>
  );
};
