
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface InvitationDetails {
  id: string;
  email: string;
  tenant_id: string;
  expires_at: string;
  status: string;
  tenant: {
    name: string;
    property_id: string;
    properties: {
      name: string;
      address: string;
    };
  };
}

const AcceptInvitation = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { user, signUp } = useAuth();
  const { toast } = useToast();
  
  const [invitation, setInvitation] = useState<InvitationDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState<'loading' | 'signup' | 'success' | 'error'>('loading');

  useEffect(() => {
    if (token) {
      validateInvitation();
    }
  }, [token]);

  const validateInvitation = async () => {
    try {
      const { data, error } = await supabase
        .from('tenant_invitations')
        .select(`
          *,
          tenants (
            name,
            property_id,
            properties (
              name,
              address
            )
          )
        `)
        .eq('token', token)
        .eq('status', 'pending')
        .single();

      if (error || !data) {
        setStep('error');
        toast({
          title: "Invitation invalide",
          description: "Cette invitation n'existe pas ou a expiré.",
          variant: "destructive",
        });
        return;
      }

      if (new Date(data.expires_at) < new Date()) {
        setStep('error');
        toast({
          title: "Invitation expirée",
          description: "Cette invitation a expiré. Contactez votre propriétaire.",
          variant: "destructive",
        });
        return;
      }

      setInvitation(data);
      setStep('signup');
    } catch (error) {
      console.error('Error validating invitation:', error);
      setStep('error');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 6 caractères.",
        variant: "destructive",
      });
      return;
    }

    setAccepting(true);

    try {
      // Create user account
      const { error: signUpError } = await signUp(invitation!.email, password);
      
      if (signUpError) {
        throw signUpError;
      }

      // Update invitation status
      const { error: updateError } = await supabase
        .from('tenant_invitations')
        .update({ status: 'accepted' })
        .eq('token', token);

      if (updateError) {
        throw updateError;
      }

      // Link tenant profile
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) {
        const { error: linkError } = await supabase
          .from('tenants')
          .update({ tenant_profile_id: userData.user.id })
          .eq('id', invitation!.tenant_id);

        if (linkError) {
          console.error('Error linking tenant profile:', linkError);
        }
      }

      setStep('success');
      
      toast({
        title: "Compte créé avec succès",
        description: "Bienvenue ! Vous pouvez maintenant accéder à votre portail locataire.",
      });

      setTimeout(() => {
        navigate('/tenant-dashboard');
      }, 2000);

    } catch (error: any) {
      console.error('Error accepting invitation:', error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la création du compte.",
        variant: "destructive",
      });
    } finally {
      setAccepting(false);
    }
  };

  if (loading || step === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Vérification de l'invitation...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Invitation invalide</h2>
            <p className="text-gray-600 mb-4">
              Cette invitation n'est pas valide ou a expiré.
            </p>
            <Button onClick={() => navigate('/')}>
              Retour à l'accueil
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Compte créé avec succès !</h2>
            <p className="text-gray-600 mb-4">
              Vous allez être redirigé vers votre portail locataire...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Rejoindre en tant que locataire</CardTitle>
        </CardHeader>
        <CardContent>
          {invitation && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900">Détails de l'invitation</h3>
              <p className="text-sm text-blue-700 mt-1">
                <strong>Propriété :</strong> {invitation.tenant.properties?.name}
              </p>
              <p className="text-sm text-blue-700">
                <strong>Adresse :</strong> {invitation.tenant.properties?.address}
              </p>
              <p className="text-sm text-blue-700">
                <strong>Email :</strong> {invitation.email}
              </p>
            </div>
          )}

          <form onSubmit={handleAcceptInvitation} className="space-y-4">
            <div>
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Choisissez un mot de passe"
                required
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmez votre mot de passe"
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={accepting}>
              {accepting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création du compte...
                </>
              ) : (
                'Créer mon compte'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AcceptInvitation;
