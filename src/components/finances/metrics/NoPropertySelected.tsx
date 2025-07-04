
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Building2 } from "lucide-react";

interface NoPropertySelectedProps {
  type: string;
}

export function NoPropertySelected({ type }: NoPropertySelectedProps) {
  const { t } = useLocale();
  
  return (
    <Card className="bg-muted/20 border-dashed">
      <CardContent className="p-8 text-center text-muted-foreground flex flex-col items-center justify-center gap-3">
        <Building2 className="h-12 w-12 text-muted-foreground/50 mb-2" />
        <h3 className="text-lg font-medium">{t('selectProperty')}</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          {t('pleaseSelectProperty')}
        </p>
      </CardContent>
    </Card>
  );
}
