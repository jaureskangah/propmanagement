
import React from 'react';
import { Navigate } from 'react-router-dom';
import AppSidebar from "@/components/AppSidebar";
import SettingsPageHeader from "@/components/settings/SettingsPageHeader";
import { ProfileSection } from "@/components/settings/ProfileSection";
import { SecuritySection } from "@/components/settings/SecuritySection";
import { NotificationsSection } from "@/components/settings/NotificationsSection";
import { AppearanceSection } from "@/components/settings/AppearanceSection";
import { LanguageSection } from "@/components/settings/LanguageSection";
import { useAuth } from '@/components/AuthProvider';
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Profile } from '@/types/profile';

const Settings = () => {
  const { isAuthenticated, loading, user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  // Fetch profile data
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data as Profile | null;
    },
    enabled: !!user?.id,
  });

  // Profile update mutation
  const profileUpdateMutation = useMutation({
    mutationFn: async (updates: Partial<Profile>) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été sauvegardées avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le profil.",
        variant: "destructive",
      });
    },
  });

  const handleProfileUpdate = () => {
    queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
  };

  const handleNotificationUpdate = async (type: 'push_notifications' | 'email_updates', value: boolean) => {
    await profileUpdateMutation.mutateAsync({ [type]: value });
  };

  const handleThemeChange = (isDark: boolean) => {
    setTheme(isDark ? 'dark' : 'light');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Vérifier si l'utilisateur est un locataire pour afficher la bonne sidebar
  const isTenantUser = user?.user_metadata?.is_tenant_user === true;

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar 
        isTenant={isTenantUser} 
        isCollapsed={sidebarCollapsed} 
        setIsCollapsed={setSidebarCollapsed} 
      />
      <main className={cn(
        "pt-16 md:pt-8 transition-all duration-300",
        sidebarCollapsed ? "md:ml-[80px]" : "md:ml-[270px]"
      )}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="pb-8"
        >
          <div className="container mx-auto px-4 md:px-6 lg:px-8 space-y-6 max-w-4xl">
            <SettingsPageHeader userEmail={user?.email} />
            
            <div className="grid gap-6">
              <ProfileSection 
                profile={profile}
                isLoading={profileLoading}
                userEmail={user?.email}
                onProfileUpdate={handleProfileUpdate}
              />
              <SecuritySection />
              <NotificationsSection 
                profile={profile}
                isLoading={profileLoading}
                onUpdatePreference={handleNotificationUpdate}
              />
              <AppearanceSection 
                theme={theme}
                onThemeChange={handleThemeChange}
              />
              <LanguageSection />
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Settings;
