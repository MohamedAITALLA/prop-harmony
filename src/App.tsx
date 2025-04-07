
import React, { Suspense } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { useAuth, AuthProvider } from './hooks/auth/useAuth';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import NewProperty from './pages/NewProperty';
import PropertyDetails from './pages/PropertyDetails';
import EditProperty from './pages/EditProperty';
import EventManagement from './pages/EventManagement';
import GlobalSync from './pages/GlobalSync';
import Notifications from './pages/Notifications';
import ProfileSettings from './pages/ProfileSettings';
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

// Loading spinner component for suspense fallback
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
    <span className="ml-2">Loading application...</span>
  </div>
);

function AppRoutes() {
  const { user, isLoading } = useAuth();
  const isAuthenticated = !!user;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Checking authentication...</span>
      </div>
    );
  }

  const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    return isAuthenticated ? (
      children
    ) : (
      <Navigate to="/login" replace />
    );
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Index />} />
          <Route path="dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="properties" element={<PrivateRoute><Properties /></PrivateRoute>} />
          <Route path="properties/new" element={<PrivateRoute><NewProperty /></PrivateRoute>} />
          <Route path="properties/:id" element={<PrivateRoute><PropertyDetails /></PrivateRoute>} />
          <Route path="properties/:id/edit" element={<PrivateRoute><EditProperty /></PrivateRoute>} />
          <Route path="events" element={<PrivateRoute><EventManagement /></PrivateRoute>} />
          <Route path="sync" element={<PrivateRoute><GlobalSync /></PrivateRoute>} />
          <Route path="notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
          <Route path="settings/profile" element={<PrivateRoute><ProfileSettings /></PrivateRoute>} />
          <Route path="components" element={<ComponentsDemo />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/resend-confirmation" element={<ResendConfirmation />} />
        <Route path="/confirm-email" element={<EmailConfirmation />} />
      </Routes>
      <Toaster />
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Suspense fallback={<LoadingSpinner />}>
          <AppRoutes />
        </Suspense>
      </AuthProvider>
    </Router>
  );
}

export default App;
