
import { ReactNode } from "react";
import { SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu } from "@/components/ui/sidebar";
import { SidebarSectionType } from "@/config/dashboard.config";
import { SidebarNavItem } from "./SidebarNavItem";

interface SidebarNavSectionProps {
  section: SidebarSectionType;
  getBadgeCount: (item: any) => number;
  userRole?: string;
}

export const SidebarNavSection = ({ section, getBadgeCount, userRole }: SidebarNavSectionProps) => {
  return (
    <SidebarGroup key={section.title}>
      <SidebarGroupLabel className="px-4 py-2">{section.title}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {section.items.map((item, itemIndex) => {
            if (item.role === "admin" && userRole !== "admin") return null;
            
            const badgeCount = getBadgeCount(item);
            
            return (
              <SidebarNavItem 
                key={item.path} 
                item={item} 
                badgeCount={badgeCount} 
                index={itemIndex} 
              />
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
