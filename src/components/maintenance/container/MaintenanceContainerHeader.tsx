
import React from "react";
import { Wrench } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

export const MaintenanceContainerHeader = () => {
  const { t } = useLocale();

  return (
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
  );
};
