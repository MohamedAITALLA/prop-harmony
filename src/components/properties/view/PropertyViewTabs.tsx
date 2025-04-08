
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid, List, Table } from "lucide-react";

interface PropertyViewTabsProps {
  viewMode: "grid" | "list" | "table";
  setViewMode: (value: "grid" | "list" | "table") => void;
}

export function PropertyViewTabs({
  viewMode,
  setViewMode
}: PropertyViewTabsProps) {
  return (
    <Tabs defaultValue={viewMode} onValueChange={(value) => setViewMode(value as "grid" | "list" | "table")}>
      <TabsList>
        <TabsTrigger value="grid">
          <Grid className="h-4 w-4 mr-2" /> Grid View
        </TabsTrigger>
        <TabsTrigger value="list">
          <List className="h-4 w-4 mr-2" /> List View
        </TabsTrigger>
        <TabsTrigger value="table">
          <Table className="h-4 w-4 mr-2" /> Table View
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
