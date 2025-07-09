
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './components/AuthProvider';
import { lazy, Suspense } from 'react';

// Landing page - load immediately
import LandingPage from './pages/LandingPage';

// Lazy load all other pages for better performance
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
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

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/tenant-signup" element={<TenantSignup />} />
        <Route path="/auth" element={<AuthPage />} />
        
        {/* Landing Page - Accessible à tous */}
        <Route path="/" element={<LandingPage />} />

        {/* Protected Routes - only accessible when logged in */}
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        
        <Route path="/vendors" element={isAuthenticated ? <Vendors /> : <Navigate to="/login" />} />
        <Route path="/add-vendor" element={isAuthenticated ? <AddVendor /> : <Navigate to="/login" />} />
        <Route path="/tasks" element={isAuthenticated ? <TaskList /> : <Navigate to="/login" />} />
        <Route path="/add-task" element={isAuthenticated ? <AddTask /> : <Navigate to="/login" />} />
        <Route path="/edit-task/:id" element={isAuthenticated ? <EditTask /> : <Navigate to="/login" />} />
        <Route path="/finances" element={isAuthenticated ? <Finances /> : <Navigate to="/login" />} />
        <Route path="/add-tenant" element={isAuthenticated ? <AddTenant /> : <Navigate to="/login" />} />
        <Route path="/document-generator" element={isAuthenticated ? <DocumentGenerator /> : <Navigate to="/login" />} />
        <Route path="/document-history" element={isAuthenticated ? <DocumentHistory /> : <Navigate to="/login" />} />
        <Route path="/tenants" element={isAuthenticated ? <Tenants /> : <Navigate to="/login" />} />
        <Route path="/invitations" element={isAuthenticated ? <Invitations /> : <Navigate to="/login" />} />
        
        <Route path="/tenant/dashboard" element={isAuthenticated ? <TenantDashboardPage /> : <Navigate to="/login" />} />
        <Route path="/tenant/maintenance" element={isAuthenticated ? <TenantMaintenance /> : <Navigate to="/login" />} />
        <Route path="/tenant/maintenance/new" element={isAuthenticated ? <AddMaintenanceRequest /> : <Navigate to="/login" />} />
        <Route path="/tenant/documents" element={isAuthenticated ? <DocumentsPage /> : <Navigate to="/login" />} />
        
        <Route path="/properties" element={isAuthenticated ? <Properties /> : <Navigate to="/login" />} />
        <Route path="/maintenance" element={isAuthenticated ? <Maintenance /> : <Navigate to="/login" />} />
        <Route path="/maintenance-requests" element={isAuthenticated ? <MaintenanceRequestList /> : <Navigate to="/login" />} />
        <Route path="/reports" element={isAuthenticated ? <Reports /> : <Navigate to="/login" />} />
        <Route path="/admin" element={isAuthenticated ? <Admin /> : <Navigate to="/login" />} />
        <Route path="/settings" element={isAuthenticated ? <Settings /> : <Navigate to="/login" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
