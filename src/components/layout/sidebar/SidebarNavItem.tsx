
import { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SidebarItemType } from "@/config/dashboard.config";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge
} from "@/components/ui/sidebar";

interface SidebarNavItemProps {
  item: SidebarItemType;
  badgeCount: number;
  index: number;
}

export const SidebarNavItem = ({ item, badgeCount, index }: SidebarNavItemProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = location.pathname === item.path;
  
  return (
    <SidebarMenuItem key={item.path}>
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2, delay: index * 0.05 }}
      >
        <SidebarMenuButton 
          className={cn(
            "flex items-center gap-3 px-4 py-2 rounded-md transition-colors",
            isActive 
              ? "bg-primary text-primary-foreground font-medium" 
              : "hover:bg-accent hover:text-accent-foreground"
          )}
          onClick={() => navigate(item.path)}
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
};
