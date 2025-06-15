
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocale } from '@/components/providers/LocaleProvider';
import { useTenantInvitation } from '@/hooks/tenant/useTenantInvitation';
import { TenantSignupForm } from '@/components/auth/TenantSignupForm';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const TenantSignup = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useLocale();
  const navigate = useNavigate();
  const { tenantData, invitationToken } = useTenantInvitation();
  const [signupSuccess, setSignupSuccess] = useState(false);

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/tenant/dashboard" replace />;
  }

  // Show error if no valid invitation
  if (!invitationToken || !tenantData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
            <CardTitle className="text-xl text-destructive">
              Invitation invalide
            </CardTitle>
            <CardDescription>
              Ce lien d'invitation n'est pas valide ou a expiré.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const handleSignupSuccess = () => {
    setSignupSuccess(true);
    // Rediriger vers le dashboard locataire après un court délai
    setTimeout(() => {
      navigate('/tenant/dashboard');
    }, 2000);
  };

  if (signupSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <CardTitle className="text-xl text-green-600">
              Compte créé avec succès !
            </CardTitle>
            <CardDescription>
              Vous allez être redirigé vers votre tableau de bord...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Créer votre compte locataire
          </CardTitle>
          <CardDescription>
            Bienvenue {tenantData.name} !<br />
            Créez votre compte pour accéder au portail locataire.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <AlertDescription>
              <strong>Propriété :</strong> {tenantData.properties?.name || 'Non spécifiée'}<br />
              <strong>Email :</strong> {tenantData.email}
            </AlertDescription>
          </Alert>
          
          <TenantSignupForm 
            tenantData={tenantData}
            invitationToken={invitationToken}
            onSuccess={handleSignupSuccess}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TenantSignup;
