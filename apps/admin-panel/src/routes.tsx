import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminLayout from './components/layout/AdminLayout';
import CategoryList from './pages/categories/CategoryList';
import ProductList from './pages/products/ProductList';
import BlogList from './pages/blog/BlogList';
import Analytics from './pages/analytics/Analytics';
import GoogleGuide from './pages/GoogleGuide';

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
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="categories" element={<CategoryList />} />
          <Route path="products" element={<ProductList />} />
          <Route path="blog" element={<BlogList />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="google-guide" element={<GoogleGuide />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
