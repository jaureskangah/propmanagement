
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocale } from "@/components/providers/LocaleProvider";

interface InviteTenantFormProps {
  email: string;
  isLoading: boolean;
  onEmailChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export const InviteTenantForm = ({
  email,
  isLoading,
  onEmailChange,
  onSubmit,
  onClose,
}: InviteTenantFormProps) => {
  const { t } = useLocale();

  return (
    <form onSubmit={onSubmit} className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="email">{t('email')}</Label>
        <Input
          id="email"
          type="email"
          placeholder={t('enterEmail')}
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          required
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          {t('cancel')}
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? t('sending') : t('inviteTenant')}
        </Button>
      </div>
    </form>
  );
}
