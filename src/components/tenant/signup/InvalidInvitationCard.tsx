
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const InvalidInvitationCard = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-red-600">
            Lien invalide
          </CardTitle>
          <CardDescription>
            Ce lien d'invitation n'est pas valide ou a expiré.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};
