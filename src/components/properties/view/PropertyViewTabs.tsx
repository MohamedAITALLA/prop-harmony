
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid, List } from "lucide-react";

interface PropertyViewTabsProps {
  viewMode: "grid" | "table";
  setViewMode: (value: "grid" | "table") => void;
}

export function PropertyViewTabs({
  viewMode,
  setViewMode
}: PropertyViewTabsProps) {
  return (
    <Tabs defaultValue={viewMode} onValueChange={(value) => setViewMode(value as "grid" | "table")}>
      <TabsList className="hidden">
        <TabsTrigger value="grid">
          <Grid className="h-4 w-4 mr-2" /> Grid View
        </TabsTrigger>
        <TabsTrigger value="table">
          <List className="h-4 w-4 mr-2" /> Table View
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
