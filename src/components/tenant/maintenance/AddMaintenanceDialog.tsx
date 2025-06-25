
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

    if (!tenantId) {
      toast({
        title: t('error'),
        description: t('tenantIdMissing'),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log("Starting maintenance request creation for tenant:", tenantId);
      
      // Get current user to determine if request is from tenant or admin
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        throw new Error(t('notAuthenticated'));
      }

      console.log("Current user:", userData.user.id);

      // Check if current user is the tenant themselves
      const { data: tenantCheck, error: tenantCheckError } = await supabase
        .from("tenants")
        .select("tenant_profile_id")
        .eq("id", tenantId)
        .single();

      if (tenantCheckError) {
        console.error("Error checking tenant:", tenantCheckError);
        throw new Error(t('tenantNotFound'));
      }

      const isFromTenant = tenantCheck.tenant_profile_id === userData.user.id;
      console.log("Is request from tenant:", isFromTenant);

      // Upload photos if any
      const photoUrls: string[] = [];
      
      if (photos.length > 0) {
        console.log("Uploading", photos.length, "photos");
        
        for (const photo of photos) {
          const fileExt = photo.name.split('.').pop();
          const fileName = `maintenance_${Date.now()}_${Math.random()}.${fileExt}`;
          const filePath = `maintenance/${tenantId}/${fileName}`;
          
          console.log("Uploading photo to:", filePath);
          
          const { error: uploadError } = await supabase.storage
            .from('tenant_documents')
            .upload(filePath, photo);
            
          if (uploadError) {
            console.error("Upload error:", uploadError);
            throw new Error(`${t('error')}: ${uploadError.message}`);
          }
          
          const { data: { publicUrl } } = supabase.storage
            .from('tenant_documents')
            .getPublicUrl(filePath);
            
          photoUrls.push(publicUrl);
          console.log("Photo uploaded successfully:", publicUrl);
        }
      }

      // Insert maintenance request
      const maintenanceData = {
        tenant_id: tenantId,
        title: title.trim(),
        description: description.trim(),
        issue: title.trim(),
        priority,
        photos: photoUrls,
        status: "Pending",
        is_from_tenant: isFromTenant
      };

      console.log("Inserting maintenance request:", maintenanceData);

      const { error: insertError } = await supabase
        .from("maintenance_requests")
        .insert(maintenanceData);

      if (insertError) {
        console.error("Insert error:", insertError);
        throw new Error(`${t('errorCreatingRequest')}: ${insertError.message}`);
      }

      console.log("Maintenance request created successfully");

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
        description: error.message || t('errorSubmittingRequest'),
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
