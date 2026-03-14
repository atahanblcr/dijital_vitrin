import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SuperAdminLayout from './components/layout/SuperAdminLayout';
import BusinessList from './pages/businesses/BusinessList';
import PlatformAnalytics from './pages/analytics/PlatformAnalytics';
import PlatformSettings from './pages/settings/PlatformSettings';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <SuperAdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="businesses" element={<BusinessList />} />
          <Route path="analytics" element={<PlatformAnalytics />} />
          <Route path="settings" element={<PlatformSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
