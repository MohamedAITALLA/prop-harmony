
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Properties from "./pages/Properties";
import PropertyDetails from "./pages/PropertyDetails";
import Calendar from "./pages/Calendar";
import EventManagement from "./pages/EventManagement";
import Notifications from "./pages/Notifications";
import ProfileSettings from "./pages/ProfileSettings";
import UserManagement from "./pages/UserManagement";
import UserProfiles from "./pages/UserProfiles";
import SyncDashboard from "./pages/SyncDashboard";
import SyncLogs from "./pages/SyncLogs";
import Conflicts from "./pages/Conflicts";
import NotFound from "./pages/NotFound";
import MainLayout from "./components/layout/MainLayout";
import ComponentsDemo from "./pages/ComponentsDemo";
import { ensureMongoId } from "./lib/mongo-helpers";

const queryClient = new QueryClient();

// Set DEV_MODE to true to bypass authentication checks
const DEV_MODE = true;

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  // In development mode, always render the protected content
  if (DEV_MODE) {
    return <MainLayout>{children}</MainLayout>;
  }
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  return <MainLayout>{children}</MainLayout>;
};

// Admin route wrapper
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  // In development mode, always render the admin content
  if (DEV_MODE) {
    return <MainLayout>{children}</MainLayout>;
  }
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!user || !user.is_admin) {
    return <Navigate to="/dashboard" />;
  }

  return <MainLayout>{children}</MainLayout>;
};

// Placeholder component for routes not yet implemented
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <h1 className="text-2xl font-bold mb-4">{title}</h1>
    <p className="text-muted-foreground mb-6">This page is under construction.</p>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            {/* Login and Register manage their own AuthProvider */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/components" element={<ComponentsDemo />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/properties" element={<ProtectedRoute><Properties /></ProtectedRoute>} />
            <Route path="/properties/:id" element={<ProtectedRoute><PropertyDetails /></ProtectedRoute>} />
            <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
            <Route path="/events" element={<ProtectedRoute><EventManagement /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />
            <Route path="/conflicts" element={<ProtectedRoute><Conflicts /></ProtectedRoute>} />
            <Route path="/sync" element={<ProtectedRoute><SyncDashboard /></ProtectedRoute>} />
            <Route path="/sync/logs" element={<ProtectedRoute><SyncLogs /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><PlaceholderPage title="Analytics" /></ProtectedRoute>} />
            <Route path="/preferences" element={<ProtectedRoute><PlaceholderPage title="Preferences" /></ProtectedRoute>} />
            
            {/* Admin routes */}
            <Route path="/admin/users" element={<AdminRoute><UserManagement /></AdminRoute>} />
            <Route path="/admin/user-profiles" element={<AdminRoute><UserProfiles /></AdminRoute>} />
            <Route path="/admin" element={<AdminRoute><PlaceholderPage title="Admin" /></AdminRoute>} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
