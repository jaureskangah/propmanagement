
import { createBrowserRouter } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Properties from "./pages/Properties";
import Tenants from "./pages/Tenants";
import Maintenance from "./pages/Maintenance";
import Settings from "./pages/Settings";
import AdminDashboard from "./pages/AdminDashboard";
import Communications from "./pages/Communications";
import TenantProfile from "./pages/TenantProfile";
import TenantPayments from "./pages/TenantPayments";
import TenantDocuments from "./pages/TenantDocuments";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
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
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "/admin",
    element: <AdminDashboard />,
  },
  {
    path: "/communications",
    element: <Communications />,
  },
  {
    path: "/profile",
    element: <TenantProfile />,
  },
  {
    path: "/payments",
    element: <TenantPayments />,
  },
  {
    path: "/documents",
    element: <TenantDocuments />,
  },
]);
