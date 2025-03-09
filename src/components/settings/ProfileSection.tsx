
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
    <Card className="overflow-hidden border-none shadow-md transition-all hover:shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-50" />
      <div className="absolute top-0 h-1 w-full bg-gradient-to-r from-blue-400 to-indigo-500" />
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-2 text-xl">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <User className="h-5 w-5" />
          </div>
          {t('profile')}
        </CardTitle>
        <CardDescription className="text-sm opacity-75">
          {t('profileDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent className="relative space-y-4 pb-6">
        {isLoading ? (
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-white/60 p-3 shadow-sm">
                <p className="mb-1 font-medium text-blue-700">{t('firstName')}</p>
                <p className="text-sm text-slate-700">
                  {profile?.first_name || '-'}
                </p>
              </div>
              <div className="rounded-lg bg-white/60 p-3 shadow-sm">
                <p className="mb-1 font-medium text-blue-700">{t('lastName')}</p>
                <p className="text-sm text-slate-700">
                  {profile?.last_name || '-'}
                </p>
              </div>
            </div>
            <div className="rounded-lg bg-white/60 p-3 shadow-sm">
              <p className="mb-1 font-medium text-blue-700">{t('email')}</p>
              <p className="text-sm text-slate-700">{userEmail}</p>
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
