import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { fr } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Image, DollarSign, Calendar as CalendarIcon } from "lucide-react";

interface CreateWorkOrderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  propertyId: string;
}

export const CreateWorkOrderDialog = ({
  isOpen,
  onClose,
  onSuccess,
  propertyId,
}: CreateWorkOrderDialogProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [unit, setUnit] = useState("");
  const [cost, setCost] = useState("");
  const [date, setDate] = useState<Date>();
  const [status, setStatus] = useState("Planifié");
  const [vendor, setVendor] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !unit || !cost || !date || !vendor) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs requis",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Upload photos if any
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

      // Create work order
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
        });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "L'ordre de travail a été créé avec succès",
      });
      
      onSuccess();
      onClose();
      
      // Reset form
      setTitle("");
      setDescription("");
      setUnit("");
      setCost("");
      setDate(undefined);
      setVendor("");
      setPhotos([]);
      
    } catch (error: any) {
      console.error("Error creating work order:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer l'ordre de travail",
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Créer un nouvel ordre de travail</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Réparation plomberie salle de bain"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez le travail à effectuer..."
              className="min-h-[100px]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unit">Numéro d'unité</Label>
              <Input
                id="unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="Ex: A101"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost">Coût estimé (€)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  id="cost"
                  type="number"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  className="pl-10"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date prévue</Label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  locale={fr}
                  className="rounded-md border"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Prestataire</Label>
              <Select value={vendor} onValueChange={setVendor}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un prestataire" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">John's Plumbing</SelectItem>
                  <SelectItem value="2">Cool Air Services</SelectItem>
                  <SelectItem value="3">Electric Pro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Statut</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Planifié">Planifié</SelectItem>
                <SelectItem value="En cours">En cours</SelectItem>
                <SelectItem value="Terminé">Terminé</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="photos">Photos</Label>
            <div className="flex items-center gap-2">
              <Input
                id="photos"
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoChange}
                className="cursor-pointer"
              />
              <Image className="h-5 w-5 text-gray-500" />
            </div>
            {photos.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {photos.length} photo(s) sélectionnée(s)
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-500 hover:bg-blue-600"
            >
              {isSubmitting ? "Création..." : "Créer l'ordre"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};