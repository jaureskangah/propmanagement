import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { useAdminRole } from '@/hooks/useAdminRole';
import { useLocale } from '@/components/providers/LocaleProvider';
import AppSidebar from '@/components/AppSidebar';
import { AdminContainer } from '@/components/admin/AdminContainer';

const Admin = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useAdminRole();
  const { t } = useLocale();

  if (authLoading || roleLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
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
        <div className="ml-0 md:ml-20 p-6 flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-destructive">
              {t('accessDenied', { fallback: 'Accès refusé' })}
            </h1>
            <p className="text-muted-foreground">
              {t('adminRequired', { fallback: 'Vous devez avoir des privilèges administrateur pour accéder à cette page.' })}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <div className="ml-0 md:ml-20 p-3 sm:p-6 md:p-8 pt-16 sm:pt-20 md:pt-8 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 sm:mb-8 animate-fade-in">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {t('adminPanel', { fallback: 'Panel d\'Administration' })}
            </h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              {t('adminDescription', { fallback: 'Gestion globale du système et métriques administrateur' })}
            </p>
            {/* Debug info - remove in production */}
            <div className="mt-4 p-4 bg-muted rounded-lg text-sm">
              <p><strong>Utilisateur connecté:</strong> {user?.email || 'Non connecté'}</p>
              <p><strong>ID utilisateur:</strong> {user?.id || 'N/A'}</p>
              <p><strong>Admin:</strong> {isAdmin ? 'Oui' : 'Non'}</p>
            </div>
          </div>
          <AdminContainer />
        </div>
      </div>
    </div>
  );
};

export default Admin;