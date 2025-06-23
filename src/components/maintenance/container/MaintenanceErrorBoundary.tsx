
import React from "react";
import { Wrench } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

export const MaintenanceErrorBoundary = () => {
  const { t } = useLocale();

  return (
    <div className="space-y-6 font-sans">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <Wrench className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {t('maintenance')}
          </h1>
        </div>
        <p className="text-muted-foreground mt-2">
          Gérez toutes vos activités de maintenance depuis un seul endroit
        </p>
      </div>
      <div className="text-center py-8">
        <p className="text-muted-foreground">Une erreur s'est produite lors du chargement.</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
        >
          Recharger la page
        </button>
      </div>
    </div>
  );
};
