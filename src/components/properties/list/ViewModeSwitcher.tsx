
import React from "react";
import { Grid, List, Table2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ViewModeSwitcherProps {
  viewMode: 'grid' | 'list' | 'table';
  onViewModeChange: (value: 'grid' | 'list' | 'table') => void;
}

export function ViewModeSwitcher({ viewMode, onViewModeChange }: ViewModeSwitcherProps) {
  return (
    <Tabs 
      value={viewMode} 
      onValueChange={(v) => onViewModeChange(v as 'grid' | 'list' | 'table')} 
      className="w-[270px]"
    >
      <TabsList className="grid w-full grid-cols-3 h-9">
        <TabsTrigger value="grid" className="flex items-center gap-1 px-3">
          <Grid className="h-4 w-4" />
          <span>Grid</span>
        </TabsTrigger>
        <TabsTrigger value="list" className="flex items-center gap-1 px-3">
          <List className="h-4 w-4" />
          <span>List</span>
        </TabsTrigger>
        <TabsTrigger value="table" className="flex items-center gap-1 px-3">
          <Table2 className="h-4 w-4" />
          <span>Table</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
