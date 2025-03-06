
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/components/providers/LocaleProvider";

interface AddMaintenanceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  tenantId: string;
}

export const AddMaintenanceDialog = ({
  isOpen,
  onClose,
  onSuccess,
  tenantId
}: AddMaintenanceDialogProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [photos, setPhotos] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { t } = useLocale();

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority("Medium");
    setPhotos([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast({
        title: t('error'),
        description: t('pleaseFillAllFields'),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Get current user's tenant ID
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not authenticated");

      const { data: tenantData, error: tenantError } = await supabase
        .from("tenants")
        .select("id")
        .eq("tenant_profile_id", userData.user.id)
        .single();

      if (tenantError || !tenantData) throw new Error("Tenant not found");

      // Upload photos if any
      const photoUrls: string[] = [];
      
      if (photos.length > 0) {
        for (const photo of photos) {
          const fileExt = photo.name.split('.').pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `${tenantData.id}/${fileName}`;
          
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
        .from("maintenance_requests")
        .insert({
          tenant_id: tenantData.id,
          title: title.trim(),
          description: description.trim(),
          issue: title.trim(),
          priority,
          photos: photoUrls,
          status: "Pending",
          is_from_tenant: true
        });

      if (error) throw error;

      toast({
        title: t('success'),
        description: t('maintenanceRequestSubmitted'),
      });

      // Reset form and close dialog
      resetForm();
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error adding maintenance request:", error);
      toast({
        title: t('error'),
        description: t('errorSubmittingRequest'),
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('newMaintenanceRequest')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">{t('title')}</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('maintenanceRequestTitlePlaceholder')}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">{t('description')}</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('maintenanceDescriptionPlaceholder')}
              className="min-h-[100px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">{t('priority')}</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger>
                <SelectValue placeholder={t('selectPriority')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">{t('low')}</SelectItem>
                <SelectItem value="Medium">{t('medium')}</SelectItem>
                <SelectItem value="High">{t('high')}</SelectItem>
                <SelectItem value="Urgent">{t('urgent')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="photos">{t('photos')}</Label>
            <Input
              id="photos"
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoChange}
              className="cursor-pointer"
            />
            {photos.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {photos.length} {t('photosSelected')}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => {
              resetForm();
              onClose();
            }}>
              {t('cancel')}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#ea384c] hover:bg-[#ea384c]/90"
            >
              {isSubmitting ? t('submitting') : t('submitRequest')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
