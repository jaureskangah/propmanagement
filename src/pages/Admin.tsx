import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { useAdminRole } from '@/hooks/useAdminRole';
import { useLocale } from '@/components/providers/LocaleProvider';
import { Shield } from 'lucide-react';
import AppSidebar from '@/components/AppSidebar';
import { AdminContainer } from '@/components/admin/AdminContainer';
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';

const Admin = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useAdminRole();
  const { t } = useLocale();

  if (authLoading || roleLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center space-y-4 animate-fade-in">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full" />
          <p className="text-sm text-muted-foreground animate-pulse">
            {t('loadingAdmin', { fallback: 'Chargement du panel admin...' })}
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <AppSidebar />
        <ResponsiveLayout title={t('accessDenied', { fallback: 'Accès refusé' })} className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-6 max-w-md mx-auto animate-fade-in">
            <div className="animate-scale-in">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
                <Shield className="w-8 h-8 text-destructive" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-destructive">
                {t('accessDenied', { fallback: 'Accès refusé' })}
              </h1>
            </div>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              {t('adminRequired', { fallback: 'Vous devez avoir des privilèges administrateur pour accéder à cette page.' })}
            </p>
            <div className="pt-4">
              <button 
                onClick={() => window.history.back()}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors duration-200 hover-scale"
              >
                ← {t('goBack', { fallback: 'Retour' })}
              </button>
            </div>
          </div>
        </ResponsiveLayout>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <ResponsiveLayout title={t('adminPanel', { fallback: 'Panel d\'Administration' })} className="p-3 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 sm:mb-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent hover-scale transition-transform duration-200">
                  {t('adminPanel', { fallback: 'Panel d\'Administration' })}
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  {t('adminDescription', { fallback: 'Gestion globale du système et métriques administrateur' })}
                </p>
              </div>
              <div className="hidden sm:flex items-center space-x-2 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full animate-scale-in">
                <Shield className="w-3 h-3" />
                <span>{t('adminMode', { fallback: 'Mode Admin' })}</span>
              </div>
            </div>
          </div>
          <div className="animate-slide-in-right">
            <AdminContainer />
          </div>
        </div>
      </ResponsiveLayout>
    </div>
  );
};

export default Admin;