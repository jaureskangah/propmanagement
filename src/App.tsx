import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import Tenants from './pages/Tenants';
import Maintenance from './pages/Maintenance';
import Settings from './pages/Settings';
import { useAuthSession } from './hooks/useAuthSession';
import AuthModal from './components/auth/AuthModal';
import AdminDashboard from "@/pages/AdminDashboard";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthSession();

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a spinner or loading component
  }

  return user ? <>{children}</> : <Navigate to="/" />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path="/properties" element={
          <PrivateRoute>
            <Properties />
          </PrivateRoute>
        } />
        <Route path="/tenants" element={
          <PrivateRoute>
            <Tenants />
          </PrivateRoute>
        } />
        <Route path="/maintenance" element={
          <PrivateRoute>
            <Maintenance />
          </PrivateRoute>
        } />
        <Route path="/settings" element={
          <PrivateRoute>
            <Settings />
          </PrivateRoute>
        } />
      <Route path="/admin" element={
        <PrivateRoute>
          <AdminDashboard />
        </PrivateRoute>
      } />
      </Routes>
    </Router>
  );
}
