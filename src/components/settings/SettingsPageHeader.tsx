
import React from "react";
import { Settings, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/components/providers/LocaleProvider";

interface SettingsPageHeaderProps {
  userEmail?: string | null;
}

const SettingsPageHeader = ({ userEmail }: SettingsPageHeaderProps) => {
  const { t } = useLocale();

  return (
    <div className="mb-8 bg-gradient-to-r from-background to-muted/30 backdrop-blur-sm p-6 rounded-xl border border-border/40 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Settings className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {t('settings')}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t('profileDescription')}
            </p>
          </div>
        </div>
        {userEmail && (
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-sm px-3 py-1.5">
              <Info className="h-4 w-4 mr-1.5" />
              {userEmail}
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPageHeader;
