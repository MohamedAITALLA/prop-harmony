
import {
  Calendar,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Building,
  Link,
  AlertTriangle,
  Bell,
  RefreshCw,
  BarChart3,
  User,
  Shield,
  Search
} from "lucide-react";
import { useNavigate, useLocation, Outlet, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/auth/useAuth";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarMenuBadge
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ReactNode, useEffect, useState } from "react";
import { dashboardConfig, SidebarItemType } from "@/config/dashboard.config";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

interface MainLayoutProps {
  children?: ReactNode;
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
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-3"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
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

  const getBadgeCount = (item: SidebarItemType) => {
    if (item.badge === "count") {
      if (item.path === "/notifications") return notificationCount;
      if (item.path === "/conflicts") return conflictCount;
    }
    return 0;
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <SidebarProvider>
      <div className="h-screen flex w-full">
        <Sidebar className="border-r">
          <SidebarHeader className="px-4 py-3 border-b flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-2"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Building className="h-6 w-6 text-primary" />
              <span className="font-semibold text-xl">PropertySync</span>
            </motion.div>
            <SidebarTrigger>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SidebarTrigger>
          </SidebarHeader>
          
          <SidebarContent>
            {dashboardConfig.sidebar.sections.map((section, sectionIndex) => (
              <SidebarGroup key={section.title}>
                <SidebarGroupLabel className="px-4 py-2">{section.title}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {section.items.map((item, itemIndex) => {
                      if (item.role === "admin" && user?.role !== "admin") return null;
                      
                      const badgeCount = getBadgeCount(item);
                      const isActive = location.pathname === item.path;
                      
                      return (
                        <SidebarMenuItem key={item.path}>
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: itemIndex * 0.05 }}
                          >
                            <SidebarMenuButton 
                              className={cn(
                                "flex items-center gap-3 px-4 py-2 rounded-md transition-colors",
                                isActive 
                                  ? "bg-primary text-primary-foreground font-medium" 
                                  : "hover:bg-accent hover:text-accent-foreground"
                              )}
                              onClick={() => handleNavigation(item.path)}
                            >
                              <item.icon className="h-5 w-5" />
                              <span>{item.name}</span>
                            </SidebarMenuButton>
                          </motion.div>
                          {item.badge === "count" && badgeCount > 0 && (
                            <SidebarMenuBadge className="bg-primary text-primary-foreground">
                              {badgeCount}
                            </SidebarMenuBadge>
                          )}
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
            
            <div className="mt-auto p-4 border-t">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={`https://ui-avatars.com/api/?name=${user?.first_name}+${user?.last_name}`} />
                    <AvatarFallback>{user?.first_name?.[0]}{user?.last_name?.[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{user?.first_name} {user?.last_name}</p>
                    <p className="text-muted-foreground text-xs">{user?.email}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => navigate("/notifications")}
                  className="relative"
                >
                  <Bell className="h-5 w-5" />
                  {notificationCount > 0 && (
                    <span className="absolute top-0 right-0 h-4 w-4 text-xs flex items-center justify-center rounded-full bg-primary text-primary-foreground">
                      {notificationCount}
                    </span>
                  )}
                </Button>
              </div>
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={logout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </Button>
            </div>
          </SidebarContent>
        </Sidebar>
        
        <motion.div 
          className="flex-1 flex flex-col h-full overflow-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-6 pb-24">
            {children || <Outlet />}
          </div>
        </motion.div>
      </div>
    </SidebarProvider>
  );
}
