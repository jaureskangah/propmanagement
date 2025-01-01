import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";
import { BasicInfoFields } from "./form/BasicInfoFields";
import { FileUploadField } from "./form/FileUploadField";
import { VendorFormValues } from "@/types/vendor";

const vendorFormSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  specialty: z.string().min(2, "La spécialité doit contenir au moins 2 caractères"),
  phone: z.string().min(10, "Le numéro de téléphone doit contenir au moins 10 caractères"),
  email: z.string().email("Email invalide"),
  emergency_contact: z.boolean().default(false),
  documents: z.array(z.instanceof(File)).optional(),
  photos: z.array(z.instanceof(File)).optional(),
  existingPhotos: z.array(z.string()).optional(),
});

interface VendorFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  defaultValues?: Partial<VendorFormValues>;
}

export const VendorForm = ({ onSuccess, onCancel, defaultValues }: VendorFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<VendorFormValues>({
    resolver: zodResolver(vendorFormSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      specialty: defaultValues?.specialty || "",
      phone: defaultValues?.phone || "",
      email: defaultValues?.email || "",
      emergency_contact: defaultValues?.emergency_contact || false,
      documents: [],
      photos: [],
      existingPhotos: defaultValues?.existingPhotos || [],
    },
  });

  const uploadFiles = async (files: File[], path: string) => {
    const uploadedUrls: string[] = [];
    
    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${path}/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('vendor_files')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('vendor_files')
        .getPublicUrl(filePath);

      uploadedUrls.push(publicUrl);
    }

    return uploadedUrls;
  };

  const onSubmit = async (data: VendorFormValues) => {
    if (!user?.id) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour effectuer cette action",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let photoUrls: string[] = data.existingPhotos || [];
      if (data.photos?.length) {
        const newPhotoUrls = await uploadFiles(data.photos, 'photos');
        photoUrls = [...photoUrls, ...newPhotoUrls];
      }

      const vendorData = {
        name: data.name,
        specialty: data.specialty,
        phone: data.phone,
        email: data.email,
        emergency_contact: data.emergency_contact,
        user_id: user.id,
        photos: photoUrls,
      };

      if (defaultValues?.name) {
        // Update
        const { error: updateError } = await supabase
          .from("vendors")
          .update(vendorData)
          .eq("name", defaultValues.name);

        if (updateError) throw updateError;
      } else {
        // Create
        const { error: insertError, data: newVendor } = await supabase
          .from("vendors")
          .insert(vendorData)
          .select()
          .single();

        if (insertError) throw insertError;

        // Upload documents if any
        if (data.documents?.length && newVendor) {
          const documentUrls = await uploadFiles(data.documents, 'documents');
          
          const documentsData = documentUrls.map(url => ({
            vendor_id: newVendor.id,
            name: data.documents![0].name,
            file_url: url,
            type: data.documents![0].type,
            user_id: user.id,
          }));

          const { error: docError } = await supabase
            .from("vendor_documents")
            .insert(documentsData);

          if (docError) throw docError;
        }
      }

      toast({ title: defaultValues ? "Prestataire mis à jour" : "Prestataire ajouté" });
      onSuccess();
    } catch (error) {
      console.error("Error saving vendor:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <BasicInfoFields form={form} />

        <FileUploadField
          form={form}
          name="documents"
          label="Documents"
          accept=".pdf,.doc,.docx"
          multiple
        />

        <FileUploadField
          form={form}
          name="photos"
          label="Photos"
          accept="image/*"
          multiple
          existingFiles={defaultValues?.existingPhotos}
        />

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Enregistrement..." : defaultValues ? "Mettre à jour" : "Ajouter"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
