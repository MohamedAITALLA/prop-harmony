
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
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
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
import { ReactNode } from "react";
import { dashboardConfig, SidebarItemType } from "@/config/dashboard.config";
import { useQuery } from "@tanstack/react-query";

// Update the MainLayoutProps interface to explicitly include children
interface MainLayoutProps {
  children?: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Mock query for notification count
  const { data: notificationCount = 0 } = useQuery({
    queryKey: ["notificationCount"],
    queryFn: async () => {
      // This would be an API call in a real app
      return 3;
    },
  });

  // Mock query for conflict count
  const { data: conflictCount = 0 } = useQuery({
    queryKey: ["conflictCount"],
    queryFn: async () => {
      // This would be an API call in a real app
      return 2;
    },
  });

  // Function to get the badge count for an item
  const getBadgeCount = (item: SidebarItemType) => {
    if (item.badge === "count") {
      if (item.path === "/notifications") return notificationCount;
      if (item.path === "/conflicts") return conflictCount;
    }
    return 0;
  };

  // Handler function for sidebar navigation
  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <SidebarProvider>
      <div className="h-screen flex w-full">
        <Sidebar className="border-r">
          <SidebarHeader className="px-4 py-3 border-b flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Home className="h-6 w-6 text-primary" />
              <span className="font-semibold text-xl">PropertySync</span>
            </div>
            <SidebarTrigger>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SidebarTrigger>
          </SidebarHeader>
          
          <SidebarContent>
            {dashboardConfig.sidebar.sections.map((section) => (
              <SidebarGroup key={section.title}>
                <SidebarGroupLabel className="px-4 py-2">{section.title}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {section.items.map((item) => {
                      // Skip admin-only items if user is not admin
                      if (item.role === "admin" && user?.role !== "admin") return null;
                      
                      const badgeCount = getBadgeCount(item);
                      
                      return (
                        <SidebarMenuItem key={item.path}>
                          <SidebarMenuButton 
                            className={cn(
                              "flex items-center gap-3 px-4 py-2 rounded-md transition-colors",
                              location.pathname === item.path && "bg-accent text-accent-foreground"
                            )}
                            onClick={() => handleNavigation(item.path)}
                          >
                            <item.icon className="h-5 w-5" />
                            <span>{item.name}</span>
                          </SidebarMenuButton>
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
                <Button variant="ghost" size="icon" onClick={() => navigate("/notifications")}>
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
        
        <div className="flex-1 flex flex-col h-full overflow-auto">
          <div className="p-6 pb-24">
            {children || <Outlet />}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}

