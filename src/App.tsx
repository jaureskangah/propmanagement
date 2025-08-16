
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './components/AuthProvider';
import { useDeletedTenantCheck } from './hooks/useDeletedTenantCheck';
import { lazy, Suspense } from 'react';
import { PageLoadingAnimation } from './components/common/PageLoadingAnimation';
import { ProtectedAdminRoute } from './components/ProtectedAdminRoute';

// Landing page - load immediately
import LandingPage from './pages/LandingPage';

// Lazy load all other pages for better performance
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const TenantSignup = lazy(() => import('./pages/TenantSignup'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Vendors = lazy(() => import('./pages/Vendors'));
const AddVendor = lazy(() => import('./pages/AddVendor'));
const TaskList = lazy(() => import('./pages/TaskList'));
const AddTask = lazy(() => import('./pages/AddTask'));
const EditTask = lazy(() => import('./pages/EditTask'));
const Finances = lazy(() => import('./pages/Finances'));
const AddTenant = lazy(() => import('./pages/AddTenant'));
const TenantDashboardPage = lazy(() => import('./pages/tenant/TenantDashboard'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const DocumentHistory = lazy(() => import('./pages/DocumentHistory'));
const DocumentGenerator = lazy(() => import('./pages/DocumentGenerator'));
const Tenants = lazy(() => import('./pages/Tenants'));
const TenantCommunications = lazy(() => import('./pages/tenant/TenantCommunications'));
const TenantMaintenance = lazy(() => import('./pages/tenant/TenantMaintenance'));
const Properties = lazy(() => import('./pages/Properties'));
const Maintenance = lazy(() => import('./pages/Maintenance'));
const MaintenanceRequestList = lazy(() => import('./pages/MaintenanceRequestList'));
const Settings = lazy(() => import('./pages/Settings'));
const AddMaintenanceRequest = lazy(() => import('./pages/AddMaintenanceRequest'));
const DocumentsPage = lazy(() => import('./pages/tenant/TenantDocuments'));
const Invitations = lazy(() => import('./pages/Invitations'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Reports = lazy(() => import('./pages/Reports'));
const Admin = lazy(() => import('./pages/Admin'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const AutomatedReminders = lazy(() => import('./pages/AutomatedReminders'));
const SupportPage = lazy(() => import('./pages/SupportPage'));
const Subscription = lazy(() => import('./pages/Subscription'));
const TestRestrictions = lazy(() => import('./pages/TestRestrictions'));
const SubscriptionSyncValidator = lazy(() => import('./components/subscription/SubscriptionSyncValidator').then(module => ({ default: module.SubscriptionSyncValidator })));
const ProductionDashboard = lazy(() => import('./components/admin/ProductionDashboard').then(module => ({ default: module.ProductionDashboard })));
const MonitoringDashboard = lazy(() => import('./components/admin/MonitoringDashboard').then(module => ({ default: module.MonitoringDashboard })));
const UserDocumentationCenter = lazy(() => import('./components/admin/UserDocumentationCenter').then(module => ({ default: module.UserDocumentationCenter })));
const GoLiveDashboard = lazy(() => import('./components/admin/GoLiveDashboard').then(module => ({ default: module.GoLiveDashboard })));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout').then(module => ({ default: module.AdminLayout })));
const ComingSoonInternational = lazy(() => import('./pages/ComingSoonInternational'));

// Loading fallback component with percentage animation
const PageLoader = () => <PageLoadingAnimation />;

function App() {
  const { isAuthenticated, isTenant } = useAuth();
  
  // Hook pour vérifier et déconnecter les comptes tenant supprimés
  // useDeletedTenantCheck(); // Temporairement désactivé pour éviter les faux positifs

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/tenant-signup" element={<TenantSignup />} />
        <Route path="/auth" element={<AuthPage />} />
        
        {/* Landing Page - Accessible à tous */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Legal Pages - Accessible à tous */}
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        
        {/* International Route */}
        <Route path="/coming-soon-international" element={<ComingSoonInternational />} />

        {/* Owner Routes - only accessible to property owners */}
        <Route path="/dashboard" element={
          isAuthenticated ? (
            isTenant ? <Navigate to="/tenant/dashboard" /> : <Dashboard />
          ) : <Navigate to="/login" />
        } />
        
        <Route path="/vendors" element={
          isAuthenticated && !isTenant ? <Vendors /> : <Navigate to="/login" />
        } />
        <Route path="/add-vendor" element={
          isAuthenticated && !isTenant ? <AddVendor /> : <Navigate to="/login" />
        } />
        <Route path="/tasks" element={
          isAuthenticated && !isTenant ? <TaskList /> : <Navigate to="/login" />
        } />
        <Route path="/add-task" element={
          isAuthenticated && !isTenant ? <AddTask /> : <Navigate to="/login" />
        } />
        <Route path="/edit-task/:id" element={
          isAuthenticated && !isTenant ? <EditTask /> : <Navigate to="/login" />
        } />
        <Route path="/finances" element={
          isAuthenticated && !isTenant ? <Finances /> : <Navigate to="/login" />
        } />
        <Route path="/add-tenant" element={
          isAuthenticated && !isTenant ? <AddTenant /> : <Navigate to="/login" />
        } />
        <Route path="/document-generator" element={
          isAuthenticated && !isTenant ? <DocumentGenerator /> : <Navigate to="/login" />
        } />
        <Route path="/document-history" element={
          isAuthenticated && !isTenant ? <DocumentHistory /> : <Navigate to="/login" />
        } />
        <Route path="/tenants" element={
          isAuthenticated && !isTenant ? <Tenants /> : <Navigate to="/login" />
        } />
        <Route path="/invitations" element={
          isAuthenticated && !isTenant ? <Invitations /> : <Navigate to="/login" />
        } />
        <Route path="/properties" element={
          isAuthenticated && !isTenant ? <Properties /> : <Navigate to="/login" />
        } />
        <Route path="/maintenance" element={
          isAuthenticated && !isTenant ? <Maintenance /> : <Navigate to="/login" />
        } />
        <Route path="/maintenance-requests" element={
          isAuthenticated && !isTenant ? <MaintenanceRequestList /> : <Navigate to="/login" />
        } />
        <Route path="/reports" element={
          isAuthenticated && !isTenant ? <Reports /> : <Navigate to="/login" />
        } />
        <Route path="/admin" element={
          <ProtectedAdminRoute><Admin /></ProtectedAdminRoute>
        } />
        
        {/* Tenant Routes - only accessible to tenants */}
        <Route path="/tenant/dashboard" element={
          isAuthenticated ? (
            isTenant ? <TenantDashboardPage /> : <Navigate to="/dashboard" />
          ) : <Navigate to="/login" />
        } />
        <Route path="/tenant/maintenance" element={
          isAuthenticated && isTenant ? <TenantMaintenance /> : <Navigate to="/login" />
        } />
        <Route path="/tenant/maintenance/new" element={
          isAuthenticated && isTenant ? <AddMaintenanceRequest /> : <Navigate to="/login" />
        } />
        <Route path="/tenant/documents" element={
          isAuthenticated && isTenant ? <DocumentsPage /> : <Navigate to="/login" />
        } />
        
        {/* Shared Routes - accessible to both owners and tenants */}
        <Route path="/settings" element={isAuthenticated ? <Settings /> : <Navigate to="/login" />} />
        <Route path="/support" element={isAuthenticated ? <SupportPage /> : <Navigate to="/login" />} />
        <Route path="/reminders" element={isAuthenticated ? <AutomatedReminders /> : <Navigate to="/login" />} />
        <Route path="/subscription" element={isAuthenticated ? <Subscription /> : <Navigate to="/login" />} />
        <Route path="/test-restrictions" element={<ProtectedAdminRoute><AdminLayout><TestRestrictions /></AdminLayout></ProtectedAdminRoute>} />
        <Route path="/sync-validation" element={<ProtectedAdminRoute><SubscriptionSyncValidator /></ProtectedAdminRoute>} />
        <Route path="/production-dashboard" element={<ProtectedAdminRoute><AdminLayout><ProductionDashboard /></AdminLayout></ProtectedAdminRoute>} />
        <Route path="/monitoring" element={<ProtectedAdminRoute><AdminLayout><MonitoringDashboard /></AdminLayout></ProtectedAdminRoute>} />
        <Route path="/documentation" element={<ProtectedAdminRoute><AdminLayout><UserDocumentationCenter /></AdminLayout></ProtectedAdminRoute>} />
        <Route path="/go-live" element={<ProtectedAdminRoute><AdminLayout><GoLiveDashboard /></AdminLayout></ProtectedAdminRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
