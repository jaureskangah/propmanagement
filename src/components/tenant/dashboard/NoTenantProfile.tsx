
import { AlertTriangle, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/components/providers/LocaleProvider";

export const NoTenantProfile = () => {
  const { t } = useLocale();

  const handleContactSupport = () => {
    window.open('mailto:contact@propmanagement.app', '_blank');
  };

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 space-y-6 max-w-4xl">
      <Card className="border-orange-200 bg-orange-50/50">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-16 w-16 text-orange-500" />
          </div>
          <CardTitle className="text-xl text-orange-800">
            Profil locataire non trouvé
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-orange-700 mb-6">
            Votre compte utilisateur existe, mais aucun profil de locataire n'est associé à votre compte. 
            Cela peut arriver si :
          </p>
          
          <div className="bg-white rounded-lg p-4 text-left space-y-2">
            <ul className="list-disc list-inside text-orange-700 space-y-1">
              <li>Votre propriétaire n'a pas encore terminé la configuration de votre profil</li>
              <li>Votre invitation n'a pas été correctement traitée</li>
              <li>Il y a eu un problème technique lors de la création de votre profil</li>
            </ul>
          </div>

          <div className="pt-4">
            <p className="text-orange-700 mb-4">
              Veuillez contacter votre propriétaire ou notre support technique pour résoudre ce problème.
            </p>
            
            <Button 
              onClick={handleContactSupport}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <Mail className="h-4 w-4 mr-2" />
              Contacter le support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
