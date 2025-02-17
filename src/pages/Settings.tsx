import { useAuth } from "@/components/AuthProvider";
import AppSidebar from "@/components/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Bell, Lock, User, Globe, Moon, Mail } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { EditProfileDialog } from "@/components/settings/EditProfileDialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function Settings() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);

  const { data: profile, isLoading, refetch } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  return (
    <div className="flex h-screen">
      <AppSidebar />
      <div className="flex-1 space-y-6 p-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Paramètres</h1>
        </div>

        <div className="grid gap-6">
          {/* Profil */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profil
              </CardTitle>
              <CardDescription>
                Gérez vos informations personnelles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium">Prénom</p>
                      <p className="text-sm text-muted-foreground">
                        {profile?.first_name || '-'}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Nom</p>
                      <p className="text-sm text-muted-foreground">
                        {profile?.last_name || '-'}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                  <div>
                    <p className="font-medium">Téléphone</p>
                    <p className="text-sm text-muted-foreground">
                      {profile?.phone || '-'}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Entreprise</p>
                    <p className="text-sm text-muted-foreground">
                      {profile?.company || '-'}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Poste</p>
                    <p className="text-sm text-muted-foreground">
                      {profile?.position || '-'}
                    </p>
                  </div>
                  <div className="flex justify-end">
                    <EditProfileDialog
                      initialData={{
                        first_name: profile?.first_name || '',
                        last_name: profile?.last_name || '',
                        phone: profile?.phone || '',
                        company: profile?.company || '',
                        position: profile?.position || '',
                      }}
                      onProfileUpdate={refetch}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Sécurité */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Sécurité
              </CardTitle>
              <CardDescription>
                Gérez vos paramètres de sécurité
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline">Changer le mot de passe</Button>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>
                Configurez vos préférences de notification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Notifications push</p>
                  <p className="text-sm text-muted-foreground">Recevoir des notifications push</p>
                </div>
                <Switch 
                  checked={notifications} 
                  onCheckedChange={setNotifications}
                />
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Mises à jour par email</p>
                  <p className="text-sm text-muted-foreground">Recevoir des mises à jour par email</p>
                </div>
                <Switch 
                  checked={emailUpdates} 
                  onCheckedChange={setEmailUpdates}
                />
              </div>
            </CardContent>
          </Card>

          {/* Apparence */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Moon className="h-5 w-5" />
                Apparence
              </CardTitle>
              <CardDescription>
                Personnalisez l'apparence de l'application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Thème sombre</p>
                  <p className="text-sm text-muted-foreground">Basculer entre le thème clair et sombre</p>
                </div>
                <Switch 
                  checked={theme === "dark"} 
                  onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
