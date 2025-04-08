
import { dashboardConfig } from "@/config/dashboard.config";
import { SidebarContent } from "@/components/ui/sidebar";
import { SidebarNavSection } from "./SidebarNavSection";
import { SidebarFooter } from "./SidebarFooter";
import { SidebarItemType } from "@/config/dashboard.config";

interface SidebarNavProps {
  notificationCount: number;
  conflictCount: number; 
  userRole?: string;
  user: any;
  logout: () => void;
}

export const SidebarNav = ({ 
  notificationCount, 
  conflictCount,
  userRole,
  user,
  logout
}: SidebarNavProps) => {
  
  const getBadgeCount = (item: SidebarItemType) => {
    if (item.badge === "count") {
      if (item.path === "/notifications") return notificationCount;
      if (item.path === "/conflicts") return conflictCount;
    }
    return 0;
  };

  return (
    <SidebarContent>
      {dashboardConfig.sidebar.sections.map((section) => (
        <SidebarNavSection
          key={section.title}
          section={section}
          getBadgeCount={getBadgeCount}
          userRole={userRole}
        />
      ))}
      
      <SidebarFooter 
        user={user}
        notificationCount={notificationCount}
        logout={logout}
      />
    </SidebarContent>
  );
};
