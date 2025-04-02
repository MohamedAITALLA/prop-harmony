
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info, Calendar, Link, AlertTriangle, Settings, Cloud } from "lucide-react";
import { cn } from "@/lib/utils";

interface PropertyDetailsTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  hasConflicts: boolean;
}

export function PropertyDetailsTabs({ activeTab, onTabChange, hasConflicts }: PropertyDetailsTabsProps) {
  return (
    <div className="bg-background rounded-lg border shadow-sm p-1 mb-6">
      <TabsList className="w-full flex flex-wrap justify-start h-auto">
        <TabsTrigger 
          value="overview" 
          onClick={() => onTabChange("overview")}
          className={cn("flex-grow sm:flex-grow-0 data-[state=active]:bg-primary data-[state=active]:text-white")}
        >
          <Info className="mr-2 h-4 w-4" /> Overview
        </TabsTrigger>
        <TabsTrigger 
          value="calendar" 
          onClick={() => onTabChange("calendar")}
          className={cn("flex-grow sm:flex-grow-0 data-[state=active]:bg-primary data-[state=active]:text-white")}
        >
          <Calendar className="mr-2 h-4 w-4" /> 
          Calendar 
          {hasConflicts && (
            <span className="ml-1 rounded-full bg-destructive w-4 h-4 text-xs flex items-center justify-center text-white">
              !
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger 
          value="ical" 
          onClick={() => onTabChange("ical")}
          className={cn("flex-grow sm:flex-grow-0 data-[state=active]:bg-primary data-[state=active]:text-white")}
        >
          <Link className="mr-2 h-4 w-4" /> iCal
        </TabsTrigger>
        <TabsTrigger 
          value="sync" 
          onClick={() => onTabChange("sync")}
          className={cn("flex-grow sm:flex-grow-0 data-[state=active]:bg-primary data-[state=active]:text-white")}
        >
          <Cloud className="mr-2 h-4 w-4" /> Sync
        </TabsTrigger>
        <TabsTrigger 
          value="conflicts" 
          onClick={() => onTabChange("conflicts")}
          className={cn("flex-grow sm:flex-grow-0 data-[state=active]:bg-primary data-[state=active]:text-white")}
        >
          <AlertTriangle className="mr-2 h-4 w-4" /> 
          Conflicts 
          {hasConflicts && (
            <span className="ml-1 rounded-full bg-destructive w-4 h-4 text-xs flex items-center justify-center text-white">
              !
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger 
          value="settings" 
          onClick={() => onTabChange("settings")}
          className={cn("flex-grow sm:flex-grow-0 data-[state=active]:bg-primary data-[state=active]:text-white")}
        >
          <Settings className="mr-2 h-4 w-4" /> Settings
        </TabsTrigger>
      </TabsList>
    </div>
  );
}
