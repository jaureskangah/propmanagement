
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import Tenants from './pages/Tenants';
import TenantDetails from './pages/TenantDetails';
import TenantDashboardPage from './pages/tenant/TenantDashboard';
import AddTenant from './pages/AddTenant';
import EditTenant from './pages/EditTenant';
import TenantList from './pages/TenantList';
import Documents from './pages/Documents';
import Settings from './pages/Settings';
import Finances from './pages/Finances';
import Maintenance from './pages/Maintenance';
import AuthModal from './components/auth/AuthModal';
import { AuthProvider } from './components/AuthProvider';
import { LocaleProvider } from './components/providers/LocaleProvider';
import { ThemeProvider } from './components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import AcceptInvitation from './pages/AcceptInvitation';
import InvitationsPage from './pages/InvitationsPage';

// Create a client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <AuthProvider>
      <LocaleProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
            <Toaster />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/properties/:id" element={<PropertyDetails />} />
              <Route path="/tenants" element={<Tenants />} />
              <Route path="/tenant-details/:id" element={<TenantDetails />} />
              <Route path="/tenant-dashboard" element={<TenantDashboardPage />} />
              <Route path="/add-tenant" element={<AddTenant />} />
              <Route path="/edit-tenant/:id" element={<EditTenant />} />
              <Route path="/tenant-list" element={<TenantList />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/finances" element={<Finances />} />
              <Route path="/maintenance" element={<Maintenance />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/auth" element={<AuthModal isOpen={true} onClose={() => {}} />} />
              
              {/* Add the new invitation acceptance route */}
              <Route path="/invite/:token" element={<AcceptInvitation />} />
              
              <Route path="/invitations" element={<InvitationsPage />} />
            </Routes>
          </ThemeProvider>
        </QueryClientProvider>
      </LocaleProvider>
    </AuthProvider>
  );
}

export default App;
