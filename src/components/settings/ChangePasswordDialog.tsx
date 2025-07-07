
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

export function ChangePasswordDialog() {
  const { toast } = useToast();
  const { t } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: t('error'),
        description: t('passwordMismatch'),
        variant: "destructive"
      });
      return;
    }

    if (formData.newPassword.length < 6) {
      toast({
        title: t('error'),
        description: t('passwordTooShort'),
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ 
        password: formData.newPassword 
      });

      if (error) throw error;

      toast({
        title: t('passwordChanged'),
        description: t('passwordChangedMessage')
      });
      
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setIsOpen(false);
    } catch (error) {
      toast({
        title: t('error'),
        description: t('passwordChangeError'),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{t('changePassword')}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('changePassword')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">{t('currentPassword')}</Label>
            <Input
              id="currentPassword"
              type="password"
              value={formData.currentPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">{t('newPassword')}</Label>
            <Input
              id="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{t('confirmNewPassword')}</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              {t('cancel')}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('updating')}
                </>
              ) : (
                t('update')
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
