
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
import { Separator } from "@/components/ui/separator";
import { ChevronRight, Save } from "lucide-react";

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
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();

  const totalSteps = 3;

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
    setCurrentStep(1);
  };

  const navigateToStep = (step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
    }
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-700">Informations de base</h3>
            <BasicInfoFields
              title={title}
              setTitle={setTitle}
              description={description}
              setDescription={setDescription}
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-700">Localisation</h3>
            <PropertyUnitFields
              propertyId={propertyId}
              setPropertyId={setPropertyId}
              unit={unit}
              setUnit={setUnit}
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-700">Détails du travail</h3>
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
            <Separator className="my-4" />
            <PhotoUpload
              handlePhotoChange={handlePhotoChange}
              photos={photos}
            />
          </div>
        );
      default:
        return null;
    }
  };

  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-between my-6 px-2">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div key={index} className="flex items-center">
            <button
              type="button"
              onClick={() => navigateToStep(index + 1)}
              className={`flex items-center justify-center w-8 h-8 rounded-full font-medium transition-colors ${
                currentStep >= index + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {index + 1}
            </button>
            {index < totalSteps - 1 && (
              <div 
                className={`h-1 w-full min-w-[3rem] mx-2 ${
                  currentStep > index + 1 ? "bg-blue-600" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    );
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
          <DialogTitle className="text-xl font-bold">Créer un nouveau bon de travail</DialogTitle>
        </DialogHeader>
        
        {renderStepIndicator()}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {renderStepContent()}

          <div className="flex justify-between gap-2 pt-4">
            {currentStep > 1 && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigateToStep(currentStep - 1)}
              >
                Précédent
              </Button>
            )}
            <div className="flex-1" />
            {currentStep < totalSteps ? (
              <Button
                type="button"
                onClick={() => navigateToStep(currentStep + 1)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Suivant <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? "Création..." : "Enregistrer"}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
