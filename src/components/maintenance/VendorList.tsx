import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, Star, History, Phone } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

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

interface VendorListProps {
  onAddVendor: () => void;
}

export const VendorList = ({ onAddVendor }: VendorListProps) => {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);

  const { data: vendors = [], isLoading: isLoadingVendors } = useQuery({
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
  
  const filteredVendors = selectedSpecialty
    ? vendors.filter(vendor => vendor.specialty === selectedSpecialty)
    : vendors;

  const emergencyContacts = vendors.filter(vendor => vendor.emergency_contact);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Prestataires</h2>
        <Button onClick={onAddVendor} className="flex items-center gap-2">
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
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedSpecialty === null ? "default" : "outline"}
              onClick={() => setSelectedSpecialty(null)}
            >
              Tous
            </Button>
            {specialties.map(specialty => (
              <Button
                key={specialty}
                variant={selectedSpecialty === specialty ? "default" : "outline"}
                onClick={() => setSelectedSpecialty(specialty)}
              >
                {specialty}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVendors.map((vendor) => (
              <Card key={vendor.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{vendor.name}</CardTitle>
                    <Users className="h-5 w-5 text-blue-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p><strong>Spécialité:</strong> {vendor.specialty}</p>
                    <p><strong>Téléphone:</strong> {vendor.phone}</p>
                    <p><strong>Email:</strong> {vendor.email}</p>
                    <p><strong>Note:</strong> {vendor.rating}/5</p>
                    {vendor.emergency_contact && (
                      <p className="text-red-500 font-semibold">Contact d'urgence</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="emergency">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {emergencyContacts.map((vendor) => (
              <Card key={vendor.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{vendor.name}</CardTitle>
                    <Phone className="h-5 w-5 text-red-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p><strong>Spécialité:</strong> {vendor.specialty}</p>
                    <p><strong>Téléphone:</strong> {vendor.phone}</p>
                    <p><strong>Email:</strong> {vendor.email}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reviews">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((review) => {
              const vendor = vendors.find(v => v.id === review.vendor_id);
              return (
                <Card key={review.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{vendor?.name}</CardTitle>
                      <Star className="h-5 w-5 text-yellow-500" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p><strong>Note:</strong> {review.rating}/5</p>
                      <p>{review.comment}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
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
    </div>
  );
};