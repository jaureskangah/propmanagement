
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
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
              <div>
                <p className="font-medium">{t('firstName')}</p>
                <p className="text-sm text-muted-foreground">
                  {profile?.first_name || '-'}
                </p>
              </div>
              <div>
                <p className="font-medium">{t('lastName')}</p>
                <p className="text-sm text-muted-foreground">
                  {profile?.last_name || '-'}
                </p>
              </div>
            </div>
            <div>
              <p className="font-medium">{t('email')}</p>
              <p className="text-sm text-muted-foreground">{userEmail}</p>
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
