
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useLocale } from "@/components/providers/LocaleProvider";

export function NoPropertySelected() {
  const { t } = useLocale();
  
  return (
    <Card className="bg-muted/20">
      <CardContent className="p-6 text-center text-muted-foreground">
        {t('selectPropertyToViewMetrics')}
      </CardContent>
    </Card>
  );
}
