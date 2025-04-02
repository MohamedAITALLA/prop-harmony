
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info, Calendar, Link, AlertTriangle, Settings, Cloud } from "lucide-react";

interface PropertyDetailsTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  hasConflicts: boolean;
}

export function PropertyDetailsTabs({ activeTab, onTabChange, hasConflicts }: PropertyDetailsTabsProps) {
  return (
    <TabsList className="mb-4">
      <TabsTrigger value="overview" onClick={() => onTabChange("overview")}>
        <Info className="mr-2 h-4 w-4" /> Overview
      </TabsTrigger>
      <TabsTrigger value="calendar" onClick={() => onTabChange("calendar")}>
        <Calendar className="mr-2 h-4 w-4" /> Calendar {hasConflicts && (
          <span className="ml-1 rounded-full bg-destructive w-4 h-4 text-xs flex items-center justify-center text-white">
            !
          </span>
        )}
      </TabsTrigger>
      <TabsTrigger value="ical" onClick={() => onTabChange("ical")}>
        <Link className="mr-2 h-4 w-4" /> iCal Connections
      </TabsTrigger>
      <TabsTrigger value="sync" onClick={() => onTabChange("sync")}>
        <Cloud className="mr-2 h-4 w-4" /> Sync
      </TabsTrigger>
      <TabsTrigger value="conflicts" onClick={() => onTabChange("conflicts")}>
        <AlertTriangle className="mr-2 h-4 w-4" /> Conflicts {hasConflicts && (
          <span className="ml-1 rounded-full bg-destructive w-4 h-4 text-xs flex items-center justify-center text-white">
            !
          </span>
        )}
      </TabsTrigger>
      <TabsTrigger value="settings" onClick={() => onTabChange("settings")}>
        <Settings className="mr-2 h-4 w-4" /> Settings
      </TabsTrigger>
    </TabsList>
  );
}
