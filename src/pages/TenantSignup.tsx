
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { TenantSignupCard } from '@/components/tenant/signup/TenantSignupCard';
import { TenantSignupForm } from '@/components/tenant/signup/TenantSignupForm';
import { StatusDisplay } from '@/components/tenant/signup/StatusDisplay';
import { InvalidInvitationCard } from '@/components/tenant/signup/InvalidInvitationCard';
import { useTenantInvitation } from '@/hooks/tenant/useTenantInvitation';
import { useTenantSignup } from '@/hooks/tenant/useTenantSignup';
import { useToast } from '@/hooks/use-toast';

const TenantSignup = () => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const { tenantData, invitationToken } = useTenantInvitation();
  const { loading, signupStatus, signUpTenant } = useTenantSignup();

  const handleSubmit = async (values: { password: string; confirmPassword: string }) => {
    if (!tenantData || !invitationToken) {
      toast({
        title: "Erreur",
        description: "Données d'invitation manquantes.",
        variant: "destructive",
      });
      return;
    }

    await signUpTenant(values, tenantData, invitationToken);
  };

  // Rediriger si déjà authentifié
  if (isAuthenticated) {
    return <Navigate to="/tenant/dashboard" replace />;
  }

  // Afficher un message d'erreur si pas de token d'invitation
  if (!invitationToken) {
    return <InvalidInvitationCard />;
  }

  return (
    <TenantSignupCard tenantData={tenantData}>
      <StatusDisplay signupStatus={signupStatus} />
      <TenantSignupForm 
        onSubmit={handleSubmit}
        loading={loading}
        signupStatus={signupStatus}
      />
    </TenantSignupCard>
  );
};

export default TenantSignup;
