
import { User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { EditProfileDialog } from "./EditProfileDialog";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Profile } from "@/types/profile";

interface ProfileSectionProps {
  profile: Profile | null;
  isLoading: boolean;
  userEmail: string | undefined;
  onProfileUpdate: () => void;
}

export function ProfileSection({ profile, isLoading, userEmail, onProfileUpdate }: ProfileSectionProps) {
  const { t } = useLocale();

  return (
    <Card className="transition-all duration-300 hover:shadow-md overflow-hidden border-border">
      <div className="h-1 bg-blue-500" />
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
            <User className="h-5 w-5 text-blue-500 dark:text-blue-400" />
          </div>
          {t('profile')}
        </CardTitle>
        <CardDescription>
          {t('profileDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <p className="font-medium text-sm text-muted-foreground">{t('firstName')}</p>
                <p className="font-semibold mt-1">
                  {profile?.first_name || '-'}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <p className="font-medium text-sm text-muted-foreground">{t('lastName')}</p>
                <p className="font-semibold mt-1">
                  {profile?.last_name || '-'}
                </p>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <p className="font-medium text-sm text-muted-foreground">{t('email')}</p>
              <p className="font-semibold mt-1">{userEmail}</p>
            </div>
            <div className="flex justify-end">
              <EditProfileDialog
                initialData={{
                  first_name: profile?.first_name || '',
                  last_name: profile?.last_name || '',
                }}
                onProfileUpdate={onProfileUpdate}
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
