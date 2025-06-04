import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import Leases from './pages/Leases';
import Tenants from './pages/Tenants';
import TenantDetails from './pages/TenantDetails';
import TenantDashboard from './pages/TenantDashboard';
import AddTenant from './pages/AddTenant';
import EditTenant from './pages/EditTenant';
import TenantList from './pages/TenantList';
import Documents from './pages/Documents';
import Payments from './pages/Payments';
import Settings from './pages/Settings';
import AuthModal from './components/auth/AuthModal';
import { AuthProvider } from './components/AuthProvider';
import { LocaleProvider } from './components/providers/LocaleProvider';
import { ThemeProvider } from './components/providers/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import { QueryClient } from '@tanstack/react-query';
import { TenantProvider } from './components/TenantProvider';
import AcceptInvitation from './pages/AcceptInvitation';
import InvitationsPage from './pages/InvitationsPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <LocaleProvider>
          <TenantProvider>
            <QueryClient>
              <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
                <Toaster />
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/properties" element={<Properties />} />
                  <Route path="/properties/:id" element={<PropertyDetails />} />
                  <Route path="/leases" element={<Leases />} />
                  <Route path="/tenants" element={<Tenants />} />
                  <Route path="/tenant-details/:id" element={<TenantDetails />} />
                  <Route path="/tenant-dashboard" element={<TenantDashboard />} />
                  <Route path="/add-tenant" element={<AddTenant />} />
                  <Route path="/edit-tenant/:id" element={<EditTenant />} />
                  <Route path="/tenant-list" element={<TenantList />} />
                  <Route path="/documents" element={<Documents />} />
                  <Route path="/payments" element={<Payments />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/auth" element={<AuthModal isOpen={true} onClose={() => {}} />} />
                  
                  {/* Add the new invitation acceptance route */}
                  <Route path="/invite/:token" element={<AcceptInvitation />} />
                  
                  <Route path="/invitations" element={<InvitationsPage />} />
                </Routes>
              </ThemeProvider>
            </QueryClient>
          </TenantProvider>
        </LocaleProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
