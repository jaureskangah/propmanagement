
import React from "react";
import { Wrench } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

export const MaintenanceContainerHeader = () => {
  const { t } = useLocale();

  return (
    <div className="mb-8">
      <div className="bg-gradient-to-r from-background to-muted/30 backdrop-blur-sm p-6 rounded-xl border border-border/40 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Wrench className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {t('maintenance')}
          </h1>
        </div>
        <p className="text-muted-foreground mt-2">
          Gérez toutes vos activités de maintenance depuis un seul endroit
        </p>
      </div>
    </div>
  );
};
