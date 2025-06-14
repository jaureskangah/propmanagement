
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

interface TenantData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  properties?: {
    name: string;
  };
}

interface TenantSignupCardProps {
  tenantData: TenantData | null;
  children: React.ReactNode;
}

export const TenantSignupCard = ({ tenantData, children }: TenantSignupCardProps) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Créer votre compte locataire
          </CardTitle>
          <CardDescription>
            {tenantData ? (
              <>
                Bonjour <strong>{tenantData.name}</strong>,<br />
                Créez votre mot de passe pour accéder à votre espace locataire.
              </>
            ) : (
              "Chargement de vos informations..."
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tenantData ? (
            <>
              <div className="mb-6 p-4 bg-muted rounded-lg">
                <div className="flex items-center mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <span className="font-medium">Informations pré-remplies</span>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p><strong>Nom :</strong> {tenantData.name}</p>
                  <p><strong>Email :</strong> {tenantData.email}</p>
                  {tenantData.properties && (
                    <p><strong>Propriété :</strong> {tenantData.properties.name}</p>
                  )}
                </div>
              </div>
              {children}
            </>
          ) : (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
