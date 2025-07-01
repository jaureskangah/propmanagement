import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient } from '@tanstack/react-query';
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider, useAuth } from './components/AuthProvider';
import { AppLayout } from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import AddProperty from './pages/AddProperty';
import EditProperty from './pages/EditProperty';
import MaintenanceRequests from './pages/MaintenanceRequests';
import MaintenanceRequestDetails from './pages/MaintenanceRequestDetails';
import AddMaintenanceRequest from './pages/AddMaintenanceRequest';
import EditMaintenanceRequest from './pages/EditMaintenanceRequest';
import Tenants from './pages/Tenants';
import TenantDetails from './pages/TenantDetails';
import AddTenant from './pages/AddTenant';
import EditTenant from './pages/EditTenant';
import Auth from './pages/Auth';
import TenantSignup from './pages/TenantSignup';
import TenantDashboard from './components/tenant/TenantDashboard';
import TenantList from './pages/TenantList';
import LocaleProvider from './components/providers/LocaleProvider';
import RentReminders from './pages/RentReminders';

function App() {
  return (
    <QueryClient>
      <AuthProvider>
        <BrowserRouter>
          <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
            <LocaleProvider>
              <div className="min-h-screen bg-background">
                <Routes>
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/tenant/signup/:token" element={<TenantSignup />} />
                  
                  <Route path="/" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <Dashboard />
                      </AppLayout>
                    </ProtectedRoute>
                  } />
                  
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
                  
                  <Route path="/maintenance-requests" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <MaintenanceRequests />
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

                  <Route path="/tenant/dashboard" element={
                    <TenantRoute>
                      <TenantDashboard />
                    </TenantRoute>
                  } />
                  
                  <Route path="/rent-reminders" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <RentReminders />
                      </AppLayout>
                    </ProtectedRoute>
                  } />
                  
                </Routes>
              </div>
            </LocaleProvider>
          </ThemeProvider>
        </BrowserRouter>
      </AuthProvider>
    </QueryClient>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}

function TenantRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isTenant, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  if (!isAuthenticated || !isTenant) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}

export default App;
