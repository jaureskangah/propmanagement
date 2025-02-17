
import { useAuth } from "@/components/AuthProvider";
import AppSidebar from "@/components/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Bell, Lock, User, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { EditProfileDialog } from "@/components/settings/EditProfileDialog";
import { ChangePasswordDialog } from "@/components/settings/ChangePasswordDialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

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

  const updateNotificationPreference = async (type: 'push_notifications' | 'email_updates', value: boolean) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ [type]: value })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Preferences updated",
        description: "Your notification preferences have been saved."
      });

      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating preferences.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex h-screen">
      <AppSidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-6 p-8 pb-16">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Settings</h1>
          </div>

          <div className="grid gap-6">
            {/* Profile */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile
                </CardTitle>
                <CardDescription>
                  Manage your personal information
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
                        <p className="font-medium">First Name</p>
                        <p className="text-sm text-muted-foreground">
                          {profile?.first_name || '-'}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">Last Name</p>
                        <p className="text-sm text-muted-foreground">
                          {profile?.last_name || '-'}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                    <div className="flex justify-end">
                      <EditProfileDialog
                        initialData={{
                          first_name: profile?.first_name || '',
                          last_name: profile?.last_name || '',
                        }}
                        onProfileUpdate={refetch}
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Security
                </CardTitle>
                <CardDescription>
                  Manage your security settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChangePasswordDialog />
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
                  Configure your notification preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Push notifications</p>
                    <p className="text-sm text-muted-foreground">Receive push notifications</p>
                  </div>
                  <Switch 
                    checked={profile?.push_notifications ?? true}
                    onCheckedChange={(checked) => updateNotificationPreference('push_notifications', checked)}
                    disabled={isLoading}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Email updates</p>
                    <p className="text-sm text-muted-foreground">Receive email updates</p>
                  </div>
                  <Switch 
                    checked={profile?.email_updates ?? true}
                    onCheckedChange={(checked) => updateNotificationPreference('email_updates', checked)}
                    disabled={isLoading}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Appearance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Moon className="h-5 w-5" />
                  Appearance
                </CardTitle>
                <CardDescription>
                  Customize the application appearance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Dark theme</p>
                    <p className="text-sm text-muted-foreground">Toggle between light and dark theme</p>
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
    </div>
  );
}
