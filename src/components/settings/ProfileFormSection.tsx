
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

interface ProfileData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
}

interface ProfileFormSectionProps {
  profile: ProfileData;
  onProfileChange: (profile: ProfileData) => void;
  onSave: () => Promise<void>;
  isLoading: boolean;
  isTenantUser?: boolean;
}

export const ProfileFormSection = ({ 
  profile, 
  onProfileChange, 
  onSave, 
  isLoading,
  isTenantUser = false 
}: ProfileFormSectionProps) => {
  const { t } = useLocale();

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    onProfileChange({ ...profile, [field]: value });
  };

  return (
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
              onChange={(e) => handleInputChange('first_name', e.target.value)}
              placeholder="Votre prénom"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last_name">Nom</Label>
            <Input
              id="last_name"
              value={profile.last_name}
              onChange={(e) => handleInputChange('last_name', e.target.value)}
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
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="votre@email.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <Input
            id="phone"
            value={profile.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
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
                onChange={(e) => handleInputChange('company', e.target.value)}
                placeholder="Nom de votre entreprise"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Poste</Label>
              <Input
                id="position"
                value={profile.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                placeholder="Votre poste"
              />
            </div>
          </>
        )}

        <div className="pt-4">
          <Button onClick={onSave} disabled={isLoading}>
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
  );
};
