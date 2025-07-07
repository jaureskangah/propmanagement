
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";
import { Profile } from "@/types/profile";
import { useLocale } from "@/components/providers/LocaleProvider";

export const useNotificationPreferences = (profile: Profile | null) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useLocale();

  const updatePreference = async (
    type: 'push_notifications' | 'email_updates', 
    value: boolean
  ) => {
    if (!user || !profile) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ [type]: value })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: t('preferencesUpdated'),
        description: t('preferencesUpdatedMessage'),
      });
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast({
        title: t('error'),
        description: t('preferencesUpdateError'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    updatePreference,
  };
};
