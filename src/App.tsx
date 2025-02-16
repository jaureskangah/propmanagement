
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import Tenants from './pages/Tenants';
import Maintenance from './pages/Maintenance';
import Settings from './pages/Settings';
import { useAuth } from '@/components/AuthProvider';
import AdminDashboard from "@/pages/AdminDashboard";

// Temporairement modifié pour permettre l'accès sans authentification
function PrivateRoute({ children }: { children: React.ReactNode }) {
  // Désactive temporairement la vérification d'authentification
  return <>{children}</>;
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
