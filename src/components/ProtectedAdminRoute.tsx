import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { useAdminRole } from '@/hooks/useAdminRole';
import { PageLoadingAnimation } from '@/components/common/PageLoadingAnimation';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

export const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({ children }) => {
  const { isAuthenticated, isTenant } = useAuth();
  const { isAdmin, loading } = useAdminRole();

  console.log('🔍 DEBUG: ProtectedAdminRoute - Auth status:', { 
    isAuthenticated, 
    isTenant, 
    isAdmin, 
    loading 
  });

  if (!isAuthenticated) {
    console.log('🔍 DEBUG: ProtectedAdminRoute - Not authenticated, redirecting to login');
    return <Navigate to="/login" />;
  }

  if (isTenant) {
    console.log('🔍 DEBUG: ProtectedAdminRoute - User is tenant, redirecting to tenant dashboard');
    return <Navigate to="/tenant/dashboard" />;
  }

  if (loading) {
    console.log('🔍 DEBUG: ProtectedAdminRoute - Still loading admin status');
    return <PageLoadingAnimation />;
  }

  if (!isAdmin) {
    console.log('🔍 DEBUG: ProtectedAdminRoute - User is not admin, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  console.log('🔍 DEBUG: ProtectedAdminRoute - User is admin, allowing access');
  return <>{children}</>;
};