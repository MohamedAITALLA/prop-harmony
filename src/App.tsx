
import React, { Suspense } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import NewProperty from './pages/NewProperty';
import PropertyDetails from './pages/PropertyDetails';
import EditProperty from './pages/EditProperty';
import PropertyAnalytics from './pages/PropertyAnalytics';
import Calendar from './pages/Calendar';
import Conflicts from './pages/Conflicts';
import EventManagement from './pages/EventManagement';
import SyncLogs from './pages/SyncLogs';
import SyncDashboard from './pages/SyncDashboard';
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
import { Toaster } from "@/components/ui/toaster"
import Index from './pages/Index';
import GlobalSync from './pages/GlobalSync';

function AppRoutes() {
  const { user, isLoading } = useAuth();
  const isAuthenticated = !!user;

  if (isLoading) {
    return <div>Loading...</div>;
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
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="properties" element={<Properties />} />
          <Route path="properties/new" element={<NewProperty />} />
          <Route path="properties/:id" element={<PropertyDetails />} />
          <Route path="properties/:id/edit" element={<EditProperty />} />
          <Route path="properties/:id/analytics" element={<PropertyAnalytics />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="conflicts" element={<Conflicts />} />
          <Route path="events" element={<EventManagement />} />
          <Route path="sync" element={<GlobalSync />} />
          <Route path="sync/logs" element={<SyncLogs />} />
          <Route path="sync/dashboard" element={<SyncDashboard />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="settings/profile" element={<ProfileSettings />} />
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
      <Suspense fallback={<div>Loading...</div>}>
        <AppRoutes />
      </Suspense>
    </Router>
  );
}

export default App;
