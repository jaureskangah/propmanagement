
import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocale } from '@/components/providers/LocaleProvider';
import { useTenantInvitation } from '@/hooks/tenant/useTenantInvitation';
import { TenantSignupCard } from '@/components/tenant/signup/TenantSignupCard';
import { TenantSignupForm } from '@/components/tenant/signup/TenantSignupForm';
import { useTenantSignup } from '@/hooks/tenant/useTenantSignup';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const TenantSignup = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useLocale();
  const navigate = useNavigate();
  const { tenantData, invitationToken } = useTenantInvitation();
  const { loading, signupStatus, signUpTenant } = useTenantSignup();
  const [signupSuccess, setSignupSuccess] = useState(false);

  const handleSignupSuccess = () => {
    setSignupSuccess(true);
    // Rediriger vers le dashboard locataire après un court délai
    setTimeout(() => {
      navigate('/tenant/dashboard');
    }, 2000);
  };

  const handleFormSubmit = async (values: { password: string; confirmPassword: string }) => {
    await signUpTenant(values, tenantData, invitationToken);
  };

  // Surveiller les changements de signupStatus
  useEffect(() => {
    if (signupStatus === 'success') {
      handleSignupSuccess();
    }
  }, [signupStatus]);

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
      <TenantSignupCard tenantData={tenantData}>
        <TenantSignupForm 
          onSubmit={handleFormSubmit}
          loading={loading}
          signupStatus={signupStatus}
        />
      </TenantSignupCard>
    </div>
  );
};

export default TenantSignup;
