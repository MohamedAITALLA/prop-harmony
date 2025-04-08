
import React from "react";
import { Grid, List } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ViewModeSwitcherProps {
  viewMode: 'grid' | 'list';
  onViewModeChange: (value: 'grid' | 'list') => void;
}

export function ViewModeSwitcher({ viewMode, onViewModeChange }: ViewModeSwitcherProps) {
  return (
    <Tabs 
      value={viewMode} 
      onValueChange={(v) => onViewModeChange(v as 'grid' | 'list')} 
      className="w-[180px]"
    >
      <TabsList className="grid w-full grid-cols-2 h-9">
        <TabsTrigger value="grid" className="flex items-center gap-1 px-3">
          <Grid className="h-4 w-4" />
          <span>Grid</span>
        </TabsTrigger>
        <TabsTrigger value="list" className="flex items-center gap-1 px-3">
          <List className="h-4 w-4" />
          <span>List</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
