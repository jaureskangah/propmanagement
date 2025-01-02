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
    console.log("Submitting work order form...");

    if (!title || !description || !propertyId || !unit || !cost || !date || !vendor) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("Uploading photos...");
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

      console.log("Creating work order in database...");
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

      if (error) {
        console.error("Error creating work order:", error);
        throw error;
      }

      console.log("Work order created successfully");
      toast({
        title: "Success",
        description: "Work order created successfully",
      });
      
      resetForm();
      onSuccess();
      onClose();
      
    } catch (error: any) {
      console.error("Error creating work order:", error);
      toast({
        title: "Error",
        description: "Unable to create work order",
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
          <DialogTitle>Create New Work Order</DialogTitle>
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
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-500 hover:bg-blue-600"
            >
              {isSubmitting ? "Creating..." : "Create Order"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};