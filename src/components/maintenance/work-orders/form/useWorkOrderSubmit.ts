
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useWorkOrderForm } from "./WorkOrderFormContext";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useNotification } from "@/hooks/useNotification";

interface UseWorkOrderSubmitProps {
  onSuccess: () => void;
}

export const useWorkOrderSubmit = ({ onSuccess }: UseWorkOrderSubmitProps) => {
  const { t } = useLocale();
  const notification = useNotification();
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
      notification.error(t("pleaseFillAllFields"));
      return false;
    }
    return true;
  };

  const submitWorkOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      notification.info(t("processingWorkOrder"));

      const photoUrls: string[] = [];
      if (photos.length > 0) {
        for (const photo of photos) {
          const fileExt = photo.name.split('.').pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `work-orders/${fileName}`;
          
          const { error: uploadError } = await supabase.storage
            .from('tenant_documents')
            .upload(filePath, photo);
            
          if (uploadError) throw uploadError;
          
          const { data: { publicUrl } } = supabase.storage
            .from('tenant_documents')
            .getPublicUrl(filePath);
            
          photoUrls.push(publicUrl);
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

      notification.success(t("workOrderCreated"));
      
      resetForm();
      onSuccess();
      
    } catch (error: any) {
      console.error("Erreur lors de la création du bon de travail:", error);
      notification.error(t("errorCreatingWorkOrder"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitWorkOrder };
};
