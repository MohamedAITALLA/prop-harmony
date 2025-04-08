
import React from "react";
import { useNavigate, useLocation, Outlet, Navigate } from "react-router-dom";
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/auth/useAuth";
import { useQuery } from "@tanstack/react-query";
import { SidebarNav } from "./sidebar/SidebarNav";
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { MainContent } from "./MainContent";
import { LoadingSpinner } from "./LoadingSpinner";

interface MainLayoutProps {
  children?: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { data: notificationCount = 0 } = useQuery({
    queryKey: ["notificationCount"],
    queryFn: async () => {
      return 3;
    },
    enabled: !!user,
  });

  const { data: conflictCount = 0 } = useQuery({
    queryKey: ["conflictCount"],
    queryFn: async () => {
      return 2;
    },
    enabled: !!user,
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const isAuthRoute = ['/login', '/register', '/forgot-password', '/reset-password', '/resend-confirmation', '/confirm-email'].includes(location.pathname);
  const isRootRoute = location.pathname === '/';
  
  if (user && isAuthRoute) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!user && !isAuthRoute && !isRootRoute) {
    return <Navigate to="/login" replace />;
  }

  if (!user) {
    return <Outlet />;
  }

  return (
    <SidebarProvider>
      <div className="h-screen flex w-full">
        <Sidebar className="border-r">
          <SidebarHeader />
          <SidebarNav 
            notificationCount={notificationCount}
            conflictCount={conflictCount}
            userRole={user?.role}
            user={user}
            logout={logout}
          />
        </Sidebar>
        
        <MainContent>{children}</MainContent>
      </div>
    </SidebarProvider>
  );
}
