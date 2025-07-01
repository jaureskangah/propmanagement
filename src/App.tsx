import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './components/AuthProvider';
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import AddProperty from './pages/AddProperty';
import EditProperty from './pages/EditProperty';
import Maintenance from './pages/Maintenance';
import MaintenanceRequestDetails from './pages/MaintenanceRequestDetails';
import AddMaintenanceRequest from './pages/AddMaintenanceRequest';
import EditMaintenanceRequest from './pages/EditMaintenanceRequest';
import Tenants from './pages/Tenants';
import TenantDetails from './pages/TenantDetails';
import AddTenant from './pages/AddTenant';
import EditTenant from './pages/EditTenant';
import AuthPage from './pages/AuthPage';
import TenantSignup from './pages/TenantSignup';
import { TenantDashboard } from './components/tenant/TenantDashboard';
import TenantList from './pages/TenantList';
import RentReminders from './pages/RentReminders';
import TenantDocuments from './pages/tenant/TenantDocuments';
import NotFound from './pages/NotFound';
import AppSidebar from './components/AppSidebar';

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/tenant/signup/:token" element={<TenantSignup />} />
        
        {/* Dashboard routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Navigate to="/" replace />
          </ProtectedRoute>
        } />
        
        {/* Properties routes */}
        <Route path="/properties" element={
          <ProtectedRoute>
            <AppLayout>
              <Properties />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/properties/:id" element={
          <ProtectedRoute>
            <AppLayout>
              <PropertyDetails />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/add-property" element={
          <ProtectedRoute>
            <AppLayout>
              <AddProperty />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/edit-property/:id" element={
          <ProtectedRoute>
            <AppLayout>
              <EditProperty />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        {/* Maintenance routes */}
        <Route path="/maintenance" element={
          <ProtectedRoute>
            <AppLayout>
              <Maintenance />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/maintenance-requests" element={
          <ProtectedRoute>
            <AppLayout>
              <Maintenance />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/maintenance-requests/:id" element={
          <ProtectedRoute>
            <AppLayout>
              <MaintenanceRequestDetails />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/add-maintenance-request" element={
          <ProtectedRoute>
            <AppLayout>
              <AddMaintenanceRequest />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/edit-maintenance-request/:id" element={
          <ProtectedRoute>
            <AppLayout>
              <EditMaintenanceRequest />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        {/* Tenants routes */}
        <Route path="/tenants" element={
          <ProtectedRoute>
            <AppLayout>
              <Tenants />
            </AppLayout>
          </ProtectedRoute>
        } />

        <Route path="/tenant-list" element={
          <ProtectedRoute>
            <AppLayout>
              <TenantList />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/tenants/:id" element={
          <ProtectedRoute>
            <AppLayout>
              <TenantDetails />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/add-tenant" element={
          <ProtectedRoute>
            <AppLayout>
              <AddTenant />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/edit-tenant/:id" element={
          <ProtectedRoute>
            <AppLayout>
              <EditTenant />
            </AppLayout>
          </ProtectedRoute>
        } />

        {/* Tenant-specific routes */}
        <Route path="/tenant/dashboard" element={
          <TenantRoute>
            <TenantDashboard />
          </TenantRoute>
        } />

        <Route path="/tenant/maintenance" element={
          <TenantRoute>
            <AppLayout>
              <Maintenance />
            </AppLayout>
          </TenantRoute>
        } />

        <Route path="/tenant/documents" element={
          <TenantRoute>
            <AppLayout>
              <TenantDocuments />
            </AppLayout>
          </TenantRoute>
        } />
        
        {/* Other routes */}
        <Route path="/rent-reminders" element={
          <ProtectedRoute>
            <AppLayout>
              <RentReminders />
            </AppLayout>
          </ProtectedRoute>
        } />

        <Route path="/invitations" element={
          <ProtectedRoute>
            <AppLayout>
              <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Invitations</h1>
                <p className="text-muted-foreground">Cette page sera développée prochainement.</p>
              </div>
            </AppLayout>
          </ProtectedRoute>
        } />

        <Route path="/finances" element={
          <ProtectedRoute>
            <AppLayout>
              <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Finances</h1>
                <p className="text-muted-foreground">Cette page sera développée prochainement.</p>
              </div>
            </AppLayout>
          </ProtectedRoute>
        } />

        <Route path="/leases" element={
          <ProtectedRoute>
            <AppLayout>
              <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Baux</h1>
                <p className="text-muted-foreground">Cette page sera développée prochainement.</p>
              </div>
            </AppLayout>
          </ProtectedRoute>
        } />

        <Route path="/payments" element={
          <ProtectedRoute>
            <AppLayout>
              <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Paiements</h1>
                <p className="text-muted-foreground">Cette page sera développée prochainement.</p>
              </div>
            </AppLayout>
          </ProtectedRoute>
        } />

        <Route path="/calendar" element={
          <ProtectedRoute>
            <AppLayout>
              <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Calendrier</h1>
                <p className="text-muted-foreground">Cette page sera développée prochainement.</p>
              </div>
            </AppLayout>
          </ProtectedRoute>
        } />

        <Route path="/settings" element={
          <ProtectedRoute>
            <AppLayout>
              <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Paramètres</h1>
                <p className="text-muted-foreground">Cette page sera développée prochainement.</p>
              </div>
            </AppLayout>
          </ProtectedRoute>
        } />
        
        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

// Simple AppLayout component for routes that need sidebar
function AppLayout({ children }: { children: React.ReactNode }) {
  const { isTenant } = useAuth();
  
  return (
    <div className="flex min-h-screen">
      <AppSidebar isTenant={isTenant} />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}

function TenantRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isTenant, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || !isTenant) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}

export default App;
