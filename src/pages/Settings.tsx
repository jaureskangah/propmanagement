
import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Navigate } from "react-router-dom";
import AppSidebar from "@/components/AppSidebar";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Loader2, Save } from "lucide-react";
import { useSidebar } from "@/components/sidebar/ModernSidebar";
import { useIsMobile } from "@/hooks/use-mobile";

const SettingsContent = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company: '',
    position: '',
  });
  const { toast } = useToast();
  const { open } = useSidebar();
  const isMobile = useIsMobile();

  // Check if user is a tenant and redirect appropriately
  const isTenantUser = user?.user_metadata?.is_tenant_user;

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email: data.email || user?.email || '',
          phone: data.phone || '',
          company: data.company || '',
          position: data.position || '',
        });
      } else {
        // If no profile exists, use user data
        setProfile({
          first_name: user?.user_metadata?.first_name || '',
          last_name: user?.user_metadata?.last_name || '',
          email: user?.email || '',
          phone: '',
          company: '',
          position: '',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger le profil",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user?.id,
          first_name: profile.first_name,
          last_name: profile.last_name,
          email: profile.email,
          phone: profile.phone,
          company: profile.company,
          position: profile.position,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été sauvegardées avec succès",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le profil",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn(
      "p-6 md:p-8 pt-24 md:pt-8 transition-all duration-300",
      !isMobile && (open ? "md:ml-[270px]" : "md:ml-[80px]")
    )}>      
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="space-y-6 max-w-4xl"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Paramètres</h1>
          <p className="text-muted-foreground">
            Gérez vos informations personnelles et les paramètres de votre compte
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>Profil</span>
            </CardTitle>
            <CardDescription>
              Gérez vos informations personnelles et les paramètres de votre compte
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">Prénom</Label>
                <Input
                  id="first_name"
                  value={profile.first_name}
                  onChange={(e) => setProfile(prev => ({ ...prev, first_name: e.target.value }))}
                  placeholder="Votre prénom"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Nom</Label>
                <Input
                  id="last_name"
                  value={profile.last_name}
                  onChange={(e) => setProfile(prev => ({ ...prev, last_name: e.target.value }))}
                  placeholder="Votre nom"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                placeholder="votre@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Votre numéro de téléphone"
              />
            </div>

            {!isTenantUser && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="company">Entreprise</Label>
                  <Input
                    id="company"
                    value={profile.company}
                    onChange={(e) => setProfile(prev => ({ ...prev, company: e.target.value }))}
                    placeholder="Nom de votre entreprise"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">Poste</Label>
                  <Input
                    id="position"
                    value={profile.position}
                    onChange={(e) => setProfile(prev => ({ ...prev, position: e.target.value }))}
                    placeholder="Votre poste"
                  />
                </div>
              </>
            )}

            <div className="pt-4">
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Sauvegarder
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {isTenantUser && (
          <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="text-blue-800">Compte Locataire</CardTitle>
              <CardDescription className="text-blue-700">
                Vous êtes connecté en tant que locataire. Certaines options sont limitées à votre profil.
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </motion.div>
    </div>
  );
};

const Settings = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const isTenantUser = user?.user_metadata?.is_tenant_user;

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

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar isTenant={isTenantUser} />
      <SettingsContent />
    </div>
  );
};

export default Settings;
