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

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (isTenant) {
    return <Navigate to="/tenant/dashboard" />;
  }

  if (loading) {
    return <PageLoadingAnimation />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};