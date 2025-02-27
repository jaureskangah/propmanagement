
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

interface ProfileFormData {
  first_name: string;
  last_name: string;
}

export function EditProfileDialog({ 
  initialData,
  onProfileUpdate 
}: { 
  initialData: ProfileFormData;
  onProfileUpdate: () => void;
}) {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>(initialData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: t('profileUpdated'),
        description: t('preferencesUpdatedMessage')
      });
      
      onProfileUpdate();
      setIsOpen(false);
    } catch (error) {
      toast({
        title: t('error'),
        description: t('profileUpdateError'),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{t('edit')}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('updateProfile')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">{t('firstName')}</Label>
              <Input
                id="firstName"
                value={formData.first_name}
                onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">{t('lastName')}</Label>
              <Input
                id="lastName"
                value={formData.last_name}
                onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              {t('cancel')}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('saving')}
                </>
              ) : (
                t('save')
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
