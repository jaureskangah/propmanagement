import React from 'react';
import { Button } from '@/components/ui/button';
import { LogIn, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLocale } from '@/components/providers/LocaleProvider';

export function GuestAuthPrompt() {
  const navigate = useNavigate();
  const { t } = useLocale();

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center mb-2">
        <UserPlus className="w-8 h-8 text-white" />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">
          {t('authPromptTitle')}
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          {t('authPromptDescription')}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
        <Button
          variant="default"
          className="flex-1 h-12 touch-manipulation relative z-10"
          onClick={() => navigate('/auth')}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          {t('register')}
        </Button>
        
        <Button
          variant="outline"
          className="flex-1 h-12 touch-manipulation relative z-10"
          onClick={() => navigate('/login')}
        >
          <LogIn className="w-4 h-4 mr-2" />
          {t('signIn')}
        </Button>
      </div>
    </div>
  );
}