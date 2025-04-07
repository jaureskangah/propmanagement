
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLocale } from "@/components/providers/LocaleProvider";

const NotFound = () => {
  const navigate = useNavigate();
  const { t } = useLocale();

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-background">
      <div className="text-center space-y-6 max-w-md px-4">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-semibold">{t('pageNotFound') || "Page non trouvée"}</h2>
        <p className="text-muted-foreground">
          {t('pageNotFoundDesc') || "La page que vous recherchez n'existe pas ou a été déplacée."}
        </p>
        
        <div className="pt-4">
          <Button 
            onClick={() => navigate('/')}
            className="px-6"
          >
            {t('backToHome') || "Retour à l'accueil"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
