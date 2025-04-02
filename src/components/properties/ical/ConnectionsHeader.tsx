
import React from 'react';
import { Link2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConnectionsHeaderProps {
  onAddClick: () => void;
}

export function ConnectionsHeader({ onAddClick }: ConnectionsHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Link2 className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">External iCal Connections</h3>
        </div>
        <p className="text-muted-foreground text-sm">Connect external calendars via iCal</p>
      </div>
      <Button onClick={onAddClick} className="gap-1">
        <Plus className="w-4 h-4" /> Add Connection
      </Button>
    </div>
  );
}
