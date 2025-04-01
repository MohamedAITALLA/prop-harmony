
import {
  Calendar,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Building,
  Link,
  AlertCircle,
  Bell
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
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
  SidebarTrigger 
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const routes = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard
    },
    {
      name: "Properties",
      path: "/properties",
      icon: Building
    },
    {
      name: "Calendar",
      path: "/calendar",
      icon: Calendar
    },
    {
      name: "iCal Connections",
      path: "/ical-connections",
      icon: Link
    },
    {
      name: "Conflicts",
      path: "/conflicts",
      icon: AlertCircle
    },
    {
      name: "Settings",
      path: "/settings",
      icon: Settings
    }
  ];

  return (
    <SidebarProvider>
      <div className="h-screen flex w-full">
        <Sidebar className="border-r">
          <SidebarHeader className="px-4 py-3 border-b flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Home className="h-6 w-6 text-primary" />
              <span className="font-semibold text-xl">PropertySync</span>
            </div>
            <SidebarTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SidebarTrigger>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="px-4 py-2">Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {routes.map((route) => (
                    <SidebarMenuItem key={route.path}>
                      <SidebarMenuButton
                        asChild
                        className={cn(
                          "flex items-center gap-3 px-4 py-2 rounded-md transition-colors",
                          location.pathname === route.path && "bg-accent text-accent-foreground"
                        )}
                      >
                        <button onClick={() => navigate(route.path)}>
                          <route.icon className="h-5 w-5" />
                          <span>{route.name}</span>
                        </button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            
            <div className="mt-auto p-4 border-t">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={`https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}`} />
                    <AvatarFallback>{user?.firstName?.[0]}{user?.lastName?.[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{user?.firstName} {user?.lastName}</p>
                    <p className="text-muted-foreground text-xs">{user?.email}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => navigate("/notifications")}>
                  <Bell className="h-5 w-5" />
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
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
