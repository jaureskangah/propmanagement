
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { BasicInfoFields } from "./form/BasicInfoFields";
import { CostDateFields } from "./form/CostDateFields";
import { VendorStatusFields } from "./form/VendorStatusFields";
import { PhotoUpload } from "./form/PhotoUpload";
import { PropertyUnitFields } from "./form/PropertyUnitFields";

interface CreateWorkOrderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  propertyId?: string;
}

export const CreateWorkOrderDialog = ({
  isOpen,
  onClose,
  onSuccess,
  propertyId: initialPropertyId,
}: CreateWorkOrderDialogProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [propertyId, setPropertyId] = useState<string | null>(initialPropertyId || null);
  const [unit, setUnit] = useState("");
  const [cost, setCost] = useState("");
  const [date, setDate] = useState<Date>();
  const [status, setStatus] = useState("Scheduled");
  const [vendor, setVendor] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPropertyId(initialPropertyId || null);
    setUnit("");
    setCost("");
    setDate(undefined);
    setVendor("");
    setPhotos([]);
    setStatus("Scheduled");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !propertyId || !unit || !cost || !date || !vendor) {
      toast({
        title: "Champs manquants",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      toast({
        title: "Création en cours",
        description: "Traitement de votre bon de travail...",
      });

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

      toast({
        title: "Succès",
        description: "Le bon de travail a été créé avec succès",
      });
      
      resetForm();
      onSuccess();
      onClose();
      
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

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(Array.from(e.target.files));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        resetForm();
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer un nouveau bon de travail</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <BasicInfoFields
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
          />

          <PropertyUnitFields
            propertyId={propertyId}
            setPropertyId={setPropertyId}
            unit={unit}
            setUnit={setUnit}
          />

          <CostDateFields
            cost={cost}
            setCost={setCost}
            date={date}
            setDate={setDate}
          />

          <VendorStatusFields
            vendor={vendor}
            setVendor={setVendor}
            status={status}
            setStatus={setStatus}
          />

          <PhotoUpload
            handlePhotoChange={handlePhotoChange}
            photos={photos}
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Création..." : "Créer le bon"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
