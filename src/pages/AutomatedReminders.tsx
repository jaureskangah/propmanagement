import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';
import { AutomatedReminders as AutomatedRemindersComponent } from '@/components/tenant/reminders/AutomatedReminders';
import { automatedRemindersTranslations } from '@/translations/features/automatedReminders';

const AutomatedReminders = () => {
  const { isAuthenticated, loading, isTenant } = useAuth();
  const { locale } = useLocale();
  const t = automatedRemindersTranslations[locale] || automatedRemindersTranslations.en;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center space-y-4 animate-fade-in">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full" />
          <p className="text-sm text-muted-foreground animate-pulse">
            {t.loadingReminders}
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  if (isTenant && !loading) {
    return <Navigate to="/tenant/dashboard" replace />;
  }

  return (
    <ResponsiveLayout title={t.title}>
      <div className="max-w-7xl mx-auto p-3 sm:p-6 md:p-8">
        <AutomatedRemindersComponent />
      </div>
    </ResponsiveLayout>
  );
};

export default AutomatedReminders;