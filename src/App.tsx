
import React, { Suspense, useCallback } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { useAuth, AuthProvider } from './hooks/auth/useAuth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import NewProperty from './pages/NewProperty';
import PropertyDetails from './pages/PropertyDetails';
import EditProperty from './pages/EditProperty';
import GlobalSync from './pages/GlobalSync';
import Notifications from './pages/Notifications';
import ProfileSettings from './pages/ProfileSettings';
import Analytics from './pages/Analytics';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ResendConfirmation from './pages/ResendConfirmation';
import EmailConfirmation from './pages/EmailConfirmation';
import ComponentsDemo from './pages/ComponentsDemo';
import NotFound from './pages/NotFound';
import { Toaster } from "@/components/ui/toaster";
import Index from './pages/Index';
import { Loader2 } from 'lucide-react';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Loading spinner component for suspense fallback
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen bg-background">
    <div className="flex flex-col items-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-3" />
      <span className="text-muted-foreground">Loading application...</span>
    </div>
  </div>
);

function AppRoutes() {
  const { user, isLoading } = useAuth();

  // We don't need the PrivateRoute component anymore since MainLayout handles authentication
  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/resend-confirmation" element={<ResendConfirmation />} />
        <Route path="/confirm-email" element={<EmailConfirmation />} />
        
        {/* Root route - landing page */}
        <Route index element={<Index />} />
        
        {/* Protected routes - all under MainLayout which handles authentication */}
        <Route path="/" element={<MainLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="properties" element={<Properties />} />
          <Route path="properties/new" element={<NewProperty />} />
          <Route path="properties/:id" element={<PropertyDetails />} />
          <Route path="properties/:id/edit" element={<EditProperty />} />
          <Route path="sync" element={<GlobalSync />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="settings/profile" element={<ProfileSettings />} />
          <Route path="components" element={<ComponentsDemo />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}

function App() {
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Suspense fallback={<LoadingSpinner />}>
            <AppRoutes />
          </Suspense>
        </AuthProvider>
      </QueryClientProvider>
    </Router>
  );
}

export default App;
