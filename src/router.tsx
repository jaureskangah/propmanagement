
import { createBrowserRouter } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Properties from "./pages/Properties";
import Tenants from "./pages/Tenants";
import Maintenance from "./pages/Maintenance";
import Settings from "./pages/Settings";
import AuthPage from "./pages/AuthPage";
import LandingPage from "./pages/LandingPage";
import AdminDashboard from "./pages/AdminDashboard";
import Communications from "./pages/Communications";
import TenantProfile from "./pages/TenantProfile";
import TenantMaintenance from "./pages/tenant/TenantMaintenance";
import TenantCommunications from "./pages/tenant/TenantCommunications";
import TenantDashboard from "./pages/tenant/TenantDashboard";
import TenantDocuments from "./pages/TenantDocuments";
import TenantPayments from "./pages/TenantPayments";

import About from "./pages/company/About";
import Careers from "./pages/company/Careers";
import Terms from "./pages/legal/Terms";
import Privacy from "./pages/legal/Privacy";
import Cookies from "./pages/legal/Cookies";

// Configure routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/auth",
    element: <AuthPage />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/properties",
    element: <Properties />,
  },
  {
    path: "/tenants",
    element: <Tenants />,
  },
  {
    path: "/maintenance",
    element: <Maintenance />,
  },
  {
    path: "/communications",
    element: <Communications />,
  },
  {
    path: "/admin",
    element: <AdminDashboard />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "/company/about",
    element: <About />,
  },
  {
    path: "/company/careers",
    element: <Careers />,
  },
  {
    path: "/legal/terms",
    element: <Terms />,
  },
  {
    path: "/legal/privacy",
    element: <Privacy />,
  },
  {
    path: "/legal/cookies",
    element: <Cookies />,
  },
  // Tenant Routes
  {
    path: "/tenant/profile",
    element: <TenantProfile />,
  },
  {
    path: "/tenant/maintenance",
    element: <TenantMaintenance />,
  },
  {
    path: "/tenant/communications",
    element: <TenantCommunications />,
  },
  {
    path: "/tenant/documents",
    element: <TenantDocuments />,
  },
  {
    path: "/tenant/payments",
    element: <TenantPayments />,
  },
  {
    path: "/tenant/dashboard",
    element: <TenantDashboard />,
  },
]);

export default router;
