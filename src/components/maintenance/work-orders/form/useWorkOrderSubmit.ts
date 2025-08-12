
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useWorkOrderForm } from "./WorkOrderFormContext";

interface UseWorkOrderSubmitProps {
  onSuccess: () => void;
}

export const useWorkOrderSubmit = ({ onSuccess }: UseWorkOrderSubmitProps) => {
  const { toast } = useToast();
  const {
    title,
    description,
    propertyId,
    unit,
    cost,
    date,
    status,
    vendor,
    photos,
    setIsSubmitting,
    resetForm
  } = useWorkOrderForm();

  const validateForm = (): boolean => {
    if (!title || !description || !propertyId || !unit || !cost || !date || !vendor) {
      toast({
        title: "Champs manquants",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const submitWorkOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      toast({
        title: "Création en cours",
        description: "Traitement de votre bon de travail...",
      });

      const photoUrls: string[] = [];
      const { data: authData } = await supabase.auth.getUser();
      const userId = authData.user?.id;
      if (!userId) throw new Error("Not authenticated");

      if (photos.length > 0) {
        for (const photo of photos) {
          const fileExt = photo.name.split('.').pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `${userId}/work-orders/${fileName}`;
          
          const { error: uploadError } = await supabase.storage
            .from('maintenance_photos')
            .upload(filePath, photo);
            
          if (uploadError) throw uploadError;
          
          const { data: { signedUrl } } = await supabase.storage
            .from('maintenance_photos')
            .createSignedUrl(filePath, 60 * 60 * 24 * 7);
          
          if (signedUrl) {
            photoUrls.push(signedUrl);
          }
        }
      }

      const { error } = await supabase
        .from('vendor_interventions')
        .insert({
          title,
          description,
          date: date?.toISOString(),
          cost: parseFloat(cost),
          status,
          vendor_id: vendor,
          photos: photoUrls,
          property_id: propertyId,
          unit_number: unit,
          user_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Le bon de travail a été créé avec succès",
      });
      
      resetForm();
      onSuccess();
      
    } catch (error: any) {
      console.error("Erreur lors de la création du bon de travail:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le bon de travail",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitWorkOrder };
};
