
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, Settings } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useTenantData } from "@/hooks/tenant/dashboard/useTenantData";
import { TenantDiagnostic } from "./TenantDiagnostic";

export const NoTenantProfile = () => {
  const { user } = useAuth();
  const { fetchTenantData } = useTenantData();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showDiagnostic, setShowDiagnostic] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchTenantData();
    } finally {
      setIsRefreshing(false);
    }
  };

  if (showDiagnostic) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <Button 
            variant="outline" 
            onClick={() => setShowDiagnostic(false)}
            size="sm"
          >
            ← Retour
          </Button>
        </div>
        <TenantDiagnostic />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="h-6 w-6 text-orange-600" />
            </div>
            <CardTitle className="text-orange-800">
              Profil locataire non trouvé
            </CardTitle>
            <CardDescription className="text-orange-700">
              Votre compte n'est pas encore lié à un profil locataire dans le système.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-white/50 p-4 rounded-lg">
              <h3 className="font-semibold text-orange-800 mb-2">
                Informations de votre compte:
              </h3>
              <div className="text-sm space-y-1 text-orange-700">
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Nom:</strong> {user?.user_metadata?.first_name} {user?.user_metadata?.last_name}</p>
                <p><strong>Type d'utilisateur:</strong> {user?.user_metadata?.is_tenant_user ? 'Locataire' : 'Standard'}</p>
              </div>
            </div>

            <div className="bg-white/50 p-4 rounded-lg">
              <h3 className="font-semibold text-orange-800 mb-2">
                Solutions possibles:
              </h3>
              <ul className="text-sm text-orange-700 space-y-2">
                <li>• Contactez votre gestionnaire immobilier pour qu'il vous ajoute au système</li>
                <li>• Vérifiez que vous utilisez la bonne adresse email</li>
                <li>• Si vous venez de créer votre compte, attendez quelques minutes et rafraîchissez</li>
                <li>• Utilisez l'outil de diagnostic ci-dessous pour identifier le problème</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex-1"
              >
                {isRefreshing ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Vérification...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Rafraîchir
                  </>
                )}
              </Button>
              
              <Button 
                onClick={() => setShowDiagnostic(true)}
                variant="outline"
                className="flex-1"
              >
                <Settings className="mr-2 h-4 w-4" />
                Diagnostic
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-orange-600">
                Si le problème persiste, contactez le support technique avec votre adresse email.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
