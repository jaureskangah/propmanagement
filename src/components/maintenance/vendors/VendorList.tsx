import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { VendorCard } from "./VendorCard";
import { VendorDialog } from "./VendorDialog";
import { useToast } from "@/hooks/use-toast";
import { Vendor } from "@/types/vendor";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const VendorList = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState<Vendor | null>(null);
  const { toast } = useToast();

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
  const filteredVendors = selectedSpecialty
    ? vendors.filter(vendor => vendor.specialty === selectedSpecialty)
    : vendors;
  const emergencyContacts = vendors.filter(vendor => vendor.emergency_contact);

  const handleEdit = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setDialogOpen(true);
  };

  const handleDelete = async (vendor: Vendor) => {
    setVendorToDelete(vendor);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!vendorToDelete) return;

    try {
      const { error } = await supabase
        .from('vendors')
        .delete()
        .eq('id', vendorToDelete.id);

      if (error) throw error;

      toast({ title: "Prestataire supprimé avec succès" });
      refetch();
    } catch (error) {
      console.error("Error deleting vendor:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression",
        variant: "destructive"
      });
    } finally {
      setDeleteDialogOpen(false);
      setVendorToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Prestataires</h2>
        <Button onClick={() => {
          setSelectedVendor(undefined);
          setDialogOpen(true);
        }} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Ajouter un Prestataire
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Tous les Prestataires</TabsTrigger>
          <TabsTrigger value="emergency">Contacts d'Urgence</TabsTrigger>
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
              <VendorCard
                key={vendor.id}
                vendor={vendor}
                onEdit={handleEdit}
                onDelete={handleDelete}
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
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <VendorDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        vendor={selectedVendor}
        onSuccess={refetch}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Cela supprimera définitivement le prestataire
              et toutes les données associées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};