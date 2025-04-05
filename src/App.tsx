import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthProvider';
import AppSidebar from './components/AppSidebar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import PropertyList from './pages/PropertyList';
import PropertyDetails from './pages/PropertyDetails';
import AddProperty from './pages/AddProperty';
import EditProperty from './pages/EditProperty';
import TenantList from './pages/TenantList';
import TenantDetails from './pages/TenantDetails';
import AddTenant from './pages/AddTenant';
import EditTenant from './pages/EditTenant';
import MaintenanceRequestList from './pages/MaintenanceRequestList';
import MaintenanceRequestDetails from './pages/MaintenanceRequestDetails';
import AddMaintenanceRequest from './pages/AddMaintenanceRequest';
import EditMaintenanceRequest from './pages/EditMaintenanceRequest';
import CommunicationList from './pages/CommunicationList';
import CommunicationDetails from './pages/CommunicationDetails';
import AddCommunication from './pages/AddCommunication';
import EditCommunication from './pages/EditCommunication';
import FinanceDashboard from './pages/FinanceDashboard';
import FinanceReport from './pages/FinanceReport';
import AddFinanceRecord from './pages/AddFinanceRecord';
import EditFinanceRecord from './pages/EditFinanceRecord';
import DocumentGenerator from './pages/DocumentGenerator';
import TenantDashboard from './pages/TenantDashboard';
import TenantProfile from './pages/TenantProfile';
import TenantMaintenanceRequests from './pages/TenantMaintenanceRequests';
import TenantCommunications from './pages/TenantCommunications';
import TenantDocuments from './pages/TenantDocuments';
import Finances from './pages/Finances';
import Vendors from './pages/Vendors';
import AddVendor from './pages/AddVendor';
import EditVendor from './pages/EditVendor';
import TaskList from './pages/TaskList';
import AddTask from './pages/AddTask';
import EditTask from './pages/EditTask';
import NotFound from './pages/NotFound';
import { useLocale } from './components/providers/LocaleProvider';
import { Toaster } from '@/components/ui/toaster';

// Importation de la nouvelle page d'historique des documents
import DocumentHistoryPage from "@/pages/DocumentHistoryPage";

const App = () => {
  const { locale } = useLocale();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const AuthRoute = ({ element, authRequired }: { element: React.ReactNode, authRequired: boolean }) => {
    const { isLoggedIn } = useAuth();
    return authRequired ? (isLoggedIn ? element : <Navigate to="/login" />) : element;
  };

  const routes = [
    {
      path: '/',
      element: <Dashboard />,
      authRequired: true
    },
    {
      path: '/dashboard',
      element: <Dashboard />,
      authRequired: true
    },
    {
      path: '/login',
      element: <Login />,
      authRequired: false
    },
    {
      path: '/signup',
      element: <Signup />,
      authRequired: false
    },
    {
      path: '/profile',
      element: <Profile />,
      authRequired: true
    },
    {
      path: '/settings',
      element: <Settings />,
      authRequired: true
    },
    {
      path: '/properties',
      element: <PropertyList />,
      authRequired: true
    },
    {
      path: '/properties/:id',
      element: <PropertyDetails />,
      authRequired: true
    },
    {
      path: '/properties/add',
      element: <AddProperty />,
      authRequired: true
    },
    {
      path: '/properties/edit/:id',
      element: <EditProperty />,
      authRequired: true
    },
    {
      path: '/tenants',
      element: <TenantList />,
      authRequired: true
    },
    {
      path: '/tenants/:id',
      element: <TenantDetails />,
      authRequired: true
    },
    {
      path: '/tenants/add',
      element: <AddTenant />,
      authRequired: true
    },
    {
      path: '/tenants/edit/:id',
      element: <EditTenant />,
      authRequired: true
    },
    {
      path: '/maintenance',
      element: <MaintenanceRequestList />,
      authRequired: true
    },
    {
      path: '/maintenance/:id',
      element: <MaintenanceRequestDetails />,
      authRequired: true
    },
    {
      path: '/maintenance/add',
      element: <AddMaintenanceRequest />,
      authRequired: true
    },
    {
      path: '/maintenance/edit/:id',
      element: <EditMaintenanceRequest />,
      authRequired: true
    },
    {
      path: '/communications',
      element: <CommunicationList />,
      authRequired: true
    },
    {
      path: '/communications/:id',
      element: <CommunicationDetails />,
      authRequired: true
    },
    {
      path: '/communications/add',
      element: <AddCommunication />,
      authRequired: true
    },
    {
      path: '/communications/edit/:id',
      element: <EditCommunication />,
      authRequired: true
    },
    {
      path: '/finances',
      element: <FinanceDashboard />,
      authRequired: true
    },
    {
      path: '/finances/report',
      element: <FinanceReport />,
      authRequired: true
    },
    {
      path: '/finances/add',
      element: <AddFinanceRecord />,
      authRequired: true
    },
    {
      path: '/finances/edit/:id',
      element: <EditFinanceRecord />,
      authRequired: true
    },
    {
      path: '/document-generator',
      element: <DocumentGenerator />,
      authRequired: true
    },
    {
      path: '/tenant/dashboard',
      element: <TenantDashboard />,
      authRequired: true
    },
    {
      path: '/tenant/profile',
      element: <TenantProfile />,
      authRequired: true
    },
    {
      path: '/tenant/maintenance',
      element: <TenantMaintenanceRequests />,
      authRequired: true
    },
    {
      path: '/tenant/communications',
      element: <TenantCommunications />,
      authRequired: true
    },
    {
      path: '/tenant/documents',
      element: <TenantDocuments />,
      authRequired: true
    },
	  {
      path: '/finances-new',
      element: <Finances />,
      authRequired: true
    },
    {
      path: '/vendors',
      element: <Vendors />,
      authRequired: true
    },
    {
      path: '/vendors/add',
      element: <AddVendor />,
      authRequired: true
    },
    {
      path: '/vendors/edit/:id',
      element: <EditVendor />,
      authRequired: true
    },
    {
      path: '/tasks',
      element: <TaskList />,
      authRequired: true
    },
    {
      path: '/tasks/add',
      element: <AddTask />,
      authRequired: true
    },
    {
      path: '/tasks/edit/:id',
      element: <EditTask />,
      authRequired: true
    },
	{
    path: '/document-history',
    element: <DocumentHistoryPage />,
    authRequired: true
  },
    {
      path: '*',
      element: <NotFound />,
      authRequired: false
    }
  ];

  return (
    <Router>
      <AuthProvider>
        <div className="flex h-screen bg-background">
          {isLoggedIn() && <AppSidebar isCollapsed={sidebarCollapsed} setIsCollapsed={setSidebarCollapsed} />}
          <div className="flex-1 overflow-auto">
            <Routes>
              {routes.map(route => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={<AuthRoute element={route.element} authRequired={route.authRequired} />}
                />
              ))}
            </Routes>
          </div>
        </div>
        <Toaster />
      </AuthProvider>
    </Router>
  );
};

export default App;
