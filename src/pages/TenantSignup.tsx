
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TenantSignupForm } from '@/components/auth/TenantSignupForm';
import { useTenantInvitation } from '@/hooks/tenant/useTenantInvitation';
import { Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const TenantSignup = () => {
  const [searchParams] = useSearchParams();
  const invitationParam = searchParams.get('invitation');
  const { tenantData, invitationToken } = useTenantInvitation();

  if (!invitationParam) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <CardTitle>Lien invalide</CardTitle>
            <CardDescription>
              Ce lien d'invitation n'est pas valide ou a expiré.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!tenantData || !invitationToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p>Vérification de l'invitation...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Créer votre compte locataire</CardTitle>
            <CardDescription>
              Bienvenue {tenantData.name}! Créez votre compte pour accéder à votre espace locataire.
            </CardDescription>
            {tenantData.properties && (
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium">Propriété</p>
                <p className="text-sm text-muted-foreground">{tenantData.properties.name}</p>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <TenantSignupForm
              tenantData={tenantData}
              invitationToken={invitationToken}
              onSuccess={() => {
                // Redirection handled in the form
              }}
            />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default TenantSignup;
