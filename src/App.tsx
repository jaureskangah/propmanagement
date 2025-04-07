
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './components/AuthProvider';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Vendors from './pages/Vendors';
import AddVendor from './pages/AddVendor';
import TaskList from './pages/TaskList';
import AddTask from './pages/AddTask';
import EditTask from './pages/EditTask';
import Finances from './pages/Finances';
import AddTenant from './pages/AddTenant';
import TenantDashboardPage from './pages/tenant/TenantDashboard';
import AuthPage from './pages/AuthPage';
import Documents from './pages/Documents';
import DocumentHistory from './pages/DocumentHistory';
import TenantDocuments from './pages/TenantDocuments';
import DocumentGenerator from './pages/DocumentGenerator';
import Tenants from './pages/Tenants';
import TenantCommunications from './pages/tenant/TenantCommunications';
import TenantMaintenance from './pages/tenant/TenantMaintenance';
import Properties from './pages/Properties';
import Maintenance from './pages/Maintenance';
import Settings from './pages/Settings';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/auth" element={<AuthPage />} />

      {/* Protected Routes - only accessible when logged in */}
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
      <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
      <Route path="/tenant/dashboard" element={isAuthenticated ? <TenantDashboardPage /> : <Navigate to="/login" />} />
      <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
      <Route path="/vendors" element={isAuthenticated ? <Vendors /> : <Navigate to="/login" />} />
      <Route path="/add-vendor" element={isAuthenticated ? <AddVendor /> : <Navigate to="/login" />} />
      <Route path="/tasks" element={isAuthenticated ? <TaskList /> : <Navigate to="/login" />} />
      <Route path="/add-task" element={isAuthenticated ? <AddTask /> : <Navigate to="/login" />} />
      <Route path="/edit-task/:id" element={isAuthenticated ? <EditTask /> : <Navigate to="/login" />} />
      <Route path="/finances" element={isAuthenticated ? <Finances /> : <Navigate to="/login" />} />
      <Route path="/add-tenant" element={isAuthenticated ? <AddTenant /> : <Navigate to="/login" />} />
      <Route path="/documents" element={isAuthenticated ? <Documents /> : <Navigate to="/login" />} />
      <Route path="/document-generator" element={isAuthenticated ? <DocumentGenerator /> : <Navigate to="/login" />} />
      <Route path="/document-history" element={isAuthenticated ? <DocumentHistory /> : <Navigate to="/login" />} />
      <Route path="/tenant/documents" element={isAuthenticated ? <TenantDocuments /> : <Navigate to="/login" />} />
      <Route path="/tenants" element={isAuthenticated ? <Tenants /> : <Navigate to="/login" />} />
      <Route path="/tenant/communications" element={isAuthenticated ? <TenantCommunications /> : <Navigate to="/login" />} />
      <Route path="/tenant/maintenance" element={isAuthenticated ? <TenantMaintenance /> : <Navigate to="/login" />} />
      <Route path="/properties" element={isAuthenticated ? <Properties /> : <Navigate to="/login" />} />
      <Route path="/maintenance" element={isAuthenticated ? <Maintenance /> : <Navigate to="/login" />} />
      <Route path="/settings" element={isAuthenticated ? <Settings /> : <Navigate to="/login" />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
