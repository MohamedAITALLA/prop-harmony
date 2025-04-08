
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Cog, Home, Link2, AlertTriangle } from "lucide-react";

interface PropertyDetailsTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  hasConflicts?: boolean;
}

export function PropertyDetailsTabs({
  activeTab,
  onTabChange,
  hasConflicts
}: PropertyDetailsTabsProps) {
  return (
    <TabsList className="grid grid-cols-6 h-auto w-full max-w-4xl mx-auto md:mb-4">
      <TabsTrigger 
        value="overview" 
        onClick={() => onTabChange("overview")}
        className="flex items-center gap-1.5 py-3"
      >
        <Home className="w-4 h-4" />
        <span>Overview</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="calendar" 
        onClick={() => onTabChange("calendar")}
        className="flex items-center gap-1.5 py-3"
      >
        <CalendarDays className="w-4 h-4" />
        <span>Calendar</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="conflicts" 
        onClick={() => onTabChange("conflicts")}
        className="flex items-center gap-1.5 py-3 relative"
      >
        <AlertTriangle className="w-4 h-4" />
        <span>Conflicts</span>
        {hasConflicts && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
        )}
      </TabsTrigger>
      
      <TabsTrigger 
        value="ical" 
        onClick={() => onTabChange("ical")}
        className="flex items-center gap-1.5 py-3"
      >
        <Link2 className="w-4 h-4" />
        <span>iCal</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="sync" 
        onClick={() => onTabChange("sync")}
        className="flex items-center gap-1.5 py-3"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-refresh-cw">
          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
          <path d="M21 3v5h-5"></path>
          <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
          <path d="M8 16H3v5"></path>
        </svg>
        <span>Sync</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="settings" 
        onClick={() => onTabChange("settings")}
        className="flex items-center gap-1.5 py-3"
      >
        <Cog className="w-4 h-4" />
        <span>Settings</span>
      </TabsTrigger>
    </TabsList>
  );
}
